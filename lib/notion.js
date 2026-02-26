import { Client } from '@notionhq/client';
// Platform client (your workspace — for admin use)
export const notion = new Client({ auth: process.env.NOTION_SECRET });
export const WORKER_DB = process.env.NOTION_WORKER_DB_ID;
export const SUBMISSIONS_DB = process.env.NOTION_SUBMISSIONS_DB_ID;
export const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
export const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
/**
* Creates a Notion client using a WORKER's personal access token.
* Use this for all writes to a worker's own Notion workspace.
*/
export function workerNotionClient(accessToken) {
 return new Client({ auth: accessToken });
}