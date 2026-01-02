class DatabaseManager {
    constructor() {
        console.log('🚀 DatabaseManager inicializado');
        this.cacheDuration = 60000; // 1 minuto de cache
        this.cache = {
            subjects: { data: null, timestamp: 0 },
            publications: { data: null, timestamp: 0 }
        };
    }

    // Función auxiliar para verificar Supabase
    checkSupabase() {
        if (!window.supabaseClient) {
            console.error('❌ ERROR: supabaseClient no está definido');
            console.log('ℹ️ Verifica que supabase-config.js se cargó correctamente');
            return false;
        }
        return true;
    }

    async getSubjects(forceRefresh = false) {
        // Verificar cache primero
        const now = Date.now();
        if (!forceRefresh && this.cache.subjects.data && 
            (now - this.cache.subjects.timestamp) < this.cacheDuration) {
            console.log('📚 Materias desde caché');
            return this.cache.subjects.data;
        }

        try {
            if (!this.checkSupabase()) return [];
            
            console.log('🔍 Obteniendo materias desde Supabase...');
            const { data, error } = await window.supabaseClient
                .from('subjects')
                .select('*')
                .order('order', { ascending: true });
            
            if (error) {
                console.error('❌ Error obteniendo materias:', error.message);
                // Intentar crear la tabla si no existe
                if (error.message.includes('does not exist')) {
                    console.log('⚠️ La tabla subjects no existe. Ejecuta el SQL de configuración.');
                }
                return [];
            }
            
            console.log(`✅ ${data.length} materias obtenidas`);
            this.cache.subjects = { data, timestamp: now };
            return data;
            
        } catch (error) {
            console.error('❌ Excepción en getSubjects:', error);
            return [];
        }
    }

    async getPublications(limit = null, forceRefresh = false) {
        // Verificar cache
        const now = Date.now();
        if (!forceRefresh && this.cache.publications.data && 
            (now - this.cache.publications.timestamp) < this.cacheDuration) {
            console.log('📰 Publicaciones desde caché');
            let data = this.cache.publications.data;
            if (limit && data.length > limit) {
                return data.slice(0, limit);
            }
            return data;
        }

        try {
            if (!this.checkSupabase()) return [];
            
            console.log('📰 Obteniendo publicaciones desde Supabase...');
            let query = window.supabaseClient
                .from('publicaciones')
                .select('*')
                .order('fecha', { ascending: false });
            
            if (limit) {
                query = query.limit(limit);
                console.log(`🔍 Limitando a ${limit} publicaciones`);
            }
            
            const { data, error } = await query;
            
            if (error) {
                console.error('❌ Error obteniendo publicaciones:', error.message);
                if (error.message.includes('does not exist')) {
                    console.log('⚠️ La tabla publicaciones no existe. Ejecuta el SQL de configuración.');
                }
                return [];
            }
            
            console.log(`✅ ${data.length} publicaciones obtenidas`);
            this.cache.publications = { data, timestamp: now };
            return data;
            
        } catch (error) {
            console.error('❌ Excepción en getPublications:', error);
            return [];
        }
    }

    async addPublication(publication) {
        try {
            if (!this.checkSupabase()) {
                return { success: false, error: 'Supabase no inicializado' };
            }
            
            console.log('➕ Agregando nueva publicación:', publication.title);
            
            const { data, error } = await window.supabaseClient
                .from('publicaciones')
                .insert([{
                    titulo: publication.title,
                    descripcion: publication.content,
                    url_imagen: publication.imageUrl || '',
                    fecha: new Date().toISOString(),
                    autor: 'Administrador',
                    likes: 0
                }])
                .select();
            
            if (error) {
                console.error('❌ Error insertando publicación:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Publicación agregada exitosamente');
            
            // Invalidar cache
            this.cache.publications = { data: null, timestamp: 0 };
            
            return { success: true, data: data[0] };
            
        } catch (error) {
            console.error('❌ Excepción en addPublication:', error);
            return { success: false, error: error.message };
        }
    }

    async deletePublication(id) {
        try {
            if (!this.checkSupabase()) {
                return { success: false, error: 'Supabase no inicializado' };
            }
            
            console.log(`🗑️ Eliminando publicación ID: ${id}`);
            
            const { error } = await window.supabaseClient
                .from('publicaciones')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('❌ Error eliminando publicación:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Publicación eliminada');
            
            // Invalidar cache
            this.cache.publications = { data: null, timestamp: 0 };
            
            return { success: true };
            
        } catch (error) {
            console.error('❌ Excepción en deletePublication:', error);
            return { success: false, error: error.message };
        }
    }

    async getStats() {
        try {
            const [subjects, publications] = await Promise.all([
                this.getSubjects(),
                this.getPublications()
            ]);
            
            return {
                totalSubjects: subjects.length,
                totalPublications: publications.length,
                totalResources: 0,
                lastUpdate: new Date().toLocaleTimeString()
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return { totalSubjects: 0, totalPublications: 0, totalResources: 0 };
        }
    }

    async getSchoolInfo() {
        return { 
            nombre: "Colegio Ildefonso Vázquez",
            lema: "Con fe hacia lo alto",
            año: "2025",
            director: "María González",
            telefono: "(601) 234-5678",
            email: "info@colegioildelfonso.edu.co",
            direccion: "Calle 123 #45-67, Bogotá",
            fundacion: "1975"
        };
    }
}

// Inicialización automática
window.dbManager = new DatabaseManager();
console.log('✅ DatabaseManager listo para usar');
