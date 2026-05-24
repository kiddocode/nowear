import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const body = await req.json()

    // El Workbench de Stripe envía el evento directamente como JSON
    const eventType = body.type || body?.data?.object?.object
    const session = body.data?.object || body

    console.log('Webhook recibido:', eventType, JSON.stringify(session?.metadata || {}))

    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const metadata = session.metadata || {}
      const { plan, eventoId, eventoSlug } = metadata

      if (!plan || (!eventoId && !eventoSlug)) {
        console.log('Webhook: metadata incompleta', metadata)
        return Response.json({ received: true })
      }

      let query = supabaseAdmin.from('eventos').update({ plan })
      if (eventoId) {
        query = query.eq('id', eventoId)
      } else {
        query = query.eq('slug', eventoSlug)
      }

      const { error } = await query
      if (error) {
        console.error('Error actualizando plan:', error)
      } else {
        console.log(`Plan actualizado: ${eventoId || eventoSlug} -> ${plan}`)
      }
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}