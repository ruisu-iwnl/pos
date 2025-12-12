class TemplateLoader {
    constructor(templatePath = 'resources/templates/') {
        this.templatePath = templatePath;
        this.cache = new Map();
    }

    async loadTemplate(templateName) {

        if (this.cache.has(templateName)) {
            return this.cache.get(templateName);
        }

        try {
            const response = await fetch(`${this.templatePath}${templateName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${templateName}`);
            }
            const html = await response.text();
            
            this.cache.set(templateName, html);
            return html;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            throw error;
        }
    }

    async injectTemplate(templateName, target, append = false) {
        const html = await this.loadTemplate(templateName);
        const targetElement = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;

        if (!targetElement) {
            throw new Error(`Target element not found: ${target}`);
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const stylesheets = tempDiv.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(oldLink => {
            const href = oldLink.getAttribute('href');
            if (href) {
                const existingLink = document.querySelector(`link[href="${href}"]`);
                if (!existingLink) {
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.type = 'text/css';
                    newLink.href = href;
                    document.head.appendChild(newLink);
                }
            }
            oldLink.remove();
        });

        if (append) {
            while (tempDiv.firstChild) {
                targetElement.appendChild(tempDiv.firstChild);
            }
        } else {
            targetElement.innerHTML = tempDiv.innerHTML;
        }

        const scripts = targetElement.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            }
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        return targetElement;
    }

    async loadTemplates(templateNames) {
        const promises = templateNames.map(name => 
            this.loadTemplate(name).then(html => ({ name, html }))
        );
        const results = await Promise.all(promises);
        return results.reduce((acc, { name, html }) => {
            acc[name] = html;
            return acc;
        }, {});
    }

    clearCache() {
        this.cache.clear();
    }
}

const templateLoader = new TemplateLoader();
