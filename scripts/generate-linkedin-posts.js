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
      "body": "Full post text ready to copy-paste to LinkedIn. Include hashtags at the end.",
      "cta": "Soft CTA suggestion for the poster",
      "hashtags": ["#ThreatIntelligence", "#Ransomware", "#CyberSecurity"],
      "character_count": 1547,
      "visual": {
        "type": "stat_card | comparison | bar_chart | pipeline | quote_card",
        "headline": "Self-explanatory headline — a stranger must understand the card without reading the post",
        "data": "structured data for the visual — see VISUAL TYPES below"
      }
    }
  ]
}

VISUAL TYPES — every post MUST include a visual. Pick the best type for the content:

stat_card: 2-4 key numbers with labels. Good for statistical hooks.
  data: [{"number": "28%", "label": "Payment rate 2025", "highlight": true}, {"number": "63%", "label": "Payment rate 2024"}]

comparison: Before/after or two contrasting values. Good for showing change.
  data: {"left": {"number": "$1,427", "label": "Access price Q1 2023"}, "right": {"number": "$439", "label": "Access price Q1 2026"}, "change": "-69%"}

bar_chart: 3-6 items with percentage or relative values. Good for rankings/distributions.
  data: [{"label": "Fortinet", "value": 85}, {"label": "SonicWall", "value": 72}, {"label": "Cisco", "value": 68}]

pipeline: 3-5 sequential stages. Good for processes. The headline MUST explain what this pipeline is and why it matters (e.g. "How Leak Bazaar Turns Stolen Data Into Revenue" not "$50K System Architecture").
  data: {"subtitle": "One line of context explaining what this pipeline represents", "stages": ["Stage 1 label", "Stage 2 label", "Stage 3 label", "Stage 4 label"]}

quote_card: A key finding or assessment as a pull quote.
  data: {"quote": "The exact quote or finding", "attribution": "Source or context"}

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

async function writeOutputs(result) {
  const dir = 'output/linkedin-posts';
  const postsDir = dir + '/posts';
  const cardsDir = dir + '/cards';
  fs.mkdirSync(postsDir, { recursive: true });
  fs.mkdirSync(cardsDir, { recursive: true });

  // Master JSON
  fs.writeFileSync(dir + '/campaign.json', JSON.stringify(result, null, 2));
  console.log('Written: ' + dir + '/campaign.json');

  // Load image libs + fonts once
  const [{ default: satori }, { Resvg }] = await Promise.all([import('satori'), import('@resvg/resvg-js')]);
  const scriptDir = __dirname || '.';
  const fontsDir = require('path').resolve(scriptDir, '..', 'fonts');
  const fonts = [
    { name: 'Inter', data: fs.readFileSync(fontsDir + '/Inter-Regular.ttf'), weight: 400, style: 'normal' },
    { name: 'Inter', data: fs.readFileSync(fontsDir + '/Inter-Bold.ttf'), weight: 700, style: 'normal' },
    { name: 'Inter', data: fs.readFileSync(fontsDir + '/Inter-Black.ttf'), weight: 900, style: 'normal' },
  ];

  // Individual post files + PNG cards
  let cardCount = 0;
  for (const post of result.posts) {
    const slug = String(post.id).padStart(2, '0') + '-' + post.type + '-' + slugify(post.topic);
    const content = [
      post.body,
      '',
      '---',
      `Type: ${post.type}`,
      `Topic: ${post.topic}`,
      `Schedule: ${post.schedule.day}, ${post.schedule.date} at ${post.schedule.time} (Week ${post.schedule.week})`,
      `CTA: ${post.cta}`,
      `Visual: cards/${slug}.png`,
      `First comment: Add report link as first comment after posting`,
      `Character count: ${post.body.length}`,
    ].join('\n');
    fs.writeFileSync(postsDir + '/' + slug + '.txt', content);

    // Render PNG card
    const element = buildCardElement(post);
    if (element) {
      const svg = await satori(element, { width: 1080, height: 1080, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } });
      const png = resvg.render().asPng();
      fs.writeFileSync(cardsDir + '/' + slug + '.png', png);
      cardCount++;
    }
  }
  console.log('Written: ' + result.posts.length + ' post files to ' + postsDir + '/');
  console.log('Written: ' + cardCount + ' PNG cards to ' + cardsDir + '/');

  // Campaign calendar
  const calendar = buildCalendar(result);
  fs.writeFileSync(dir + '/campaign-calendar.md', calendar);
  console.log('Written: ' + dir + '/campaign-calendar.md');
}

// --- PNG card builder (Satori element trees, 1080x1350) ---
// Design: one hero element per card, massive typography, #f5f5f5 bg
function el(type, style, children) {
  if (typeof children === 'string') children = children;
  if (!Array.isArray(children) && typeof children !== 'string') children = children ? [children] : [];
  return { type, props: { style: { fontFamily: 'Inter', ...style }, children } };
}

function buildCardElement(post) {
  const v = post.visual;
  if (!v || !v.type) return null;

  // --- Build the hero content based on visual type ---
  let hero = null;

  if (v.type === 'stat_card' && Array.isArray(v.data)) {
    const primary = v.data.find(s => s.highlight) || v.data[0];
    const rest = v.data.filter(s => s !== primary);
    hero = el('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }, [
      el('div', { fontSize: 180, fontWeight: 900, color: '#ff4400', lineHeight: 1 }, String(primary.number)),
      el('div', { fontSize: 32, color: '#374151', marginTop: 12 }, String(primary.label)),
      ...(rest.length > 0 ? [
        el('div', { display: 'flex', width: '100%', marginTop: 48, gap: 40 },
          rest.map(s =>
            el('div', { display: 'flex', flexDirection: 'column' }, [
              el('div', { fontSize: 72, fontWeight: 900, color: '#111', lineHeight: 1 }, String(s.number)),
              el('div', { fontSize: 22, color: '#6b7280', marginTop: 6 }, String(s.label)),
            ])
          )
        )
      ] : []),
    ]);
  }

  else if (v.type === 'comparison' && v.data) {
    const d = v.data;
    hero = el('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }, [
      // "Before" — smaller, gray, clearly labeled
      el('div', { display: 'flex', alignItems: 'baseline', gap: 20 }, [
        el('div', { fontSize: 80, fontWeight: 900, color: '#c0c0c0', lineHeight: 1 }, String(d.left.number)),
        el('div', { fontSize: 26, color: '#9ca3af' }, String(d.left.label)),
      ]),
      // Change badge
      ...(d.change ? [
        el('div', { display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, marginBottom: 24 }, [
          el('div', { fontSize: 32, fontWeight: 900, color: '#ff4400' }, '\u2193'),
          el('div', { fontSize: 32, fontWeight: 900, background: '#ff4400', color: '#fff', padding: '6px 24px' }, String(d.change)),
        ]),
      ] : [
        el('div', { marginTop: 24, marginBottom: 24 }, ''),
      ]),
      // "After" — big, black, the hero
      el('div', { display: 'flex', alignItems: 'baseline', gap: 20 }, [
        el('div', { fontSize: 160, fontWeight: 900, color: '#111', lineHeight: 1 }, String(d.right.number)),
      ]),
      el('div', { fontSize: 26, color: '#374151', marginTop: 6 }, String(d.right.label)),
    ]);
  }

  else if (v.type === 'bar_chart' && Array.isArray(v.data)) {
    const maxVal = Math.max(...v.data.map(d => d.value));
    hero = el('div', { display: 'flex', flexDirection: 'column', width: '100%', gap: 24 },
      v.data.map(d => {
        const pct = Math.round((d.value / maxVal) * 100);
        return el('div', { display: 'flex', flexDirection: 'column', width: '100%' }, [
          el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }, [
            el('div', { fontSize: 34, fontWeight: 700, color: '#111' }, String(d.label)),
            el('div', { fontSize: 42, fontWeight: 900, color: '#ff4400' }, d.value + '%'),
          ]),
          el('div', { display: 'flex', width: '100%', background: '#e5e5e5', height: 56 }, [
            el('div', { width: pct + '%', height: '100%', background: '#ff4400' }, ''),
          ]),
        ]);
      })
    );
  }

  else if (v.type === 'pipeline' && (Array.isArray(v.data) || v.data?.stages)) {
    const colors = ['#ff4400', '#e03800', '#c23000', '#992900', '#111111'];
    const stages = Array.isArray(v.data) ? v.data : v.data.stages;
    const subtitle = !Array.isArray(v.data) && v.data.subtitle;
    const stageEls = stages.map((label, i) => {
        const items = [
          el('div', { display: 'flex', alignItems: 'center', gap: 28, background: '#ebebeb', padding: '28px 32px', borderLeft: '6px solid ' + (colors[i] || '#333') }, [
            el('div', { fontSize: 40, fontWeight: 900, color: colors[i] || '#333', width: 56, flexShrink: 0 }, String(i + 1) + '.'),
            el('div', { fontSize: 36, fontWeight: 700, color: '#111' }, String(label)),
          ]),
        ];
        if (i < v.data.length - 1) {
          items.push(el('div', { height: 8 }, ''));
        }
        return el('div', { display: 'flex', flexDirection: 'column' }, items);
      });
    const pipeChildren = [];
    if (subtitle) {
      pipeChildren.push(el('div', { fontSize: 24, color: '#6b7280', marginBottom: 24 }, String(subtitle)));
    }
    pipeChildren.push(...stageEls);
    hero = el('div', { display: 'flex', flexDirection: 'column', width: '100%' }, pipeChildren);
  }

  else if (v.type === 'quote_card' && v.data) {
    hero = el('div', { display: 'flex', flexDirection: 'column', width: '100%', borderLeft: '6px solid #ff4400', paddingLeft: 40 }, [
      el('div', { fontSize: 44, fontWeight: 700, color: '#111', lineHeight: 1.4 }, '\u201C' + String(v.data.quote) + '\u201D'),
      el('div', { fontSize: 28, color: '#6b7280', marginTop: 28 }, '\u2014 ' + String(v.data.attribution)),
    ]);
  }

  else { return null; }

  // --- Card shell: 1080x1080 square, content packed tight ---
  return el('div', {
    display: 'flex', flexDirection: 'column',
    width: '100%', height: '100%',
    background: '#f5f5f5', padding: '48px 56px',
    justifyContent: 'space-between',
  }, [
    // Header
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
      el('div', { fontSize: 18, fontWeight: 700, letterSpacing: 4, color: '#9ca3af' }, 'DARKWEBIQ'),
      el('div', { fontSize: 16, fontWeight: 700, letterSpacing: 2, color: '#fff', background: '#ff4400', padding: '5px 14px' }, 'Q1 2026'),
    ]),
    // Headline + hero packed together
    el('div', { display: 'flex', flexDirection: 'column', width: '100%' }, [
      el('div', { fontSize: 44, fontWeight: 900, color: '#111', lineHeight: 1.15, marginBottom: 36 }, String(v.headline || post.topic)),
      hero,
    ]),
    // Footer
    el('div', { fontSize: 16, color: '#b0b0b0' }, 'darkwebiq.com'),
  ]);
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
  let raw = data.content[0].text;
  // Strip markdown fences
  raw = raw.replace(/^```json?\s*\n?/, '').replace(/\n?\s*```\s*$/, '').trim();
  // Find the top-level JSON object — skip any preamble text
  const jsonStart = raw.indexOf('{"posts"');
  if (jsonStart === -1) {
    // fallback: find first {
    const fallback = raw.indexOf('{');
    if (fallback > 0) raw = raw.slice(fallback);
  } else if (jsonStart > 0) {
    raw = raw.slice(jsonStart);
  }
  // Strip trailing garbage after closing brace
  const lastBrace = raw.lastIndexOf('}');
  if (lastBrace > 0) {
    raw = raw.slice(0, lastBrace + 1);
  }
  // Fix trailing commas
  raw = raw.replace(/,\s*([\]}])/g, '$1');
  // Fix unescaped newlines inside JSON strings
  raw = raw.replace(/"([^"]*?)"/gs, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('JSON parse failed. First 500 chars:', raw.slice(0, 500));
    throw e;
  }
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
  await writeOutputs(result);

  console.log('\nDone. ' + allPosts.length + ' posts ready in output/linkedin-posts/');
}

run().catch(e => { console.error(e); process.exit(1); });
