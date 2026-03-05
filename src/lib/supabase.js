import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnmcwwvvnsfzmvuvuevt.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create a safe supabase client — returns a mock if no key is configured
function createSafeClient() {
  if (!supabaseAnonKey) {
    // Return a mock client that returns empty results instead of crashing
    const mockQuery = () => ({
      select: () => mockQuery(),
      insert: () => mockQuery(),
      eq: () => mockQuery(),
      order: () => mockQuery(),
      single: () => Promise.resolve({ data: null, error: { message: 'No Supabase key configured' } }),
      then: (resolve) => resolve({ data: null, error: { message: 'No Supabase key configured' } }),
    });
    return { from: () => mockQuery() };
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSafeClient();
