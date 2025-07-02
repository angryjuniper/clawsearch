// Custom JavaScript for SearXNG Dracula Theme
document.addEventListener('DOMContentLoaded', function() {
    // Footer popup functionality for mobile
    function initFooterPopup() {
        const footer = document.querySelector('footer');
        const footerP = footer?.querySelector('p');
        if (!footer || !footerP) return;
        
        // Replace |, -, — (em dash) and – (en dash) with • in footer, but preserve hyphenated words
        const originalHTML = footerP.innerHTML;
        let cleanHTML = originalHTML;
        cleanHTML = cleanHTML.replace(/\s*\|\s*/g, ' • ');
        // Replace standalone dashes with spaces around them, but not hyphens in compound words
        cleanHTML = cleanHTML.replace(/\s+-\s+/g, ' • ');
        cleanHTML = cleanHTML.replace(/\s*—\s*/g, ' • ');
        cleanHTML = cleanHTML.replace(/\s*–\s*/g, ' • ');
        footerP.innerHTML = cleanHTML;
        
        // Create popup element with full footer content
        const popup = document.createElement('div');
        popup.className = 'footer-popup';
        popup.innerHTML = cleanHTML;
        document.body.appendChild(popup);
        

        
        // Check if we're on mobile/portrait
        function isMobileView() {
            return window.innerWidth <= 767 || 
                   window.matchMedia('(orientation: portrait)').matches;
        }
        
        // Show popup
        function showPopup() {
            popup.classList.add('show');
        }
        
        // Hide popup
        function hidePopup() {
            popup.classList.remove('show');
        }
        
        // Footer mouseover handlers for mobile only
        footer.addEventListener('mouseenter', function(e) {
            if (isMobileView()) {
                showPopup();
                // Add blur effect to page content
                document.body.classList.add('footer-blur');
            }
        });
        
        footer.addEventListener('mouseleave', function(e) {
            if (isMobileView()) {
                hidePopup();
                // Remove blur effect
                document.body.classList.remove('footer-blur');
            }
        });
        
        // Keep popup visible when hovering over it
        popup.addEventListener('mouseenter', function(e) {
            if (isMobileView()) {
                // Popup stays visible while hovering
            }
        });
        
        popup.addEventListener('mouseleave', function(e) {
            if (isMobileView()) {
                hidePopup();
                document.body.classList.remove('footer-blur');
            }
        });
        
        // Hide popup on window resize if not mobile anymore
        window.addEventListener('resize', function() {
            if (!isMobileView()) {
                hidePopup();
            }
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
    initFooterPopup();
    initPlaceholderVisibility();
}); 