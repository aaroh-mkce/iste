import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rnmcwwvvnsfzmvuvuevt.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

function createSafeClient() {
  if (!supabaseAnonKey) {
    const mockQuery = () => ({
      select: () => mockQuery(),
      insert: () => mockQuery(),
      update: () => mockQuery(),
      delete: () => mockQuery(),
      eq: () => mockQuery(),
      neq: () => mockQuery(),
      gte: () => mockQuery(),
      lt: () => mockQuery(),
      ilike: () => mockQuery(),
      in: () => mockQuery(),
      order: () => mockQuery(),
      limit: () => mockQuery(),
      range: () => mockQuery(),
      single: () => Promise.resolve({ data: null, error: { message: 'No Supabase key configured' } }),
      then: (resolve) => resolve({ data: [], error: null }),
    });
    return {
      from: () => mockQuery(),
      auth: {
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'No Supabase key configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'No Supabase key configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          list: () => Promise.resolve({ data: [], error: null }),
        }),
      },
    };
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSafeClient();
