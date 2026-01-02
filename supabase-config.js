// Configuración de Supabase
const supabaseUrl = 'https://eixyvceoedhgpxkefnws.supabase.co'; // Ejemplo: https://xyz.supabase.co
const supabaseKey = 'sb_secret_JyTktO0wOOlBaFZi5leNcA_oResZywR';    // El código largo que empieza por eyJ...

// Inicializar el cliente de Supabase
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Exportar para que otros archivos lo usen
window.supabase = supabase;