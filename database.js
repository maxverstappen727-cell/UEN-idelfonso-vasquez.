class DatabaseManager {
    constructor() {
        this.cache = { subjects: [], publications: [] };
    }

    async getSubjects() {
        try {
            const { data, error } = await window.supabaseClient
                .from('subjects')
                .select('*')
                .order('name', { ascending: true });
            
            if (error) {
                console.warn("Error en subjects (probablemente tabla no existe):", error.message);
                return [];
            }
            return data || [];
        } catch (error) {
            console.warn("Error obteniendo materias:", error.message);
            return [];
        }
    }

    async getPublications(limit = null) {
        try {
            let query = window.supabaseClient
                .from('publicaciones')
                .select('*')
                .order('fecha', { ascending: false });
            
            if (limit) query = query.limit(limit);
            
            const { data, error } = await query;
            
            if (error) {
                console.warn("Error en publicaciones:", error.message);
                return [];
            }
            return data || [];
        } catch (error) {
            console.warn("Error obteniendo publicaciones:", error.message);
            return [];
        }
    }

    async addPublication(publication) {
        try {
            const { data, error } = await window.supabaseClient
                .from('publicaciones')
                .insert([{
                    titulo: publication.title,
                    descripcion: publication.content,
                    url_imagen: publication.imageUrl || '',
                    fecha: new Date().toISOString(),
                    autor: 'Administrador'
                }])
                .select();
            
            if (error) {
                console.error("Error insertando publicación:", error);
                return { success: false, error: error.message };
            }
            
            console.log("Publicación agregada:", data);
            return { success: true, data: data };
        } catch (error) {
            console.error("Error en addPublication:", error);
            return { success: false, error: error.message };
        }
    }

    async deletePublication(id) {
        try {
            const { error } = await window.supabaseClient
                .from('publicaciones')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStats() {
        try {
            const subjects = await this.getSubjects();
            const publications = await this.getPublications();
            
            return {
                totalSubjects: subjects.length,
                totalPublications: publications.length,
                totalResources: 0
            };
        } catch (error) {
            return { totalSubjects: 0, totalPublications: 0, totalResources: 0 };
        }
    }

    async getSchoolInfo() {
        return { 
            nombre: "Colegio Ildefonso Vázquez",
            lema: "Con fe hacia lo alto",
            año: "2025"
        };
    }
}

window.dbManager = new DatabaseManager();
