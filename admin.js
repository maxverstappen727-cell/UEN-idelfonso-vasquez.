class AdminManager {
    constructor() {
        this.storage = new StorageManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Formulario de Publicaciones
        document.getElementById('publication-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Publicando...';

            try {
                const title = document.getElementById('pub-title').value;
                const content = document.getElementById('pub-content').value;
                const imageFile = document.getElementById('pub-image').files[0];

                let imageUrl = '';
                if (imageFile) {
                    // 1. Subir a ImgBB primero
                    const uploadResult = await this.storage.uploadImage(imageFile);
                    imageUrl = uploadResult.url;
                }

                // 2. Guardar en Supabase
                const result = await window.dbManager.addPublication({
                    title: title,
                    content: content,
                    imageUrl: imageUrl
                });

                if (result.success) {
                    alert('¡Publicado con éxito!');
                    location.reload(); // Recargar para ver los cambios
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Publicar';
            }
        });
    }

    async deletePub(id) {
        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
            const result = await window.dbManager.deletePublication(id);
            if (result.success) location.reload();
        }
    }
}

// Inicializar el administrador
window.adminManager = new AdminManager();