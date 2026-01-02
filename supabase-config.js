const supabaseUrl = 'https://eixyvceoedhgpxkefnws.supabase.co';
const supabaseKey = 'sb_secret_JyTktO0wOOlBaFZi5leNcA_oResZywR';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.supabase = supabaseClient;
