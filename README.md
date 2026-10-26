# Quick Tools

A collection of simple, standalone HTML/CSS/JS tools for everyday tasks. Each tool is self-contained and can be easily embedded in websites via custom HTML or served through CDN (like jsdelivr).

## 🚀 Features

- **No Dependencies**: Pure HTML/CSS/JS - no frameworks or build steps
- **Self-Contained**: Each tool works independently
- **Privacy-First**: All processing happens in the browser
- **Easy to Embed**: Can be loaded via CDN or custom HTML code
- **Mobile Responsive**: Works on all devices

## 📦 Available Tools

### CSV Converter
Convert semicolon, comma or tab-separated exports to UTF-8 comma-separated CSV.
- **File**: `tools/csv-converter.html`
- **Features**:
  - Drag & drop file upload
  - Detects the separator across multiple records, including Excel `sep=` directives
  - Suggests skipping single-field report titles before the table; choose **First row to keep** for other layouts
  - Manual separator and first-row controls with source and output previews
  - Preserves quoted separators, decimal commas, escaped quotes and multiline cells
  - Reads UTF-8, UTF-16 with a BOM, and Windows-1252 exports
  - Reports malformed quotes and inconsistent column counts before allowing a download
  - Supports CSV, TXT and TSV files up to 20 MB, entirely in the browser

Review the first kept row before downloading. Title rows with multiple fields cannot reliably be distinguished from column names or data, so select the correct row manually. Rows before that selection and entirely blank rows are excluded. Files without headers are supported by keeping the first data row. Source previews show up to 10 rows and 20 columns; downloads retain every column. Output uses CRLF record endings and UTF-8 without a BOM.

For conversion regressions, run `node --test tests/csv-converter.test.cjs`. The tests execute the converter's inline script directly with a minimal DOM, covering parsing, detection, encoding and UI validation state. They do not replace browser testing or testing a client's failing export.

### Popup Script Generator
Create customizable popup forms that trigger on clicks, page load, or URL
- **File**: `tools/popup-generator.html`
- **Features**:
  - Multiple trigger types (hash links, classes, IDs, URLs)
  - Customizable colors and sizes
  - Multiple popups per page
  - Works in any platform (WordPress, GHL, etc.)
  - Automatic script generation with best practices

**Usage**:
```html
<!-- Load popup library with defer -->
<script src="https://cdn.jsdelivr.net/gh/Business-Fitness-DK/quick-tools@main/assets/js/openPopup.js" defer></script>

<!-- Configure popups with defer -->
<script defer>
(function runWhenReady() {
  // Wait for openPopup library to load (with 10 second timeout)
  if (typeof window.initPopups === 'function') {
    initPopups({
      formUrl: "https://your-form-url.com",
      brandColor: "#0066FF",
      width: "auto",
      height: "auto",
      triggers: [{ type: "hash", value: "signup" }]
    });
  } else {
    // Retry every 30ms until loaded (max 10 seconds)
    var elapsed = (runWhenReady.elapsed || 0) + 30;
    if (elapsed < 10000) {
      runWhenReady.elapsed = elapsed;
      setTimeout(runWhenReady, 30);
    } else {
      console.error('openPopup library failed to load after 10 seconds');
    }
  }
})();
</script>
```

### More Tools Coming Soon...

## 🎨 Brand Kit

All tools share a consistent brand identity defined in `assets/css/brand.css`:
- Clean, professional design
- Accessible color palette
- Consistent spacing and typography
- Reusable components (buttons, cards, forms)

## 🔗 Using with CDN (jsdelivr)

Once pushed to GitHub, you can load any tool via jsdelivr CDN:

```html
<!-- For the home page -->
https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/index.html

<!-- For specific tools -->
https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/tools/csv-converter.html

<!-- For the brand CSS -->
https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/assets/css/brand.css
```

## 📝 Embedding in GHL (GoHighLevel)

To embed a tool in your GHL landing page:

1. Add a Custom Code element
2. Use an iframe:

```html
<iframe
  src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/tools/csv-converter.html"
  width="100%"
  height="800px"
  style="border: none; border-radius: 8px;"
></iframe>
```

Or load directly:

```html
<div id="tool-container"></div>
<script>
  fetch('https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/tools/csv-converter.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('tool-container').innerHTML = html;
    });
</script>
```

## 🛠️ Adding New Tools

1. Create a new HTML file in the `tools/` folder
2. Link to the brand CSS: `<link rel="stylesheet" href="../assets/css/brand.css">`
3. Add the header with logo and back button
4. Build your tool using the brand kit classes
5. Update `index.html` to add a card for your new tool

## 📁 Project Structure

```
quick-tools/
├── index.html              # Home page with tools listing
├── assets/
│   ├── css/
│   │   └── brand.css       # Shared brand styles
│   └── js/                 # Shared JavaScript (if needed)
├── tools/
│   ├── csv-converter.html  # CSV converter tool
│   └── ...                 # More tools
└── README.md
```

## 🔧 Integration with n8n

For more complex tools requiring backend processing (Python, APIs, etc.):

1. Create the frontend tool as usual
2. Add an API call to your n8n webhook
3. Process data in n8n workflow
4. Return results to the frontend

Example:
```javascript
// In your tool's JavaScript
async function processWithN8n(data) {
  const response = await fetch('https://your-n8n-webhook-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}
```

## 🌐 Local Development

Simply open `index.html` in your browser. No build step required!

```bash
# Optional: Use a local server
python -m http.server 8000
# or
npx serve
```

## 📄 License

Free to use for any purpose.
