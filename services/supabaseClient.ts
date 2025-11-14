
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ganmslkxizjnemcttkgz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhbm1zbGt4aXpqbmVtY3R0a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMjY5MzQsImV4cCI6MjA3NzgwMjkzNH0.1eNxy9ONljzpmPhwcYC4GsIUmBTXwGEiaa_pZpNXX0E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);