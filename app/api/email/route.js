import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

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
        <!-- HEADER -->
        <tr><td style="background:#0A0A0A;padding:20px 28px;">
          <img src="${LOGO}" alt="NOWEAR" style="height:28px;display:block;"/>
        </td></tr>
        <!-- BODY -->
        <tr><td style="background:#FFFFFF;padding:36px 28px;border:1px solid #E0E0DC;border-top:none;">
          ${contenido}
        </td></tr>
        <!-- FOOTER -->
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

function lookCard(marca, modelo, color, fotoUrl) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E0E0DC;margin-bottom:8px;">
      <tr><td style="padding:16px 20px;">
        ${fotoUrl ? `<img src="${fotoUrl}" alt="Look" style="width:100%;max-height:180px;object-fit:cover;display:block;margin-bottom:12px;"/>` : ''}
        <p style="font-size:14px;font-weight:700;color:#0A0A0A;margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;">${marca} &middot; ${modelo}</p>
        <p style="font-size:12px;color:#888884;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">${color}</p>
      </td></tr>
    </table>`
}

function btnPrimary(texto, href) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
      <tr><td style="background:#0A0A0A;border-radius:4px;">
        <a href="${href}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#FFFFFF;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</a>
      </td></tr>
    </table>`
}

function h1(texto) {
  return `<h1 style="font-size:24px;font-weight:300;letter-spacing:-0.02em;color:#0A0A0A;margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</h1>`
}

function subtitulo(texto) {
  return `<p style="font-size:13px;color:#888884;margin:0 0 28px;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>`
}

function parrafo(texto) {
  return `<p style="font-size:13px;color:#555552;line-height:1.7;margin:20px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>`
}

function alerta(texto, tipo) {
  const colores = {
    error: { bg:'#FFF0F1', border:'#F07987', text:'#0A0A0A' },
    ok:    { bg:'#F0FFF4', border:'#C4E8C4', text:'#2D6A2D' },
    warn:  { bg:'#FFF8F0', border:'#F5D6A0', text:'#0A0A0A' },
  }
  const c = colores[tipo] || colores.warn
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr><td style="background:${c.bg};border-left:3px solid ${c.border};padding:14px 18px;">
        <p style="font-size:13px;color:${c.text};line-height:1.7;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>
      </td></tr>
    </table>`
}

export async function POST(req) {
  const {
    tipo, emailInvitada, nombreInvitada, nombreEvento, nombreOrganizadora,
    marca, modelo, color, eventoId, organizadoraId,
    fotoUrl, lookId, candidatoId, nombreCandidata, emailCandidata,
    marcaCandidata, modeloCandidata, colorCandidata, fotoCandidataUrl,
    token,
    emailPrimera, nombrePrimera,
    fechaEvento,
  } = await req.json()

  try {
    let emailOrganizadora = null
    let notifConflicto = true

    if (organizadoraId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(organizadoraId)
      emailOrganizadora = authUser?.user?.email || null
      const { data: prof } = await supabaseAdmin.from('profiles').select('notif_conflicto').eq('id', organizadoraId).single()
      notifConflicto = prof?.notif_conflicto ?? true
    }

    const eventoUrl = `https://nowear.es/${eventoId}`
    const fechaStr = fechaEvento ? new Date(fechaEvento).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : ''
    const eventoSubtitulo = fechaStr ? `Para <strong>${nombreEvento}</strong> &middot; ${fechaStr}` : `Para <strong>${nombreEvento}</strong>`

    // ─── CONFIRMACION ───────────────────────────────────────────────
    if (tipo === 'confirmacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está registrado · ${nombreEvento}`,
        html: emailBase(`
          ${h1('Look registrado')}
          ${subtitulo(eventoSubtitulo)}
          ${lookCard(marca, modelo, color, null)}
          ${parrafo(`Hola <strong>${nombreInvitada}</strong>, tu look ha sido registrado correctamente.`)}
          ${parrafo(`Si necesitas hacer algún cambio, vuelve al enlace del evento:`)}
          ${btnPrimary('Ver mi look →', eventoUrl)}
        `)
      })
    }

    // ─── CONFLICTO INVITADA ─────────────────────────────────────────
    if (tipo === 'conflicto_invitada') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look no está disponible · ${nombreEvento}`,
        html: emailBase(`
          ${h1('Look no disponible')}
          ${subtitulo(eventoSubtitulo)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, el look que intentaste registrar (<strong>${marca}, ${modelo}</strong>) ya está reservado por otra invitada.`, 'error')}
          ${parrafo('Vuelve al enlace del evento y elige otro look.')}
          ${btnPrimary('Elegir otro look →', eventoUrl)}
        `)
      })

      if (emailOrganizadora && notifConflicto) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Conflicto detectado · ${nombreEvento}`,
          html: emailBase(`
            ${h1('Conflicto detectado')}
            ${subtitulo(eventoSubtitulo)}
            ${alerta(`<strong>${nombreInvitada}</strong> intentó registrar <strong>${marca}, ${modelo}</strong> pero ya estaba reservado por <strong>${nombrePrimera || 'otra invitada'}</strong>.`, 'error')}
            ${btnPrimary('Ver mi evento →', `https://nowear.es/evento/${eventoId}`)}
          `)
        })
      }

      if (emailPrimera && nombrePrimera) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailPrimera,
          subject: `Tu look sigue siendo único · ${nombreEvento}`,
          html: emailBase(`
            ${h1('Tu look sigue siendo único')}
            ${subtitulo(eventoSubtitulo)}
            ${alerta(`Hola <strong>${nombrePrimera}</strong>, otra invitada intentó registrar el mismo look que tú (<strong>${marca}, ${modelo}</strong>), pero el sistema lo ha bloqueado. Tu look sigue siendo exclusivo.`, 'ok')}
          `)
        })
      }
    }

    // ─── AMBIGUEDAD CON FOTO ────────────────────────────────────────
    if (tipo === 'ambiguedad_foto') {
      if (emailOrganizadora) {
        const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
        const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`

        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Validación pendiente · ${nombreEvento}`,
          html: emailBase(`
            ${h1('Validación pendiente')}
            ${subtitulo(eventoSubtitulo)}
            ${alerta('Hay una posible coincidencia entre dos looks. Revisa las fotos y decide si son el mismo producto.', 'warn')}
            <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:20px 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Look nuevo · ${nombreInvitada}</p>
            ${lookCard(marca, modelo, color, fotoUrl)}
            <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:16px 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;">Look registrado · ${nombreCandidata}</p>
            ${lookCard(marcaCandidata, modeloCandidata, colorCandidata, fotoCandidataUrl)}
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
              <tr>
                <td style="background:#0A0A0A;border-radius:4px;padding-right:12px;">
                  <a href="${urlAprobar}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#FFFFFF;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">Aprobar look</a>
                </td>
                <td style="background:#FFFFFF;border-radius:4px;border:1px solid #F07987;">
                  <a href="${urlRechazar}" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#F07987;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">Rechazar look</a>
                </td>
              </tr>
            </table>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">Al aprobar, el look de ${nombreInvitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}