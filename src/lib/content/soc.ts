// DarkWebIQ SOC Lead Landing Page Content

export const socContent = {
  hero: {
    preheadline: "For security teams who want prevention, not detection",
    headline: "Stop Ransomware 23 Days Before It Starts.",
    subheadline: "We have relationships inside the criminal networks where stolen access gets traded. When your organization comes up, we hear about it—and we buy the access before anyone can use it.",
    cta: "Check My Exposure",
    secondaryCta: "See How It Works"
  },
  whoThisIsFor: {
    headline: "Built For Teams Who Want Prevention",
    profiles: [
      { title: "Security Operations Teams", description: "Your stack detects attacks in progress. We prevent them entirely. Every alert is vetted by our analysts—no raw feeds, no chasing noise." },
      { title: "Vulnerability Management", description: "We tell you which vulnerabilities criminals are actually exploiting to sell your access. Not theoretical CVSS scores—real listings with real prices." },
      { title: "Incident Response", description: "23 days to remediate instead of 23 minutes to contain. We intercept the access sale, you patch the hole, the attack never happens." },
      { title: "Security Leadership", description: "Show your board attacks prevented, not incidents responded to. Documented proof: we bought the access, you patched the vuln, ransomware avoided." }
    ]
  },
  trustedByBanner: {
    headline: "Trusted By",
    text: "Security operations teams rely on DarkWebIQ for pre-attack intelligence"
  },
  caseStudy: {
    headline: "Prevention, Not Detection",
    company: "Regional Healthcare System (400+ beds, $800M revenue)",
    timeline: [
      { day: "Day 1", event: "Our analyst spotted Citrix VPN credentials for sale in a private Telegram channel—$15,000 asking price" },
      { day: "Day 3", event: "We confirmed the listing was legitimate, purchased the access, and destroyed it" },
      { day: "Day 4", event: "SOC team patched the Citrix CVE and rotated all affected credentials" },
      { day: "Day 27", event: "The threat actor who lost the sale was arrested by the FBI Cyber Division" }
    ],
    outcome: "23 days to patch. Zero ransomware. Zero incident response.",
    cta: "Get Your Threat Assessment"
  },
  stats: [
    { number: "72", label: "Attacks Prevented—Not Detected—in Q1 2026" },
    { number: "$50MM", label: "In Verified Losses Prevented" },
    { number: "23", label: "Days Average Lead Time Before Attack" }
  ],
  statsHeadline: "Q1 2026 Intelligence Report",
  statsFootnote: "*Verified through cyber insurance claims analysis conducted by Coalition",
  socialProof: {
    headline: "Trusted by Security Teams",
    logos: ["Fortune 500 Banks", "Global Insurers", "Healthcare Systems", "Critical Infrastructure"],
    metric: "847 attacks intercepted in 2025"
  },
  howItWorks: {
    headline: "What You Get",
    subheadline: "Prevention Instead of Detection",
    steps: [
      { title: "Access Interception", description: "We have relationships inside criminal networks. When your organization's access comes up for sale, we hear about it—and we buy it before attackers can." },
      { title: "23-Day Lead Time", description: "Our average warning before attack execution. Time to patch the vulnerability and rotate credentials—not scramble to contain a breach." },
      { title: "Analyst-Vetted Alerts", description: "Every alert is reviewed by our team before it reaches you. Including infostealer logs. No raw feeds. No false positive fatigue." },
      { title: "Documented Prevention", description: "Proof of attacks stopped: the listing, the purchase, the remediation. Show your board what your team prevented." }
    ]
  },
  comparison: {
    headline: "Why Your Stack Misses This",
    subheadline: "We operate where your tools can't see",
    capabilitiesEnhanced: [
      { theirs: "EDR detects malware after it runs", ours: "We intercept access sales weeks before any malware" },
      { theirs: "SIEM correlates logs after the breach", ours: "We alert you before there's a breach to log" },
      { theirs: "Vuln scanners show theoretical risk", ours: "We show criminals actively selling your real access" },
      { theirs: "Pen tests find what could be exploited", ours: "We find what IS being sold to attackers right now" },
      { theirs: "Detection and response", ours: "Prevention. 23 days of prevention." }
    ]
  },
  testimonials: [
    { quote: "They stopped an attack we never knew was coming. 19 days warning. That's not detection—that's prevention.", author: "Moriah Hara", role: "3X Fortune 500 CISO", featured: true },
    { quote: "Incident Response before the Incident. That's not marketing—it's literally what they do.", author: "Billy Gouveia", role: "CEO Surefire Cyber" },
    { quote: "We sleep better at night knowing Darkweb IQ is out there looking out for us.", author: "Jeff Greer", role: "Manager of IT, Star Pipe Products" },
    { quote: "We receive a lot of infostealer noise from vendors, but this was the first time someone showed us actionable intelligence.", author: "Head of Threat Intel", role: "Top 5 Insurance Broker" }
  ],
  riskCalculator: {
    headline: "What's Your Exposure?",
    subheadline: "Free 5-minute assessment",
    description: "Enter your domain. We'll check our intelligence database and show you what criminals see when they look at your organization.",
    cta: "Check My Exposure Free",
    privacyNote: "No sales call required. Results delivered by email."
  },
  whatToExpect: {
    headline: "What Happens After You Click",
    steps: [
      { number: "1", title: "30-Second Form", description: "Your name, email, and primary domain. That's it." },
      { number: "2", title: "48-Hour Intelligence Sweep", description: "Our analysts search high-signal sources for mentions of your organization." },
      { number: "3", title: "Confidential Briefing", description: "A 20-minute call showing what we found—and what it means for your security posture." }
    ],
    reassurance: "No pressure. No 'let me get my manager.' Just intelligence you can act on."
  },
  community: {
    headline: "Join 400+ Security Teams Getting Early Warning",
    description: "Weekly threat landscape briefings. No spam. Just intelligence that matters.",
    cta: "Subscribe to Intel Brief",
    socialProof: "Read by security teams at Google, JPMorgan, and the Department of Defense"
  },
  cta: {
    headline: "Is Your Access For Sale Right Now?",
    subheadline: "Get a confidential threat assessment. See exactly what criminals see when they look at your organization—and how to shut it down.",
    button: "Get My Threat Assessment",
    secondaryButton: "Download Sample Report",
    urgencyText: "Limited briefing slots available this week"
  },
  footer: {
    certifications: ["CISA Partner", "FBI InfraGard Member"],
    trustedBy: "Trusted by enterprise security teams worldwide"
  }
};
