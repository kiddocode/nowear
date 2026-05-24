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
      const { plan, eventoId, eventoSlug, eventoNombre } = metadata

      if (!plan || (!eventoId && !eventoSlug)) {
        console.log('Webhook: metadata incompleta', metadata)
        return Response.json({ received: true })
      }

      // Actualizar plan en Supabase
      let query = supabaseAdmin.from('eventos').update({ plan })
      if (eventoId) {
        query = query.eq('id', eventoId)
      } else {
        query = query.eq('slug', eventoSlug)
      }

      const { error } = await query
      if (error) {
        console.error('Error actualizando plan:', error)
        return Response.json({ error: error.message }, { status: 500 })
      }

      console.log(`Plan actualizado: ${eventoId || eventoSlug} -> ${plan}`)

      // Obtener email de la organizadora
      try {
        const id = eventoId || null
        const slug = eventoSlug || null

        let eventoQuery = supabaseAdmin.from('eventos').select('organizadora_id, nombre, slug')
        if (id) eventoQuery = eventoQuery.eq('id', id)
        else eventoQuery = eventoQuery.eq('slug', slug)

        const { data: evento } = await eventoQuery.single()

        if (evento?.organizadora_id) {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(evento.organizadora_id)
          const emailOrganizadora = authUser?.user?.email

          if (emailOrganizadora) {
            const planLabel = PLAN_LABELS[plan] || plan
            const nombreEvento = evento.nombre || eventoNombre || 'tu evento'
            const slugEvento = evento.slug || eventoSlug || ''

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

            console.log(`Email de confirmación enviado a ${emailOrganizadora}`)
          }
        }
      } catch (emailError) {
        console.error('Error enviando email de confirmación:', emailError)
        // No retornamos error para no afectar la respuesta al webhook
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}