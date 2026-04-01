// DarkWebIQ First Party Monitoring & Interceptions — Product SKU
// Core offering: continuous monitoring of YOUR organization across criminal networks
// + active interception (purchase/disruption) of access sales targeting you

export const firstPartyMonitoringContent = {
  product: {
    name: "First Party Monitoring & Interceptions",
    shortName: "FPM&I",
    tagline: "We watch criminal networks for your name. When your access goes up for sale, we buy it first.",
    description: "Continuous monitoring of your organization across criminal channels—combined with active interception of access sales before attackers can use them. One service. Full lifecycle from detection to prevention.",
  },
  hero: {
    preheadline: "Your organization. Their networks. Our analysts.",
    headline: "We're Already Inside the Room Where Your Access Gets Sold.",
    subheadline: "DarkWebIQ develops one-on-one relationships with threat actors using misattributable personas. When your organization's credentials, vulnerabilities, or network access appear for sale, we know—and we buy it before anyone else can.",
    cta: "Check My Exposure",
    secondaryCta: "See a Sample Alert"
  },
  whatYouGet: {
    headline: "One Product. Two Capabilities.",
    subheadline: "Monitoring finds the threat. Interception eliminates it.",
    capabilities: [
      {
        title: "First Party Monitoring",
        description: "Continuous surveillance of your organization across criminal networks. Not marketplace scraping—direct relationships with the threat actors who broker access.",
        includes: [
          "Credential exposure detection across infostealer logs and private channels",
          "Access offer identification—when someone lists a way into your network",
          "Threat actor targeting awareness—who is looking at you and why",
          "Vulnerability exploitation tracking—which of your CVEs criminals are actively selling against",
          "Analyst-vetted alerts. Every finding reviewed by our team before it reaches you."
        ]
      },
      {
        title: "Interceptions",
        description: "When monitoring surfaces an active access sale targeting your organization, we don't just alert you—we purchase or disrupt the listing before attackers can weaponize it.",
        includes: [
          "Access purchase—we buy the credentials, VPN access, or exploit before attackers can",
          "Listing disruption—when purchase isn't possible, we take other steps to neutralize the offer",
          "Evidence preservation—full documentation of the listing, the purchase, and the threat actor",
          "23-day average head start to patch, rotate credentials, and fortify before any attack executes",
          "Documented proof of prevention for board reporting and cyber insurance carriers"
        ]
      }
    ]
  },
  howItWorks: {
    headline: "How It Works",
    subheadline: "From criminal network to your inbox—analyst-vetted, not automated",
    steps: [
      { title: "We Develop Relationships", description: "Our analysts build and maintain one-on-one relationships with threat actors using misattributable personas. This gets us into the private channels, Telegram groups, and direct conversations where access is brokered—not just the public marketplaces everyone else watches." },
      { title: "We Monitor for You", description: "Your organization is continuously monitored across these high-signal sources. When your credentials, domains, IP ranges, or access appears in any context—listing, conversation, infostealer log—our analysts flag it." },
      { title: "We Vet Every Alert", description: "Every finding is reviewed and contextualized by our team before it reaches you. You get actionable intelligence with the listing, the source, the asking price, and what it means for your risk posture. No raw feeds. No noise." },
      { title: "We Intercept Access Sales", description: "When an active access sale targets your organization, we purchase or disrupt the listing. The threat actor loses their sale. You get 23 days on average to patch the vulnerability and rotate credentials before any attack can execute." },
      { title: "You Get Documented Prevention", description: "Full evidence chain: what was listed, where, when we acquired it, and what was remediated. Proof your security program works—for your board, your auditors, and your insurance carrier." }
    ]
  },
  monitoring: {
    headline: "What We Monitor",
    subheadline: "Your attack surface through the eyes of threat actors",
    categories: [
      {
        title: "Credential Exposure",
        description: "Infostealer logs, credential dumps, and private sales. Not the stale Have I Been Pwned results—current listings from active threat actors selling fresh access.",
        examples: ["Corporate email credentials from infostealer malware", "VPN and remote access credentials listed for sale", "API keys and service account tokens in private channels"]
      },
      {
        title: "Network Access Offers",
        description: "Initial access brokers selling a way into your network. These are the listings that, if purchased by a ransomware operator, become a full-scale attack within weeks.",
        examples: ["RDP access to internal systems", "VPN credentials with MFA bypass", "Citrix/Fortinet/Pulse Secure exploits specific to your infrastructure"]
      },
      {
        title: "Threat Actor Targeting",
        description: "Conversations and reconnaissance activity indicating your organization is being evaluated as a target. We hear when threat actors discuss your company—before any listing goes live.",
        examples: ["Threat actors discussing your organization's revenue or insurance coverage", "Reconnaissance sharing—your domain, IP ranges, or employee names circulating", "Requests for access to organizations in your industry or region"]
      },
      {
        title: "Vulnerability Exploitation",
        description: "Which of your specific CVEs criminals are actively exploiting and selling against. Not theoretical CVSS scores—real criminal market activity against your infrastructure.",
        examples: ["Exploits for unpatched CVEs matching your tech stack", "Access listings that reference specific vulnerabilities in your perimeter", "Zero-day discussions targeting your vendors or platforms"]
      }
    ]
  },
  interceptions: {
    headline: "How Interceptions Work",
    subheadline: "The only threat intelligence that stops the attack—not just reports it",
    process: [
      { step: "1", title: "Listing Identified", description: "Our analyst spots an access offer targeting your organization in a private channel, forum, or direct conversation with a threat actor." },
      { step: "2", title: "Validation", description: "We confirm the listing is legitimate and matches your infrastructure. No false alarms—we verify before we act." },
      { step: "3", title: "Acquisition", description: "We purchase the access using our established personas and relationships. The threat actor gets their sale. The attacker who would have used it gets nothing." },
      { step: "4", title: "Destruction & Notification", description: "Access is destroyed. You receive a detailed alert with what was exposed, how it was listed, and exactly what to remediate." },
      { step: "5", title: "Remediation Window", description: "You now have an average of 23 days to patch the vulnerability and rotate credentials—before any ransomware operator could have executed." }
    ],
    whyItWorks: "Traditional threat intel tells you about threats. We eliminate them. By purchasing access before ransomware operators can, we remove the initial foothold entirely. No access means no lateral movement, no encryption, no ransom demand."
  },
  caseStudy: {
    headline: "Monitoring Spotted It. Interception Stopped It.",
    company: "Regional Healthcare System (400+ beds, $800M revenue)",
    timeline: [
      { day: "Day 1", event: "First Party Monitoring flagged Citrix VPN credentials for sale in a private Telegram channel—$15,000 asking price from a known initial access broker" },
      { day: "Day 3", event: "Our analysts validated the listing, confirmed it matched the client's infrastructure, and purchased the access" },
      { day: "Day 4", event: "Client received a detailed alert with the exact CVE, affected systems, and remediation steps. Credentials rotated, vulnerability patched." },
      { day: "Day 27", event: "The threat actor who listed the access was arrested by the FBI Cyber Division" }
    ],
    outcome: "23 days of lead time. Zero ransomware. Zero patient data exposure. Zero headlines.",
    withoutDwiq: "Without interception, this access would have been purchased by a ransomware affiliate within days. Average time from access sale to ransomware execution: 23 days. Average cost of a healthcare ransomware event: $10.9M (IBM Cost of a Data Breach 2024).",
    cta: "Get Your Threat Assessment"
  },
  stats: [
    { number: "847", label: "Access Sales Intercepted in 2025" },
    { number: "23", label: "Days Average Warning Before Attack Execution" },
    { number: "$4.5M", label: "Avg Losses Avoided Per Interception" },
    { number: "9,000+", label: "Access Offers Monitored Across Criminal Networks" }
  ],
  statsHeadline: "2025 Results",
  statsFootnote: "*Loss avoidance verified through cyber insurance claims analysis conducted by Coalition",
  comparison: {
    headline: "What Makes This Different",
    subheadline: "Every vendor claims dark web monitoring. Here's why ours isn't the same thing.",
    rows: [
      {
        category: "Source Access",
        others: "Scrape public marketplaces and paste sites",
        dwiq: "One-on-one relationships with threat actors via misattributable personas. We're in the private channels and DMs where access is actually brokered."
      },
      {
        category: "Alert Quality",
        others: "Automated matching dumps raw feeds to your team",
        dwiq: "Every alert is vetted by our analysts. You get context, not noise."
      },
      {
        category: "What Happens Next",
        others: "You get a report. The access stays on the market.",
        dwiq: "We buy the access and destroy it. The threat is eliminated, not just documented."
      },
      {
        category: "Credential Coverage",
        others: "Historical breach databases and recycled dumps",
        dwiq: "Current infostealer logs and fresh credential sales from active threat actors."
      },
      {
        category: "Outcome",
        others: "Awareness of exposure",
        dwiq: "Prevention of attack. Documented, evidence-backed, board-ready."
      }
    ]
  },
  pricing: {
    headline: "How It's Priced",
    description: "First Party Monitoring & Interceptions is a single subscription covering your organization's domains, IP ranges, and brand presence across criminal networks. Interception costs (access purchases) are included—no surprise bills when we buy access on your behalf.",
    includes: [
      "Unlimited monitoring across all enrolled domains and IP ranges",
      "All interception costs included—access purchases covered",
      "Analyst-vetted alerts with full context and remediation guidance",
      "Quarterly intelligence briefings with documented prevention evidence",
      "Direct analyst access for questions on any alert"
    ],
    cta: "Get a Quote",
    note: "No long-term contracts required. Threat assessment is free."
  },
  testimonials: [
    { quote: "They stopped an attack we never knew was coming. 19 days warning. That's not detection—that's prevention.", author: "Moriah Hara", role: "3X Fortune 500 CISO", featured: true },
    { quote: "Darkweb IQ is the Ferrari of Intel Firms.", author: "UK Threat Intel Lead", role: "Top 10 Global Bank" },
    { quote: "Incident Response before the Incident. That's not marketing—it's literally what they do.", author: "Billy Gouveia", role: "CEO Surefire Cyber" },
    { quote: "We receive a lot of infostealer noise from vendors, but this was the first time someone showed us actionable intelligence.", author: "Head of Threat Intel", role: "Top 5 Insurance Broker" }
  ],
  faq: [
    {
      question: "How is this different from dark web monitoring I already get from my SIEM or threat intel vendor?",
      answer: "Most vendors scrape public marketplaces and match against your domains. We develop direct relationships with the threat actors who broker access—getting into private channels and conversations your other vendors can't see. And we don't just report what we find. We buy the access and destroy it."
    },
    {
      question: "What counts as an 'interception'?",
      answer: "An interception occurs when we purchase or disrupt an active access sale targeting your organization. This includes credential purchases, VPN/RDP access acquisitions, and exploit disruptions. Every interception is documented with full evidence."
    },
    {
      question: "Do interception purchases cost extra?",
      answer: "No. All access purchase costs are included in your subscription. When we buy credentials or access listed for $5,000 or $50,000, that's on us."
    },
    {
      question: "How do you develop relationships with threat actors without breaking the law?",
      answer: "We operate using misattributable personas—carefully constructed identities that allow our analysts to build trust within criminal networks. We work closely with law enforcement, including the FBI and CISA, and our intelligence has contributed directly to arrests and prosecutions."
    },
    {
      question: "What if you don't find anything?",
      answer: "Good news—it means your organization isn't currently being targeted in the channels we monitor. You still benefit from continuous monitoring, and you'll be alerted the moment anything surfaces."
    }
  ],
  cta: {
    headline: "Is Your Access For Sale Right Now?",
    subheadline: "Get a confidential threat assessment. We'll check our intelligence sources and show you what threat actors see when they look at your organization.",
    button: "Get My Threat Assessment",
    secondaryButton: "See a Sample Alert",
    urgencyText: "847 access sales intercepted in 2025. How many targeted organizations like yours?"
  },
  footer: {
    certifications: ["CISA Partner", "FBI InfraGard Member"],
    trustedBy: "Trusted by enterprise security teams worldwide"
  }
};
