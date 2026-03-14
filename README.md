# DarkWebIQ Collateral Generator

A lightweight tool to generate meeting-specific collateral (emails, one-pagers) from existing pitch content.

## Features

- **4 Email Templates**: Post-meeting follow-up, cold outreach, threat update, event follow-up
- **One-Pager Generation**: Markdown output ready for PDF
- **Industry Detection**: Healthcare, Financial, Enterprise, SMB
- **Persona Detection**: CISO, CTI, SOC, Vendor Risk
- **Token-Conscious Design**: ~600-1100 tokens per generation
- **Copy to Clipboard**: One-click copy for all outputs

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/darkwebiq-collateral-generator)

Or deploy manually:

```bash
npm install -g vercel
vercel
```

## Configuration

### API Key (Optional)

For AI-powered context extraction from meeting notes, add your Anthropic API key in the "Advanced" section of the form. Without an API key, you can still generate collateral by manually selecting industry and persona.

## Architecture

```
src/
├── app/
│   └── page.tsx              # Main UI
├── lib/
│   ├── collateral/
│   │   ├── index.ts          # Main generate() function
│   │   ├── extractor.ts      # LLM extraction
│   │   ├── selector.ts       # Content selection
│   │   ├── templates.ts      # Output templates
│   │   └── types.ts          # TypeScript types
│   └── content/
│       ├── content.ts        # Core messaging
│       ├── cti.ts            # CTI persona content
│       ├── soc.ts            # SOC persona content
│       ├── vendor-risk.ts    # TPRM content
│       └── smb.ts            # SMB content
```

## Token Usage

| Operation | Tokens | Notes |
|-----------|--------|-------|
| Extract context | ~500-700 | Only if API key provided |
| Select content | 0 | Pure logic |
| Fill template | 0 | String interpolation |

**Total: ~600-1100 tokens per generation** (vs ~3000+ for full LLM generation)
