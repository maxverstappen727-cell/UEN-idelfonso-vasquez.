class DatabaseManager {
    constructor() {
        this.cache = {
            subjects: null,
            resources: null,
            publications: null
        };
    }

    async getSubjects() {
        try {
            const { data, error } = await window.supabase
                .from('subjects')
                .select('*')
                .order('order', { ascending: true });
            
            if (error) throw error;
            this.cache.subjects = data;
            return data || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async addSubject(subject) {
        try {
            const { data, error } = await window.supabase
                .from('subjects')
                .insert([{ ...subject }]);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
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
            console.error(error);
            return [];
        }
    }

    async addPublication(publication) {
        try {
            const { data, error } = await window.supabase
                .from('publicaciones')
                .insert([{
                    titulo: publication.title,
                    descripcion: publication.content,
                    url_imagen: publication.imageUrl,
                    fecha: new Date().toISOString()
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
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

    async getSchoolInfo() {
        return { nombre: "Colegio Ildefonso Vázquez" };
    }

    async getStats() {
        try {
            const { count: sCount } = await window.supabase.from('subjects').select('*', { count: 'exact', head: true });
            const { count: pCount } = await window.supabase.from('publicaciones').select('*', { count: 'exact', head: true });
            return {
                totalSubjects: sCount || 0,
                totalPublications: pCount || 0,
                totalResources: 0
            };
        } catch (error) {
            return { totalSubjects: 0, totalPublications: 0, totalResources: 0 };
        }
    }

    subscribeToUpdates(callback) {
        return () => {};
    }
}

window.dbManager = new DatabaseManager();
