class DatabaseManager {
    constructor() {
        this.cache = { subjects: [], publications: [] };
    }

    async getSubjects() {
        try {
            const { data, error } = await window.supabase
                .from('subjects')
                .select('*')
                .order('name');
            if (error) throw error;
            this.cache.subjects = data || [];
            return this.cache.subjects;
        } catch (error) {
            console.error("Error obteniendo materias:", error);
            return [];
        }
    }

    async getPublications(limit = null) {
        try {
            let query = window.supabase
                .from('publicaciones')
                .select('*')
                .order('fecha', { ascending: false });
            
            if (limit) query = query.limit(limit);
            
            const { data, error } = await query;
            if (error) throw error;
            this.cache.publications = data || [];
            return this.cache.publications;
        } catch (error) {
            console.error("Error obteniendo publicaciones:", error);
            return [];
        }
    }

    async addPublication(publication) {
        try {
            const { error } = await window.supabase
                .from('publicaciones')
                .insert([{
                    titulo: publication.title,
                    descripcion: publication.content,
                    url_imagen: publication.imageUrl || '',
                    fecha: new Date().toISOString(),
                    autor: 'Administrador'
                }]);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Error agregando publicación:", error);
            return { success: false, error: error.message };
        }
    }

    async deletePublication(id) {
        try {
            const { error } = await window.supabase
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
            const { count: subjectCount } = await window.supabase
                .from('subjects')
                .select('*', { count: 'exact', head: true });
            
            const { count: pubCount } = await window.supabase
                .from('publicaciones')
                .select('*', { count: 'exact', head: true });
            
            return {
                totalSubjects: subjectCount || 0,
                totalPublications: pubCount || 0,
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
