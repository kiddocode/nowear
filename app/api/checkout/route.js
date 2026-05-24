import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRECIOS = {
  basico:   { amount: 900,  label: 'NOWEAR Básico - 1 mes' },
  estandar: { amount: 1900, label: 'NOWEAR Estándar - 3 meses' },
  premium:  { amount: 2900, label: 'NOWEAR Premium - Sin límite' },
}

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('Checkout body:', JSON.stringify(body))
    const { plan, eventoData, eventoId, eventoNombre, eventoSlug } = body

    const precio = PRECIOS[plan]
    if (!precio) {
      return Response.json({ error: 'Plan no válido' }, { status: 400 })
    }

    // Compatibilidad con ambos formatos: eventoData objeto o campos sueltos
    const nombre = eventoData?.nombre || eventoNombre || ''
    const slug   = eventoData?.slug   || eventoSlug   || ''
    const id     = eventoData?.id     || eventoId     || ''

    const successUrl = slug
      ? `https://www.nowear.es/evento/${slug}?pago=ok`
      : `https://www.nowear.es/dashboard?pago=ok`

    const cancelUrl = slug
      ? `https://www.nowear.es/evento/${slug}`
      : `https://www.nowear.es/dashboard/`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: precio.label },
            unit_amount: precio.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan,
        eventoId: id,
        eventoNombre: nombre,
        eventoSlug: slug,
      },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}