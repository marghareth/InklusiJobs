/**
 * test-notion.js
 * Run from your project root: node test-notion.js
 * Tests Notion connection and writes a fake submission — no AI, no challenges needed.
 * Delete the test rows from Notion after you're done.
 */

require("dotenv").config({ path: ".env.local" });
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_SECRET });
const WORKER_DB      = process.env.NOTION_WORKER_DB_ID;
const SUBMISSIONS_DB = process.env.NOTION_SUBMISSIONS_DB_ID;

const FAKE_WORKER_ID   = "test-worker-001";
const FAKE_WORKER_NAME = "Test Worker (DELETE ME)";

async function run() {
  console.log("\n=== InklusiJobs Notion Connection Test ===\n");

  // ── TEST 1: Check secret and Worker DB ──────────────────────────────────────
  process.stdout.write("1. Checking NOTION_SECRET and Worker Tracker DB... ");
  try {
    const db = await notion.databases.retrieve({ database_id: WORKER_DB });
    const name = db.title?.[0]?.plain_text || "(no title)";
    console.log(`✅  Connected — "${name}"`);
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    console.log("   Fix: check NOTION_WORKER_DB_ID in .env.local and make sure");
    console.log("   the integration is connected to that database in Notion.\n");
    process.exit(1);
  }

  // ── TEST 2: Check Submissions DB ────────────────────────────────────────────
  process.stdout.write("2. Checking Submissions DB... ");
  try {
    const db = await notion.databases.retrieve({ database_id: SUBMISSIONS_DB });
    const name = db.title?.[0]?.plain_text || "(no title)";
    console.log(`✅  Connected — "${name}"`);
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    console.log("   Fix: check NOTION_SUBMISSIONS_DB_ID in .env.local and make sure");
    console.log("   the integration is connected to the Submissions database in Notion.\n");
    process.exit(1);
  }

  // ── TEST 3: Create a worker row ──────────────────────────────────────────────
  process.stdout.write("3. Creating a test worker row in Worker Tracker... ");
  let workerPageId;
  try {
    const page = await notion.pages.create({
      parent: { database_id: WORKER_DB },
      properties: {
        "Worker Name":     { title:     [{ text: { content: FAKE_WORKER_NAME } }] },
        "Worker ID":       { rich_text: [{ text: { content: FAKE_WORKER_ID } }] },
        "Total Submitted": { number: 1 },
        "Total Approved":  { number: 0 },
        "Total Rejected":  { number: 0 },
        "Current Streak":  { number: 3 },
        "Longest Streak":  { number: 5 },
        "Last Active":     { date: { start: new Date().toISOString() } },
      },
    });
    workerPageId = page.id;
    console.log(`✅  Created — page ID: ${workerPageId}`);
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    console.log("   Fix: check that your Worker Tracker database has ALL these columns:");
    console.log("   Worker Name (Title), Worker ID (Text), Total Submitted (Number),");
    console.log("   Total Approved (Number), Total Rejected (Number),");
    console.log("   Current Streak (Number), Longest Streak (Number), Last Active (Date)\n");
    process.exit(1);
  }

  // ── TEST 4: Create a submission row ─────────────────────────────────────────
  process.stdout.write("4. Creating a test submission row in Submissions DB... ");
  let submissionPageId;
  try {
    const page = await notion.pages.create({
      parent: { database_id: SUBMISSIONS_DB },
      properties: {
        "Challenge Title": { title:     [{ text: { content: "TEST: Debug a JavaScript function" } }] },
        "Worker ID":       { rich_text: [{ text: { content: FAKE_WORKER_ID } }] },
        "Worker Name":     { rich_text: [{ text: { content: FAKE_WORKER_NAME } }] },
        "Status":          { select:    { name: "pending" } },
        "Submission URL":  { url: "https://example.com/test-submission" },
        "Submitted At":    { date: { start: new Date().toISOString() } },
        "Attempt Number":  { number: 1 },
        "Challenge ID":    { rich_text: [{ text: { content: "test-challenge-001" } }] },
        "Submission ID":   { rich_text: [{ text: { content: "test-submission-001" } }] },
      },
    });
    submissionPageId = page.id;
    console.log(`✅  Created — page ID: ${submissionPageId}`);
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    console.log("   Fix: check that your Submissions database has ALL these columns:");
    console.log("   Challenge Title (Title), Worker ID (Text), Worker Name (Text),");
    console.log("   Status (Select), Submission URL (URL), Submitted At (Date),");
    console.log("   Attempt Number (Number), Challenge ID (Text), Submission ID (Text)\n");
    process.exit(1);
  }

  // ── TEST 5: Simulate AI evaluation — update the submission row ───────────────
  process.stdout.write("5. Simulating AI evaluation (updating submission status + score)... ");
  try {
    await notion.pages.update({
      page_id: submissionPageId,
      properties: {
        "Status":       { select:    { name: "approved" } },
        "AI Score":     { number: 87.5 },
        "AI Feedback":  { rich_text: [{ text: { content: "Good work! Clear logic, well-structured code." } }] },
        "Evaluated At": { date: { start: new Date().toISOString() } },
      },
    });
    console.log("✅  Updated — status changed to 'approved', score set to 87.5");
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    console.log("   Fix: check that Submissions DB has: AI Score (Number),");
    console.log("   AI Feedback (Text), Evaluated At (Date) columns.\n");
    process.exit(1);
  }

  // ── TEST 6: Update worker stats ──────────────────────────────────────────────
  process.stdout.write("6. Updating worker summary stats... ");
  try {
    await notion.pages.update({
      page_id: workerPageId,
      properties: {
        "Total Approved": { number: 1 },
        "Current Streak": { number: 4 },
        "Last Active":    { date: { start: new Date().toISOString() } },
      },
    });
    console.log("✅  Updated — Total Approved = 1, streak = 4");
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    process.exit(1);
  }

  // ── TEST 7: Query back to verify data is there ───────────────────────────────
  process.stdout.write("7. Querying Submissions DB to verify data saved correctly... ");
  try {
    const result = await notion.databases.query({
      database_id: SUBMISSIONS_DB,
      filter: { property: "Worker ID", rich_text: { equals: FAKE_WORKER_ID } },
    });
    const row   = result.results[0];
    const score = row?.properties?.["AI Score"]?.number;
    const status= row?.properties?.["Status"]?.select?.name;
    console.log(`✅  Found — status: "${status}", score: ${score}`);
  } catch (err) {
    console.log(`❌  Failed — ${err.message}`);
    process.exit(1);
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  console.log("\n=== All 7 tests passed ✅ ===");
  console.log("\nNow open Notion and check:");
  console.log("  - Worker Tracker DB → should have a row called 'Test Worker (DELETE ME)'");
  console.log("  - Submissions DB    → should have a row called 'TEST: Debug a JavaScript function'");
  console.log("                        with status 'approved' and score 87.5");
  console.log("\nDelete both test rows from Notion when you're done.\n");
}

run().catch(err => {
  console.error("\n❌ Unexpected error:", err.message);
  process.exit(1);
});