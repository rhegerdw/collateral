// Content selector - maps meeting context to existing content blocks
// Pure logic, no LLM calls

import { MeetingContext, Industry, Persona, ContentBlocks } from './types';
import { content } from '@/lib/content';
import { ctiContent } from '@/lib/content/cti';
import { socContent } from '@/lib/content/soc';
import { vendorRiskContent } from '@/lib/content/vendor-risk';
import { smbContent } from '@/lib/content/smb';

// Define a minimal content shape that all content sources share
interface ContentSource {
  hero: {
    headline: string;
    subheadline: string;
  };
  howItWorks: {
    steps: Array<{ description: string }>;
  };
  cta: {
    button: string;
  };
}

// Content source map by persona
const PERSONA_CONTENT: Record<Persona, ContentSource> = {
  ciso: content,
  cti: ctiContent,
  soc: socContent,
  'vendor-risk': vendorRiskContent,
};

// Testimonial selection by industry/persona
const TESTIMONIALS = {
  healthcare: {
    quote: "They stopped an attack we never knew was coming. 19 days warning. That's not detection—that's prevention.",
    author: "Moriah Hara",
    role: "3X Fortune 500 CISO",
  },
  financial: {
    quote: "Darkweb IQ is the Ferrari of Intel Firms.",
    author: "UK Threat Intel Lead",
    role: "Top 10 Global Bank",
  },
  enterprise: {
    quote: "Incident Response before the Incident. That's not marketing—it's literally what they do.",
    author: "Billy Gouveia",
    role: "CEO Surefire Cyber",
  },
  smb: {
    quote: "We sleep better at night knowing Darkweb IQ is out there looking out for us.",
    author: "Jeff Greer",
    role: "Manager of IT, Star Pipe Products",
  },
};

// Case studies by industry
const CASE_STUDIES = {
  healthcare: {
    headline: "VPN Vulnerability Flagged Before Attack",
    company: "Regional Healthcare System (400+ beds)",
    outcome: "23 days warning. Zero ransomware. Zero headlines.",
  },
  financial: {
    headline: "Credential Sale Intercepted",
    company: "Top 10 Global Bank",
    outcome: "$4M estimated loss avoidance",
  },
  enterprise: {
    headline: "We Bought the Access. They Patched the Hole.",
    company: "Fortune 500 Enterprise",
    outcome: "23 days to remediate. Attack prevented.",
  },
  smb: {
    headline: "SMB Protected Before Attack",
    company: "Regional Business",
    outcome: "No ransomware. No downtime. No recovery costs.",
  },
};

// Key benefits by persona
const KEY_BENEFITS: Record<Persona, string> = {
  ciso: "We buy your organization's access before criminals can use it—giving you 23 days to patch instead of 23 minutes to respond.",
  cti: "Our analyst-vetted alerts cut through the noise. Every alert is confirmed before it reaches you.",
  soc: "Prevention instead of detection. We intercept access sales weeks before any malware runs.",
  'vendor-risk': "Know about vendor compromises before they do—on average 9 days before official disclosure.",
};

// Stats by context
const STATS = {
  enterprise: { number: "847", label: "Attacks Intercepted in 2025" },
  healthcare: { number: "23", label: "Days Average Warning Before Attack" },
  financial: { number: "$4.5M", label: "Avg Losses Avoided Per Intercept" },
  smb: { number: "72", label: "Ransomware Attacks Stopped in Q1 2026" },
};

export function selectContent(context: MeetingContext): ContentBlocks {
  const industry = context.industry || 'enterprise';
  const persona = context.persona || 'ciso';

  // Get base content from persona-specific source
  const source = PERSONA_CONTENT[persona] || content;

  // Select headline based on persona
  const headline = source.hero.headline;
  const subheadline = source.hero.subheadline;

  // Select key benefit
  const keyBenefit = KEY_BENEFITS[persona];

  // Select relevant stat
  const stat = STATS[industry];
  const relevantStat = `${stat.number} ${stat.label}`;

  // Select case study
  const caseStudy = CASE_STUDIES[industry];

  // Select testimonial
  const testimonial = TESTIMONIALS[industry];

  // Get capabilities from source
  const capabilities = source.howItWorks.steps.map(step => step.description);

  // CTA
  const cta = source.cta.button;

  return {
    headline,
    subheadline,
    keyBenefit,
    relevantStat,
    caseStudy,
    testimonial,
    capabilities,
    cta,
  };
}

// Helper to detect pain point themes
export function detectPainPointTheme(painPoints: string[]): string | null {
  const combined = painPoints.join(' ').toLowerCase();

  if (combined.includes('vendor') || combined.includes('third-party') || combined.includes('supply chain')) {
    return 'vendor-risk';
  }
  if (combined.includes('ransomware') || combined.includes('attack')) {
    return 'prevention';
  }
  if (combined.includes('alert') || combined.includes('noise') || combined.includes('false positive')) {
    return 'signal-quality';
  }
  if (combined.includes('board') || combined.includes('executive') || combined.includes('roi')) {
    return 'executive-reporting';
  }
  if (combined.includes('credential') || combined.includes('infostealer') || combined.includes('password')) {
    return 'credentials';
  }

  return null;
}

// Get industry-specific messaging hooks
export function getIndustryHooks(industry: Industry): {
  complianceNote?: string;
  specificConcern: string;
  caseStudyFocus: string;
} {
  switch (industry) {
    case 'healthcare':
      return {
        complianceNote: 'HIPAA-compliant intelligence delivery',
        specificConcern: 'patient data protection',
        caseStudyFocus: 'healthcare system ransomware prevention',
      };
    case 'financial':
      return {
        complianceNote: 'SOX and PCI-aware reporting',
        specificConcern: 'regulatory compliance and fraud prevention',
        caseStudyFocus: 'financial institution credential interception',
      };
    case 'smb':
      return {
        specificConcern: 'affordable protection without an internal security team',
        caseStudyFocus: 'small business ransomware prevention',
      };
    case 'enterprise':
    default:
      return {
        specificConcern: 'enterprise-scale threat intelligence',
        caseStudyFocus: 'Fortune 500 security operations',
      };
  }
}
