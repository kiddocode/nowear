import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PLAN_LABELS = {
  basico:   'Básico',
  estandar: 'Estándar',
  premium:  'Premium',
}

export async function POST(req) {
  try {
    const body = await req.json()

    const eventType = body.type || body?.data?.object?.object
    const session = body.data?.object || body

    console.log('Webhook recibido:', eventType, JSON.stringify(session?.metadata || {}))

    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const metadata = session.metadata || {}
      const { plan, eventoId, eventoSlug, eventoNombre, eventoPendienteId } = metadata

      if (!plan) {
        console.log('Webhook: metadata incompleta', metadata)
        return Response.json({ received: true })
      }

      let slugFinal = eventoSlug
      let nombreFinal = eventoNombre

      // CASO 1: Evento nuevo (viene de eventos_pendientes)
      if (eventoPendienteId) {
        const { data: pendiente } = await supabaseAdmin
          .from('eventos_pendientes')
          .select('datos')
          .eq('id', eventoPendienteId)
          .single()

        if (pendiente?.datos) {
          const datos = pendiente.datos
          slugFinal = datos.slug
          nombreFinal = datos.nombre

          const { error: insertError } = await supabaseAdmin.from('eventos').insert({
            organizadora_id: datos.organizadora_id,
            slug: datos.slug,
            nombre: datos.nombre,
            tipo: datos.tipo || null,
            fecha: datos.fecha || null,
            lugar: datos.lugar || null,
            num_invitadas: datos.num_invitadas || null,
            colores_bloqueados: datos.colores_bloqueados || null,
            damas_honor: datos.damas_honor || null,
            plan,
            look_bloqueado_color: datos.look_bloqueado_color || null,
            look_bloqueado_marca1: datos.look_bloqueado_marca1 || null,
            look_bloqueado_tipo1: datos.look_bloqueado_tipo1 || null,
            look_bloqueado_modelo1: datos.look_bloqueado_modelo1 || null,
            look_bloqueado_referencia1: datos.look_bloqueado_referencia1 || null,
            look_bloqueado_link1: datos.look_bloqueado_link1 || null,
            look_bloqueado_marca2: datos.look_bloqueado_marca2 || null,
            look_bloqueado_tipo2: datos.look_bloqueado_tipo2 || null,
            look_bloqueado_modelo2: datos.look_bloqueado_modelo2 || null,
            look_bloqueado_referencia2: datos.look_bloqueado_referencia2 || null,
            look_bloqueado_link2: datos.look_bloqueado_link2 || null,
          })

          if (insertError) {
            console.error('Error creando evento:', insertError)
          } else {
            // Borrar el pendiente
            await supabaseAdmin.from('eventos_pendientes').delete().eq('id', eventoPendienteId)
            console.log('Evento creado:', datos.slug)
          }
        }

      // CASO 2: Mejora de plan (evento ya existe)
      } else if (eventoId || eventoSlug) {
        let query = supabaseAdmin.from('eventos').update({ plan })
        if (eventoId) query = query.eq('id', eventoId)
        else query = query.eq('slug', eventoSlug)
        const { error } = await query
        if (error) console.error('Error actualizando plan:', error)
        else console.log(`Plan actualizado: ${eventoId || eventoSlug} -> ${plan}`)
      }

      // Email de confirmación
      try {
        let eventoQuery = supabaseAdmin.from('eventos').select('organizadora_id, nombre, slug')
        if (eventoId) eventoQuery = eventoQuery.eq('id', eventoId)
        else eventoQuery = eventoQuery.eq('slug', slugFinal)
        const { data: evento } = await eventoQuery.single()

        if (evento?.organizadora_id) {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(evento.organizadora_id)
          const emailOrganizadora = authUser?.user?.email

          if (emailOrganizadora) {
            const planLabel = PLAN_LABELS[plan] || plan
            const nombreEvento = evento.nombre || nombreFinal || 'tu evento'
            const slugEvento = evento.slug || slugFinal || ''

            await resend.emails.send({
              from: 'NOWEAR <support@nowear.es>',
              to: emailOrganizadora,
              subject: `Plan ${planLabel} activado · ${nombreEvento}`,
              html: `
                <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#0A0A0A">
                  <div style="margin-bottom:32px">
                    <span style="font-size:18px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase">NOWEAR</span>
                  </div>
                  <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin-bottom:8px">Plan activado</h1>
                  <p style="font-size:14px;color:#888884;margin-bottom:32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
                  <div style="background:#EEF4E8;padding:24px;margin-bottom:32px;border-left:3px solid #4A6B42">
                    <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-bottom:8px">Plan contratado</p>
                    <p style="font-size:22px;font-weight:700;color:#0A0A0A;margin-bottom:4px">${planLabel}</p>
                    <p style="font-size:13px;color:#4A6B42">Pago confirmado. Tu evento ya tiene acceso a todas las funciones del plan.</p>
                  </div>
                  <a href="https://nowear.es/evento/${slugEvento}" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500">Ver mi evento →</a>
                  <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0E0DC">
                    <p style="font-size:11px;color:#BEBEBA">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA">nowear.es</a></p>
                  </div>
                </div>
              `
            })
            console.log(`Email enviado a ${emailOrganizadora}`)
          }
        }
      } catch (emailError) {
        console.error('Error enviando email:', emailError)
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}