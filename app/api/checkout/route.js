import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRECIOS = {
  basico: { amount: 900, label: 'NOWEAR Básico - 1 mes' },
  estandar: { amount: 1900, label: 'NOWEAR Estándar - 3 meses' },
  premium: { amount: 2900, label: 'NOWEAR Premium - Sin límite' },
}

export async function POST(req) {
  try {
    const { plan, eventoData } = await req.json()

    const precio = PRECIOS[plan]
    if (!precio) {
      return Response.json({ error: 'Plan no válido' }, { status: 400 })
    }

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
      success_url: `https://www.nowear.es/dashboard?pago=ok`,
      cancel_url: `https://www.nowear.es/dashboard/nuevo`,
      metadata: {
        plan,
        eventoNombre: eventoData?.nombre || '',
        eventoSlug: eventoData?.slug || '',
      },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}