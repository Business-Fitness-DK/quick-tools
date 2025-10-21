## Simple Integration (New Data-Attribute Method)

**INSERT ONCE IN HEAD:**
```html
<script src="https://cdn.jsdelivr.net/gh/mari22q2/bf-popup/openPopup.js" 
        data-popup-config='{"globalColor":"#96BEC1","popups":[{"formUrl":"https://book.businessandfitness.dk/widget/form/C5s3ocGHAwJTkveUncfg","trigger":{"type":"class","value":"provetime-popup"}}]}'>
</script>
```

---

## Legacy Integration (Old Method - Still Works)

**INSERT IN TOP:**
```html
<script src="https://cdn.jsdelivr.net/gh/mari22q2/bf-popup/openPopup.js"></script>
```

**FOR EACH POPUP:**
```html
<script>
    // Open Popup (with class ".provetime-popup")
    document.querySelectorAll(".provetime-popup").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        openPopup("https://book.businessandfitness.dk/widget/form/C5s3ocGHAwJTkveUncfg", "#96BEC1");
      });
    });
</script>
```

---

## Configuration Format

The `data-popup-config` attribute accepts JSON with:
- `globalColor`: Default color for all popups
- `popups`: Array of popup configurations

Each popup needs:
- `formUrl`: The iframe URL to load
- `trigger`: Object with `type` and `value`:
  - `type: "class"` - targets elements with CSS class
  - `type: "id"` - targets element with specific ID  
  - `type: "url"` - triggers on specific page URLs
  - `type: "text"` - triggers on buttons/links containing text