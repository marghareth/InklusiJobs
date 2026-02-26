import { workerNotionClient } from './notion';

/**
* Called once when a worker connects Notion.
* Creates their full tracker page pre-filled with
* their roadmap phases and unlocked challenges.
*
* @param {string} accessToken - Worker's Notion access token
* @param {object} workerData - { name, currentPhase, verificationScore }
* @param {array} phases - Array of roadmap_phases rows
* @param {array} challenges - Array of unlocked challenges with submission status
* @returns {string} - Notion page ID
*/
export async function buildWorkerPage(accessToken, workerData, phases, challenges) {
  const client = workerNotionClient(accessToken);
  
  // Build the children blocks for the page
  const children = [
    // Header
    { 
      object: 'block', 
      type: 'heading_1',
      heading_1: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'My InklusiJobs Tracker' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'This page updates automatically as you complete challenges on InklusiJobs.' }
        }]
      }
    },
    { object: 'block', type: 'divider', divider: {} },
    
    // Stats section
    { 
      object: 'block', 
      type: 'heading_2',
      heading_2: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'My Stats' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'Total Submitted: 0' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'Total Approved: 0' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'Current Streak: 0 days' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'Verification Score: ' + (workerData.verificationScore || 0) }
        }]
      }
    },
    { object: 'block', type: 'divider', divider: {} },
    
    // Roadmap section heading
    { 
      object: 'block', 
      type: 'heading_2',
      heading_2: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'My Roadmap (Current Phase: ' + (workerData.currentPhase || 'Phase 1') + ')' }
        }]
      }
    },
  ];
  
  // Add each phase and its challenges
  for (const phase of phases) {
    const statusLabel = 
      phase.status === 'active' ? ' — IN PROGRESS' :
      phase.status === 'completed' ? ' — COMPLETED' :
      phase.status === 'locked' ? ' — LOCKED' : '';
    
    children.push({
      object: 'block', 
      type: 'heading_3',
      heading_3: { 
        rich_text: [{ 
          type: 'text',
          text: { content: phase.phase_name + statusLabel }
        }]
      },
    });
    
    // Add challenges for this phase
    const phaseChallenges = challenges.filter(c => c.phase_id === phase.id);
    
    for (const ch of phaseChallenges) {
      const prefix = 
        ch.status === 'approved' ? 'Approved | Score: ' + ch.ai_score + ' | ' :
        ch.status === 'pending' ? 'Pending | ' :
        ch.status === 'rejected' ? 'Rejected | ' :
        'Not started | ';
      
      children.push({
        object: 'block', 
        type: 'to_do',
        to_do: {
          rich_text: [{ 
            type: 'text',
            text: { content: ch.title + ' — ' + prefix }
          }],
          checked: ch.status === 'approved',
        },
      });
    }
    
    if (phaseChallenges.length === 0) {
      children.push({ 
        object: 'block', 
        type: 'paragraph',
        paragraph: { 
          rich_text: [{ 
            type: 'text',
            text: { content: 'No challenges unlocked in this phase yet.' }
          }]
        }
      });
    }
  }
  
  // Submission log section
  children.push(
    { object: 'block', type: 'divider', divider: {} },
    { 
      object: 'block', 
      type: 'heading_2',
      heading_2: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'Submission Log' }
        }]
      }
    },
    { 
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{ 
          type: 'text',
          text: { content: 'New submissions appear here automatically.' }
        }]
      }
    },
  );
  
  // Create the page in worker's Notion
  const page = await client.pages.create({
    parent: { type: 'workspace', workspace: true },
    icon: { type: 'emoji', emoji: '📊' },
    properties: {
      title: {
        title: [{ 
          type: 'text',
          text: { content: workerData.name + ' — InklusiJobs Tracker' }
        }]
      },
    },
    children,
  });
  
  return page.id;
}

/**
* Appends a new submission entry to the worker's Submission Log section.
* Returns the block ID so we can update it after AI evaluation.
*/
export async function logSubmissionBlock(accessToken, pageId, data) {
  const client = workerNotionClient(accessToken);
  
  const result = await client.blocks.children.append({
    block_id: pageId,
    children: [{
      object: 'block', 
      type: 'paragraph',
      paragraph: { 
        rich_text: [{
          type: 'text',
          text: { content: '[PENDING] ' + data.challengeTitle + ' | Submitted: ' + new Date().toLocaleDateString() }
        }]
      },
    }],
  });
  
  // Return the block ID of the new paragraph
  return result.results[0]?.id || null;
}

/**
* Updates the submission log entry after AI evaluation.
* Uses the block ID saved during logSubmissionBlock().
*/
export async function updateSubmissionBlock(accessToken, blockId, data) {
  const client = workerNotionClient(accessToken);
  
  const label = 
    data.status === 'approved' ? '[APPROVED]' :
    data.status === 'rejected' ? '[REJECTED]' : '[REVIEWED]';
  
  await client.blocks.update({
    block_id: blockId,
    paragraph: { 
      rich_text: [{
        type: 'text',
        text: { content: label + ' ' + data.challengeTitle + ' | Score: ' + (data.aiScore || 'N/A') + ' | ' + new Date().toLocaleDateString() }
      }]
    },
  });
}

/**
* Finds and updates the Stats blocks on the worker's page.
* Called after every submission and evaluation.
*/
export async function updatePageStats(accessToken, pageId, stats) {
  const client = workerNotionClient(accessToken);
  
  const blocks = await client.blocks.children.list({ block_id: pageId });
  
  for (const block of blocks.results) {
    if (block.type !== 'paragraph') continue;
    
    const text = block.paragraph?.rich_text?.[0]?.text?.content || '';
    
    if (text.startsWith('Total Submitted:')) {
      await client.blocks.update({ 
        block_id: block.id,
        paragraph: { 
          rich_text: [{ 
            type: 'text',
            text: { content: 'Total Submitted: ' + stats.totalSubmitted }
          }]
        }
      });
    }
    
    if (text.startsWith('Total Approved:')) {
      await client.blocks.update({ 
        block_id: block.id,
        paragraph: { 
          rich_text: [{ 
            type: 'text',
            text: { content: 'Total Approved: ' + stats.totalApproved }
          }]
        }
      });
    }
    
    if (text.startsWith('Current Streak:')) {
      await client.blocks.update({ 
        block_id: block.id,
        paragraph: { 
          rich_text: [{ 
            type: 'text',
            text: { content: 'Current Streak: ' + stats.currentStreak + ' days' }
          }]
        }
      });
    }
    
    if (text.startsWith('Verification Score:')) {
      await client.blocks.update({ 
        block_id: block.id,
        paragraph: { 
          rich_text: [{ 
            type: 'text',
            text: { content: 'Verification Score: ' + stats.verificationScore }
          }]
        }
      });
    }
  }
}

/**
* Called when a worker unlocks a new challenge.
* Finds the correct phase section and appends the new challenge as a to-do.
*/
export async function appendUnlockedChallenge(accessToken, pageId, data) {
  const client = workerNotionClient(accessToken);
  
  // Find the heading block for the phase
  const blocks = await client.blocks.children.list({ block_id: pageId });
  let phaseBlockId = null;
  
  for (const block of blocks.results) {
    if (block.type === 'heading_3') {
      const text = block.heading_3?.rich_text?.[0]?.text?.content || '';
      if (text.includes(data.phaseName)) {
        phaseBlockId = block.id;
        break;
      }
    }
  }
  
  // If phase heading not found, append after the last heading_3 or to the page
  if (!phaseBlockId) {
    // Find the last heading_3 to append after it
    let lastHeading3Index = -1;
    for (let i = blocks.results.length - 1; i >= 0; i--) {
      if (blocks.results[i].type === 'heading_3') {
        lastHeading3Index = i;
        break;
      }
    }
    
    if (lastHeading3Index >= 0) {
      // Get the block after the last heading_3
      const afterBlockId = blocks.results[lastHeading3Index + 1]?.id;
      if (afterBlockId) {
        // Append before the next block
        await client.blocks.children.append({
          block_id: pageId,
          after: afterBlockId,
          children: [{
            object: 'block', 
            type: 'to_do',
            to_do: {
              rich_text: [{ 
                type: 'text',
                text: { content: data.challengeTitle + ' — Not started' }
              }],
              checked: false,
            },
          }],
        });
        return;
      }
    }
  }
  
  // Default: append after the phase heading or to the page
  await client.blocks.children.append({
    block_id: phaseBlockId || pageId,
    children: [{
      object: 'block', 
      type: 'to_do',
      to_do: {
        rich_text: [{ 
          type: 'text',
          text: { content: data.challengeTitle + ' — Not started' }
        }],
        checked: false,
      },
    }],
  });
}