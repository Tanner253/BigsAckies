document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality for product pages
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    
    if (addToCartForms) {
        addToCartForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const productId = this.querySelector('[name="productId"]').value;
                const quantity = this.querySelector('[name="quantity"]').value || 1;
                
                fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: parseInt(productId),
                        quantity: parseInt(quantity)
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update cart count in the header
                        updateCartCount(data.cartItemCount);
                        
                        // Show success message
                        showNotification('Product added to cart!', 'success');
                    } else {
                        showNotification(data.error || 'Failed to add product to cart', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error adding to cart:', error);
                    showNotification('An error occurred. Please try again.', 'error');
                });
            });
        });
    }
    
    // Update quantity functionality on cart page
    const updateQuantityForms = document.querySelectorAll('.update-quantity-form');
    
    if (updateQuantityForms) {
        updateQuantityForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const productId = this.querySelector('[name="productId"]').value;
                const quantity = this.querySelector('[name="quantity"]').value;
                
                updateCartItem(productId, quantity, form);
            });
            
            // Quantity increment/decrement buttons
            const decrementBtn = form.querySelector('.quantity-decrement');
            const incrementBtn = form.querySelector('.quantity-increment');
            const quantityInput = form.querySelector('[name="quantity"]');
            
            if (decrementBtn && incrementBtn && quantityInput) {
                decrementBtn.addEventListener('click', function() {
                    let qty = parseInt(quantityInput.value);
                    if (qty > 1) {
                        quantityInput.value = qty - 1;
                        updateCartItem(form.querySelector('[name="productId"]').value, qty - 1, form);
                    } else if (qty === 1) {
                        // If quantity will be 0, remove the item
                        removeCartItem(form.querySelector('[name="productId"]').value);
                    }
                });
                
                incrementBtn.addEventListener('click', function() {
                    let qty = parseInt(quantityInput.value);
                    quantityInput.value = qty + 1;
                    updateCartItem(form.querySelector('[name="productId"]').value, qty + 1, form);
                });
            }
        });
    }
    
    // Remove from cart functionality
    const removeItemForms = document.querySelectorAll('.remove-item-form');
    
    if (removeItemForms) {
        removeItemForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const productId = this.querySelector('[name="productId"]').value;
                removeCartItem(productId);
            });
        });
    }
    
    // Clear cart functionality
    const clearCartForm = document.querySelector('#clear-cart-form');
    
    if (clearCartForm) {
        clearCartForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to clear your cart?')) {
                fetch('/cart/clear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reload the page to show empty cart
                        window.location.reload();
                    } else {
                        showNotification(data.error || 'Failed to clear cart', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error clearing cart:', error);
                    showNotification('An error occurred. Please try again.', 'error');
                });
            }
        });
    }
    
    // Helper functions
    function updateCartItem(productId, quantity, form) {
        fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: parseInt(productId),
                quantity: parseInt(quantity)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update cart count in header
                updateCartCount(data.cartItemCount);
                
                // Update subtotal for the item
                const itemRow = form.closest('tr');
                if (itemRow) {
                    const itemTotalElement = itemRow.querySelector('.item-total');
                    if (itemTotalElement) {
                        itemTotalElement.textContent = `$${data.itemTotal}`;
                    }
                }
                
                // Update cart total
                const cartTotalElement = document.querySelector('#cart-total');
                if (cartTotalElement && data.cartTotal) {
                    cartTotalElement.textContent = `$${data.cartTotal}`;
                }
                
                // If quantity is 0, remove the row
                if (parseInt(quantity) === 0) {
                    if (itemRow) {
                        itemRow.remove();
                    }
                    
                    // If cart is now empty, reload to show empty cart message
                    if (data.cartItemCount === 0) {
                        window.location.reload();
                    }
                }
                
                showNotification('Cart updated', 'success');
            } else {
                showNotification(data.error || 'Failed to update cart', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    }
    
    function removeCartItem(productId) {
        fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: parseInt(productId)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update cart count in header
                updateCartCount(data.cartItemCount);
                
                // Remove the item row
                const itemRow = document.querySelector(`.remove-item-form input[value="${productId}"]`).closest('tr');
                if (itemRow) {
                    itemRow.remove();
                }
                
                // Update cart total
                const cartTotalElement = document.querySelector('#cart-total');
                if (cartTotalElement && data.cartTotal) {
                    cartTotalElement.textContent = `$${data.cartTotal}`;
                }
                
                // If cart is now empty, reload to show empty cart message
                if (data.cartItemCount === 0) {
                    window.location.reload();
                }
                
                showNotification('Item removed from cart', 'success');
            } else {
                showNotification(data.error || 'Failed to remove item', 'error');
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    }
    
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
            
            // Show/hide badge based on count
            if (count > 0) {
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
    }
    
    function showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification fixed top-4 right-4 px-6 py-3 rounded shadow-lg transform transition-all duration-500 translate-x-full';
            document.body.appendChild(notification);
        }
        
        // Set notification type
        notification.className = notification.className.replace(/bg-\w+-\d+/g, '');
        if (type === 'success') {
            notification.className += ' bg-green-500 text-white';
        } else {
            notification.className += ' bg-red-500 text-white';
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
        }, 3000);
    }
}); 