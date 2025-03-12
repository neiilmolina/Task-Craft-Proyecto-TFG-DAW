import { createClient } from "@supabase/supabase-js";

// Variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY as string;

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
export default supabase;
