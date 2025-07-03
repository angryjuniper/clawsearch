// Custom JavaScript for SearXNG Dracula Theme
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the enhanced footer with icons
    function initEnhancedFooter() {
        // Get the footer element
        const footer = document.querySelector('footer');
        const footerP = footer?.querySelector('p');
        if (!footer || !footerP) return;
        
        // Create container for the navigation icons
        const footerNav = document.createElement('div');
        footerNav.className = 'footer-nav';
        
        // Replace |, -, — (em dash) and – (en dash) with • in footer text
        const originalHTML = footerP.innerHTML;
        let cleanHTML = originalHTML;
        cleanHTML = cleanHTML.replace(/\s*\|\s*/g, ' • ');
        cleanHTML = cleanHTML.replace(/\s+-\s+/g, ' • ');
        cleanHTML = cleanHTML.replace(/\s*—\s*/g, ' • ');
        cleanHTML = cleanHTML.replace(/\s*–\s*/g, ' • ');
        footerP.innerHTML = cleanHTML;
        
        // Prepare content for the power popup (split into two lines)
        // Find the position of the first bullet point
        const firstBulletPos = cleanHTML.indexOf('•');
        // Split content into two paragraphs
        let popupContent = '';
        
        if (firstBulletPos !== -1) {
            // Extract first part (before any bullet points)
            const firstLine = cleanHTML.substring(0, firstBulletPos).trim();
            // Get the rest with bullet points
            const restContent = cleanHTML.substring(firstBulletPos).trim();
            // Format as two paragraphs
            popupContent = `<p>${firstLine}</p><p>${restContent}</p>`;
        } else {
            popupContent = `<p>${cleanHTML}</p>`;
        }
        
        // 1. Add Power Plug icon
        const powerButton = document.createElement('div');
        powerButton.className = 'footer-power';
        powerButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Electric-Cord-3--Streamline-Sharp" height="24" width="24">
              <desc>Electric Cord 3 Streamline Icon</desc>
              <g id="electric-cord-3--electricity-electronic-appliances-device-cord-cable-plug-connection">
                <path id="Vector 2444" stroke="currentColor" d="M6.5 21.5284C3.21209 19.6264 1 16.0716 1 12 1 5.92487 5.92487 1 12 1c6.0751 0 11 4.92487 11 11 0 6.0751 -4.9249 11 -11 11v-5.4648" stroke-width="2"></path>
                <path id="Vector 2445" stroke="currentColor" d="M6.90967 10.02H16.9331v2.5059c0 2.7679 -2.2438 5.0117 -5.0117 5.0117 -2.76791 0 -5.01173 -2.2438 -5.01173 -5.0117V10.02Z" stroke-width="2"></path>
                <path id="Vector 2446" stroke="currentColor" d="M9.5 10V6" stroke-width="2"></path>
                <path id="Vector 2447" stroke="currentColor" d="M14.5 10V6" stroke-width="2"></path>
              </g>
            </svg>
        `;
        
        // 2. Create Info Icon
        const infoButton = document.createElement('a');
        infoButton.className = 'footer-info';
        infoButton.href = '/about';
        infoButton.title = 'About';
        infoButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `;
        
        // 3. Create Settings Icon
        const settingsButton = document.createElement('a');
        settingsButton.className = 'footer-settings';
        settingsButton.href = '/preferences';
        settingsButton.title = 'Preferences';
        settingsButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
        
        // Add buttons to the footer navigation container
        footerNav.appendChild(powerButton);
        footerNav.appendChild(infoButton);
        footerNav.appendChild(settingsButton);
        
        // Clear footer text
        footerP.innerHTML = '';

        // Placeholder popup content
        const powerPopup = document.createElement('div');
        powerPopup.className = 'footer-power-popup';
        powerPopup.innerHTML = '<p>Loading …</p>';

        // Fetch version file and build final popup content
        fetch('/static/version.txt')
            .then(r=>r.text())
            .then(ver=>{
                const verLink = `<a href="https://github.com/searxng/searxng/pkgs/container/searxng?version=skiptags&tab=tags">${ver}</a>`;
                powerPopup.innerHTML = `<p>Powered by SearXNG • ${verLink} • a privacy-respecting, open metasearch engine</p>
                  <p><a href="https://github.com/searxng/searxng">Source code</a> • <a href="https://github.com/searxng/searxng/issues">Issue tracker</a> • <a href="https://searx.space">Public instances</a></p>`;
            })
            .catch(()=>{
                powerPopup.innerHTML = `<p>Powered by SearXNG • a privacy-respecting, open metasearch engine</p>`;
            });
        
        // Add the navigation to the footer
        footer.appendChild(footerNav);
        document.body.appendChild(powerPopup);
        
        // ----- Interaction logic -----
        let powerPopupVisible = false;
        let hideTimeout;

        const showPowerPopup = () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            powerPopup.classList.add('show');
            document.body.classList.add('popup-blur');
            powerPopupVisible = true;
        };

        const hidePowerPopup = () => {
            powerPopup.classList.remove('show');
            document.body.classList.remove('popup-blur');
            powerPopupVisible = false;
        };

        // Helper to schedule hide after small delay (allows cursor travel)
        const scheduleHide = () => {
            hideTimeout = setTimeout(() => {
                if (!powerPopup.matches(':hover') && !powerButton.matches(':hover')) {
                    hidePowerPopup();
                }
            }, 150); // 150 ms grace period
        };

        // Hover interactions
        powerButton.addEventListener('mouseenter', showPowerPopup);
        powerButton.addEventListener('mouseleave', scheduleHide);
        powerPopup.addEventListener('mouseenter', () => {
            if (hideTimeout) clearTimeout(hideTimeout);
        });
        powerPopup.addEventListener('mouseleave', scheduleHide);

        // Optional: toggle on click as well
        powerButton.addEventListener('click', (e) => {
            e.preventDefault();
            powerPopupVisible ? hidePowerPopup() : showPowerPopup();
        });

        // Click outside closes popup
        document.addEventListener('click', (evt) => {
            if (powerPopupVisible && !powerPopup.contains(evt.target) && evt.target !== powerButton) {
                hidePowerPopup();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Nothing special needed for resize - the layout adapts automatically
        });
    }
    
    // Custom placeholder functionality
    function initPlaceholderVisibility() {
        const searchBox = document.querySelector('.search_box');
        const input = document.querySelector('input#q');
        
        if (!searchBox || !input) return;
        
        // Hide custom placeholder when input has content
        function updatePlaceholderVisibility() {
            const hasContent = input.value.trim().length > 0;
            const isFocused = document.activeElement === input;
            
            if (hasContent || isFocused) {
                searchBox.classList.add('has-content');
            } else {
                searchBox.classList.remove('has-content');
            }
        }
        
        // Event listeners for input changes
        input.addEventListener('input', updatePlaceholderVisibility);
        input.addEventListener('focus', updatePlaceholderVisibility);
        input.addEventListener('blur', updatePlaceholderVisibility);
        
        // Initial check
        updatePlaceholderVisibility();
    }
    
    // Initialize all functionality
    initEnhancedFooter();
    initPlaceholderVisibility();
}); 