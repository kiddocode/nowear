import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) return Response.json({ ok: false, error: 'No userId' }, { status: 400 })

    await supabaseAdmin.from('profiles').update({ pending_deletion_at: null }).eq('id', userId)
    await supabaseAdmin.from('eventos').update({ activo: true }).eq('organizadora_id', userId)

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}