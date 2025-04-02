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
                const product_id = formData.get('product_id');
                const quantity = formData.get('quantity') || 1;
                const csrfToken = formData.get('_csrf');
                
                try {
                    const response = await fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'CSRF-Token': csrfToken
                        },
                        body: `product_id=${product_id}&quantity=${quantity}&_csrf=${csrfToken}`
                    });

                    // Check if the server redirected us (likely to login)
                    if (response.redirected) {
                        window.location.href = response.url; // Navigate to the login page
                        return; // Stop further processing
                    }
                    
                    if (!response.ok) {
                        // If it wasn't a redirect but still not ok, try parsing error JSON
                        let error = { error: 'Failed to add item to cart. Status: ' + response.status };
                        try {
                            error = await response.json();
                        } catch (parseError) {
                            console.error('Could not parse error response as JSON:', parseError);
                        }
                        throw new Error(error.error || `HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    
                    // Update cart badge
                    const cartBadge = document.querySelector('.cart-count');
                    if (cartBadge) {
                        cartBadge.textContent = result.cartItemCount;
                        cartBadge.classList.remove('hidden');
                    }
                    
                    // Show success message
                    alert('Item added to cart successfully!');
                    
                } catch (error) {
                    console.error('Error adding item to cart:', error);
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
    
    // Remove from cart functionality
    const removeItemForms = document.querySelectorAll('.remove-item-form');
    
    if (removeItemForms) {
        removeItemForms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const productId = this.querySelector('[name="product_id"]').value;
                
                try {
                    const response = await fetch('/cart/remove', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            product_id: productId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Remove the row
                        const row = this.closest('tr');
                        row.remove();
                        
                        // Update cart totals
                        updateCartTotals(data);
                        
                        // Update cart count in header
                        updateCartCount(data.cartItemCount);
                        
                        showNotification('Item removed from cart', 'success');
                    } else {
                        showNotification(data.error || 'Failed to remove item', 'error');
                    }
                } catch (error) {
                    console.error('Error removing item:', error);
                    showNotification('An error occurred while removing the item', 'error');
                }
            });
        });
    }
    
    // Helper functions
    async function updateCartItem(productId, quantity, form) {
        try {
            const csrfToken = form.querySelector('[name="_csrf"]').value;
            
            const response = await fetch('/cart/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken,
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
            cartCount.textContent = `Cart Items (${data.cartCount})`;
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