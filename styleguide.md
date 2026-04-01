# DarkWebIQ Visual Style Guide

Reference for generating branded HTML collateral (reports, one-pagers, datasheets). All output should be self-contained HTML with inline CSS — no external dependencies.

---

## Brand Identity

- **Logo**: `output/logo-on-white.png` — embed as base64 `data:image/png;base64,...`
- **Logo height**: 40px, displayed as a block element above any document type badge
- **Brand spelling**: `DarkWebIQ` (camelCase), `DARKWEBIQ` (all-caps for footers/badges)

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#ff4400` | Section headings, accent bars, chart fills, badges, stat highlights |
| Black | `#111111` | Headlines, primary text, borders, dark chart fills |
| Body text | `#374151` | Paragraph text, chart labels |
| Secondary text | `#4b5563` | Subheadlines |
| Muted text | `#6b7280` | Meta info, stat labels, captions, chart titles, muted chart fills |
| Light muted | `#9ca3af` | Classification lines, date metadata |
| Surface | `#f9fafb` | Chart containers, comparison boxes, stat boxes |
| Border | `#e5e7eb` | Section heading underlines, chart/stat borders, dividers |
| White | `#ffffff` | Page background, text on dark fills |

Only three fill styles for charts: `primary` (#ff4400), `dark` (#111), `muted` (#6b7280).

---

## Typography

**Font stack**: `'Helvetica Neue', Helvetica, Arial, sans-serif`

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Page headline (h1) | 32px | 900 (black) | #111 | line-height: 1.2 |
| Subheadline | 16px | 400 | #4b5563 | line-height: 1.5 |
| Section heading (h2) | 17px | 700 (bold) | #ff4400 | border-bottom: 1px solid #e5e7eb; padding-bottom: 6px |
| Body paragraph | 14.5px | 400 | #374151 | line-height: 1.7; margin-bottom: 16px |
| In-body bold | inherit | 700 | inherit | Use `<strong>` for subsection headers within body text |
| Stat number | 22px | 900 | #111 | Centered in stat box |
| Stat label | 12px | 400 | #6b7280 | Below stat number |
| Chart title | 13px | 700 | #6b7280 | letter-spacing: 0.1em; text-transform: uppercase |
| Badge/tag | 11px | 700 | #fff on #ff4400 | letter-spacing: 0.2em; text-transform: uppercase; padding: 3px 10px |
| Meta/date line | 13px | 400 | #9ca3af | Bold spans use #6b7280 |
| Caption (figures) | 12px | 400 | #6b7280 | italic; on #f9fafb background with top border |

---

## Layout

- **Max width**: 860px (reports with charts), 800px (simpler collateral)
- **Page padding**: 48px top/bottom, 40px left/right
- **Body line-height**: 1.7 (reports), 1.6 (simpler collateral)

### Header
- Logo (block, 40px tall)
- Document type badge (e.g. "THREAT INTELLIGENCE REPORT") — inline-block, primary bg, white text
- Headline (h1)
- Subheadline
- Meta line (quarter, date, classification)
- Separated from body by 4px solid #000 border-bottom, 28px padding-bottom, 40px margin-bottom

### Sections
- 36px margin-bottom between sections
- h2 with primary color and 1px #e5e7eb border-bottom
- Body paragraphs separated by 16px margin-bottom

### Footer
- CTA/contact: 2px solid #000 border-top, 24px padding-top
- Classification line: centered, 11px, #9ca3af, letter-spacing 0.2em, with 1px #e5e7eb border-top and 40px margin-top

---

## Components

### Stat Boxes
Grid layout, 12px gap, centered text. Use `cols-N` class for responsive columns (max 5).

```html
<div class="stat-box">
  <div class="stat-number">28%</div>
  <div class="stat-label">Description text</div>
</div>
```

- Background: #f9fafb
- Border: 1px solid #e5e7eb
- Padding: 18px 12px

### Bar Charts
Horizontal bars with label on the left, track on the right.

```
[  Label  ] [████████████  value  ]
```

- Bar label: 140px wide, 13px, font-weight 600, right-aligned
- Track: #e5e7eb background, 28px height
- Fill: one of `.primary` (#ff4400), `.dark` (#111), `.muted` (#6b7280)
- Fill text: 12px, bold, white, left-padded 8px
- Use `value` (0-100) for width percentage, `displayValue` for the label inside the bar

### Timeline
Vertical line with dot markers.

- Left border: 3px solid #e5e7eb, 24px padding-left
- Dots: 12px circles, positioned at -33px left
  - Default: #ff4400 fill, white 3px border, #ff4400 2px box-shadow
  - Muted: #6b7280 fill and box-shadow (for external/open-source events)
- Date: 12px, bold, #ff4400 (or #6b7280 if muted)
- Text: 13.5px, #374151

### Comparison Boxes
Side-by-side metric boxes in a 2-column grid (16px gap).

- Box: #f9fafb background, 1px #e5e7eb border, 20px padding
- Box title: 13px, bold, #6b7280, uppercase, letter-spacing 0.1em
- Number: 32px, font-weight 900, #111 (or #ff4400 with `.highlight`)
- Detail: 13px, #6b7280
- Optional footnote: 13px, #374151, 10px margin-top

### Pipeline Flow
Horizontal stages in a flexbox row, no gaps.

- Each stage: equal flex, 14px vertical / 10px horizontal padding, centered white text, 12px bold
- Stage label: 10px, 70% opacity, block, letter-spacing 0.1em
- Color progression: s1=#ff4400, s2=#cc3700, s3=#992900, s4=#111
- Optional footnotes below: grid of small boxes with #f9fafb background

### Embedded Images
For screenshots and primary source evidence.

```html
<figure class="report-image">
  <img src="data:image/png;base64,..." alt="Description">
  <figcaption>Caption text</figcaption>
</figure>
```

- Border: 1px solid #e5e7eb
- Image: width 100%, display block
- Caption: 12px, #6b7280, italic, 10px/16px padding, #f9fafb background, 1px #e5e7eb border-top

### Chart Containers
Wrap all chart types in a container.

- Background: #f9fafb
- Border: 1px solid #e5e7eb
- Padding: 24px
- Margin-bottom: 20px
- Title inside: chart-title style (see typography)

---

## Print Styles

For PDF export via browser print dialog (Cmd+P, uncheck "Headers and footers"):

- Force background colors: `-webkit-print-color-adjust: exact; print-color-adjust: exact`
- Page: letter size, 0.75in margins
- `h2`: `break-after: avoid` (keep heading with content)
- Stat boxes, bar rows, timeline items, CTA: `break-inside: avoid`
- Use `.page-break` class (`page-break-before: always`) at major chapter boundaries
- Do NOT use `break-inside: avoid` on full sections or chart containers — they're too tall and cause blank gaps
- All colored backgrounds need `!important` overrides in print media query

---

## Voice & Terminology (for text generation)

- Alerts are **vetted**, never "verified"
- Never claim "zero false positives"
- We develop **one-on-one relationships with threat actors using misattributable personas** — not "monitoring marketplaces" or "scraping forums"
- We intercept **access** before ransomware execution — never "intercept ransomware"
- Brand is always `DarkWebIQ` (not "Dark Web IQ", "Darkweb IQ", etc.)
- Reports use analytical prose: "DWIQ assesses...", "assessed ties to...", "consistent with..."
- No marketing hype in reports — this is intelligence, not sales collateral
