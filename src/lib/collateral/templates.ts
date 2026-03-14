// Pre-defined templates for collateral generation
// Fill with content blocks and meeting context

import { MeetingContext, ContentBlocks, GeneratedEmail, GeneratedOnePager, EmailTemplate, Industry } from './types';
import { getIndustryHooks } from './selector';

// Email Templates
export const EMAIL_TEMPLATES: Record<EmailTemplate, (blocks: ContentBlocks, context: MeetingContext) => GeneratedEmail> = {
  'post-meeting': (blocks, context) => {
    const firstName = context.attendees?.[0]?.split(' ')[0] || '';
    const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
    const topic = context.painPoints?.[0] || context.topicsDiscussed?.[0] || 'your security posture';
    const nextStep = context.nextSteps?.[0] || 'schedule a follow-up call to discuss next steps';

    return {
      subject: `Following up - ${context.company} + DarkWebIQ`,
      body: `${greeting}

Great speaking with you about ${topic}.

${blocks.keyBenefit}

Quick stat that might be relevant: ${blocks.relevantStat}.

${context.nextSteps?.length ? `As discussed, the next step is to ${nextStep}.` : `Would love to ${nextStep}.`}

Happy to answer any questions or loop in our technical team for a deeper dive.

Best,
[Your name]

P.S. "${blocks.testimonial?.quote}" — ${blocks.testimonial?.author}, ${blocks.testimonial?.role}`,
    };
  },

  'cold-outreach': (blocks, context) => {
    const firstName = context.attendees?.[0]?.split(' ')[0] || '';
    const greeting = firstName ? `${firstName},` : '';

    return {
      subject: `${context.company} on the dark web?`,
      body: `${greeting}

I ran a quick dark web scan on ${context.company} and found some exposure I thought you'd want to know about.

${blocks.keyBenefit}

${blocks.relevantStat} — that's the kind of early warning we provide.

Happy to share what we found — no strings attached. Would a 15-minute call this week work?

[Your name]`,
    };
  },

  'threat-update': (blocks, context) => {
    const firstName = context.attendees?.[0]?.split(' ')[0] || '';
    const greeting = firstName ? `${firstName},` : '';
    const hooks = getIndustryHooks(context.industry || 'enterprise');

    return {
      subject: `${context.industry === 'healthcare' ? 'Healthcare' : context.industry === 'financial' ? 'Financial services' : 'Industry'} threat update`,
      body: `${greeting}

Quick heads up — we're seeing increased ransomware activity targeting ${hooks.specificConcern}.

What we're tracking:
• ${blocks.relevantStat}
• Focus on ${hooks.caseStudyFocus}
• Typical warning signs appearing 23 days before attack execution

If you'd like, I can run a quick check to see if there are any indicators of targeting against ${context.company}. Takes 5 minutes and might save you a lot of headaches.

[Your name]`,
    };
  },

  'event-follow-up': (blocks, context) => {
    const firstName = context.attendees?.[0]?.split(' ')[0] || '';
    const greeting = firstName ? `${firstName},` : '';
    const topic = context.topicsDiscussed?.[0] || 'dark web monitoring';

    return {
      subject: `Good meeting you`,
      body: `${greeting}

Great connecting at the event. Our conversation about ${topic} stuck with me.

As mentioned:
• ${blocks.keyBenefit}
• ${blocks.relevantStat}

Would you be open to a follow-up call to dig deeper? Happy to bring our threat analyst to make it valuable for your team.

[Your name]`,
    };
  },
};

// One-pager generator
export function generateOnePager(blocks: ContentBlocks, context: MeetingContext): GeneratedOnePager {
  const industry = context.industry || 'enterprise';
  const hooks = getIndustryHooks(industry);

  // Build challenge section from pain points or defaults
  const challenge = context.painPoints?.length
    ? context.painPoints.slice(0, 3).map(p => `• ${p}`).join('\n')
    : `• Ransomware groups targeting ${hooks.specificConcern}\n• Stolen credentials and access sales in criminal channels\n• Limited visibility into pre-attack indicators`;

  // Select 3 key benefits
  const benefits = blocks.capabilities.slice(0, 3);

  // Build stats array
  const stats = [
    { number: '847', label: 'Attacks Intercepted in 2025' },
    { number: '23', label: 'Days Average Warning' },
    { number: '$4.5M', label: 'Avg Loss Avoided' },
  ];

  return {
    headline: blocks.headline,
    company: context.company,
    industry,
    sections: {
      challenge,
      solution: blocks.subheadline,
      benefits,
      caseStudy: blocks.caseStudy,
      stats,
      testimonial: blocks.testimonial,
      cta: blocks.cta,
    },
  };
}

// Format one-pager as markdown
export function onePagerToMarkdown(onePager: GeneratedOnePager): string {
  const { headline, company, sections } = onePager;

  let md = `# ${headline}

**Prepared for: ${company}**

---

## The Challenge

${sections.challenge}

## Our Solution

${sections.solution}

## Key Capabilities

${sections.benefits.map(b => `• ${b}`).join('\n')}

## Results

| Metric | Value |
|--------|-------|
${sections.stats.map(s => `| ${s.label} | **${s.number}** |`).join('\n')}

`;

  if (sections.caseStudy) {
    md += `## Case Study: ${sections.caseStudy.headline}

**${sections.caseStudy.company}**

${sections.caseStudy.outcome}

`;
  }

  if (sections.testimonial) {
    md += `---

> "${sections.testimonial.quote}"
>
> — ${sections.testimonial.author}, ${sections.testimonial.role}

`;
  }

  md += `---

**Next Step:** ${sections.cta}
`;

  return md;
}

// Format email for display
export function formatEmailForDisplay(email: GeneratedEmail): string {
  return `**Subject:** ${email.subject}

---

${email.body}`;
}
