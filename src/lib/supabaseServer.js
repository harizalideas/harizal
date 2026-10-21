import { createClient } from '@supabase/supabase-js';

const fallbackService = Buffer.from(
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjeUk2SW5OMWNHRmlaVk5wWkdVaUxDSnlaV1lpT2lKNGVXMzZkblZzY0doMWFHVnBZbWRwZVhweGQyaHdJaXdpY205c1pTSTZJbk5sY25acFkyVitmWEpsYldWZmN5SXNJbWxoZENJNk1UYzFPRGMzTURFeE55d2laWGh3SWpveU1EYzBNelEwTmpFeE56MTAuRzI4NXdIX0pKNENuZnVlbTc1RGh0V2V2Y1V6SWFMeVJoWEhuZFVxYTJjVQ==',
  'base64'
).toString('utf-8');

const fallbackAnon = Buffer.from(
  'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjeUk2SW5OMWNHRmlaVk5wWkdVaUxDSnlaV1lpT2lKNGVXMzZkblZzY0doMWFHVnBZbWRwZVhweGQyaHdJaXdpY205c1pTSTZJbUZ1YjI0aUxDSnBZWFFpT2pFM05UZzNOekF4TVRjc0ltVjRjQ0k2TWpBM05ETTBOakV4Tnp0MC5DVFZrYmdyRnNBbDMtbmdVQlJVcDJZOURQSk5SbFotWWdwRUpXT2Y4OGlz',
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
