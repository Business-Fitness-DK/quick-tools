(function() {
    // Function to initialize and show the popup
    function openPopup(iframeUrl, brandColor = '#007bff', width = 700, height = 650) {
      // Validate parameters
      if (!iframeUrl || typeof iframeUrl !== 'string') {
        console.error('openPopup: Invalid iframe URL provided');
        return;
      }
  
      // Sanitize URL to prevent XSS
      try {
        new URL(iframeUrl);
      } catch (e) {
        console.error('openPopup: Invalid URL format:', iframeUrl);
        return;
      }
  
      // Check if an overlay already exists
      if (document.querySelector('.popup-overlay')) {
        return;
      }
  
      // Save current body overflow and prevent background scrolling
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
  
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'popup-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'rgba(0, 0, 0, 0.8)';
      overlay.style.zIndex = '1000';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease-in';
      document.body.appendChild(overlay);
  
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          removePopup();
        }
      };
  
      // Helper to remove overlay and associated styles
      const removePopup = () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = previousOverflow;
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        const existingStyle = document.getElementById('popup-spinner-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
  
      // Fade in overlay
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
  
      // Close popup if clicking outside the box
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          removePopup();
        }
      });
  
      // Create popup container
      const popup = document.createElement('div');
      popup.style.position = 'relative';
      popup.style.width = `${width}px`;
      popup.style.height = `${height}px`;
      popup.style.background = '#fff';
      popup.style.borderRadius = '15px';
      popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      popup.style.opacity = '0';
      popup.style.transition = 'opacity 0.5s ease';
      overlay.appendChild(popup);
  
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '15px';
      closeBtn.style.background = 'transparent';
      closeBtn.style.border = 'none';
      closeBtn.style.color = brandColor;
      closeBtn.style.fontSize = '35px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = removePopup;
      popup.appendChild(closeBtn);
  
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = iframeUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      popup.appendChild(iframe);
  
      // Show preloader
      const preloader = document.createElement('div');
      preloader.style.position = 'absolute';
      preloader.style.top = '50%';
      preloader.style.left = '50%';
      preloader.style.transform = 'translate(-50%, -50%)';
      preloader.style.border = '6px solid #f3f3f3';
      preloader.style.borderTop = `6px solid ${brandColor}`;
      preloader.style.borderRadius = '50%';
      preloader.style.width = '50px';
      preloader.style.height = '50px';
      preloader.style.animation = 'spin 1s linear infinite';
      overlay.appendChild(preloader);
  
      // Add keyframes for preloader animation if not already present
      let styleSheet = document.getElementById('popup-spinner-style');
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'popup-spinner-style';
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `;
        document.head.appendChild(styleSheet);
      }
  
      // Handle iframe load and error events
      iframe.onload = () => {
        preloader.style.display = 'none';
        popup.style.opacity = '1';
      };
  
      iframe.onerror = () => {
        preloader.style.display = 'none';
        popup.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h3 style="margin: 0 0 10px 0; color: #333;">Unable to load form</h3>
            <p style="margin: 0; font-size: 14px;">Please check the URL and try again</p>
          </div>
        `;
        popup.style.opacity = '1';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '15px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = brandColor;
        closeBtn.style.fontSize = '35px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = removePopup;
        popup.appendChild(closeBtn);
      };
  
      // Set timeout for iframe loading
      setTimeout(() => {
        if (popup.style.opacity === '0') {
          iframe.onerror();
        }
      }, 10000);
    }
  
    // Initialize popup system with configuration
    function initPopupSystem(config = {}) {
      const defaultConfig = {
        globalColor: '#007bff',
        popups: []
      };
  
      const finalConfig = { ...defaultConfig, ...config };
  
      finalConfig.popups.forEach(popupConfig => {
        const { trigger, formUrl, color } = popupConfig;
        const popupColor = color || finalConfig.globalColor;
  
        if (trigger.type === 'class' || trigger.type === 'id') {
          const selector = trigger.type === 'class' ? `.${trigger.value}` : `#${trigger.value}`;
          const elements = document.querySelectorAll(selector);
          
          elements.forEach(element => {
            element.addEventListener('click', function(event) {
              event.preventDefault();
              openPopup(formUrl, popupColor);
            });
          });
        } 
        else if (trigger.type === 'url') {
          if (window.location.pathname === trigger.value || window.location.href.includes(trigger.value)) {
            const buttons = document.querySelectorAll('a, button');
            buttons.forEach(button => {
              // Default exclusions for common navigation/footer elements
              const defaultExcludes = 'nav, header, footer, .nav, .navbar, .header, .footer, .menu, .navigation, .sidebar, .breadcrumb, [role="navigation"]';
              
              // Combine default exclusions with user-specified ones
              const userExcludes = trigger.exclude || '';
              const allExcludes = userExcludes ? `${defaultExcludes}, ${userExcludes}` : defaultExcludes;
              
              let shouldExclude = false;
              const excludeList = allExcludes.split(',').map(s => s.trim()).filter(s => s);
              
              shouldExclude = excludeList.some(selector => {
                try {
                  return button.matches(selector) || button.closest(selector);
                } catch (e) {
                  console.warn('openPopup: Invalid exclude selector:', selector);
                  return false;
                }
              });
              
              if (!shouldExclude) {
                button.addEventListener('click', function(event) {
                  event.preventDefault();
                  openPopup(formUrl, popupColor);
                });
              }
            });
          }
        }
        else if (trigger.type === 'text') {
          const elements = document.querySelectorAll('a, button');
          elements.forEach(element => {
            if (element.textContent.toLowerCase().includes(trigger.value.toLowerCase())) {
              element.addEventListener('click', function(event) {
                event.preventDefault();
                openPopup(formUrl, popupColor);
              });
            }
          });
        }
      });
    }
  
    // Auto-initialize from data attributes
    function autoInit() {
      const script = document.querySelector('script[data-popup-config]');
      if (script) {
        try {
          const config = JSON.parse(script.getAttribute('data-popup-config'));
          initPopupSystem(config);
        } catch (e) {
          console.error('openPopup: Invalid configuration JSON', e);
        }
      }
    }
  
    // Run auto-init when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  
    // Expose functions to global scope
    window.openPopup = openPopup;
    window.initPopupSystem = initPopupSystem;
  })();