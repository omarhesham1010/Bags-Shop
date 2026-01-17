/**
 * Main JavaScript File
 * Handles mobile menu toggle and cart counter functionality
 */

(function() {
    'use strict';

    /**
     * Mobile Menu Toggle
     * Toggles the navigation menu on mobile devices
     */
    function initMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (!menuToggle || !mainNav) return;
        
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('.nav__link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    /**
     * Cart Counter
     * Manages the cart item count (UI only, no backend)
     */
    function initCartCounter() {
        const cartIcon = document.getElementById('cart-icon');
        const cartCount = document.getElementById('cart-count');
        
        if (!cartIcon || !cartCount) return;
        
        // Get initial count from localStorage or default to 0
        let count = parseInt(localStorage.getItem('cartCount') || '0', 10);
        updateCartCount(count);
        
        // Handle add to cart button clicks
        const addToCartBtn = document.getElementById('add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get quantity value
                const quantityInput = document.getElementById('quantity');
                const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
                
                // Increment cart count
                count += quantity;
                updateCartCount(count);
                localStorage.setItem('cartCount', count.toString());
                
                // Visual feedback
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(function() {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            });
        }
        
        function updateCartCount(newCount) {
            cartCount.textContent = newCount;
            if (newCount > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    /**
     * Quantity Selector
     * Handles quantity increase/decrease on product page
     */
    function initQuantitySelector() {
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('quantity-decrease');
        const increaseBtn = document.getElementById('quantity-increase');
        
        if (!quantityInput || !decreaseBtn || !increaseBtn) return;
        
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value, 10) || 1;
            if (value > 1) {
                value--;
                quantityInput.value = value;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value, 10) || 1;
            value++;
            quantityInput.value = value;
        });
        
        // Ensure quantity is always at least 1
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value, 10) || 1;
            if (value < 1) {
                value = 1;
            }
            this.value = value;
        });
    }

    /**
     * Variant Selector
     * Handles variant selection on product page (visual only)
     */
    function initVariantSelector() {
        const variantOptions = document.querySelectorAll('.variant-option');
        
        variantOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                // Remove active class from siblings
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll('.variant-option');
                siblings.forEach(function(sibling) {
                    sibling.classList.remove('variant-option--active');
                });
                
                // Add active class to clicked option
                this.classList.add('variant-option--active');
            });
        });
    }

    /**
     * Product Thumbnail Gallery
     * Switches main product image when thumbnail is clicked
     */
    function initProductGallery() {
        const thumbnails = document.querySelectorAll('.product__thumbnail');
        const mainImage = document.querySelector('.product__main-image .image-placeholder');
        
        if (!thumbnails.length || !mainImage) return;
        
        thumbnails.forEach(function(thumbnail, index) {
            thumbnail.addEventListener('click', function() {
                // Remove active state from all thumbnails
                thumbnails.forEach(function(thumb) {
                    thumb.style.borderColor = 'transparent';
                });
                
                // Add active state to clicked thumbnail
                this.style.borderColor = 'var(--color-accent)';
                
                // Update main image placeholder text (in real implementation, this would swap images)
                if (mainImage) {
                    mainImage.textContent = `Product Image ${index + 1}`;
                }
            });
            
            // Set first thumbnail as active by default
            if (index === 0) {
                thumbnail.style.borderColor = 'var(--color-accent)';
            }
        });
    }

    /**
     * Newsletter Form
     * Handles newsletter subscription (UI only, no backend)
     */
    function initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter__input');
            const email = emailInput.value.trim();
            
            if (email) {
                // Visual feedback (in real implementation, this would submit to backend)
                alert('Thank you for subscribing! (This is a demo - no data is being saved)');
                emailInput.value = '';
            }
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip empty hash and prevent default for same-page anchors
                if (href === '#' || href === '') {
                    return;
                }
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Initialize all functionality when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            initMobileMenu();
            initCartCounter();
            initQuantitySelector();
            initVariantSelector();
            initProductGallery();
            initNewsletterForm();
            initSmoothScroll();
        }
    }

    // Start initialization
    init();

})();
