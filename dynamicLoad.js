document.addEventListener("DOMContentLoaded", async () => {
    const sidebar = document.querySelector("ul");
    const mainContent = document.getElementById("mainContent");
    const pageTitle = document.getElementById("pageTitle");
    window.modulesConfig = [
        { "file": "dashboard", "title": "Painel de controle", "icon": "fas fa-tachometer-alt" },
        { "file": "sales", "title": "Vendas", "icon": "fas fa-shopping-cart" },
        { "file": "rh", "title": "Recursos Humanos", "icon": "fas fa-users" },
        // { "file": "inventory", "title": "Inventory", "icon": "fas fa-boxes" },
        // { "file": "purchasing", "title": "Purchasing", "icon": "fas fa-shopping-bag" },
        // { "file": "accounting", "title": "Accounting", "icon": "fas fa-calculator" },
        // { "file": "manufacturing", "title": "Manufacturing", "icon": "fas fa-industry" },
        // { "file": "crm", "title": "CRM", "icon": "fas fa-handshake" },
        // { "file": "projects", "title": "Projects", "icon": "fas fa-project-diagram" },
        // { "file": "reports", "title": "Reports", "icon": "fas fa-chart-bar" }
    ];

    async function loadModule(moduleName, title) {
        try {
            const response = await fetch(`modules/${moduleName}.html`);
            const htmlText = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlText;

            const scripts = tempDiv.querySelectorAll("script");
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                if (script.src) newScript.src = script.src;
                else newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });

            scripts.forEach(s => s.remove());
            mainContent.innerHTML = tempDiv.innerHTML;
            pageTitle.textContent = title;

            setTimeout(() => {
                if (typeof window.init === "function") {
                    window.init();
                } else {
                    console.warn(`Função init() não encontrada para o módulo ${moduleName}`);
                }
            }, 0);
        } catch (err) {
            console.error(err);
            mainContent.innerHTML = `<div class="text-red-500">Erro ao carregar o módulo ${moduleName}</div>`;
        }
    }

    async function buildSidebar() {
        sidebar.innerHTML = `
            <h3 class="text-xs uppercase text-blue-300 font-semibold mb-4 nav-text">Main Modules</h3>
        `;

        window.modulesConfig.forEach((mod, index) => {
            const li = document.createElement("li");
            li.className = "mb-2";
            li.innerHTML = `
                <a href="#" class="module-link flex items-center p-2 rounded hover:bg-blue-700 ${index === 0 ? "active bg-blue-700" : ""}" data-module="${mod.file}" data-title="${mod.title}">
                    <i class="${mod.icon} mr-3"></i>
                    <span class="nav-text">${mod.title}</span>
                </a>
            `;
            sidebar.appendChild(li);
        });

        addLinkListeners();
    }

    function addLinkListeners() {
        const links = document.querySelectorAll(".module-link");

        links.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const module = link.dataset.module;
                const title = link.dataset.title || module;

                loadModule(module, title);

                links.forEach(l => l.classList.remove("active", "bg-blue-700"));
                link.classList.add("active", "bg-blue-700");
            });
        });

        // Carrega o primeiro módulo automaticamente
        const firstLink = links[0];
        if (firstLink) {
            const module = firstLink.dataset.module;
            const title = firstLink.dataset.title || module;
            loadModule(module, title);
        }
    }

    await buildSidebar();
});
