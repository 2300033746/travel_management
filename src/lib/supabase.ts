import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  destination: string;
  booking_date: string;
  travel_date: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
};
