const supabaseUrl = 'https://eixyvceoedhgpxkefnws.supabase.co';
const supabaseKey = 'eixyvceoedhgpxkefnws';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.supabase = supabaseClient;

