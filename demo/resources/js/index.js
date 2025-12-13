document.addEventListener('DOMContentLoaded', async () => {
    try {
        await templateLoader.injectTemplate('header', '#app-container', false);
        await templateLoader.injectTemplate('navbar', '#app-container', true);
        
        const contentWrapper = document.createElement('div');
        contentWrapper.id = 'content-wrapper';
        contentWrapper.className = 'd-flex';
        document.getElementById('app-container').appendChild(contentWrapper);
        
        await templateLoader.injectTemplate('left-sidebar', '#content-wrapper', true);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'sidebar-toggle';
        toggleBtn.className = 'sidebar-toggle-btn';
        toggleBtn.type = 'button';
        toggleBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
        document.body.appendChild(toggleBtn);
        
        const mainContent = document.createElement('main');
        mainContent.id = 'main-content';
        mainContent.className = 'flex-grow-1';
        contentWrapper.appendChild(mainContent);
        
        await templateLoader.injectTemplate('order-line', '#main-content', false);

        await templateLoader.injectTemplate('footer', '#app-container', true);
        
        setupNavigation();
        setInitialActiveSidebarItem('order-line');
        setupSidebarToggle();
        
    } catch (error) {
        console.error('Error loading templates:', error);
    }
});

function setupNavigation() {
    document.addEventListener('click', async (e) => {
        const linkElement = e.target.closest('[data-page]');
        
        if (linkElement) {
            e.preventDefault();
            const page = linkElement.getAttribute('data-page');
            
            if (page === 'logout') {
                console.log('Logout clicked');
                return;
            }
            
            try {
                updateActiveSidebarItem(linkElement);
                await templateLoader.injectTemplate(page, '#main-content', false);
            } catch (error) {
                console.error(`Error loading page ${page}:`, error);
            }
        }
    });
}

function setInitialActiveSidebarItem(pageName) {
    const sidebar = document.querySelector('aside nav');
    if (!sidebar) return;
    
    const link = sidebar.querySelector(`[data-page="${pageName}"]`);
    if (link) {
        updateActiveSidebarItem(link);
    }
}

function updateActiveSidebarItem(activeLink) {
    const sidebar = document.querySelector('aside nav');
    if (!sidebar) return;
    
    const allLinks = sidebar.querySelectorAll('[data-page]');
    allLinks.forEach(link => {
        link.classList.remove('text-white');
        link.classList.add('text-dark');
        link.style.backgroundColor = '';
    });
    
    activeLink.classList.remove('text-dark');
    activeLink.classList.add('text-white');
    activeLink.style.backgroundColor = '#17a2b8';
}

function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('content-wrapper');
    
    if (toggleBtn && sidebar && contentWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = sidebar.classList.toggle('collapsed');
            contentWrapper.classList.toggle('sidebar-collapsed');
            toggleBtn.classList.toggle('collapsed', isCollapsed);
        });
    }
}

