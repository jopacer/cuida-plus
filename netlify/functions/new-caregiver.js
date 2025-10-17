// /.netlify/functions/new-caregiver.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY){
    return new Response('Configura SUPABASE_URL y SUPABASE_ANON_KEY en Environment Variables', { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const body = await req.json()

  const payload = {
    ...body,
    certificaciones: Array.isArray(body.certificaciones) ? body.certificaciones :
      String(body.certificaciones || '').split(';').map(s=>s.trim()).filter(Boolean)
  }

  const { data, error } = await supabase
    .from('cuidadores')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  return Response.json({ ok:true, data })
}
