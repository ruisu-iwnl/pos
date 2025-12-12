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

        if (append) {
            targetElement.insertAdjacentHTML('beforeend', html);
        } else {
            targetElement.innerHTML = html;
        }

        const scripts = targetElement.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
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
