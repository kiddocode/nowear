import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LOGO_WHITE = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_white.png'
const HERO_IMG = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/hero%20foto.jpg'
const IG = 'https://instagram.com/nowearapp'
const TK = 'https://tiktok.com/@nowearapp'
const WEB = 'https://nowear.es'

const IG_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#BEBEBA" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="#BEBEBA" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="#BEBEBA"/></svg>`
const TK_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" fill="#BEBEBA"/></svg>`

function emailWrapper(contenido, eventoUrl = null) {
  const footer = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0A;padding:32px 28px;">
      <tr><td align="center">
        <img src="${LOGO_WHITE}" alt="NOWEAR" style="height:22px;display:block;margin-bottom:20px;"/>
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
          <tr>
            <td style="padding:0 8px;"><a href="${IG}" style="text-decoration:none;">${IG_ICON}</a></td>
            <td style="padding:0 8px;"><a href="${TK}" style="text-decoration:none;">${TK_ICON}</a></td>
          </tr>
        </table>
        ${eventoUrl ? `<p style="margin:0 0 8px;"><a href="${eventoUrl}" style="font-size:11px;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;text-decoration:none;">Ver mi look</a></p>` : ''}
        <p style="margin:0 0 4px;"><a href="${WEB}" style="font-size:11px;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;text-decoration:none;">nowear.es</a></p>
        <p style="margin:8px 0 0;font-size:10px;color:#555552;font-family:'Helvetica Neue',Arial,sans-serif;">No two looks alike</p>
      </td></tr>
    </table>`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr><td style="background:#0A0A0A;padding:24px 32px;text-align:center;">
          <img src="${LOGO_WHITE}" alt="NOWEAR" style="height:28px;display:inline-block;"/>
        </td></tr>
        <tr><td style="padding:0;line-height:0;">
          <img src="${HERO_IMG}" alt="" style="width:100%;max-height:200px;object-fit:cover;display:block;"/>
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:40px 32px;border-left:1px solid #E0E0DC;border-right:1px solid #E0E0DC;">
          ${contenido}
        </td></tr>
        <tr><td>${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function titulo(texto) {
  return `<h1 style="font-size:28px;font-weight:300;letter-spacing:-0.03em;color:#0A0A0A;margin:0 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.2;">${texto}</h1>`
}

function subtitulo(texto) {
  return `<p style="font-size:13px;color:#888884;margin:0 0 32px;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:0.02em;text-transform:uppercase;font-weight:500;">${texto}</p>`
}

function parrafo(texto) {
  return `<p style="font-size:14px;color:#555552;line-height:1.8;margin:0 0 16px;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>`
}

function boton(texto, href, tipo = 'primary') {
  const bg = tipo === 'danger' ? '#FFFFFF' : '#0A0A0A'
  const color = tipo === 'danger' ? '#F07987' : '#FFFFFF'
  const border = tipo === 'danger' ? '1px solid #F07987' : 'none'
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
      <tr><td style="background:${bg};border-radius:4px;border:${border};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:600;color:${color};text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:0.03em;">${texto}</a>
      </td></tr>
    </table>`
}

function alerta(texto, tipo = 'warn') {
  const estilos = {
    warn:  { bg:'#FFF8F0', border:'#F5D6A0', color:'#0A0A0A' },
    error: { bg:'#FFF0F1', border:'#F07987', color:'#0A0A0A' },
    ok:    { bg:'#F0FFF4', border:'#C4E8C4', color:'#2D6A2D' },
  }
  const s = estilos[tipo] || estilos.warn
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr><td style="background:${s.bg};border-left:3px solid ${s.border};padding:16px 20px;border-radius:0 4px 4px 0;">
        <p style="font-size:13px;color:${s.color};line-height:1.7;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>
      </td></tr>
    </table>`
}

function lookCard(nombre, marca, modelo, fotoUrl) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E0E0DC;margin-bottom:12px;border-radius:4px;overflow:hidden;">
      <tr><td>
        ${fotoUrl ? `<img src="${fotoUrl}" alt="Look" style="width:100%;max-height:220px;object-fit:cover;display:block;"/>` : ''}
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:14px 18px;">
          ${nombre ? `<p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;">${nombre}</p>` : ''}
          ${marca ? `<p style="font-size:14px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">${marca}${modelo ? ` · ${modelo}` : ''}</p>` : ''}
        </td></tr></table>
      </td></tr>
    </table>`
}

function separador() {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #E0E0DC;"></td></tr></table>`
}

function etiqueta(texto) {
  return `<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888884;margin:20px 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>`
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
      `<html><body style="font-family:'Helvetica Neue',sans-serif;text-align:center;padding:60px;color:#0A0A0A">
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

  const { data: evento } = await supabaseAdmin
    .from('eventos')
    .select('nombre, slug')
    .eq('id', validacion.evento_id)
    .single()

  const eventoNombre = evento?.nombre || 'el evento'
  const eventoUrl = evento?.slug ? `https://nowear.es/${evento.slug}` : null

  if (decision === 'aprobar') {
    await supabaseAdmin.from('looks').update({ estado: 'confirmado' }).eq('id', validacion.look_id)

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: validacion.email_invitada,
      subject: `Tu look ha sido validado · ${eventoNombre}`,
      html: emailWrapper(`
        ${titulo('Tu look está confirmado')}
        ${subtitulo(eventoNombre)}
        ${alerta(`Hola <strong>${validacion.nombre_invitada}</strong>, la organizadora ha revisado tu look y lo ha aprobado. Ya está todo listo.`, 'ok')}
        ${eventoUrl ? boton('Ver el evento', eventoUrl) : ''}
      `, eventoUrl)
    })

    if (validacion.email_candidata) {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: validacion.email_candidata,
        subject: `Todo resuelto · ${eventoNombre}`,
        html: emailWrapper(`
          ${titulo('Todo resuelto')}
          ${subtitulo(eventoNombre)}
          ${alerta(`Hola <strong>${validacion.nombre_candidata}</strong>, la organizadora ha revisado los looks y ha confirmado que son distintos. Tu look sigue siendo tuyo.`, 'ok')}
        `, eventoUrl)
      })
    }
  } else {
    await supabaseAdmin.from('looks').update({ estado: 'rechazado' }).eq('id', validacion.look_id)

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: validacion.email_invitada,
      subject: `Tu look necesita revisión · ${eventoNombre}`,
      html: emailWrapper(`
        ${titulo('Look no disponible')}
        ${subtitulo(eventoNombre)}
        ${alerta(`Hola <strong>${validacion.nombre_invitada}</strong>, tras revisar las fotos la organizadora ha detectado que tu look coincide con el de otra invitada. Por favor, elige otro look.`, 'error')}
        ${eventoUrl ? boton('Elegir otro look', eventoUrl) : ''}
      `, eventoUrl)
    })

    if (validacion.email_candidata) {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: validacion.email_candidata,
        subject: `Todo resuelto · ${eventoNombre}`,
        html: emailWrapper(`
          ${titulo('Todo resuelto')}
          ${subtitulo(eventoNombre)}
          ${alerta(`Hola <strong>${validacion.nombre_candidata}</strong>, la organizadora ha revisado los looks y ha confirmado que tu look sigue siendo exclusivo.`, 'ok')}
        `, eventoUrl)
      })
    }
  }

  const mensajeOrg = decision === 'aprobar'
    ? 'Has aprobado el look. Las dos invitadas han sido notificadas.'
    : 'Has rechazado el look. Las dos invitadas han sido notificadas.'

  return new Response(
    `<html>
      <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
      <body style="font-family:'Helvetica Neue',sans-serif;background:#F7F7F5;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box;">
        <div style="background:#FFFFFF;max-width:420px;width:100%;padding:40px;border:1px solid #E0E0DC;text-align:center;">
          <img src="${LOGO_WHITE}" alt="NOWEAR" style="height:24px;margin-bottom:32px;display:block;margin-left:auto;margin-right:auto;background:#0A0A0A;padding:12px 20px;border-radius:4px;"/>
          <div style="font-size:2rem;margin-bottom:16px;">${decision === 'aprobar' ? '✓' : '✕'}</div>
          <h2 style="font-size:20px;font-weight:300;color:#0A0A0A;margin:0 0 12px;">${decision === 'aprobar' ? 'Look aprobado' : 'Look rechazado'}</h2>
          <p style="font-size:14px;color:#888884;line-height:1.7;margin:0 0 32px;">${mensajeOrg}</p>
          <a href="https://nowear.es/dashboard" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500;border-radius:4px;">Ir a mi panel</a>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' }, status: 200 }
  )
}

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

  await supabaseAdmin
    .from('validaciones')
    .update({ foto_url_candidata: fotoUrl, esperando_foto_candidata: false })
    .eq('id', validacion.id)

  await supabaseAdmin
    .from('looks')
    .update({ foto_url: fotoUrl })
    .eq('id', validacion.candidato_id)

  const { data: lookAna } = await supabaseAdmin
    .from('looks')
    .select('marca, modelo, color_hex, foto_url')
    .eq('id', validacion.candidato_id)
    .single()

  const { data: lookEster } = await supabaseAdmin
    .from('looks')
    .select('marca, modelo, color_hex, foto_url')
    .eq('id', validacion.look_id)
    .single()

  const { data: evento } = await supabaseAdmin
    .from('eventos')
    .select('nombre, fecha, slug, organizadora_id')
    .eq('id', validacion.evento_id)
    .single()

  let emailOrganizadora = null
  if (evento?.organizadora_id) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(evento.organizadora_id)
    emailOrganizadora = authUser?.user?.email || null
  }

  if (emailOrganizadora && evento) {
    const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
    const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`
    const fechaStr = evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : ''

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: emailOrganizadora,
      subject: `Listo para validar · ${evento.nombre}`,
      html: emailWrapper(`
        ${titulo('Ya puedes validar')}
        ${subtitulo(fechaStr ? `${evento.nombre} · ${fechaStr}` : evento.nombre)}
        ${alerta('Las dos invitadas han subido sus fotos. Revísalas y decide si son el mismo look.', 'warn')}
        ${etiqueta(`Look de ${validacion.nombre_invitada}`)}
        ${lookCard('', lookEster?.marca || '', lookEster?.modelo || '', lookEster?.foto_url || null)}
        ${etiqueta(`Look de ${validacion.nombre_candidata}`)}
        ${lookCard('', lookAna?.marca || '', lookAna?.modelo || '', fotoUrl)}
        ${separador()}
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin-top:8px','margin-top:0')}</td>
            <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin-top:8px','margin-top:0')}</td>
          </tr>
        </table>
        <p style="font-size:11px;color:#BEBEBA;margin-top:16px;font-family:'Helvetica Neue',Arial,sans-serif;">Al aprobar, el look de ${validacion.nombre_invitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
      `)
    })
  }

  return Response.json({ ok: true })
}