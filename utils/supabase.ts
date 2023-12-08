import { createClient } from '@supabase/supabase-js'

const supabaseUrl: any = process.env.NEXT_PUBLIC_SUPERBASE_URL 
const supabaseKey: any = process.env.NEXT_PUBLIC_ANON_KEY 

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getSupabase = () => {
    console.log(supabase)
}
