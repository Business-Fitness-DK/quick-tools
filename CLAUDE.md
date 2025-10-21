# Quick Tools - Project Documentation

## Overview
A collection of simple, standalone web tools built with vanilla HTML/CSS/JS. Each tool is self-contained and can be embedded in websites or served via CDN.

## Project Structure
```
quick-tools/
├── index.html              # Home page with tools grid
├── assets/
│   ├── css/
│   │   └── brand.css      # Shared design system
│   └── images/
│       └── logo.png       # B&F logo
├── tools/
│   └── csv-converter.html # CSV delimiter converter
└── README.md              # Detailed documentation
```

## Design Philosophy
- **Notion/Figma aesthetic**: Clean, minimal, professional
- **No dependencies**: Pure HTML/CSS/JS - no frameworks
- **Privacy-first**: All processing happens in the browser
- **CDN-ready**: Can be served via jsdelivr for easy embedding

## Design System (brand.css)

### Colors
- **Background**: `#FBFBFA` (warm off-white)
- **Surface**: `#ffffff` (white cards)
- **Primary**: `#0066FF` (Figma blue)
- **Text**: `#37352F` (warm black)
- **Borders**: `#E9E9E7` (subtle gray)

### Components
- Cards with subtle shadows
- Blue primary buttons
- Clean hover states
- Tool grid layout
- File upload areas

## Tools

### CSV Converter
**Purpose**: Convert semicolon-separated CSV files to comma-separated format

**Flow**:
1. Upload CSV file (drag & drop or browse)
2. File is automatically converted
3. Success message with download button appears
4. User downloads converted file

**Features**:
- Auto-detects delimiter (semicolon vs comma)
- Simple two-button interface after upload
- Clean success state

## Adding New Tools

1. Create new HTML file in `tools/` directory
2. Link to shared brand CSS: `<link rel="stylesheet" href="../assets/css/brand.css">`
3. Copy header with logo from existing tool
4. Build tool UI using design system classes
5. Add tool card to `index.html`

### Example Tool Card
```html
<a href="./tools/your-tool.html" class="tool-card">
  <div class="tool-icon">📊</div>
  <div class="tool-title">Your Tool Name</div>
  <p class="tool-description">Brief description of what it does</p>
</a>
```

## Embedding in GoHighLevel

Use iframe in custom HTML element:
```html
<iframe
  src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/tools/csv-converter.html"
  width="100%"
  height="800px"
  style="border: none;"
></iframe>
```

## Development Notes
- No build process required
- Open `index.html` directly in browser to test
- All tools are fully client-side
- Logo: B&F stacked logo at 48px height

## Future Tools
- Popup script generator
- Additional utilities as needed by clients
