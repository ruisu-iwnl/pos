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
                
                const vatable = subtotal;
                const vatAmount = subtotal * 0.06;
                const vatExempt = 0.00;
                const zeroRated = 0.00;
                const donation = 1.00;
                const totalPayable = subtotal + vatAmount + donation;
                
                const subtotalEl = document.getElementById('subtotal');
                const vatableEl = document.getElementById('vatable');
                const vatAmountEl = document.getElementById('vat-amount');
                const vatExemptEl = document.getElementById('vat-exempt');
                const zeroRatedEl = document.getElementById('zero-rated');
                const donationEl = document.getElementById('donation');
                const totalPayableEl = document.getElementById('total-payable');
                
                if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
                if (vatableEl) vatableEl.textContent = `$${vatable.toFixed(2)}`;
                if (vatAmountEl) vatAmountEl.textContent = `$${vatAmount.toFixed(2)}`;
                if (vatExemptEl) vatExemptEl.textContent = `$${vatExempt.toFixed(2)}`;
                if (zeroRatedEl) zeroRatedEl.textContent = `$${zeroRated.toFixed(2)}`;
                if (donationEl) donationEl.textContent = `$${donation.toFixed(2)}`;
                if (totalPayableEl) totalPayableEl.textContent = `$${totalPayable.toFixed(2)}`;
                
                updateChange();
            } else {
                rightSidebar.classList.add('hidden');
            }
        }
        
        function updateChange() {
            const cashInput = document.getElementById('cash-input');
            const totalPayableEl = document.getElementById('total-payable');
            const changeEl = document.getElementById('change');
            
            if (!cashInput || !totalPayableEl || !changeEl) return;
            
            const cashGiven = parseFloat(cashInput.value) || 0;
            const totalPayableText = totalPayableEl.textContent.replace('$', '').replace(',', '');
            const totalPayable = parseFloat(totalPayableText) || 0;
            const change = cashGiven - totalPayable;
            
            if (change >= 0) {
                changeEl.textContent = `$${change.toFixed(2)}`;
                changeEl.style.color = '';
            } else {
                changeEl.textContent = `-$${Math.abs(change).toFixed(2)}`;
                changeEl.style.color = '#dc3545';
            }
        }
        
        document.addEventListener('input', function(e) {
            if (e.target.id === 'cash-input') {
                updateChange();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('button') && e.target.closest('button').querySelector('.bi-printer')) {
                const rightSidebar = document.getElementById('right-sidebar');
                if (!rightSidebar) return;
                
                const cashInput = document.getElementById('cash-input');
                const cashValue = cashInput ? (cashInput.value || '0.00') : '0.00';
                
                const activePaymentMethod = document.querySelector('.payment-method-btn.active');
                let paymentMethodText = 'Card';
                if (activePaymentMethod) {
                    const method = activePaymentMethod.dataset.method;
                    if (method === 'cash') paymentMethodText = 'Cash';
                    else if (method === 'card') paymentMethodText = 'Card';
                    else if (method === 'scan') paymentMethodText = 'QR';
                }
                
                const now = new Date();
                const dateStr = (now.getMonth() + 1) + '/' + now.getDate() + '/' + (now.getFullYear() % 100);
                const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = rightSidebar.innerHTML;
                
                const cashInputEl = tempDiv.querySelector('#cash-input');
                if (cashInputEl) {
                    const cashDisplay = document.createElement('div');
                    cashDisplay.className = 'd-flex justify-content-between mb-3';
                    cashDisplay.innerHTML = `
                        <span class="text-muted">Cash Given</span>
                        <span class="fw-bold">$${parseFloat(cashValue).toFixed(2)}</span>
                    `;
                    cashInputEl.parentElement.replaceWith(cashDisplay);
                }
                
                const paymentMethodSections = tempDiv.querySelectorAll('.mb-4');
                paymentMethodSections.forEach(section => {
                    if (section.querySelector('.payment-method-btn')) {
                        section.innerHTML = `
                            <h5 class="fw-bold mb-3">Payment Method</h5>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Payment Method</span>
                                <span class="fw-bold">${paymentMethodText}</span>
                            </div>
                        `;
                    }
                });
                
                const buttons = tempDiv.querySelectorAll('button');
                buttons.forEach(btn => btn.remove());
                
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Receipt</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                        <style>
                            body { padding: 20px; font-family: 'Courier New', 'Consolas', 'Monaco', monospace, sans-serif; }
                            .receipt-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                            .receipt-title { text-align: center; font-weight: bold; font-size: 1.5rem; margin-bottom: 10px; }
                            @media print {
                                body { padding: 0; }
                                .btn { display: none !important; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt-title">
                            <span class="fw-bold">Kunwari</span>
                            <span class="text-muted ms-1">Resto</span>
                        </div>
                        <hr>
                        <div class="receipt-header">
                            <div>${dateStr}, ${timeStr}</div>
                            <div class="fw-bold">Receipt</div>
                        </div>
                        ${tempDiv.innerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                            };
                        </script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            }
        });
        
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

