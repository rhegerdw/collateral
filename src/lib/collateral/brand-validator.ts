// Deterministic post-processing brand rule enforcement
// Runs after every LLM response to catch recurring violations

import { EnhancedOnePager, BrandViolation } from './types';

interface DenyRule {
  pattern: RegExp;
  replacement: string;
  rule: string;
}

const DENY_RULES: DenyRule[] = [
  // "zero false positives" — overclaim, factually wrong
  {
    pattern: /zero false positives?/gi,
    replacement: 'analyst-vetted alerts',
    rule: 'no-absolute-claims',
  },
  // "verified" when describing alerts/threats — always "vetted"
  {
    pattern: /\bverified\s+(threats?|alerts?|intelligence|findings?)/gi,
    replacement: 'vetted $1',
    rule: 'brand-terminology',
  },
  // "monitoring marketplaces" — we develop relationships, not scrape
  {
    pattern: /monitor(?:ing|s)?\s+(?:criminal\s+)?(?:dark\s*web\s+)?marketplaces?/gi,
    replacement: 'developing relationships with threat actors through misattributable personas',
    rule: 'positioning',
  },
  {
    pattern: /track(?:ing|s)?\s+(?:listings?|offers?)\s+(?:across|on)\s+(?:criminal\s+)?marketplaces?/gi,
    replacement: 'engaging directly with threat actors through misattributable personas',
    rule: 'positioning',
  },
  {
    pattern: /scrap(?:ing|es?)\s+(?:criminal\s+)?(?:dark\s*web\s+)?(?:marketplaces?|forums?)/gi,
    replacement: 'infiltrating criminal networks through human-led intelligence',
    rule: 'positioning',
  },
  // "crypto intelligence and human intelligence" — just "human-led intelligence"
  {
    pattern: /crypto(?:currency)?\s+intelligence\s+(?:and|&)\s+human\s+intelligence/gi,
    replacement: 'human-led intelligence',
    rule: 'brand-terminology',
  },
  // "intercept ransomware" — we intercept ACCESS before ransomware
  {
    pattern: /intercepts?\s+ransomware/gi,
    replacement: 'intercept access before ransomware execution',
    rule: 'brand-terminology',
  },
  {
    pattern: /intercepted\s+ransomware/gi,
    replacement: 'intercepted access before ransomware execution',
    rule: 'brand-terminology',
  },
  {
    pattern: /intercepting\s+ransomware/gi,
    replacement: 'intercepting access before ransomware execution',
    rule: 'brand-terminology',
  },
  // "100% detection/accuracy/coverage" — overclaim
  {
    pattern: /100%\s+(?:detection|accuracy|coverage)/gi,
    replacement: 'comprehensive coverage',
    rule: 'no-absolute-claims',
  },
  // "guaranteed" — never guarantee
  {
    pattern: /\bguaranteed?\b/gi,
    replacement: 'designed to',
    rule: 'no-absolute-claims',
  },
  // DarkWebIQ spelling consistency
  {
    pattern: /Dark\s*Web\s+IQ\b/g,
    replacement: 'DarkWebIQ',
    rule: 'brand-spelling',
  },
  {
    pattern: /Darkweb\s*IQ\b/g,
    replacement: 'DarkWebIQ',
    rule: 'brand-spelling',
  },
  {
    pattern: /DARK\s+WEB\s+IQ\b/g,
    replacement: 'DARKWEBIQ',
    rule: 'brand-spelling',
  },
];

function applyRulesToText(
  text: string,
  fieldPath: string,
  violations: BrandViolation[]
): string {
  let result = text;
  for (const rule of DENY_RULES) {
    const matches = result.match(rule.pattern);
    if (matches) {
      for (const match of matches) {
        violations.push({
          field: fieldPath,
          original: match,
          corrected: match.replace(rule.pattern, rule.replacement),
          rule: rule.rule,
        });
      }
      result = result.replace(rule.pattern, rule.replacement);
    }
  }
  return result;
}

export function validateAndFix(doc: EnhancedOnePager): {
  fixed: EnhancedOnePager;
  violations: BrandViolation[];
} {
  const violations: BrandViolation[] = [];

  const fixed: EnhancedOnePager = {
    ...doc,
    headline: applyRulesToText(doc.headline, 'headline', violations),
    subheadline: applyRulesToText(doc.subheadline, 'subheadline', violations),
    sections: doc.sections.map((section, i) => ({
      heading: applyRulesToText(section.heading, `sections[${i}].heading`, violations),
      body: applyRulesToText(section.body, `sections[${i}].body`, violations),
    })),
    stats: doc.stats.map((stat, i) => ({
      number: stat.number,
      label: applyRulesToText(stat.label, `stats[${i}].label`, violations),
    })),
    cta: applyRulesToText(doc.cta, 'cta', violations),
  };

  return { fixed, violations };
}
