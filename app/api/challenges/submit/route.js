import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getOrCreateWorkerPage, logSubmission,
updateWorkerStats } from '@/lib/notion-tracker';
export async function POST(request) {
try {
const supabase = createRouteHandlerClient({ cookies });
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const { challengeId, submissionUrl, submissionText, submissionType } = await request.json();
// 1. Fetch challenge title and worker profile
const { data: challenge } = await supabase
.from('challenges').select('title').eq('id', challengeId).single();
const { data: profile } = await supabase
.from('worker_profiles')
.select('full_name, current_streak, longest_streak')
.eq('id', user.id).single();
// 2. Save to Supabase FIRST — this is the source of truth
const { data: submission, error } = await supabase
.from('challenge_submissions')
.insert({ worker_id: user.id, challenge_id: challengeId,
submission_url: submissionUrl || null,
submission_text: submissionText || null,
submission_type: submissionType, status: 'pending' })
.select().single();
if (error) throw error;
// 3. Count totals for Notion summary
const { count: totalSubmitted } = await supabase
.from('challenge_submissions')
.select('*', { count: 'exact', head: true }).eq('worker_id', user.id);
const { count: totalApproved } = await supabase
.from('challenge_submissions')
.select('*', { count: 'exact', head: true })
.eq('worker_id', user.id).eq('status', 'approved');
// 4. Sync to Notion — fire and forget (user never waits for this)
syncToNotion({ workerId: user.id, workerName: profile?.full_name || 'Worker',
challengeId, challengeTitle: challenge?.title || 'Challenge',
submissionId: submission.id, submissionUrl,
totalSubmitted: totalSubmitted || 0, totalApproved: totalApproved || 0,
totalRejected: (totalSubmitted||0) - (totalApproved||0),
currentStreak: profile?.current_streak || 0,
longestStreak: profile?.longest_streak || 0,
}).catch(err => console.error('[Notion sync error]', err));
return NextResponse.json({ success: true, submissionId: submission.id });
} catch (err) {
return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}
}

// Runs in background — never blocks the HTTP response
async function syncToNotion(data) {
// Find or create the worker's summary row in Notion
async function syncToNotion(data) {
const workerPageId = await getOrCreateWorkerPage(data.workerId, data.workerName);
// Save worker's Notion page ID if not already saved
await supabase.from('worker_profiles')
.update({ notion_page_id: workerPageId })
.eq('id', data.workerId);
// Log submission and save its Notion page ID
const submissionPage = await logSubmission({ ...data, status: 'pending' });
await supabase.from('challenge_submissions')
.update({ notion_page_id: submissionPage.id })
.eq('id', data.submissionId);
await updateWorkerStats(workerPageId, {
totalSubmitted: data.totalSubmitted,
totalApproved: data.totalApproved,
totalRejected: data.totalRejected,
currentStreak: data.currentStreak,
longestStreak: data.longestStreak,
});
}
// Add a new submission row to the Submissions database
await logSubmission({
workerId: data.workerId,
workerName: data.workerName,
challengeId: data.challengeId,
challengeTitle: data.challengeTitle,
submissionId: data.submissionId,
submissionUrl: data.submissionUrl,
status: 'pending',
attemptNumber: 1,
});
// Update the worker's summary stats
await updateWorkerStats(workerPageId, {
totalSubmitted: data.totalSubmitted,
totalApproved: data.totalApproved,
totalRejected: data.totalRejected,
currentStreak: data.currentStreak,
longestStreak: data.longestStreak,
});
}