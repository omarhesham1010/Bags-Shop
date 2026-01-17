/**
 * Main JavaScript File
 * Handles mobile menu toggle, cart functionality, and UI interactions
 */

(function() {
    'use strict';

    // Cart Management
    const Cart = {
        /**
         * Get cart from localStorage
         */
        getCart: function() {
            const cartJson = localStorage.getItem('cart');
            return cartJson ? JSON.parse(cartJson) : [];
        },

        /**
         * Save cart to localStorage
         */
        saveCart: function(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartCounter();
        },

        /**
         * Add item to cart
         */
        addItem: function(product) {
            const cart = this.getCart();
            const existingItem = cart.find(item => 
                item.id === product.id && 
                item.variant === product.variant
            );

            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    variant: product.variant || 'default',
                    image: product.image || '',
                    quantity: product.quantity || 1
                });
            }

            this.saveCart(cart);
            return cart;
        },

        /**
         * Remove item from cart
         */
        removeItem: function(itemId, variant) {
            const cart = this.getCart();
            const filteredCart = cart.filter(item => 
                !(item.id === itemId && item.variant === variant)
            );
            this.saveCart(filteredCart);
            return filteredCart;
        },

        /**
         * Update item quantity
         */
        updateQuantity: function(itemId, variant, quantity) {
            const cart = this.getCart();
            const item = cart.find(item => 
                item.id === itemId && item.variant === variant
            );

            if (item) {
                if (quantity <= 0) {
                    return this.removeItem(itemId, variant);
                }
                item.quantity = quantity;
            }

            this.saveCart(cart);
            return cart;
        },

        /**
         * Get total quantity of items in cart
         */
        getTotalQuantity: function() {
            const cart = this.getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        },

        /**
         * Get cart subtotal
         */
        getSubtotal: function() {
            const cart = this.getCart();
            return cart.reduce((total, item) => {
                const price = parseFloat(item.price.replace('$', '').replace(',', ''));
                return total + (price * item.quantity);
            }, 0);
        },

        /**
         * Update cart counter in header
         */
        updateCartCounter: function() {
            const cartCount = document.getElementById('cart-count');
            if (!cartCount) return;

            const total = this.getTotalQuantity();
            cartCount.textContent = total;
            
            if (total > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    };

    /**
     * Mobile Menu Toggle
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
     * Product Page - Add to Cart
     */
    function initAddToCart() {
        const addToCartBtn = document.getElementById('add-to-cart');
        if (!addToCartBtn) return;

        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Get product information from page
            const productTitle = document.querySelector('.product__title');
            const productPrice = document.querySelector('.product__price');
            const quantityInput = document.getElementById('quantity');
            const mainProductImage = document.getElementById('main-product-image');

            if (!productTitle || !productPrice) return;

            // Get selected variants
            const variantButtons = document.querySelectorAll('.variant-option--active');
            let variant = 'default';
            if (variantButtons.length > 0) {
                const variants = Array.from(variantButtons).map(btn => btn.textContent.trim());
                variant = variants.join(' / ');
            }

            // Get product image (default to Product 1 if not found)
            let productImage = 'assets/images/Product 1.jpg';
            if (mainProductImage && mainProductImage.src) {
                productImage = mainProductImage.src.split('/').slice(-2).join('/'); // Get relative path
            }

            // Create product object
            const product = {
                id: 'product-' + Date.now(), // Simple ID generation for demo
                name: productTitle.textContent.trim(),
                price: productPrice.textContent.trim(),
                variant: variant,
                image: productImage,
                quantity: quantityInput ? parseInt(quantityInput.value, 10) : 1
            };

            // Add to cart
            Cart.addItem(product);

            // Visual feedback
            const cartIcon = document.getElementById('cart-icon');
            if (cartIcon) {
                cartIcon.style.transform = 'scale(1.2)';
                setTimeout(function() {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }

            // Optional: Show feedback message
            addToCartBtn.textContent = 'Added to Cart!';
            setTimeout(function() {
                addToCartBtn.textContent = 'Add to Cart';
            }, 1500);
        });
    }

    /**
     * Quantity Selector on Product Page
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
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value, 10) || 1;
            if (value < 1) {
                value = 1;
            }
            this.value = value;
        });
    }

    /**
     * Variant Selector on Product Page
     */
    function initVariantSelector() {
        const variantOptions = document.querySelectorAll('.variant-option');
        
        variantOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll('.variant-option');
                siblings.forEach(function(sibling) {
                    sibling.classList.remove('variant-option--active');
                });
                this.classList.add('variant-option--active');
            });
        });
    }

    /**
     * Product Thumbnail Gallery
     */
    function initProductGallery() {
        const thumbnails = document.querySelectorAll('.product__thumbnail');
        const mainImage = document.getElementById('main-product-image');
        
        if (!thumbnails.length || !mainImage) return;
        
        thumbnails.forEach(function(thumbnail, index) {
            const thumbnailImg = thumbnail.querySelector('.product__thumbnail-img');
            
            if (index === 0) {
                thumbnail.style.borderColor = 'var(--color-accent)';
            }
            
            thumbnail.addEventListener('click', function() {
                // Remove active state from all thumbnails
                thumbnails.forEach(function(thumb) {
                    thumb.style.borderColor = 'transparent';
                });
                
                // Add active state to clicked thumbnail
                this.style.borderColor = 'var(--color-accent)';
                
                // Update main image source
                if (thumbnailImg && thumbnailImg.dataset.image) {
                    mainImage.src = thumbnailImg.dataset.image;
                }
            });
        });
    }

    /**
     * Render Cart Items on Cart Page
     */
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartContent = document.getElementById('cart-content');
        
        if (!cartItemsContainer) return;

        const cart = Cart.getCart();

        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';

        // Clear existing items
        cartItemsContainer.innerHTML = '';

        // Render each cart item
        cart.forEach(function(item, index) {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            // Map product name to image (default to Product 1 if not matched)
            let productImage = 'assets/images/Product 1.jpg';
            if (item.name.includes('Minimalist') || item.name.includes('Crossbody')) {
                productImage = 'assets/images/Product 2.jpg';
            } else if (item.name.includes('Clutch') || item.name.includes('Evening')) {
                productImage = 'assets/images/Product 3.jpg';
            } else if (item.name.includes('Backpack') || item.name.includes('Weekend')) {
                productImage = 'assets/images/Product 4.jpg';
            } else if (item.image) {
                productImage = item.image;
            }
            
            itemElement.innerHTML = `
                <div class="cart-item__image">
                    <img src="${productImage}" alt="${item.name}" class="cart-item__img">
                </div>
                <div class="cart-item__info">
                    <h3 class="cart-item__name">${item.name}</h3>
                    <p class="cart-item__variant">${item.variant}</p>
                    <p class="cart-item__price">${item.price}</p>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn quantity-btn--small" data-action="decrease" data-item-id="${item.id}" data-variant="${item.variant}" aria-label="Decrease quantity">−</button>
                    <input type="number" class="quantity-input quantity-input--small" value="${item.quantity}" min="1" data-item-id="${item.id}" data-variant="${item.variant}" aria-label="Quantity">
                    <button class="quantity-btn quantity-btn--small" data-action="increase" data-item-id="${item.id}" data-variant="${item.variant}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item__total">
                    <span class="cart-item__total-price">$${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}</span>
                </div>
                <button class="cart-item__remove" data-item-id="${item.id}" data-variant="${item.variant}" aria-label="Remove item">×</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Update totals
        updateCartTotals();

        // Attach event listeners to cart item controls
        attachCartItemListeners();
    }

    /**
     * Attach event listeners to cart item controls
     */
    function attachCartItemListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.cart-item .quantity-btn[data-action="decrease"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const variant = this.getAttribute('data-variant');
                const quantityInput = document.querySelector(`.cart-item .quantity-input[data-item-id="${itemId}"][data-variant="${variant}"]`);
                const currentQty = parseInt(quantityInput.value, 10);
                
                if (currentQty > 1) {
                    Cart.updateQuantity(itemId, variant, currentQty - 1);
                    renderCartItems();
                }
            });
        });

        // Quantity increase buttons
        document.querySelectorAll('.cart-item .quantity-btn[data-action="increase"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const variant = this.getAttribute('data-variant');
                const quantityInput = document.querySelector(`.cart-item .quantity-input[data-item-id="${itemId}"][data-variant="${variant}"]`);
                const currentQty = parseInt(quantityInput.value, 10);
                
                Cart.updateQuantity(itemId, variant, currentQty + 1);
                renderCartItems();
            });
        });

        // Quantity input changes
        document.querySelectorAll('.cart-item .quantity-input').forEach(function(input) {
            input.addEventListener('change', function() {
                const itemId = this.getAttribute('data-item-id');
                const variant = this.getAttribute('data-variant');
                let quantity = parseInt(this.value, 10) || 1;
                
                if (quantity < 1) quantity = 1;
                
                Cart.updateQuantity(itemId, variant, quantity);
                renderCartItems();
            });
        });

        // Remove buttons
        document.querySelectorAll('.cart-item__remove').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const variant = this.getAttribute('data-variant');
                
                Cart.removeItem(itemId, variant);
                renderCartItems();
            });
        });
    }

    /**
     * Update cart totals
     */
    function updateCartTotals() {
        const subtotal = Cart.getSubtotal();
        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');

        if (subtotalElement) {
            subtotalElement.textContent = '$' + subtotal.toFixed(2);
        }
        if (totalElement) {
            totalElement.textContent = '$' + subtotal.toFixed(2);
        }
    }

    /**
     * Initialize Cart Page
     */
    function initCartPage() {
        if (document.getElementById('cart-items')) {
            renderCartItems();
        }
    }

    /**
     * Newsletter Form
     */
    function initNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter__input');
            const email = emailInput.value.trim();
            
            if (email) {
                alert('Thank you for subscribing! (This is a demo - no data is being saved)');
                emailInput.value = '';
            }
        });
    }

    /**
     * Contact Form
     */
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#contact-name');
            const emailInput = this.querySelector('#contact-email');
            const subjectInput = this.querySelector('#contact-subject');
            const messageInput = this.querySelector('#contact-message');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();
            
            if (name && email && subject && message) {
                alert('Thank you for your message! (This is a demo - no data is being saved)');
                contactForm.reset();
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
            // Initialize cart counter on all pages
            Cart.updateCartCounter();
            
            // Initialize mobile menu
            initMobileMenu();
            
            // Initialize product page features
            initAddToCart();
            initQuantitySelector();
            initVariantSelector();
            initProductGallery();
            
            // Initialize cart page
            initCartPage();
            
            // Initialize other features
            initNewsletterForm();
            initContactForm();
            initSmoothScroll();
        }
    }

    // Start initialization
    init();

})();
