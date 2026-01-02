// CONFIGURACIÓN SUPABASE - CORRECTA Y ACTUALIZADA
const supabaseUrl = 'https://eixyvceoedhgpxkefnws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpeHl2Y2VvZWRoZ3B4a2VmbndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMTk0MjYsImV4cCI6MjA4Mjg5NTQyNn0.izyXmqCZaacTYYomJZ2oUM1uT5ysFaJGdKP2Kc1YrtY';

// Inicializar Supabase correctamente
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Verificar conexión inmediatamente
console.log('🔧 Configurando Supabase...');
console.log('📊 URL:', supabaseUrl);
console.log('🔑 Key length:', supabaseAnonKey.length);

// Probar conexión
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('❌ Error en conexión Supabase:', error.message);
    } else {
        console.log('✅ Supabase conectado correctamente');
        console.log('👤 Sesión:', data.session ? 'Activa' : 'No autenticado');
    }
}).catch(err => {
    console.error('❌ Error crítico en Supabase:', err);
});

// Exportar para uso global
window.supabaseClient = supabase;
console.log('✅ SupabaseClient exportado globalmente');
