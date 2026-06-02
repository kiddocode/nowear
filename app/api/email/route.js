import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

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
            <td style="padding:0 8px;">
              <a href="${IG}" style="text-decoration:none;">${IG_ICON}</a>
            </td>
            <td style="padding:0 8px;">
              <a href="${TK}" style="text-decoration:none;">${TK_ICON}</a>
            </td>
          </tr>
        </table>
        ${eventoUrl ? `<p style="margin:0 0 8px;"><a href="${eventoUrl}" style="font-size:11px;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;text-decoration:none;">Ver mi look</a></p>` : ''}
        <p style="margin:0 0 4px;"><a href="${WEB}" style="font-size:11px;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;text-decoration:none;">nowear.es</a></p>
        <p style="margin:8px 0 0;font-size:10px;color:#555552;font-family:'Helvetica Neue',Arial,sans-serif;">No two looks alike</p>
      </td></tr>
    </table>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
</head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- HEADER -->
        <tr><td style="background:#0A0A0A;padding:24px 32px;text-align:center;">
          <img src="${LOGO_WHITE}" alt="NOWEAR" style="height:28px;display:inline-block;"/>
        </td></tr>

        <!-- HERO IMAGE -->
        <tr><td style="padding:0;line-height:0;">
          <img src="${HERO_IMG}" alt="" style="width:100%;max-height:200px;object-fit:cover;display:block;"/>
        </td></tr>

        <!-- CONTENIDO -->
        <tr><td style="background:#FFFFFF;padding:40px 32px;border-left:1px solid #E0E0DC;border-right:1px solid #E0E0DC;">
          ${contenido}
        </td></tr>

        <!-- FOOTER -->
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

function separador() {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td style="border-top:1px solid #E0E0DC;"></td></tr></table>`
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
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:14px 18px;">
            ${nombre ? `<p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;">${nombre}</p>` : ''}
            ${marca ? `<p style="font-size:14px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">${marca}${modelo ? ` · ${modelo}` : ''}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>
    </table>`
}

function etiqueta(texto) {
  return `<p style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888884;margin:20px 0 8px;font-family:'Helvetica Neue',Arial,sans-serif;">${texto}</p>`
}

export async function POST(req) {
  const body = await req.json()
  const {
    tipo, emailInvitada, nombreInvitada, nombreEvento, fechaEvento,
    nombreOrganizadora, marca, modelo, color, eventoId, organizadoraId,
    fotoUrl, nombreCandidata, emailCandidata,
    marcaCandidata, modeloCandidata, colorCandidata, fotoCandidataUrl,
    token, emailPrimera, nombrePrimera,
    fotoUrlNueva, fotoUrlCandidata,
    nombreNueva, nombreCandidataValidacion,
    marcaNueva, modeloNueva,
    marcaCandidataV, modeloCandidataV,
    cancelUrl, fechaEliminacion,
  } = body

  try {
    let emailOrganizadora = null
    let notifConflicto = true

    if (organizadoraId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(organizadoraId)
      emailOrganizadora = authUser?.user?.email || null
      const { data: prof } = await supabaseAdmin.from('profiles').select('notif_conflicto').eq('id', organizadoraId).single()
      notifConflicto = prof?.notif_conflicto ?? true
    }

    const eventoUrl = eventoId ? `https://nowear.es/${eventoId}` : null
    const fechaStr = fechaEvento ? new Date(fechaEvento).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : ''
    const eventoTag = fechaStr ? `${nombreEvento} · ${fechaStr}` : nombreEvento

    // ─── CONFIRMACION ──────────────────────────────────────────────
    if (tipo === 'confirmacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está registrado · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Tu look está registrado')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, tu look ha sido registrado correctamente. Si necesitas hacer algún cambio, vuelve al link del evento.`, 'ok')}
          ${lookCard('', marca, modelo, null)}
          ${boton('Ver mi look', eventoUrl)}
        `, eventoUrl)
      })
    }

    // ─── LOOK PENDIENTE (Ester sube foto) ─────────────────────────
    if (tipo === 'look_pendiente') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está pendiente · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Tu look está pendiente')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, hemos recibido tu look y tu foto. Hay una posible coincidencia con otra invitada, así que la organizadora necesita revisarlo antes de confirmarlo. Te avisaremos en cuanto esté validado.`, 'warn')}
          ${lookCard('', marca, modelo, fotoUrl || null)}
        `, eventoUrl)
      })
    }

    // ─── CONFLICTO INVITADA ────────────────────────────────────────
    if (tipo === 'conflicto_invitada') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look no está disponible · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Look no disponible')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, el look que intentaste registrar ya está reservado por otra invitada. Solo la primera en registrar tiene el look reservado.`, 'error')}
          ${parrafo('Vuelve al enlace del evento y elige otro look.')}
          ${boton('Elegir otro look', eventoUrl)}
        `, eventoUrl)
      })

      if (emailOrganizadora && notifConflicto) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Conflicto detectado · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Conflicto detectado')}
            ${subtitulo(eventoTag)}
            ${alerta(`<strong>${nombreInvitada}</strong> intentó registrar <strong>${marca}${modelo ? `, ${modelo}` : ''}</strong> pero ya estaba reservado por <strong>${nombrePrimera || 'otra invitada'}</strong>.`, 'error')}
            ${boton('Ver mi evento', `https://nowear.es/evento/${eventoId}`)}
          `)
        })
      }

      if (emailPrimera && nombrePrimera) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailPrimera,
          subject: `Tu look sigue siendo único · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Tu look sigue siendo único')}
            ${subtitulo(eventoTag)}
            ${alerta(`Hola <strong>${nombrePrimera}</strong>, otra invitada intentó registrar el mismo look que tú, pero el sistema lo ha bloqueado. Tu look sigue siendo exclusivo.`, 'ok')}
          `, eventoUrl)
        })
      }
    }

    // ─── PEDIR FOTO A CANDIDATA (Ana) ──────────────────────────────
    if (tipo === 'pedir_foto_candidata') {
      const urlSubirFoto = `https://nowear.es/${eventoId}?token=${token}`
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Acción requerida: sube una foto de tu look · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Necesitamos tu foto')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, otra invitada tiene un look muy similar al tuyo. Para que la organizadora pueda verificar que son distintos, necesitamos que subas una foto de tu look.`, 'warn')}
          ${parrafo('Solo tardarás un momento.')}
          ${boton('Subir mi foto', urlSubirFoto)}
          ${parrafo('Si tus looks son claramente distintos, la organizadora lo confirmará y todo quedará resuelto.')}
        `, eventoUrl)
      })

      if (emailOrganizadora) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Validación en proceso · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Validación en proceso')}
            ${subtitulo(eventoTag)}
            ${alerta('Hay una posible coincidencia entre dos looks. Ya hemos pedido a la segunda invitada que suba su foto. Te avisaremos cuando ambas fotos estén listas.', 'warn')}
            ${etiqueta(`Look nuevo · ${nombreCandidata || ''}`)}
            ${lookCard('', marcaCandidata || '', modeloCandidata || '', fotoUrl || null)}
            ${parrafo('No necesitas hacer nada por ahora.')}
          `)
        })
      }
    }

    // ─── VALIDACION LISTA (ambas fotos) ────────────────────────────
    if (tipo === 'validacion_lista') {
      const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
      const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`

      if (emailOrganizadora) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Listo para validar · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Ya puedes validar')}
            ${subtitulo(eventoTag)}
            ${alerta('Las dos invitadas han subido sus fotos. Revísalas y decide si son el mismo look.', 'warn')}
            ${etiqueta(`Look de ${nombreNueva || 'invitada nueva'}`)}
            ${lookCard('', marcaNueva || '', modeloNueva || '', fotoUrlNueva || null)}
            ${etiqueta(`Look de ${nombreCandidataValidacion || 'primera invitada'}`)}
            ${lookCard('', marcaCandidataV || '', modeloCandidataV || '', fotoUrlCandidata || null)}
            ${separador()}
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin-top:8px','margin-top:0')}</td>
                <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin-top:8px','margin-top:0')}</td>
              </tr>
            </table>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;font-family:'Helvetica Neue',Arial,sans-serif;">Al aprobar, el look de ${nombreNueva || 'la invitada'} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

    // ─── AMBIGUEDAD CON FOTO ────────────────────────────────────────
    if (tipo === 'ambiguedad_foto') {
      const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
      const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`

      if (emailOrganizadora) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Validación pendiente · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Validación pendiente')}
            ${subtitulo(eventoTag)}
            ${alerta('Hay una posible coincidencia entre dos looks. Revisa las fotos y decide si son el mismo producto.', 'warn')}
            ${etiqueta(`Look nuevo · ${nombreInvitada}`)}
            ${lookCard('', marca, modelo, fotoUrl || null)}
            ${etiqueta(`Look registrado · ${nombreCandidata || ''}`)}
            ${lookCard('', marcaCandidata || '', modeloCandidata || '', fotoCandidataUrl || null)}
            ${separador()}
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin-top:8px','margin-top:0')}</td>
                <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin-top:8px','margin-top:0')}</td>
              </tr>
            </table>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;font-family:'Helvetica Neue',Arial,sans-serif;">Al aprobar, el look de ${nombreInvitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

    // ─── CUENTA PENDIENTE ELIMINACION ──────────────────────────────
    if (tipo === 'cuenta_pendiente_eliminacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu cuenta será eliminada el ${fechaEliminacion}`,
        html: emailWrapper(`
          ${titulo('Solicitud de eliminación recibida')}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, hemos recibido tu solicitud. Tu cuenta y todos tus datos se eliminarán definitivamente el <strong>${fechaEliminacion}</strong>. Tienes 30 días para cancelarlo.`, 'warn')}
          ${boton('Cancelar eliminación', cancelUrl)}
          ${parrafo('Si no solicitaste esto, cancela el proceso inmediatamente desde el enlace de arriba.')}
        `)
      })
    }

    // ─── ELIMINACION SOLICITADA (aviso admin) ──────────────────────
    if (tipo === 'eliminacion_solicitada') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: 'mnavarretegon@gmail.com',
        subject: `Cuenta solicitó eliminación · ${marca}`,
        html: emailWrapper(`
          ${titulo('Solicitud de eliminación')}
          ${alerta(`La usuaria <strong>${modelo}</strong> (<strong>${marca}</strong>) ha solicitado eliminar su cuenta. Se eliminará el <strong>${color}</strong>.`, 'warn')}
        `)
      })
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}