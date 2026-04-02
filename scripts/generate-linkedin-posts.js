// Usage: node generate-linkedin-posts.js [source.md] [post_count] [campaign_weeks]
const fs = require('fs');

// Load .env if present
if (fs.existsSync('.env')) {
  fs.readFileSync('.env', 'utf-8').split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const sourceFile = process.argv[2] || 'Q12026.md';
const postCount = parseInt(process.argv[3] || '20');
const campaignWeeks = parseInt(process.argv[4] || '6');

if (!fs.existsSync(sourceFile)) {
  console.error('Source file not found: ' + sourceFile);
  process.exit(1);
}

const sourceText = fs.readFileSync(sourceFile, 'utf-8');

// --- Post type distribution ---
const TYPE_MIX = {
  statistical_hook: 0.25,
  narrative_story: 0.20,
  question_discussion: 0.15,
  thread_deep_dive: 0.20,
  hot_take_contrarian: 0.15,
  defensive_actionable: 0.05,
};

function computeTypeCounts(total) {
  const counts = {};
  let assigned = 0;
  const types = Object.keys(TYPE_MIX);
  types.forEach((type, i) => {
    if (i === types.length - 1) {
      counts[type] = Math.max(1, total - assigned);
    } else {
      counts[type] = Math.max(1, Math.round(total * TYPE_MIX[type]));
      assigned += counts[type];
    }
  });
  return counts;
}

// --- System prompt ---
const SYSTEM = `You are a LinkedIn content strategist for DarkWebIQ, a dark web threat intelligence company. You create high-performing LinkedIn posts from threat intelligence reports.

BRAND VOICE RULES (MANDATORY — violating these is a critical error):
- Brand is always "DarkWebIQ" (never "Dark Web IQ", "Darkweb IQ", etc.)
- Alerts are "vetted", NEVER "verified"
- NEVER use "zero false positives"
- NEVER describe us as "monitoring marketplaces" or "tracking listings"
- We develop one-on-one relationships with threat actors using misattributable personas
- We receive access offers directly from threat actors — we don't scrape or monitor
- We intercept ACCESS before ransomware execution — never "intercept ransomware"
- Use "human-led intelligence" not "crypto intelligence and human intelligence"
- Intelligence tone: authoritative, analytical, data-driven. Not salesy or promotional.
- Reports use analytical prose: "DWIQ assesses...", "consistent with..."
- No marketing hype. This is intelligence, not sales collateral.

LINKEDIN ALGORITHM OPTIMIZATION (2026 best practices):
- First 210 characters are the hook — visible before "See more". Make them count.
- MIX post lengths for variety. Not every post should be long-form:
  - SHORT (600–900 chars): Punchy, sharp. Great for statistical hooks, hot takes, and questions. High comment rate.
  - MEDIUM (900–1,300 chars): Solid insight with enough depth. Good for narratives and contrarian takes.
  - LONG (1,300–1,900 chars): Deep dives and actionable posts. High save rate and dwell time.
- Write for "saves" — content with lasting reference value gets wider distribution.
- Write for dwell time — substantive, information-dense posts get rewarded.
- No engagement bait ("Like if you agree", "Comment below", "Share this").
- No external links in the post body — native content only. Suggest adding report link as first comment.
- 3–5 hashtags at the very end, PascalCase (e.g. #ThreatIntelligence).
- Soft CTAs only — invite discussion or reflection, never pushy sales language.
- Write as a senior threat intelligence professional sharing analysis, not as a company page.
- Use line breaks generously for readability. Short paragraphs (1-3 sentences).

APPROVED HASHTAG POOL (pick 3-5 per post, vary across posts):
#ThreatIntelligence #Ransomware #CyberSecurity #InfoSec #DarkWeb #CISO
#SecurityOperations #IncidentResponse #ThreatActors #DataBreach
#VPNSecurity #AccessBrokers #CyberCrime #RiskManagement

POST TYPE DEFINITIONS:

statistical_hook (SHORT — 600-900 chars):
Open with a single surprising number. One punchy line. Then 1-2 short paragraphs on why it matters. End with an implication or question. Keep it tight — the number does the work.

narrative_story (MEDIUM — 900-1,300 chars):
Tell the story of a specific finding — Leak Bazaar's emergence, the brute force tool discovery, SnowTeam's forum migration. Chronological or problem-solution structure. Name threat actors where the report does. Build tension and payoff.

question_discussion (SHORT — 600-900 chars):
Open with a provocative question that challenges conventional thinking. Provide brief data context from the report. End with another question. Designed to generate comments — brevity invites response.

thread_deep_dive (LONG — 1,300-1,900 chars):
Use clear section markers (line breaks, short headers using caps or symbols). 4-5 mini-sections covering a topic in depth. More technical detail. Designed for saves and bookmarks. This is where length pays off.

hot_take_contrarian (MEDIUM — 900-1,300 chars):
Challenge a common assumption ("Everyone talks about ransomware prevention. But the real risk has shifted."). Bold opening, data to support the reframe, clear conclusion. Not reckless — grounded in report data.

defensive_actionable (LONG — 1,300-1,900 chars):
Lead with a specific action item security teams can implement. Explain why it matters (tied to report data). List 3-4 concrete steps. High save value — practical reference material. Length is justified by the actionable detail.

CONTENT RULES:
- Every statistic MUST come from the source report. Never invent numbers.
- Cite sources inline where the report does (Chainalysis, IBM, etc.).
- Frame DarkWebIQ's role through what the data reveals, not product pitches.
- Target audience: CISOs, VP Security, IT decision-makers, security practitioners.
- Each post must stand alone — no "as we discussed in our last post" references.
- Vary the opening structure across posts. Don't start every post with a number.

Output valid JSON only. Do not wrap in markdown code fences.`;

// --- Build user prompt ---
function buildUserPrompt(typeCounts, batchOffset, previousTopics) {
  const typeInstructions = Object.entries(typeCounts)
    .map(([type, count]) => `- ${count} ${type} posts`)
    .join('\n');

  let previousContext = '';
  if (previousTopics && previousTopics.length > 0) {
    previousContext = `\nALREADY GENERATED (avoid repeating these topics):\n${previousTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`;
  }

  return `Generate LinkedIn posts from this DarkWebIQ Q1 2026 Threat Intelligence Report.

SOURCE REPORT:
"""
${sourceText}
"""

Generate exactly this mix:
${typeInstructions}
${previousContext}
KEY DATA POINTS TO ATOMIZE (use across multiple posts, don't cluster):
1. Ransomware payment rate: 28% in 2025 vs 63% in 2024 (Chainalysis)
2. 50% YoY increase in claimed attacks, 8,000+ orgs on leak sites in 2025
3. Access price deflation: $1,427 in Q1 2023 → $439 in Q1 2026 (69% drop)
4. Leak Bazaar: structured data monetization platform by SnowTeam (IAB tied to Akira)
5. $50,000 distributed brute force system targeting 8 enterprise VPN protocols
6. $75M single ransom to Dark Angels; median payment up 368% YoY
7. Shift from extortion to data asset monetization
8. Post-breach monitoring must account for structured resale, not just raw dumps
9. Defensive recommendations: lockout policies, MFA, authentication monitoring

IMPORTANT: Start post IDs at ${batchOffset + 1}.

Return JSON in this exact schema:
{
  "posts": [
    {
      "id": 1,
      "type": "statistical_hook",
      "topic": "Short topic description",
      "hook": "First 210 characters — the attention grabber before See more",
      "body": "Full post text, 1300-1900 characters, ready to copy-paste to LinkedIn. Include hashtags at the end.",
      "cta": "Soft CTA suggestion for the poster",
      "hashtags": ["#ThreatIntelligence", "#Ransomware", "#CyberSecurity"],
      "character_count": 1547
    }
  ]
}

RULES:
- Match the character count target for each post type:
  - SHORT types (statistical_hook, question_discussion): 600-900 characters
  - MEDIUM types (narrative_story, hot_take_contrarian): 900-1,300 characters
  - LONG types (thread_deep_dive, defensive_actionable): 1,300-1,900 characters
- The hook field must be the first 210 characters of the body (they must match).
- Include 3-5 hashtags from the approved pool at the end of each body.
- Vary tone and structure across posts — don't be formulaic.
- Every stat must come from the source report. Do not invent.`;
}

// --- Schedule assignment ---
function assignSchedules(posts, weeks, startDate) {
  const slots = [
    { day: 'Tuesday', offset: 1, time: '8:00 AM ET' },
    { day: 'Wednesday', offset: 2, time: '10:00 AM ET' },
    { day: 'Thursday', offset: 3, time: '12:00 PM ET' },
  ];

  // Find next Monday after startDate
  const start = new Date(startDate);
  const dayOfWeek = start.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  start.setDate(start.getDate() + daysUntilMonday);

  // Build a flat list of all available slots across all weeks
  const allSlots = [];
  for (let w = 0; w < weeks; w++) {
    slots.forEach(slot => {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + slot.offset);
      allSlots.push({ week: w + 1, day: slot.day, time: slot.time, date: d.toISOString().split('T')[0] });
    });
  }

  // Distribute posts evenly across available slots
  const step = allSlots.length / posts.length;
  posts.forEach((post, i) => {
    const slotIndex = Math.min(Math.floor(i * step), allSlots.length - 1);
    post.schedule = allSlots[slotIndex];
  });
  return posts;
}

// --- Validation ---
function validatePosts(posts) {
  const warnings = [];
  const banned = [
    { pattern: /zero false positives/i, fix: 'Use "analyst-vetted alerts"' },
    { pattern: /\bverified\b/i, fix: 'Use "vetted" not "verified"' },
    { pattern: /monitoring marketplaces/i, fix: 'We develop 1-on-1 relationships with threat actors' },
    { pattern: /tracking listings/i, fix: 'We receive access offers directly' },
    { pattern: /intercept ransomware/i, fix: 'We intercept ACCESS before ransomware execution' },
    { pattern: /Dark Web IQ|Darkweb IQ|dark web iq/g, fix: 'Always "DarkWebIQ"' },
  ];

  const lengthRanges = {
    statistical_hook: [600, 900],
    question_discussion: [600, 900],
    narrative_story: [900, 1300],
    hot_take_contrarian: [900, 1300],
    thread_deep_dive: [1300, 1900],
    defensive_actionable: [1300, 1900],
  };

  posts.forEach((post, i) => {
    banned.forEach(rule => {
      if (rule.pattern.test(post.body)) {
        warnings.push(`Post ${post.id}: Found "${rule.pattern.source}" — ${rule.fix}`);
      }
    });
    const len = post.body.length;
    const [min, max] = lengthRanges[post.type] || [600, 1900];
    if (len < min * 0.8) {
      warnings.push(`Post ${post.id} (${post.type}): Too short (${len} chars, target ${min}-${max})`);
    }
    if (len > max * 1.2) {
      warnings.push(`Post ${post.id} (${post.type}): Too long (${len} chars, target ${min}-${max})`);
    }
  });

  if (warnings.length > 0) {
    console.error('\nWARNINGS:');
    warnings.forEach(w => console.error('  ⚠ ' + w));
    console.error('');
  }
  return warnings;
}

// --- Output writing ---
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

function writeOutputs(result) {
  const dir = 'output/linkedin-posts';
  const postsDir = dir + '/posts';
  fs.mkdirSync(postsDir, { recursive: true });

  // Master JSON
  fs.writeFileSync(dir + '/campaign.json', JSON.stringify(result, null, 2));
  console.log('Written: ' + dir + '/campaign.json');

  // Individual post files
  result.posts.forEach(post => {
    const slug = String(post.id).padStart(2, '0') + '-' + post.type + '-' + slugify(post.topic);
    const content = [
      post.body,
      '',
      '---',
      `Type: ${post.type}`,
      `Topic: ${post.topic}`,
      `Schedule: ${post.schedule.day}, ${post.schedule.date} at ${post.schedule.time} (Week ${post.schedule.week})`,
      `CTA: ${post.cta}`,
      `First comment: Add report link as first comment after posting`,
      `Character count: ${post.body.length}`,
    ].join('\n');
    fs.writeFileSync(postsDir + '/' + slug + '.txt', content);
  });
  console.log('Written: ' + result.posts.length + ' post files to ' + postsDir + '/');

  // Campaign calendar
  const calendar = buildCalendar(result);
  fs.writeFileSync(dir + '/campaign-calendar.md', calendar);
  console.log('Written: ' + dir + '/campaign-calendar.md');
}

function buildCalendar(result) {
  const lines = [
    '# DarkWebIQ Q1 2026 — LinkedIn Campaign Calendar',
    '',
    `Generated: ${new Date().toISOString().split('T')[0]}`,
    `Total posts: ${result.posts.length} across ${result.campaign.campaign_weeks} weeks`,
    '',
  ];

  const byWeek = {};
  result.posts.forEach(post => {
    const w = post.schedule.week;
    if (!byWeek[w]) byWeek[w] = [];
    byWeek[w].push(post);
  });

  Object.keys(byWeek).sort((a, b) => a - b).forEach(week => {
    const posts = byWeek[week];
    const firstDate = posts[0].schedule.date;
    lines.push(`## Week ${week} (starting ${firstDate})`);
    lines.push('');
    lines.push('| Day | Time | Type | Topic |');
    lines.push('|-----|------|------|-------|');
    posts.forEach(post => {
      lines.push(`| ${post.schedule.day} ${post.schedule.date} | ${post.schedule.time} | ${post.type} | ${post.topic} |`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

// --- LLM call ---
async function callClaude(userPrompt, maxTokens) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('API error ' + resp.status + ': ' + err);
  }

  return resp.json();
}

function parseResponse(data) {
  const raw = data.content[0].text.replace(/^```json?\s*/, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(raw);
}

// --- Main ---
async function run() {
  console.error('Source: ' + sourceFile);
  console.error('Generating ' + postCount + ' posts for ' + campaignWeeks + '-week campaign...\n');

  const typeCounts = computeTypeCounts(postCount);
  console.error('Post mix: ' + Object.entries(typeCounts).map(([t, c]) => `${c} ${t}`).join(', '));

  // Try single call first
  const userPrompt = buildUserPrompt(typeCounts, 0, []);
  console.error('\nCalling Claude API...');
  let data = await callClaude(userPrompt, 16000);

  let allPosts;

  if (data.stop_reason === 'end_turn') {
    const result = parseResponse(data);
    allPosts = result.posts;
    console.error('Generated ' + allPosts.length + ' posts in single call.');
  } else {
    // Truncated — fall back to batched generation
    console.error('Response truncated, switching to batched generation...');
    const half = Math.ceil(postCount / 2);
    const firstCounts = {};
    const secondCounts = {};
    let assigned = 0;
    Object.entries(typeCounts).forEach(([type, count]) => {
      const firstHalf = Math.ceil(count / 2);
      firstCounts[type] = firstHalf;
      secondCounts[type] = count - firstHalf;
      assigned += count;
    });

    // Batch 1
    console.error('Batch 1...');
    data = await callClaude(buildUserPrompt(firstCounts, 0, []), 16000);
    const batch1 = parseResponse(data);
    allPosts = batch1.posts;

    // Batch 2
    const previousTopics = allPosts.map(p => p.topic);
    console.error('Batch 2...');
    data = await callClaude(buildUserPrompt(secondCounts, allPosts.length, previousTopics), 16000);
    const batch2 = parseResponse(data);
    allPosts = allPosts.concat(batch2.posts);

    console.error('Generated ' + allPosts.length + ' posts in 2 batches.');
  }

  // Assign schedules
  assignSchedules(allPosts, campaignWeeks, new Date().toISOString().split('T')[0]);

  // Validate
  validatePosts(allPosts);

  // Build result
  const result = {
    campaign: {
      title: 'DarkWebIQ Q1 2026 Report — LinkedIn Campaign',
      source: sourceFile,
      generated_at: new Date().toISOString(),
      total_posts: allPosts.length,
      campaign_weeks: campaignWeeks,
    },
    posts: allPosts,
  };

  // Write outputs
  writeOutputs(result);

  console.log('\nDone. ' + allPosts.length + ' posts ready in output/linkedin-posts/');
}

run().catch(e => { console.error(e); process.exit(1); });
