(function() {
    if (window.quantityHandlerAttached) return;
    window.quantityHandlerAttached = true;
    
    function initFoodMenu() {
        const categoryCarousel = document.getElementById('category-carousel');
        const categoryLeftBtn = document.getElementById('category-left-btn');
        const categoryRightBtn = document.getElementById('category-right-btn');
        
        if (!categoryCarousel || !categoryLeftBtn || !categoryRightBtn) {
            setTimeout(initFoodMenu, 50);
            return;
        }
        
        function updateCategoryButtons() {
            const scrollLeft = categoryCarousel.scrollLeft;
            const scrollWidth = categoryCarousel.scrollWidth;
            const clientWidth = categoryCarousel.clientWidth;
            
            if (scrollWidth <= clientWidth) {
                categoryLeftBtn.style.display = 'none';
                categoryRightBtn.style.display = 'none';
            } else {
                if (scrollLeft <= 5) {
                    categoryLeftBtn.style.display = 'none';
                    categoryRightBtn.style.display = 'flex';
                } else if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    categoryLeftBtn.style.display = 'flex';
                    categoryRightBtn.style.display = 'none';
                } else {
                    categoryLeftBtn.style.display = 'flex';
                    categoryRightBtn.style.display = 'flex';
                }
            }
        }
        
        function smoothScroll(element, distance) {
            const start = element.scrollLeft;
            const target = start + distance;
            const duration = 400;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                
                element.scrollLeft = start + (target - start) * ease;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        categoryLeftBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            smoothScroll(categoryCarousel, -150);
        };
        
        categoryRightBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            smoothScroll(categoryCarousel, 150);
        };
        
        categoryCarousel.addEventListener('scroll', updateCategoryButtons);
        window.addEventListener('resize', updateCategoryButtons);
        updateCategoryButtons();
        
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.border = '1px solid #e0e0e0';
                });
                this.classList.add('active');
                this.style.border = '2px solid #17a2b8';
            });
        });
        
        const handleQuantityClick = function(e) {
            const btn = e.target.closest('.quantity-btn');
            if (!btn) return;
            
            if (btn.dataset.processing) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            btn.dataset.processing = 'true';
            
            const card = btn.closest('.food-card');
            if (!card) {
                delete btn.dataset.processing;
                return;
            }
            
            const quantitySpan = card.querySelector('.quantity-value');
            if (!quantitySpan) {
                delete btn.dataset.processing;
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            let quantity = parseInt(quantitySpan.textContent) || 0;
            
            if (btn.classList.contains('quantity-plus')) {
                quantity++;
            } else if (btn.classList.contains('quantity-minus') && quantity > 0) {
                quantity--;
            } else {
                delete btn.dataset.processing;
                return;
            }
            
            quantitySpan.textContent = quantity;
            
            if (quantity > 0) {
                card.style.border = '2px solid #17a2b8';
            } else {
                card.style.border = '1px solid #e0e0e0';
            }
            
            updateCart();
            
            setTimeout(() => {
                delete btn.dataset.processing;
            }, 200);
        };
        
        document.addEventListener('click', handleQuantityClick, true);
        
        function updateCart() {
            const rightSidebar = document.getElementById('right-sidebar');
            const foodCards = document.querySelectorAll('.food-card');
            const itemsList = document.getElementById('ordered-items-list');
            const itemCountBadge = document.getElementById('item-count');
            
            if (!rightSidebar || !itemsList || !itemCountBadge) {
                setTimeout(updateCart, 50);
                return;
            }
            
            let totalItems = 0;
            let subtotal = 0;
            const cartItems = [];
            
            foodCards.forEach(card => {
                const quantity = parseInt(card.querySelector('.quantity-value').textContent) || 0;
                if (quantity > 0) {
                    const itemName = card.getAttribute('data-item-name');
                    const itemPrice = parseFloat(card.getAttribute('data-item-price'));
                    const totalPrice = quantity * itemPrice;
                    
                    totalItems += quantity;
                    subtotal += totalPrice;
                    cartItems.push({ name: itemName, quantity: quantity, price: itemPrice, total: totalPrice });
                }
            });
            
            if (totalItems > 0) {
                rightSidebar.classList.remove('hidden');
                
                const leftSidebar = document.getElementById('sidebar');
                const contentWrapper = document.getElementById('content-wrapper');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (leftSidebar && !leftSidebar.classList.contains('collapsed')) {
                    leftSidebar.classList.add('collapsed');
                    if (contentWrapper) {
                        contentWrapper.classList.add('sidebar-collapsed');
                    }
                    if (sidebarToggle) {
                        sidebarToggle.classList.add('collapsed');
                    }
                }
                
                itemsList.innerHTML = '';
                cartItems.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'd-flex justify-content-between align-items-start mb-3';
                    itemElement.innerHTML = `
                        <div class="flex-grow-1">
                            <span class="text-muted">${item.quantity}x</span> <span class="text-dark">${item.name}</span>
                        </div>
                        <span class="fw-bold">$${item.total.toFixed(2)}</span>
                    `;
                    itemsList.appendChild(itemElement);
                });
                
                itemCountBadge.textContent = String(totalItems).padStart(2, '0');
                
                const tax = subtotal * 0.06;
                const donation = 1.00;
                const totalPayable = subtotal + tax + donation;
                
                document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
                document.getElementById('donation').textContent = `$${donation.toFixed(2)}`;
                document.getElementById('total-payable').textContent = `$${totalPayable.toFixed(2)}`;
            } else {
                rightSidebar.classList.add('hidden');
            }
        }
        
        const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
        paymentMethodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                paymentMethodBtns.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                    b.classList.add('btn-outline-secondary');
                });
                this.classList.add('active', 'btn-primary');
                this.classList.remove('btn-outline-secondary');
            });
        });
    }
    
    setTimeout(initFoodMenu, 10);
})();

