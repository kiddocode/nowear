import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LOGO = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/No%20Wear.png'

function emailBase(contenido) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
        <tr><td style="background:#0A0A0A;padding:20px 28px;">
          <img src="${LOGO}" alt="NOWEAR" style="height:28px;display:block;"/>
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:36px 28px;border:1px solid #E0E0DC;border-top:none;">
          ${contenido}
        </td></tr>
        <tr><td style="padding:20px 28px;text-align:center;">
          <p style="font-size:11px;color:#BEBEBA;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">
            NOWEAR &middot; No two looks alike &middot;
            <a href="https://nowear.es" style="color:#BEBEBA;text-decoration:none;">nowear.es</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const decision = searchParams.get('decision')

  if (!token || !decision || !['aprobar', 'rechazar'].includes(decision)) {
    return new Response('Enlace no válido.', { status: 400 })
  }

  const { data: validacion, error } = await supabaseAdmin
    .from('validaciones')
    .select('*')
    .eq('token', token)
    .eq('estado', 'pendiente')
    .single()

  if (error || !validacion) {
    return new Response(
      `<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#0A0A0A">
        <h2>Este enlace ya ha sido usado o no es válido.</h2>
        <p style="color:#888884">La validación ya fue procesada anteriormente.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 200 }
    )
  }

  await supabaseAdmin
    .from('validaciones')
    .update({ estado: decision === 'aprobar' ? 'aprobado' : 'rechazado' })
    .eq('id', validacion.id)

  if (decision === 'aprobar') {
    await supabaseAdmin.from('looks').update({ estado: 'confirmado' }).eq('id', validacion.look_id)

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: validacion.email_invitada,
      subject: 'Tu look ha sido validado',
      html: emailBase(`
        <h1 style="font-size:24px;font-weight:300;color:#0A0A0A;margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Tu look está confirmado</h1>
        <p style="font-size:13px;color:#888884;margin:0 0 28px;font-family:'Helvetica Neue',Arial,sans-serif;">La organizadora ha revisado tu look.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
          <tr><td style="background:#F0FFF4;border-left:3px solid #C4E8C4;padding:14px 18px;">
            <p style="font-size:13px;color:#2D6A2D;line-height:1.7;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">Hola <strong>${validacion.nombre_invitada}</strong>, la organizadora ha revisado tu look y lo ha aprobado. Ya está todo listo.</p>
          </td></tr>
        </table>
      `)
    })
  } else {
    await supabaseAdmin.from('looks').update({ estado: 'rechazado' }).eq('id', validacion.look_id)

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: validacion.email_invitada,
      subject: 'Tu look necesita revisión',
      html: emailBase(`
        <h1 style="font-size:24px;font-weight:300;color:#0A0A0A;margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Look no disponible</h1>
        <p style="font-size:13px;color:#888884;margin:0 0 28px;font-family:'Helvetica Neue',Arial,sans-serif;">La organizadora ha revisado tu look.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
          <tr><td style="background:#FFF0F1;border-left:3px solid #F07987;padding:14px 18px;">
            <p style="font-size:13px;color:#0A0A0A;line-height:1.7;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">Hola <strong>${validacion.nombre_invitada}</strong>, tras revisar las fotos la organizadora ha detectado que tu look coincide con el de otra invitada. Por favor, vuelve al enlace del evento y elige otro look.</p>
          </td></tr>
        </table>
      `)
    })
  }

  const mensajeOrg = decision === 'aprobar'
    ? 'Has aprobado el look. La invitada ha sido notificada.'
    : 'Has rechazado el look. La invitada ha sido notificada para que elija otro.'

  return new Response(
    `<html>
      <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
      <body style="font-family:'Helvetica Neue',sans-serif;background:#F7F7F5;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box;">
        <div style="background:#FFFFFF;max-width:420px;width:100%;padding:40px;border:1px solid #E0E0DC;text-align:center;">
          <img src="${LOGO}" alt="NOWEAR" style="height:24px;margin-bottom:32px;display:block;margin-left:auto;margin-right:auto;"/>
          <div style="font-size:2rem;margin-bottom:16px;">${decision === 'aprobar' ? '✓' : '✕'}</div>
          <h2 style="font-size:20px;font-weight:600;color:#0A0A0A;margin:0 0 12px;font-family:'Helvetica Neue',sans-serif;">${decision === 'aprobar' ? 'Look aprobado' : 'Look rechazado'}</h2>
          <p style="font-size:14px;color:#888884;line-height:1.7;margin:0 0 32px;font-family:'Helvetica Neue',sans-serif;">${mensajeOrg}</p>
          <a href="https://nowear.es/dashboard" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500;border-radius:4px;font-family:'Helvetica Neue',sans-serif;">Ir a mi panel</a>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' }, status: 200 }
  )
}

// POST: Ana sube su foto desde el link del email
export async function POST(req) {
  const { token, fotoUrl } = await req.json()

  if (!token || !fotoUrl) {
    return Response.json({ ok: false, error: 'Faltan datos' }, { status: 400 })
  }

  const { data: validacion, error } = await supabaseAdmin
    .from('validaciones')
    .select('*')
    .eq('token', token)
    .eq('estado', 'pendiente')
    .single()

  if (error || !validacion) {
    return Response.json({ ok: false, error: 'Validación no encontrada' }, { status: 404 })
  }

  // Guardar foto de la candidata (Ana)
  await supabaseAdmin
    .from('validaciones')
    .update({ foto_url_candidata: fotoUrl, esperando_foto_candidata: false })
    .eq('id', validacion.id)

  // Actualizar el look de Ana con la foto
  await supabaseAdmin
    .from('looks')
    .update({ foto_url: fotoUrl })
    .eq('id', validacion.candidato_id)

  // Obtener datos del evento y looks para el email
  const { data: evento } = await supabaseAdmin
    .from('eventos')
    .select('nombre, fecha, slug, organizadora_id')
    .eq('id', validacion.evento_id)
    .single()

  const { data: lookNuevo } = await supabaseAdmin
    .from('looks')
    .select('marca, modelo, color_hex, foto_url')
    .eq('id', validacion.look_id)
    .single()

  // Obtener email organizadora
  let emailOrganizadora = null
  if (evento?.organizadora_id) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(evento.organizadora_id)
    emailOrganizadora = authUser?.user?.email || null
  }

  if (emailOrganizadora && evento && lookNuevo) {
    const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
    const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`
    const fechaStr = evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : ''

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: emailOrganizadora,
      subject: `Listo para validar · ${evento.nombre}`,
      html: emailBase(`
        <h1 style="font-size:24px;font-weight:300;color:#0A0A0A;margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Ya puedes validar</h1>
        <p style="font-size:13px;color:#888884;margin:0 0 28px;font-family:'Helvetica Neue',Arial,sans-serif;">Para <strong>${evento.nombre}</strong>${fechaStr ? ` &middot; ${fechaStr}` : ''}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
          <tr><td style="background:#FFF8F0;border-left:3px solid #F5D6A0;padding:14px 18px;">
            <p style="font-size:13px;color:#0A0A0A;line-height:1.7;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">Las dos invitadas han subido sus fotos. Revísalas y decide si son el mismo look.</p>
          </td></tr>
        </table>
        <p style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:20px 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Look de ${validacion.nombre_invitada}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E0E0DC;margin-bottom:8px;">
          <tr><td style="padding:16px 20px;">
            ${lookNuevo.foto_url ? `<img src="${lookNuevo.foto_url}" alt="Look" style="width:100%;max-height:200px;object-fit:cover;display:block;margin-bottom:12px;border-radius:4px;"/>` : ''}
            <p style="font-size:14px;font-weight:700;color:#0A0A0A;margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;">${lookNuevo.marca} &middot; ${lookNuevo.modelo}</p>
          </td></tr>
        </table>
        <p style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:16px 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Look de ${validacion.nombre_candidata}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E0E0DC;margin-bottom:24px;">
          <tr><td style="padding:16px 20px;">
            <img src="${fotoUrl}" alt="Look" style="width:100%;max-height:200px;object-fit:cover;display:block;margin-bottom:12px;border-radius:4px;"/>
          </td></tr>
        </table>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background:#0A0A0A;border-radius:4px;padding-right:12px;">
              <a href="${urlAprobar}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#FFFFFF;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">Aprobar look</a>
            </td>
            <td style="background:#FFFFFF;border-radius:4px;border:1px solid #F07987;">
              <a href="${urlRechazar}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#F07987;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">Rechazar look</a>
            </td>
          </tr>
        </table>
        <p style="font-size:11px;color:#BEBEBA;margin-top:16px;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">Al aprobar, el look de ${validacion.nombre_invitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
      `)
    })
  }

  return Response.json({ ok: true })
}