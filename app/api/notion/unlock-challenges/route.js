import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { appendUnlockedChallenge } from '@/lib/notion-tracker';
export async function POST(request) {
 try {
 const { workerId, challengeId } = await request.json();
 const supabase = createRouteHandlerClient({ cookies });
 // Get worker's Notion info
 const { data: profile } = await supabase
 .from('worker_profiles')
 .select('notion_access_token, notion_page_id')
 .eq('id', workerId).single();
 if (!profile?.notion_access_token) {
 return NextResponse.json({ synced: false, reason: 'not connected' });
 }
 // Get challenge and its phase
 const { data: challenge } = await supabase
 .from('challenges')
 .select('title, phase_id, roadmap_phases(phase_name)')
 .eq('id', challengeId).single();
 // Append to their Notion page — fire and forget
 appendUnlockedChallenge(
 profile.notion_access_token,
 profile.notion_page_id,
 {
 challengeTitle: challenge?.title || 'New Challenge',
 phaseName: challenge?.roadmap_phases?.phase_name || '',
 }
 ).catch(err => console.error('[Notion unlock sync]', err));
 return NextResponse.json({ synced: true });
 } catch (err) {
 return NextResponse.json({ error: 'Internal error' }, { status: 500 });
 }
}
