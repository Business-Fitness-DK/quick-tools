(function() {
  // Core popup function
  function openPopup(formUrl, brandColor = '#0066FF', width = 'auto', height = 'auto') {
    // Validate URL
    if (!formUrl || typeof formUrl !== 'string') {
      console.error('openPopup: Invalid form URL');
      return;
    }

    try {
      new URL(formUrl);
    } catch (e) {
      console.error('openPopup: Invalid URL format');
      return;
    }

    // Prevent duplicate popups
    if (document.querySelector('.popup-overlay')) {
      return;
    }

    // Prevent body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // Close function
    const closePopup = () => {
      document.body.style.overflow = previousOverflow;
      overlay.remove();
      document.removeEventListener('keydown', handleEscape);
    };

    // ESC key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') closePopup();
    };
    document.addEventListener('keydown', handleEscape);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    // Calculate dimensions
    const popupWidth = width === 'auto' ? 'min(90vw, 700px)' : `${width}px`;
    const popupHeight = height === 'auto' ? 'min(90vh, 650px)' : `${height}px`;

    // Create popup container
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: relative;
      width: ${popupWidth};
      height: ${popupHeight};
      max-width: 95vw;
      max-height: 95vh;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
      overflow: hidden;
    `;
    overlay.appendChild(popup);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: transparent;
      border: none;
      color: ${brandColor};
      font-size: 32px;
      cursor: pointer;
      z-index: 10;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeBtn.onclick = closePopup;
    popup.appendChild(closeBtn);

    // Loading spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 4px solid #f3f3f3;
      border-top: 4px solid ${brandColor};
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 0.8s linear infinite;
    `;
    popup.appendChild(spinner);

    // Add spinner animation
    if (!document.getElementById('popup-spinner-style')) {
      const style = document.createElement('style');
      style.id = 'popup-spinner-style';
      style.textContent = `
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = formUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    `;
    popup.appendChild(iframe);

    // Handle load
    iframe.onload = () => {
      spinner.style.display = 'none';
      popup.style.opacity = '1';
    };

    // Handle error
    iframe.onerror = () => {
      spinner.style.display = 'none';
      popup.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <h3 style="margin: 0 0 8px; color: #333; font-size: 20px;">Unable to load form</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Please try again later</p>
        </div>
      `;
      popup.style.opacity = '1';

      const retryCloseBtn = document.createElement('button');
      retryCloseBtn.innerHTML = '×';
      retryCloseBtn.style.cssText = closeBtn.style.cssText;
      retryCloseBtn.onclick = closePopup;
      popup.appendChild(retryCloseBtn);
    };

    // Timeout fallback
    setTimeout(() => {
      if (popup.style.opacity === '0') {
        iframe.onerror();
      }
    }, 10000);
  }

  // Initialize popups based on config
  function initPopups(config) {
    const {
      formUrl,
      brandColor = '#0066FF',
      width = 'auto',
      height = 'auto',
      triggers = []
    } = config;

    if (!formUrl) {
      console.error('openPopup: formUrl is required');
      return;
    }

    triggers.forEach(trigger => {
      const { type, value } = trigger;

      // Hash link trigger (e.g., #free-trial)
      if (type === 'hash') {
        document.addEventListener('click', (e) => {
          const target = e.target.closest('a');
          if (target && target.hash === `#${value}`) {
            e.preventDefault();
            openPopup(formUrl, brandColor, width, height);
          }
        });
      }

      // Class trigger (e.g., .open-popup)
      else if (type === 'class') {
        document.addEventListener('click', (e) => {
          if (e.target.closest(`.${value}`)) {
            e.preventDefault();
            openPopup(formUrl, brandColor, width, height);
          }
        });
      }

      // ID trigger (e.g., #popup-button)
      else if (type === 'id') {
        document.addEventListener('click', (e) => {
          const element = document.getElementById(value);
          if (element && (e.target === element || element.contains(e.target))) {
            e.preventDefault();
            openPopup(formUrl, brandColor, width, height);
          }
        });
      }

      // URL trigger (opens popup on specific page)
      else if (type === 'url') {
        if (window.location.pathname === value || window.location.href.includes(value)) {
          // Wait for DOM to be ready, then open
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
              openPopup(formUrl, brandColor, width, height);
            });
          } else {
            openPopup(formUrl, brandColor, width, height);
          }
        }
      }
    });
  }

  // Auto-init from script tag data attribute
  function autoInit() {
    const script = document.querySelector('script[data-popup-config]');
    if (script) {
      try {
        const config = JSON.parse(script.getAttribute('data-popup-config'));
        initPopups(config);
      } catch (e) {
        console.error('openPopup: Invalid config JSON', e);
      }
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Expose to global scope
  window.openPopup = openPopup;
  window.initPopups = initPopups;
})();
