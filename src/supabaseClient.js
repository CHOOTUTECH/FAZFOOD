// src/supabaseClient.js
// 
// Hum yahan Supabase client ko initialize kar rahe hain. 
// Apne project me Supabase use karne ke liye pehle `@supabase/supabase-js` install karein:
// npm install @supabase/supabase-js
// 
// Phir apne .env file me SUPABASE_URL aur SUPABASE_ANON_KEY add karein.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
