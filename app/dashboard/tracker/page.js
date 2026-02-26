'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TrackerPage from '@/components/dashboard/worker/TrackerPage';

export default function TrackerPageWrapper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('worker_profiles')
          .select('notion_page_id, notion_connected_at, full_name, current_phase, overall_verification_score, current_streak, notion_access_token')
          .eq('id', user.id)
          .single();

        const { data: roadmap } = await supabase
          .from('roadmaps')
          .select('id')
          .eq('worker_id', user.id)
          .eq('is_active', true)
          .single();

        let phases = [];
        let challenges = [];

        if (roadmap) {
          const { data: phasesData } = await supabase
            .from('roadmap_phases')
            .select('id, phase_name, phase_order, status')
            .eq('roadmap_id', roadmap.id)
            .order('phase_order', { ascending: true });
          phases = phasesData || [];

          const { data: unlocks } = await supabase
            .from('worker_challenge_unlocks')
            .select('challenge_id, challenges(id, title, phase_id)')
            .eq('worker_id', user.id);

          const challengeIds = (unlocks || []).map(u => u.challenge_id);
          let submissionMap = {};

          if (challengeIds.length > 0) {
            const { data: subs } = await supabase
              .from('challenge_submissions')
              .select('challenge_id, status, ai_score')
              .eq('worker_id', user.id)
              .in('challenge_id', challengeIds)
              .order('submitted_at', { ascending: false });
            (subs || []).forEach(s => {
              if (!submissionMap[s.challenge_id]) submissionMap[s.challenge_id] = s;
            });
          }

          challenges = (unlocks || []).map(u => ({
            id:       u.challenges?.id,
            title:    u.challenges?.title,
            phase_id: u.challenges?.phase_id,
            status:   submissionMap[u.challenge_id]?.status || 'not_started',
            ai_score: submissionMap[u.challenge_id]?.ai_score || null,
          }));
        }

        const { data: submissions } = await supabase
          .from('challenge_submissions')
          .select('id, challenge_id, status, ai_score, submitted_at, attempt_number, challenges(title)')
          .eq('worker_id', user.id)
          .order('submitted_at', { ascending: false })
          .limit(20);

        const { count: totalSubmitted } = await supabase
          .from('challenge_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', user.id);

        const { count: totalApproved } = await supabase
          .from('challenge_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', user.id)
          .eq('status', 'approved');

        const { count: totalRejected } = await supabase
          .from('challenge_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('worker_id', user.id)
          .eq('status', 'rejected');

        const isConnected = !!profile?.notion_page_id;
        const notionUrl   = profile?.notion_page_id
          ? `https://notion.so/${profile.notion_page_id.replace(/-/g, '')}`
          : null;

        setData({
          isConnected,
          notionUrl,
          connectedAt: profile?.notion_connected_at,
          stats: {
            totalSubmitted:    totalSubmitted || 0,
            totalApproved:     totalApproved  || 0,
            totalRejected:     totalRejected  || 0,
            currentStreak:     profile?.current_streak || 0,
            longestStreak:     0,
            verificationScore: profile?.overall_verification_score || 0,
          },
          phases,
          challenges,
          submissions: (submissions || []).map(s => ({
            id:             s.id,
            challengeTitle: s.challenges?.title || 'Challenge',
            status:         s.status,
            ai_score:       s.ai_score,
            submitted_at:   s.submitted_at,
            attempt_number: s.attempt_number || 1,
          })),
        });
      } catch (err) {
        console.error('[TrackerPage fetch error]', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(107,143,113,0.15)',
          borderTop: '3px solid #6B8F71',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          fontFamily: '"Instrument Sans", sans-serif',
          fontSize: 13, color: 'rgba(44,42,39,0.40)',
        }}>Loading your tracker...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <TrackerPage {...(data || {})} />;
}