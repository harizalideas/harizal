import { createClient } from '@supabase/supabase-js';

const fallbackService = Buffer.from(
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5oNWJYcHVkblZzY0dobGFXSm5kR2w1ZW5kNElpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGMxT0RjM01ERXhOeXdpWlhod0lqb3lNRGMwTXpRMk1URTNmUS5HMjg1d0hfSko0Q25mVWVtNzVEaHRXZXZjVXpJYUx5UmhYSG5kVXFhMmNV',
  'base64'
).toString('utf-8');

const fallbackAnon = Buffer.from(
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5oNWJYcHVkblZzY0dobGFXSm5kR2w1ZW5kNElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTlRnM056QXhNVGNzSW1WNGNDSTZNakEzTkRNME5qRXhOMzAuQ1RWa2JnckZzQWwzLW5nVUJSVXAyWTVEUEpOUmxaLVlncEVKV09mODhpcw==',
  'base64'
).toString('utf-8');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xymznvulpheibgtiyzwx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fallbackService;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnon;

// Server-side admin client with service_role secret
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Client/Anon client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
