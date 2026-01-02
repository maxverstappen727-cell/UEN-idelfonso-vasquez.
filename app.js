class ColegioApp {
    constructor() {
        this.currentView = 'home';
        this.init();
    }

    async init() {
        this.loadIcons();
        this.setupEventListeners();
        this.initThemes();
        this.checkAuth();
        this.loadInitialData();
    }

    loadIcons() {
        if (window.lucide && window.lucide.createIcons) {
            lucide.createIcons();
        }
    }

    setupEventListeners() {
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
        
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark');
            document.body.classList.toggle('dark', !isDark);
            localStorage.setItem('theme', !isDark ? 'dark' : 'light');
            this.loadIcons();
        });
    }

    initThemes() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        }
    }

    checkAuth() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const adminBtn = document.getElementById('admin-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (isAdmin) {
            adminBtn?.classList.add('hidden');
            logoutBtn?.classList.remove('hidden');
        } else {
            adminBtn?.classList.remove('hidden');
            logoutBtn?.classList.add('hidden');
        }
        
        document.querySelectorAll('.admin-only').forEach(el => {
            el.classList.toggle('hidden', !isAdmin);
        });
    }

    async loadInitialData() {
        await Promise.all([
            this.loadStats(),
            this.loadPublicationsPreview(),
            this.loadSubjectsPreview()
        ]);
    }

    async loadStats() {
        try {
            const stats = await window.dbManager.getStats();
            document.getElementById('total-subjects').textContent = stats.totalSubjects;
            document.getElementById('total-publications').textContent = stats.totalPublications;
            document.getElementById('total-resources').textContent = stats.totalResources;
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        }
    }

    async loadPublicationsPreview() {
        try {
            const publications = await window.dbManager.getPublications(3);
            this.renderPreviewPublications(publications);
        } catch (error) {
            console.error("Error cargando publicaciones:", error);
        }
    }

    renderPreviewPublications(publications) {
        const container = document.getElementById('preview-publications');
        if (!container) return;
        
        if (!publications || publications.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No hay publicaciones aún.</p>';
            return;
        }
        
        container.innerHTML = publications.map(pub => `
            <div class="card p-4 cursor-pointer hover:shadow-lg" onclick="app.showView('publications')">
                <h4 class="font-bold text-lg mb-2 line-clamp-2">${pub.titulo}</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">${pub.descripcion}</p>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    ${new Date(pub.fecha).toLocaleDateString('es-ES')}
                </div>
            </div>
        `).join('');
    }

    async loadSubjectsPreview() {
        try {
            const subjects = await window.dbManager.getSubjects();
            this.renderSubjectsGrid(subjects.slice(0, 4));
        } catch (error) {
            console.error("Error cargando materias:", error);
        }
    }

    renderSubjectsGrid(subjects) {
        const container = document.getElementById('subjects-grid');
        if (!container) return;
        
        if (!subjects || subjects.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No hay materias registradas.</p>';
            return;
        }
        
        container.innerHTML = subjects.map(subject => `
            <div class="card p-6 text-center hover:shadow-lg">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                    📚
                </div>
                <h3 class="font-bold text-lg mb-2">${subject.name}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">${subject.grade || 'Todos los grados'}</p>
            </div>
        `).join('');
    }

    async showView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === viewName) {
                link.classList.add('active');
            }
        });
        
        document.getElementById('mobile-menu').classList.add('hidden');
        
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.remove('hidden');
        }
        
        if (viewName === 'admin') {
            const isAdmin = localStorage.getItem('isAdmin') === 'true';
            if (!isAdmin) {
                showLoginModal();
                return;
            }
            await this.showAdminTab('dashboard');
        } else if (viewName === 'publications') {
            await this.loadAllPublications();
        } else if (viewName === 'subjects') {
            await this.loadAllSubjects();
        }
    }

    async loadAllPublications() {
        try {
            const publications = await window.dbManager.getPublications();
            this.renderPublicationsList(publications);
        } catch (error) {
            console.error("Error cargando publicaciones:", error);
        }
    }

    renderPublicationsList(publications) {
        const container = document.getElementById('publications-list');
        if (!container) return;
        
        if (!publications || publications.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400">No hay publicaciones disponibles.</p>';
            return;
        }
        
        container.innerHTML = publications.map(pub => `
            <div class="card overflow-hidden">
                ${pub.url_imagen ? `
                <img src="${pub.url_imagen}" alt="${pub.titulo}" class="w-full h-48 object-cover">
                ` : ''}
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${pub.titulo}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${pub.descripcion}</p>
                    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>${new Date(pub.fecha).toLocaleDateString('es-ES')}</span>
                        <span>${pub.autor || 'Colegio'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadAllSubjects() {
        try {
            const subjects = await window.dbManager.getSubjects();
            const container = document.getElementById('subjects-grid-full');
            if (!container) return;
            
            container.innerHTML = subjects.map(subject => `
                <div class="card p-6 text-center hover:shadow-lg">
                    <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                        📚
                    </div>
                    <h3 class="font-bold text-lg mb-2">${subject.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${subject.grade || 'Todos los grados'}</p>
                    <button onclick="app.showResources('${subject.id}')" class="btn-secondary text-sm">
                        Ver Recursos
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error("Error cargando materias:", error);
        }
    }

    async showAdminTab(tabName) {
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const contentId = `admin-${tabName}`;
        const content = document.getElementById(contentId);
        if (content) {
            content.classList.remove('hidden');
            
            if (tabName === 'dashboard') {
                await this.loadAdminDashboard();
            } else if (tabName === 'publications') {
                await this.loadAdminPublications();
            }
        }
    }

    async loadAdminDashboard() {
        try {
            const stats = await window.dbManager.getStats();
            document.getElementById('admin-total-subjects').textContent = stats.totalSubjects;
            document.getElementById('admin-total-publications').textContent = stats.totalPublications;
            
            const publications = await window.dbManager.getPublications(5);
            const pubContainer = document.getElementById('admin-recent-publications');
            
            if (pubContainer) {
                pubContainer.innerHTML = publications.map(pub => `
                    <div class="border-b dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <div class="flex justify-between">
                            <h4 class="font-semibold line-clamp-1">${pub.titulo}</h4>
                            <span class="text-xs text-gray-500">${new Date(pub.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        <button onclick="app.deletePublication('${pub.id}')" class="text-red-600 text-xs mt-1">
                            Eliminar
                        </button>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Error cargando dashboard:", error);
        }
    }

    async loadAdminPublications() {
        const publications = await window.dbManager.getPublications();
        const container = document.getElementById('admin-publications-list');
        
        if (container) {
            container.innerHTML = publications.map(pub => `
                <div class="border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-semibold">${pub.titulo}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${pub.descripcion}</p>
                        </div>
                        <button onclick="app.deletePublication('${pub.id}')" class="text-red-600 hover:text-red-800">
                            <i data-lucide="trash" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            this.loadIcons();
        }
    }

    async deletePublication(id) {
        if (!confirm('¿Eliminar esta publicación?')) return;
        
        try {
            const result = await window.dbManager.deletePublication(id);
            if (result.success) {
                alert('Publicación eliminada');
                this.loadAdminPublications();
                this.loadAdminDashboard();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error eliminando publicación');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ColegioApp();
    window.app.showView('home');
    
    document.getElementById('publication-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('pub-title').value;
        const content = document.getElementById('pub-content').value;
        const imageFile = document.getElementById('pub-image').files[0];
        
        let imageUrl = '';
        if (imageFile) {
            try {
                const uploadResult = await window.storageManager.uploadImage(imageFile);
                imageUrl = uploadResult.url;
            } catch (error) {
                alert('Error subiendo imagen: ' + error.message);
                return;
            }
        }
        
        const result = await window.dbManager.addPublication({
            title: title,
            content: content,
            imageUrl: imageUrl
        });
        
        if (result.success) {
            alert('Publicación creada con éxito');
            document.getElementById('pub-title').value = '';
            document.getElementById('pub-content').value = '';
            document.getElementById('pub-image').value = '';
            window.app.loadAdminPublications();
            window.app.loadAdminDashboard();
        } else {
            alert('Error: ' + result.error);
        }
    });
});
