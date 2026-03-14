// DarkWebIQ CTI Lead Landing Page Content

export const ctiContent = {
  hero: {
    preheadline: "For threat intel teams tired of noise",
    headline: "We Buy Your Access Before Criminals Do.",
    subheadline: "We have relationships inside the criminal networks where stolen access gets bought and sold. When your organization comes up, we hear about it—and we buy the access before anyone can use it.",
    cta: "Check My Exposure",
    secondaryCta: "See a Sample Threat Report"
  },
  whoThisIsFor: {
    headline: "Built For Security Teams Who Want Signal",
    profiles: [
      { title: "Threat Intelligence Teams", description: "Your IOC feeds tell you what happened to someone else. We tell you someone is selling access to YOUR network right now—and we bought it first." },
      { title: "Security Operations Centers", description: "Every alert is vetted by our analysts before it reaches you—including infostealer logs. No raw data dumps. No chasing noise." },
      { title: "Incident Response Teams", description: "Incident response before the incident. We give you 23 days to remediate, not 23 minutes to contain. That's the difference between patching and forensics." },
      { title: "MSSPs & MDRs", description: "Tell your clients you stopped the ransomware before it started—because you bought the initial access before the attacker could. That's differentiation." }
    ]
  },
  trustedByBanner: {
    headline: "Trusted By",
    text: "Threat intelligence teams rely on DarkWebIQ for pre-attack intelligence"
  },
  caseStudy: {
    headline: "We Bought the Access. They Patched the Hole.",
    company: "Regional Healthcare System (400+ beds, $800M revenue)",
    timeline: [
      { day: "Day 1", event: "Our analyst spotted Citrix VPN credentials for sale in a private Telegram channel—$15,000 asking price" },
      { day: "Day 3", event: "We confirmed the listing was legitimate, purchased the access, and destroyed it" },
      { day: "Day 4", event: "Client patched the Citrix vulnerability and rotated all credentials" },
      { day: "Day 27", event: "The threat actor who lost the sale was arrested by the FBI Cyber Division" }
    ],
    outcome: "23 days warning. Zero ransomware. Zero headlines.",
    cta: "Get Your Threat Assessment"
  },
  stats: [
    { number: "72", label: "Ransomware Attacks Intercepted in Q1 2026" },
    { number: "$50MM", label: "In Verified Losses Prevented" },
    { number: "23", label: "Days Average Warning Before Attack" }
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
    subheadline: "Pre-Attack Intelligence, Not Post-Breach Reports",
    steps: [
      { title: "Access Interception", description: "We have relationships inside criminal networks. When your organization's access comes up for sale, we hear about it—and we buy it before attackers can." },
      { title: "23-Day Head Start", description: "Our average warning time before attack execution. That's 23 days to patch, rotate credentials, and fortify—not 23 minutes to respond." },
      { title: "Analyst-Vetted Alerts", description: "Every alert is reviewed by our team before it reaches you. Including infostealer logs. No raw feeds. No noise." },
      { title: "Documented Prevention", description: "Proof of attacks stopped: the listing, the purchase, the remediation. Evidence your security program works." }
    ]
  },
  comparison: {
    headline: "Why Your Threat Intel Feeds Miss This",
    subheadline: "We operate where your tools can't see",
    capabilitiesEnhanced: [
      { theirs: "IOC feeds with thousands of indicators", ours: "We tell you YOUR access is for sale—and we bought it" },
      { theirs: "Threat reports about other companies' breaches", ours: "Direct intelligence that YOU are being targeted" },
      { theirs: "\"Possible\" or \"likely\" threat assessments", ours: "Certainty: we found the listing, confirmed it, purchased it" },
      { theirs: "Post-breach indicators of compromise", ours: "Pre-attack interception—23 days before any malware runs" },
      { theirs: "Analyst time spent triaging noise", ours: "Every alert vetted by our analysts before it reaches you" }
    ]
  },
  testimonials: [
    { quote: "We receive a lot of infostealer noise from vendors, but this was the first time someone showed us actionable intelligence.", author: "Head of Threat Intel", role: "Top 5 Insurance Broker", featured: true },
    { quote: "They stopped an attack we never knew was coming. 19 days warning. That's not detection—that's prevention.", author: "Moriah Hara", role: "3X Fortune 500 CISO" },
    { quote: "Darkweb IQ is the Ferrari of Intel Firms.", author: "UK Threat Intel Lead", role: "Top 10 Global Bank" },
    { quote: "Incident Response before the Incident. That's not marketing—it's literally what they do.", author: "Billy Gouveia", role: "CEO Surefire Cyber" }
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
