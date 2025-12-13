(function() {
    if (typeof window.orderLineMenu === 'undefined') {
        window.orderLineMenu = {};
    }

    if (!window.orderLineMenu.data) {
        window.orderLineMenu.data = {
            burger: [
                { name: "Bacon Cheese with Chips & Drinks", price: 15.00, image: "baconcheesewithchipsdrinks.png", category: "Burger" },
                { name: "Black Pepper", price: 12.00, image: "blackpepper.png", category: "Burger" },
                { name: "Cheese Bacon", price: 14.00, image: "cheesebacon.png", category: "Burger" },
                { name: "Cheese Burger", price: 10.00, image: "cheeseburger.png", category: "Burger" },
                { name: "Chimichurri Burger", price: 16.00, image: "chimichurriburger.png", category: "Burger" },
                { name: "Double Minute Burger", price: 18.00, image: "doubleminuteburger.png", category: "Burger" },
                { name: "Minute Burger", price: 9.00, image: "minuteburger.png", category: "Burger" }
            ],
            special: [
                { name: "Chili Con with Nachos", price: 13.00, image: "chiliconwithnachos.png", category: "Special" }
            ],
            soup: [
                { name: "Chicken Noodle Soup", price: 8.50, image: null, icon: "bi-cup-fill", category: "Soup" },
                { name: "Tomato Basil Soup", price: 9.00, image: null, icon: "bi-cup-fill", category: "Soup" },
                { name: "Cream of Mushroom", price: 10.00, image: null, icon: "bi-cup-fill", category: "Soup" },
                { name: "French Onion Soup", price: 11.50, image: null, icon: "bi-cup-fill", category: "Soup" },
                { name: "Minestrone Soup", price: 9.50, image: null, icon: "bi-cup-fill", category: "Soup" }
            ],
            dessert: [
                { name: "Chocolate Cake", price: 6.50, image: null, icon: "bi-cake2-fill", category: "Dessert" },
                { name: "Cheesecake", price: 7.00, image: null, icon: "bi-cake2-fill", category: "Dessert" },
                { name: "Ice Cream Sundae", price: 5.50, image: null, icon: "bi-cake2-fill", category: "Dessert" },
                { name: "Apple Pie", price: 6.00, image: null, icon: "bi-cake2-fill", category: "Dessert" },
                { name: "Tiramisu", price: 8.00, image: null, icon: "bi-cake2-fill", category: "Dessert" },
                { name: "Brownie", price: 5.00, image: null, icon: "bi-cake2-fill", category: "Dessert" }
            ]
        };
    }
    
    function renderFoodItems(category = 'all') {
        const container = document.getElementById('food-items-container');
        if (!container) return;

        const menuData = window.orderLineMenu.data;
        let itemsToShow = [];
        if (category === 'all') {
            Object.values(menuData).forEach(catItems => {
                itemsToShow = itemsToShow.concat(catItems);
            });
        } else {
            itemsToShow = menuData[category] || [];
        }

        container.innerHTML = itemsToShow.map(item => {
            const imageSection = item.image 
                ? `<img src="resources/static/images/${item.image}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">`
                : `<div class="card-img-top d-flex align-items-center justify-content-center" style="height: 200px; background-color: #f8f9fa; border-radius: 12px 12px 0 0;">
                    <i class="${item.icon || 'bi-egg-fried'}" style="font-size: 4rem; color: #ccc;"></i>
                   </div>`;
            
            return `
            <div class="col-md-3 col-sm-6">
                <div class="card food-card h-100 d-flex flex-column" style="border-radius: 12px; border: 1px solid #e0e0e0;" data-item-name="${item.name}" data-item-price="${item.price.toFixed(2)}">
                    ${imageSection}
                    <div class="card-body d-flex flex-column flex-grow-1" style="position: relative;">
                        <small class="text-muted">${item.category}</small>
                        <h6 class="card-title mt-1 mb-2">${item.name}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="fw-bold item-price">$${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="quantity-selector" style="background-color: #f8f9fa; padding: 12px; border-radius: 0 0 12px 12px; border-top: 1px solid #e0e0e0;">
                        <div class="d-flex justify-content-center align-items-center" style="gap: 4px;">
                            <button class="btn btn-sm btn-outline-secondary quantity-btn quantity-minus" style="width: 30px; height: 30px; padding: 0;">-</button>
                            <span class="quantity-value" style="min-width: 20px; text-align: center;">0</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-btn quantity-plus" style="width: 30px; height: 30px; padding: 0;">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');

        updateCategoryCounts();
    }

    function updateCategoryCounts() {
        const menuData = window.orderLineMenu.data;
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            const category = btn.getAttribute('data-category');
            const countElement = btn.querySelector('.category-count');
            if (countElement) {
                let count = 0;
                if (category === 'all') {
                    count = Object.values(menuData).reduce((sum, items) => sum + items.length, 0);
                } else {
                    count = (menuData[category] || []).length;
                }
                countElement.textContent = `${count} items`;
            }
        });
    }

    function initCategoryFiltering() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        const freshButtons = document.querySelectorAll('.category-btn');
        freshButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                freshButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.border = '1px solid #e0e0e0';
                });
                this.classList.add('active');
                this.style.border = '2px solid #17a2b8';
                
                const category = this.getAttribute('data-category');
                renderFoodItems(category);
            });
        });
    }

    function initializeOrderLine() {
        const container = document.getElementById('food-items-container');
        if (!container) {
            setTimeout(initializeOrderLine, 50);
            return;
        }

        const contentWrapper = document.getElementById('content-wrapper');
        if (contentWrapper && !document.getElementById('right-sidebar')) {
            templateLoader.injectTemplate('right-sidebar', '#content-wrapper', true).then(() => {
                contentWrapper.classList.add('has-right-sidebar');
            });
        }

        renderFoodItems('all');
        initCategoryFiltering();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOrderLine);
    } else {
        setTimeout(initializeOrderLine, 0);
    }
})();

