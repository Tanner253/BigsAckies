document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality for product pages
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    
    if (addToCartForms) {
        addToCartForms.forEach(form => {
            // Handle quantity increment/decrement buttons
            const decrementBtn = form.querySelector('.quantity-decrement');
            const incrementBtn = form.querySelector('.quantity-increment');
            const quantityInput = form.querySelector('[name="quantity"]');
            
            if (decrementBtn && incrementBtn && quantityInput) {
                decrementBtn.addEventListener('click', function() {
                    let qty = parseInt(quantityInput.value);
                    if (qty > 1) {
                        quantityInput.value = qty - 1;
                    }
                });
                
                incrementBtn.addEventListener('click', function() {
                    let qty = parseInt(quantityInput.value);
                    const max = parseInt(quantityInput.getAttribute('max')) || 999;
                    if (qty < max) {
                        quantityInput.value = qty + 1;
                    }
                });
            }

            // Check if the form has an action attribute (direct form submission)
            const formAction = form.getAttribute('action');
            
            if (formAction) {
                // This is a direct form submission, no need to handle it with JavaScript
                return;
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const csrfToken = formData.get('_csrf');
                
                try {
                    const response = await fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({
                            product_id: formData.get('product_id'),
                            quantity: formData.get('quantity')
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Update cart count in header
                        updateCartCount(data.cartItemCount);
                        showNotification('Item added to cart', 'success');
                    } else {
                        showNotification(data.error || 'Failed to add item to cart', 'error');
                    }
                } catch (error) {
                    console.error('Error adding item to cart:', error);
                    // In production, redirect to login instead of showing alert
                    if (window.location.hostname.includes('herokuapp.com') || process.env.NODE_ENV === 'production') {
                        window.location.href = '/login';
                        return;
                    }
                    alert(error.message || 'Failed to add item to cart');
                }
            });
        });
    }
    
    // Update quantity functionality on cart page
    const updateQuantityForms = document.querySelectorAll('.update-quantity-form');
    
    if (updateQuantityForms) {
        updateQuantityForms.forEach(form => {
            // Quantity increment/decrement buttons
            const decrementBtn = form.querySelector('.quantity-decrement');
            const incrementBtn = form.querySelector('.quantity-increment');
            const quantityInput = form.querySelector('[name="quantity"]');
            
            if (decrementBtn && incrementBtn && quantityInput) {
                decrementBtn.addEventListener('click', async function() {
                    let qty = parseInt(quantityInput.value);
                    if (qty > 1) {
                        quantityInput.value = qty - 1;
                        await updateCartItem(form.querySelector('[name="product_id"]').value, qty - 1, form);
                    }
                });
                
                incrementBtn.addEventListener('click', async function() {
                    let qty = parseInt(quantityInput.value);
                    const max = parseInt(quantityInput.getAttribute('max')) || 999;
                    if (qty < max) {
                        quantityInput.value = qty + 1;
                        await updateCartItem(form.querySelector('[name="product_id"]').value, qty + 1, form);
                    }
                });
            }
            
            // Handle direct input changes
            quantityInput.addEventListener('change', async function() {
                let qty = parseInt(this.value);
                const max = parseInt(this.getAttribute('max')) || 999;
                
                // Validate input
                if (isNaN(qty) || qty < 1) {
                    qty = 1;
                } else if (qty > max) {
                    qty = max;
                }
                
                this.value = qty;
                await updateCartItem(form.querySelector('[name="product_id"]').value, qty, form);
            });
        });
    }
    
    // Remove item functionality
    const removeItemButtons = document.querySelectorAll('.remove-item-btn');
    
    if (removeItemButtons) {
        removeItemButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const productId = button.getAttribute('data-product-id');
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                
                try {
                    const response = await fetch('/cart/remove', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({
                            product_id: productId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Remove the item row from the table
                        const itemRow = button.closest('tr');
                        itemRow.remove();
                        
                        // Update cart totals
                        updateCartTotals(data);
                        
                        // Update cart count in header
                        updateCartCount(data.cartItemCount);
                        
                        showNotification('Item removed from cart', 'success');
                        
                        // If no items left, reload the page to show empty cart message
                        if (data.cartItemCount === 0) {
                            window.location.reload();
                        }
                    } else {
                        showNotification(data.error || 'Failed to remove item from cart', 'error');
                    }
                } catch (error) {
                    console.error('Error removing item from cart:', error);
                    showNotification('Failed to remove item from cart', 'error');
                }
            });
        });
    }
    
    // Clear cart functionality
    const clearCartForm = document.getElementById('clear-cart-form');
    if (clearCartForm) {
        clearCartForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!confirm('Are you sure you want to clear your cart?')) {
                return;
            }
            
            try {
                const response = await fetch('/cart/clear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Reload the page to show empty cart
                    window.location.reload();
                } else {
                    showNotification(data.error || 'Failed to clear cart', 'error');
                }
            } catch (error) {
                console.error('Error clearing cart:', error);
                showNotification('An error occurred while clearing the cart', 'error');
            }
        });
    }
    
    async function updateCartItem(productId, quantity, form) {
        try {
            const csrfToken = form.querySelector('[name="_csrf"]').value;
            
            const response = await fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                    _csrf: csrfToken
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update cart');
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Update the item total
                const row = form.closest('tr');
                const totalCell = row.querySelector('.item-total');
                if (totalCell) {
                    totalCell.textContent = `$${data.itemTotal}`;
                }
                
                // Update cart totals
                updateCartTotals(data);
            } else {
                showNotification(data.error || 'Failed to update cart', 'error');
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            showNotification(error.message || 'An error occurred while updating the cart', 'error');
        }
    }
    
    function updateCartTotals(data) {
        // Update cart total
        const cartTotal = document.querySelector('.text-lg.font-semibold.text-gray-900:last-child');
        if (cartTotal) {
            cartTotal.textContent = `$${data.cartTotal}`;
        }
        
        // Update cart count in header
        const cartCount = document.querySelector('.text-lg.font-semibold.text-white');
        if (cartCount) {
            cartCount.textContent = `Cart Items (${data.cartItemCount})`;
        }
    }
    
    function updateCartCount(count) {
        // Update the cart badge in the header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            
            // Show or hide the badge based on count
            if (count > 0) {
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
        
        // Also update the cart text if it exists
        const cartText = document.querySelector('.text-lg.font-semibold.text-white');
        if (cartText) {
            cartText.textContent = `Cart Items (${count})`;
        }
    }
    
    function showNotification(message, type = 'success') {
        // Implementation of notification system
        alert(message); // For now, just using alert
    }
}); 