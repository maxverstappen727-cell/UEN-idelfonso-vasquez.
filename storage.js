// Clase para manejar la subida de imágenes a ImgBB (Plan B: Sin tarjeta)
class StorageManager {
    constructor() {
        // IMPORTANTE: Pon aquí tu clave API de ImgBB
        // Consíguela gratis en: https://api.imgbb.com/
        this.apiKey = 'c55c6a2ccb0bc61795de75942c0e087e'; 
    }

    async uploadImage(file, folder = 'publications') {
        try {
            // Validar si es una imagen
            if (!file.type.startsWith('image/')) {
                throw new Error('Solo se permiten archivos de imagen');
            }
            
            // 1. Preparar los datos para enviar a ImgBB
            const formData = new FormData();
            formData.append('image', file);

            console.log("Subiendo imagen a ImgBB...");

            // 2. Hacer la petición a la API de ImgBB
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                console.log("✅ Foto subida con éxito:", result.data.url);
                
                // Retornamos el mismo formato que esperaba tu app
                return {
                    url: result.data.url, // Enlace directo para la base de datos
                    path: result.data.id, // ID único de la imagen
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    delete_url: result.data.delete_url // Por si quieres borrarla luego
                };
            } else {
                throw new Error(result.error.message);
            }
            
        } catch (error) {
            console.error("❌ Error en StorageManager:", error);
            alert("Error al subir la imagen: " + error.message);
            throw error;
        }
    }

    // Nota: ImgBB en su versión gratuita no permite borrar por código fácilmente
    // así que esta función la dejamos como "limpia" para no romper tu código
    async deleteImage(imageUrl) {
        console.warn("La eliminación automática no está disponible en el plan gratuito de ImgBB. Debes borrarla desde su web.");
        return { success: true };
    }

    // Mantenemos esta función para que los filtros de tu app sigan funcionando
    getOptimizedImageUrl(originalUrl) {
        return originalUrl;
    }

    // Previsualización local (Esto ayuda a que el profesor vea la foto antes de subirla)
    createLocalPreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }
}

// Inicializar globalmente para que admin.js lo encuentre
window.storageManager = new StorageManager();