# Popup Script - Integration Guide

## Quick Start

Add this script to your website's `<head>` section:

```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js"
        data-popup-config='{
          "formUrl": "https://book.businessandfitness.dk/widget/form/YOUR_FORM_ID",
          "brandColor": "#0066FF",
          "width": "auto",
          "height": "auto",
          "triggers": [
            {"type": "hash", "value": "free-trial"}
          ]
        }'>
</script>
```

Then add a link anywhere on your page:
```html
<a href="#free-trial">Start Free Trial</a>
```

---

## Configuration Options

### Required
- **formUrl** - Your form/iframe URL

### Optional
- **brandColor** - Color for close button and loader (default: `#0066FF`)
- **width** - Popup width in pixels or `"auto"` (default: `"auto"` = responsive 700px max)
- **height** - Popup height in pixels or `"auto"` (default: `"auto"` = responsive 650px max)
- **triggers** - Array of trigger configurations

---

## Trigger Types

### 1. Hash Link (Recommended)
Triggers when clicking a link with specific hash anchor

```javascript
{"type": "hash", "value": "free-trial"}
```

Use with:
```html
<a href="#free-trial">Click here</a>
<button onclick="location.hash='free-trial'">Click here</button>
```

### 2. CSS Class
Triggers when clicking any element with specific class

```javascript
{"type": "class", "value": "open-popup"}
```

Use with:
```html
<button class="open-popup">Click here</button>
<a href="#" class="open-popup">Click here</a>
```

### 3. Element ID
Triggers when clicking element with specific ID

```javascript
{"type": "id", "value": "signup-button"}
```

Use with:
```html
<button id="signup-button">Click here</button>
```

### 4. URL/Page
Auto-opens popup when user visits specific page

```javascript
{"type": "url", "value": "/landing-page"}
```

---

## Examples

### Basic Hash Trigger
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js"
        data-popup-config='{
          "formUrl": "https://example.com/form",
          "brandColor": "#96BEC1",
          "triggers": [
            {"type": "hash", "value": "signup"}
          ]
        }'>
</script>
```

### Multiple Triggers
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js"
        data-popup-config='{
          "formUrl": "https://example.com/form",
          "brandColor": "#0066FF",
          "triggers": [
            {"type": "hash", "value": "free-trial"},
            {"type": "class", "value": "contact-form"},
            {"type": "id", "value": "header-cta"}
          ]
        }'>
</script>
```

### Custom Size
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js"
        data-popup-config='{
          "formUrl": "https://example.com/form",
          "brandColor": "#FF6B6B",
          "width": 800,
          "height": 700,
          "triggers": [
            {"type": "hash", "value": "demo"}
          ]
        }'>
</script>
```

### Auto-open on Landing Page
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js"
        data-popup-config='{
          "formUrl": "https://example.com/form",
          "triggers": [
            {"type": "url", "value": "/special-offer"}
          ]
        }'>
</script>
```

---

## Features

✅ Auto-adjusting responsive sizes
✅ ESC key to close
✅ Click outside to close
✅ Loading spinner
✅ Error handling
✅ No body scroll while open
✅ Customizable brand color
✅ Multiple trigger types
✅ No dependencies

---

## Tips

1. **Use hash triggers** for most cases - cleanest and most flexible
2. **Set width/height to "auto"** for responsive popups that work on all devices
3. **Brand color** should match your website's primary color
4. **Multiple triggers** can point to the same popup
5. **Test the form URL** works in an iframe before deploying

---

## CDN URL

Replace `yourusername` with your GitHub username:
```
https://cdn.jsdelivr.net/gh/yourusername/quick-tools@main/openPopup.js
```

For specific version (recommended for production):
```
https://cdn.jsdelivr.net/gh/yourusername/quick-tools@v1.0.0/openPopup.js
```
