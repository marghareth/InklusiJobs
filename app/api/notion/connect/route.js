import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NOTION_CLIENT_ID, APP_URL } from '@/lib/notion';

export async function GET(request) {
  console.log('[Notion Connect] Starting connection process');
  
  try {
    // Get the cookie store properly
    const cookieStore = cookies();
    
    // Create Supabase client with the cookie store
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Get the user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[Notion Connect] Auth error:', error);
      // Instead of redirecting to login, redirect back to tracker with auth error
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=auth_failed`);
    }

    if (!user) {
      console.log('[Notion Connect] No user found');
      // Instead of redirecting to login, redirect back to tracker with no user error
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=no_user`);
    }

    console.log('[Notion Connect] User authenticated:', user.id);

    // Check if NOTION_CLIENT_ID is configured
    if (!NOTION_CLIENT_ID) {
      console.error('[Notion Connect] NOTION_CLIENT_ID is not configured');
      return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=config`);
    }

    const redirectUri = `${APP_URL}/api/notion/callback`;
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const state = encodeURIComponent(user.id);

    const notionAuthUrl = 
      `https://api.notion.com/v1/oauth/authorize` +
      `?client_id=${NOTION_CLIENT_ID}` +
      `&response_type=code` +
      `&owner=user` +
      `&redirect_uri=${encodedRedirectUri}` +
      `&state=${state}`;

    console.log('[Notion Connect] Redirecting to Notion');
    
    return NextResponse.redirect(notionAuthUrl);

  } catch (error) {
    console.error('[Notion Connect] Unexpected error:', error);
    return NextResponse.redirect(`${APP_URL}/dashboard/tracker?notion=error&reason=unexpected`);
  }
}