import { updateSubmissionBlock, updatePageStats } from '@/lib/notion-tracker';

// After updating Supabase with AI results:
// Fetch the submission's notion_block_id and worker's notion info
const { data: sub } = await supabase
  .from('challenge_submissions')
  .select('notion_block_id, worker_id')
  .eq('id', submissionId)
  .single();

const { data: profile } = await supabase
  .from('worker_profiles')
  .select('notion_access_token, notion_page_id, current_streak, overall_verification_score, full_name')
  .eq('id', sub?.worker_id)
  .single();

if (profile?.notion_access_token && profile?.notion_page_id) {
  syncEvalToNotion({
    accessToken: profile.notion_access_token,
    pageId: profile.notion_page_id,
    blockId: sub?.notion_block_id,
    challengeTitle: challengeTitle,
    aiScore: aiScore,
    status: newStatus,
    workerId: sub.worker_id,
    currentStreak: profile.current_streak || 0,
    verificationScore: profile.overall_verification_score || 0,
  }).catch(err => console.error('[Notion eval sync]', err));
}

async function syncEvalToNotion(data) {
  // Update the submission log entry
  if (data.blockId) {
    await updateSubmissionBlock(data.accessToken, data.blockId, {
      challengeTitle: data.challengeTitle,
      aiScore: data.aiScore,
      status: data.status,
    });
  }

  // Re-fetch totals and update stats
  const { count: totalSubmitted } = await supabase
    .from('challenge_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', data.workerId);

  const { count: totalApproved } = await supabase
    .from('challenge_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', data.workerId)
    .eq('status', 'approved');

  await updatePageStats(data.accessToken, data.pageId, {
    totalSubmitted: totalSubmitted || 0,
    totalApproved: totalApproved || 0,
    currentStreak: data.currentStreak,
    verificationScore: data.verificationScore,
  });
}