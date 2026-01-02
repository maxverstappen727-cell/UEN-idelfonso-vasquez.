class DatabaseManager {
    constructor() {
        this.cache = { subjects: null, resources: null, publications: null };
    }

    async getSubjects() {
        try {
            const { data, error } = await window.supabase
                .from('subjects')
                .select('*')
                .order('order', { ascending: true });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error en subjects:", error);
            return [];
        }
    }

    async getPublications() {
        try {
            const { data, error } = await window.supabase
                .from('publicaciones')
                .select('*')
                .order('fecha', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error en publicaciones:", error);
            return [];
        }
    }

    async addPublication(publication) {
        try {
            const { error } = await window.supabase.from('publicaciones').insert([{
                titulo: publication.title,
                descripcion: publication.content,
                url_imagen: publication.imageUrl,
                fecha: new Date().toISOString()
            }]);
            return { success: !error, error: error?.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getSchoolInfo() {
        return { nombre: "Colegio Ildefonso Vázquez" };
    }

    async getStats() {
        try {
            const { count: sCount } = await window.supabase.from('subjects').select('*', { count: 'exact', head: true });
            const { count: pCount } = await window.supabase.from('publicaciones').select('*', { count: 'exact', head: true });
            return { totalSubjects: sCount || 0, totalPublications: pCount || 0, totalResources: 0 };
        } catch (error) {
            return { totalSubjects: 0, totalPublications: 0, totalResources: 0 };
        }
    }

    subscribeToUpdates(callback) {
        return () => {};
    }
}
window.dbManager = new DatabaseManager();
