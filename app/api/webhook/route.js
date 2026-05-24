import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const { plan, eventoId, eventoSlug } = session.metadata || {}

    if (!plan || (!eventoId && !eventoSlug)) {
      console.error('Webhook: faltan datos en metadata', session.metadata)
      return Response.json({ error: 'Metadata incompleta' }, { status: 400 })
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
      console.error('Error actualizando plan en Supabase:', error)
      return Response.json({ error: 'Error actualizando plan' }, { status: 500 })
    }

    console.log(`Plan actualizado: evento ${eventoId || eventoSlug} -> ${plan}`)
  }

  return Response.json({ received: true })
}