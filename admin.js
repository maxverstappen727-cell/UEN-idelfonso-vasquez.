class AdminManager {
    constructor() {
        this.storage = new StorageManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('publication-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Procesando...';

            try {
                const title = document.getElementById('pub-title').value;
                const content = document.getElementById('pub-content').value;
                const imageFile = document.getElementById('pub-image').files[0];

                let imageUrl = '';
                if (imageFile) {
                    const uploadResult = await this.storage.uploadImage(imageFile);
                    imageUrl = uploadResult.url;
                }

                const result = await window.dbManager.addPublication({
                    title: title,
                    content: content,
                    imageUrl: imageUrl
                });

                if (result.success) {
                    location.reload();
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                alert(error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Publicar';
            }
        });
    }

    async deletePub(id) {
        if (confirm('¿Eliminar?')) {
            const result = await window.dbManager.deletePublication(id);
            if (result.success) location.reload();
        }
    }
}

window.adminManager = new AdminManager();
