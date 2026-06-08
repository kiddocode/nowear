import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRECIOS = {
  basico:   { amount: 900,  label: 'NOWEAR Básico - 1 mes' },
  estandar: { amount: 1900, label: 'NOWEAR Estándar - 3 meses' },
  premium:  { amount: 2900, label: 'NOWEAR Premium - Sin límite' },
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { plan, planActual, eventoData, eventoId, eventoNombre, eventoSlug } = body

    const precio = PRECIOS[plan]
    if (!precio) return Response.json({ error: 'Plan no válido' }, { status: 400 })

    const nombre = eventoData?.nombre || eventoNombre || ''
    const slug   = eventoData?.slug   || eventoSlug   || ''
    const id     = eventoData?.id     || eventoId     || ''

    const precioActual = planActual ? (PRECIOS[planActual]?.amount || 0) : 0
    const diferencia = Math.max(precio.amount - precioActual, 0)
    if (diferencia === 0) return Response.json({ error: 'Ya tienes este plan o uno superior.' }, { status: 400 })

    const esMejora = precioActual > 0
    const labelPago = esMejora
      ? `${precio.label} (mejora desde ${PRECIOS[planActual]?.label || planActual})`
      : precio.label

    const successUrl = slug
      ? `https://www.nowear.es/evento/${slug}?pago=ok`
      : `https://www.nowear.es/dashboard?pago=ok`

    const cancelUrl = slug
      ? `https://www.nowear.es/evento/${slug}`
      : `https://www.nowear.es/dashboard`

    // Si es evento nuevo (sin id), guardar datos en tabla temporal
    let eventoPendienteId = null
    if (!id && eventoData) {
      const { data: pendiente } = await supabaseAdmin
        .from('eventos_pendientes')
        .insert({ datos: eventoData })
        .select('id')
        .single()
      eventoPendienteId = pendiente?.id || null
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: labelPago },
          unit_amount: diferencia,
        },
        quantity: 1,
      }],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      custom_text: {
        submit: {
          message: 'Al completar el pago confirmas que el servicio se activa de inmediato y renuncias al derecho de desistimiento. No se realizan reembolsos una vez activado el plan.'
        }
      },
      metadata: {
        plan,
        planAnterior: planActual || '',
        eventoId: id,
        eventoNombre: nombre,
        eventoSlug: slug,
        eventoPendienteId: eventoPendienteId || '',
      },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}