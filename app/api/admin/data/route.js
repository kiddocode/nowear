import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ADMIN_EMAIL = 'mnavarretegon@gmail.com'

export async function GET(req) {
  try {
    // Verificar que es el admin
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return Response.json({ ok: false }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user || user.email !== ADMIN_EMAIL) {
      return Response.json({ ok: false }, { status: 403 })
    }

    // Traer todos los perfiles
    const { data: perfiles } = await supabaseAdmin
      .from('profiles')
      .select('id, nombre, email, created_at, pending_deletion_at')
      .order('created_at', { ascending: false })

    // Traer todos los eventos
    const { data: eventos } = await supabaseAdmin
      .from('eventos')
      .select('id, nombre, slug, tipo, fecha, plan, organizadora_id, activo, created_at')
      .order('created_at', { ascending: false })

    // Stats
    const { count: totalLooks } = await supabaseAdmin
      .from('looks')
      .select('id', { count: 'exact', head: true })

    const { count: totalConflictos } = await supabaseAdmin
      .from('conflictos')
      .select('id', { count: 'exact', head: true })

    // Agrupar eventos por organizadora
    const eventosPorUser = {}
    if (eventos) {
      eventos.forEach(ev => {
        if (!eventosPorUser[ev.organizadora_id]) eventosPorUser[ev.organizadora_id] = []
        eventosPorUser[ev.organizadora_id].push(ev)
      })
    }

    const usuariosConEventos = (perfiles || []).map(p => ({
      ...p,
      eventos: eventosPorUser[p.id] || []
    }))

    return Response.json({
      ok: true,
      usuarios: usuariosConEventos,
      stats: {
        totalUsuarios: perfiles?.length || 0,
        totalEventos: eventos?.length || 0,
        totalLooks: totalLooks || 0,
        totalConflictos: totalConflictos || 0
      }
    })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return Response.json({ ok: false }, { status: 401 })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user || user.email !== ADMIN_EMAIL) {
      return Response.json({ ok: false }, { status: 403 })
    }

    const { eventoId } = await req.json()

    const { data: looks } = await supabaseAdmin
      .from('looks')
      .select('*')
      .eq('evento_id', eventoId)
      .order('created_at', { ascending: false })

    const { data: conflictos } = await supabaseAdmin
      .from('conflictos')
      .select('*')
      .eq('evento_id', eventoId)
      .order('created_at', { ascending: false })

    return Response.json({ ok: true, looks: looks || [], conflictos: conflictos || [] })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}