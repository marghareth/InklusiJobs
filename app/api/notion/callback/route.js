import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NOTION_CLIENT_ID, NOTION_CLIENT_SECRET, APP_URL } from '@/lib/notion';
import { buildWorkerPage } from '@/lib/notion-tracker';

export async function GET(request) {
  console.log('=== NOTION CALLBACK STARTED ===');
  
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('Callback params:', { 
    codeExists: !!code, 
    state, 
    error,
    codeLength: code?.length 
  });

  if (error) {
    console.error('Error from Notion:', error);
    return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=notion_${error}`);
  }

  if (!code) {
    console.error('No code received');
    return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=no_code`);
  }

  try {
    // 1. Exchange code for access token
    console.log('Exchanging code for token...');
    console.log('Client ID exists:', !!NOTION_CLIENT_ID);
    console.log('Client Secret exists:', !!NOTION_CLIENT_SECRET);
    
    const credentials = Buffer.from(
      `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${APP_URL}/api/notion/callback`,
      }),
    });

    console.log('Token response status:', tokenRes.status);

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Token exchange failed:', tokenRes.status, errorText);
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=token_exchange&details=${encodeURIComponent(errorText)}`);
    }

    const tokenData = await tokenRes.json();
    console.log('Token data received:', { 
      hasAccessToken: !!tokenData.access_token,
      botId: tokenData.bot_id,
      workspaceName: tokenData.workspace_name,
      workspaceIcon: tokenData.workspace_icon
    });

    if (!tokenData.access_token) {
      throw new Error('No access token in response');
    }

    const accessToken = tokenData.access_token;
    const workerId = decodeURIComponent(state);
    
    console.log('Worker ID from state:', workerId);

    
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // 2. Fetch worker profile
    console.log('Fetching worker profile...');
    const { data: profile, error: profileError } = await supabase
      .from('worker_profiles')
      .select('full_name, current_phase, overall_verification_score')
      .eq('id', workerId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=profile_fetch`);
    }

    console.log('Profile found:', { 
      name: profile?.full_name,
      phase: profile?.current_phase 
    });

    // 3. Fetch roadmap phases
    console.log('Fetching roadmap...');
    const { data: roadmap, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('id')
      .eq('worker_id', workerId)
      .eq('is_active', true)
      .single();

    if (roadmapError) {
      console.error('Roadmap fetch error:', roadmapError);
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=roadmap_fetch`);
    }

    console.log('Roadmap found:', roadmap);

    let phases = [];
    if (roadmap) {
      const { data, error: phasesError } = await supabase
        .from('roadmap_phases')
        .select('id, phase_name, phase_order, status')
        .eq('roadmap_id', roadmap.id)
        .order('phase_order', { ascending: true });
      
      if (phasesError) {
        console.error('Phases fetch error:', phasesError);
      } else {
        phases = data || [];
        console.log('Phases found:', phases.length);
      }
    }

    // 4. Fetch unlocked challenges
    console.log('Fetching unlocked challenges...');
    const { data: unlocks, error: unlocksError } = await supabase
      .from('worker_challenge_unlocks')
      .select(`
        challenge_id,
        challenges (id, title, phase_id)
      `)
      .eq('worker_id', workerId);

    if (unlocksError) {
      console.error('Unlocks fetch error:', unlocksError);
    }

    console.log('Unlocks found:', unlocks?.length || 0);

    // Get latest submission status
    const challengeIds = (unlocks || []).map(u => u.challenge_id);
    let submissionMap = {};

    if (challengeIds.length > 0) {
      console.log('Fetching submissions for', challengeIds.length, 'challenges');
      const { data: subs, error: subsError } = await supabase
        .from('challenge_submissions')
        .select('challenge_id, status, ai_score')
        .eq('worker_id', workerId)
        .in('challenge_id', challengeIds)
        .order('submitted_at', { ascending: false });

      if (subsError) {
        console.error('Submissions fetch error:', subsError);
      } else {
        (subs || []).forEach(s => {
          if (!submissionMap[s.challenge_id]) submissionMap[s.challenge_id] = s;
        });
        console.log('Submissions mapped:', Object.keys(submissionMap).length);
      }
    }

    // Build challenges array
    const challenges = (unlocks || []).map(u => ({
      id: u.challenges.id,
      title: u.challenges.title,
      phase_id: u.challenges.phase_id,
      status: submissionMap[u.challenge_id]?.status || 'not_started',
      ai_score: submissionMap[u.challenge_id]?.ai_score || null,
    }));

    console.log('Challenges built:', challenges.length);

    // 5. Build the full Notion page
    console.log('Building Notion page...');
    try {
      const notionPageId = await buildWorkerPage(
        accessToken,
        {
          name: profile?.full_name || 'Worker',
          currentPhase: profile?.current_phase || 'Phase 1',
          verificationScore: profile?.overall_verification_score || 0,
        },
        phases,
        challenges,
      );

      console.log('Notion page created:', notionPageId);

      // 6. Save token and page ID
      console.log('Saving to Supabase...');
      const { error: updateError } = await supabase
        .from('worker_profiles')
        .update({
          notion_access_token: accessToken,
          notion_page_id: notionPageId,
          notion_connected_at: new Date().toISOString(),
        })
        .eq('id', workerId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=update_failed`);
      }

      console.log('=== NOTION CALLBACK SUCCESS ===');
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=connected`);

    } catch (buildError) {
      console.error('Error building Notion page:', buildError);
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=build_failed&details=${encodeURIComponent(buildError.message)}`);
    }

  } catch (err) {
    console.error('=== NOTION CALLBACK UNEXPECTED ERROR ===');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=unexpected&details=${encodeURIComponent(err.message)}`);
  }
}