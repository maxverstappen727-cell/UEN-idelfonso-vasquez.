class StorageManager {
    constructor() {
        this.apiKey = 'c55c6a2ccb0bc61795de75942c0e087e';
    }

    async uploadImage(file) {
        try {
            if (!file.type.startsWith('image/')) {
                throw new Error('Solo se permiten archivos de imagen');
            }
            
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                return {
                    url: result.data.url,
                    path: result.data.id,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
            } else {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            throw error;
        }
    }
}

window.storageManager = new StorageManager();
