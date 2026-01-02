// Configuración de Supabase
const supabaseUrl = 'https://eixyvceoedhgpxkefnws.supabase.co'; 
const supabaseKey = 'sb_secret_JyTktO0wOOlBaFZi5leNcA_oResZywR';

// CAMBIO: Usamos createClient directamente de la librería cargada en el index.html
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Exportar con un nombre claro para evitar conflictos
window.supabase = supabaseClient;
