(function() {
    function initCarousel() {
        const carousel = document.getElementById('order-carousel');
        const leftBtn = document.getElementById('carousel-left-btn');
        const rightBtn = document.getElementById('carousel-right-btn');
        
        if (!carousel || !leftBtn || !rightBtn) {
            setTimeout(initCarousel, 50);
            return;
        }
        
        function updateButtons() {
            const scrollLeft = carousel.scrollLeft;
            const scrollWidth = carousel.scrollWidth;
            const clientWidth = carousel.clientWidth;
            
            if (scrollWidth <= clientWidth) {
                leftBtn.style.display = 'none';
                rightBtn.style.display = 'none';
            } else {
                if (scrollLeft <= 5) {
                    leftBtn.style.display = 'none';
                    rightBtn.style.display = 'flex';
                } else if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    leftBtn.style.display = 'flex';
                    rightBtn.style.display = 'none';
                } else {
                    leftBtn.style.display = 'flex';
                    rightBtn.style.display = 'flex';
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
        
        leftBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            smoothScroll(carousel, -150);
        };
        
        rightBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            smoothScroll(carousel, 150);
        };
        
        carousel.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons();
    }
    
    setTimeout(initCarousel, 10);
})();

