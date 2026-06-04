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
const P = `font-family:'Century Gothic','Gill Sans','Trebuchet MS',Arial,sans-serif;`

function emailWrapper(contenido) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F7F7F5;${P}">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
        <tr><td style="background:#0A0A0A;padding:12px 20px;text-align:center;">
          <img src="${LOGO_WHITE}" alt="NOWEAR" style="width:100%;max-width:200px;height:auto;display:inline-block;"/>
        </td></tr>
        <tr><td style="padding:0;line-height:0;">
          <img src="${HERO_IMG}" alt="" style="width:100%;height:130px;object-fit:cover;object-position:center 30%;display:block;"/>
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:44px 40px;border-left:1px solid #E8E8E4;border-right:1px solid #E8E8E4;text-align:center;">
          ${contenido}
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:16px 40px 28px;border:1px solid #E8E8E4;border-top:1px solid #F0F0EC;text-align:center;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
            <tr>
              <td style="padding:0 10px;"><a href="${IG}" target="_blank" style="font-size:11px;font-weight:500;color:#0A0A0A;text-decoration:none;${P}letter-spacing:0.04em;">Instagram</a></td>
              <td style="color:#BEBEBA;font-size:11px;">·</td>
              <td style="padding:0 10px;"><a href="${TK}" target="_blank" style="font-size:11px;font-weight:500;color:#0A0A0A;text-decoration:none;${P}letter-spacing:0.04em;">TikTok</a></td>
              <td style="color:#BEBEBA;font-size:11px;">·</td>
              <td style="padding:0 10px;"><a href="${WEB}" style="font-size:11px;font-weight:600;color:#0A0A0A;text-decoration:none;${P}letter-spacing:0.04em;">nowear.es</a></td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function titulo(texto) {
  return `<h1 style="font-size:32px;font-weight:400;letter-spacing:-0.02em;color:#0A0A0A;margin:0 0 8px;${P}line-height:1.3;text-align:center;">${texto}</h1>`
}

function subtitulo(texto) {
  return `<p style="font-size:13px;color:#555552;margin:0 0 28px;${P}letter-spacing:0.12em;text-transform:uppercase;font-weight:700;text-align:center;">${texto}</p>`
}

function parrafo(texto) {
  return `<p style="font-size:15px;color:#0A0A0A;line-height:1.9;margin:0 0 20px;${P}font-weight:300;text-align:center;">${texto}</p>`
}

function separador() {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;"><tr><td style="border-top:1px solid #E8E8E4;"></td></tr></table>`
}

function boton(texto, href, tipo = 'primary') {
  const bg = tipo === 'danger' ? '#FFFFFF' : '#0A0A0A'
  const color = tipo === 'danger' ? '#F07987' : '#FFFFFF'
  const border = tipo === 'danger' ? '1px solid #F07987' : 'none'
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 0;">
      <tr><td style="background:${bg};border-radius:3px;border:${border};">
        <a href="${href}" style="display:inline-block;padding:13px 32px;font-size:11px;font-weight:600;color:${color};text-decoration:none;${P}letter-spacing:0.1em;text-transform:uppercase;">${texto}</a>
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
      <tr><td style="background:${s.bg};border-left:3px solid ${s.border};padding:14px 18px;border-radius:0 3px 3px 0;">
        <p style="font-size:15px;color:${s.color};line-height:1.8;margin:0;${P}font-weight:300;text-align:left;">${texto}</p>
      </td></tr>
    </table>`
}

function lookCardSimple(marca, modelo) {
  if (!marca) return ''
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E8E8E4;margin-bottom:8px;border-radius:3px;">
      <tr><td style="padding:14px 18px;text-align:center;">
        <p style="font-size:14px;font-weight:500;color:#0A0A0A;margin:0;${P}">${marca}${modelo ? ` · ${modelo}` : ''}</p>
      </td></tr>
    </table>`
}

function lookCardConFoto(nombre, marca, modelo, fotoUrl) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E8E8E4;margin-bottom:12px;border-radius:3px;overflow:hidden;">
      <tr><td>
        ${fotoUrl ? `<img src="${fotoUrl}" alt="Look" style="width:100%;max-height:220px;object-fit:cover;display:block;"/>` : ''}
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:14px 18px;text-align:left;">
            ${nombre ? `<p style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#888884;margin:0 0 5px;${P}">${nombre}</p>` : ''}
            ${marca ? `<p style="font-size:14px;font-weight:500;color:#0A0A0A;margin:0;${P}">${marca}${modelo ? ` · ${modelo}` : ''}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>
    </table>`
}

function etiqueta(texto) {
  return `<p style="font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#888884;margin:20px 0 8px;${P}text-align:center;">${texto}</p>`
}

function bloqueLook(marca, modelo, marca2, modelo2) {
  if (marca2) {
    return `
      ${etiqueta('Prenda 1 de tu look')}
      ${lookCardSimple(marca, modelo)}
      ${etiqueta('Prenda 2 de tu look')}
      ${lookCardSimple(marca2, modelo2)}`
  }
  return `
    ${etiqueta('Este es el look que has registrado')}
    ${lookCardSimple(marca, modelo)}`
}

export async function POST(req) {
  const body = await req.json()
  const {
    tipo, emailInvitada, nombreInvitada, nombreEvento, fechaEvento,
    nombreOrganizadora, marca, modelo, color, eventoId, organizadoraId,
    marca2, modelo2, tipo2,
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
      const { data: prof } = await supabaseAdmin
        .from('profiles')
        .select('email, notif_conflicto')
        .eq('id', organizadoraId)
        .single()
      emailOrganizadora = prof?.email || null
      notifConflicto = prof?.notif_conflicto ?? true
    }

    const eventoUrl = eventoId ? `https://nowear.es/${eventoId}` : null
    const fechaStr = fechaEvento ? new Date(fechaEvento).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}) : ''
    const eventoTag = fechaStr ? `${nombreEvento} · ${fechaStr}` : nombreEvento

    if (tipo === 'confirmacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está registrado · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Tu look está registrado')}
          ${subtitulo(eventoTag)}
          ${parrafo(`Hola <strong>${nombreInvitada}</strong>, tu look ha sido <strong>registrado correctamente</strong>. Si necesitas hacer algún cambio, vuelve al link del evento.`)}
          ${bloqueLook(marca, modelo, marca2, modelo2)}
          ${eventoUrl ? boton('Ver mi look', eventoUrl) : ''}
        `)
      })
    }

    if (tipo === 'look_pendiente') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está pendiente · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Tu look está pendiente')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, hemos recibido tu look y tu foto. Hay una <strong>posible coincidencia</strong> con otra invitada, así que la organizadora necesita revisarlo antes de confirmarlo. Te avisaremos en cuanto esté validado.`, 'warn')}
          ${lookCardConFoto('', marca, modelo, fotoUrl || null)}
        `)
      })
    }

    if (tipo === 'conflicto_invitada') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look no está disponible · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Look no disponible')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, el look que intentaste registrar ya está <strong>reservado por otra invitada</strong>. Solo la primera en registrar tiene el look reservado.`, 'error')}
          ${parrafo(`<strong>Vuelve al enlace del evento</strong> y elige otro look.`)}
          ${eventoUrl ? boton('Elegir otro look', eventoUrl) : ''}
        `)
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
            ${alerta(`Hola <strong>${nombrePrimera}</strong>, otra invitada intentó registrar el mismo look que tú, pero el sistema lo ha bloqueado. Tu look <strong>sigue siendo exclusivo</strong>.`, 'ok')}
          `)
        })
      }
    }

    if (tipo === 'pedir_foto_candidata') {
      const urlSubirFoto = `https://nowear.es/${eventoId}?token=${token}`
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Acción requerida: sube una foto de tu look · ${nombreEvento}`,
        html: emailWrapper(`
          ${titulo('Necesitamos tu foto')}
          ${subtitulo(eventoTag)}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, otra invitada tiene un look muy similar al tuyo. Para que la organizadora pueda verificar que son distintos, <strong>necesitamos que subas una foto de tu look</strong>.`, 'warn')}
          ${parrafo('Solo tardarás un momento.')}
          ${boton('Subir mi foto', urlSubirFoto)}
          ${parrafo('Si tus looks son claramente distintos, la organizadora lo confirmará y todo quedará resuelto.')}
        `)
      })

      if (emailOrganizadora) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Validación en proceso · ${nombreEvento}`,
          html: emailWrapper(`
            ${titulo('Validación en proceso')}
            ${subtitulo(eventoTag)}
            ${alerta('Hay una posible coincidencia entre dos looks. Ya hemos pedido a la segunda invitada que suba su foto. <strong>Te avisaremos cuando ambas fotos estén listas.</strong>', 'warn')}
            ${etiqueta(`Look nuevo · ${nombreCandidata || ''}`)}
            ${lookCardConFoto('', marcaCandidata || '', modeloCandidata || '', fotoUrl || null)}
            ${parrafo('No necesitas hacer nada por ahora.')}
          `)
        })
      }
    }

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
            ${alerta('Las dos invitadas han subido sus fotos. <strong>Revísalas y decide si son el mismo look.</strong>', 'warn')}
            ${etiqueta(`Look de ${nombreNueva || 'invitada nueva'}`)}
            ${lookCardConFoto('', marcaNueva || '', modeloNueva || '', fotoUrlNueva || null)}
            ${etiqueta(`Look de ${nombreCandidataValidacion || 'primera invitada'}`)}
            ${lookCardConFoto('', marcaCandidataV || '', modeloCandidataV || '', fotoUrlCandidata || null)}
            ${separador()}
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin:8px auto 0','margin:0')}</td>
                <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin:8px auto 0','margin:0')}</td>
              </tr>
            </table>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;${P}font-weight:300;text-align:center;">Al aprobar, el look de ${nombreNueva || 'la invitada'} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

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
            ${alerta('Hay una posible coincidencia entre dos looks. <strong>Revisa las fotos y decide si son el mismo producto.</strong>', 'warn')}
            ${etiqueta(`Look nuevo · ${nombreInvitada}`)}
            ${lookCardConFoto('', marca, modelo, fotoUrl || null)}
            ${etiqueta(`Look registrado · ${nombreCandidata || ''}`)}
            ${lookCardConFoto('', marcaCandidata || '', modeloCandidata || '', fotoCandidataUrl || null)}
            ${separador()}
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin:8px auto 0','margin:0')}</td>
                <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin:8px auto 0','margin:0')}</td>
              </tr>
            </table>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;${P}font-weight:300;text-align:center;">Al aprobar, el look de ${nombreInvitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

    if (tipo === 'descatalogada_sospecha') {
  const urlAprobar = `https://nowear.es/api/validar?token=${token}&decision=aprobar`
  const urlRechazar = `https://nowear.es/api/validar?token=${token}&decision=rechazar`

  if (emailOrganizadora) {
    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: emailOrganizadora,
      subject: `Posible coincidencia a revisar · ${nombreEvento}`,
      html: emailWrapper(`
        ${titulo('Posible coincidencia')}
        ${subtitulo(eventoTag)}
        ${alerta('Dos invitadas han registrado prendas antiguas o descatalogadas de la misma marca y tipo. <strong>Revisa sus fotos y descripciones</strong> para verificar si coinciden.', 'warn')}
        ${etiqueta(`Look de ${nombreInvitada}`)}
        ${lookCardConFoto('', marca, modelo, fotoUrl || null)}
        ${body.descripcionLibre ? `<p style="font-size:13px;color:#555552;line-height:1.7;margin:0 0 16px;font-style:italic;text-align:left;">"${body.descripcionLibre}"</p>` : ''}
        ${etiqueta(`Look de ${body.nombreCandidata || 'otra invitada'}`)}
        ${lookCardConFoto('', body.marcaCandidata || '', body.modeloCandidata || '', body.fotoCandidataUrl || null)}
        ${body.descripcionCandidata ? `<p style="font-size:13px;color:#555552;line-height:1.7;margin:0 0 16px;font-style:italic;text-align:left;">"${body.descripcionCandidata}"</p>` : ''}
        ${separador()}
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
          <tr>
            <td style="padding-right:12px;">${boton('Aprobar look', urlAprobar).replace('margin:8px auto 0','margin:0')}</td>
            <td>${boton('Rechazar look', urlRechazar, 'danger').replace('margin:8px auto 0','margin:0')}</td>
          </tr>
        </table>
        <p style="font-size:11px;color:#BEBEBA;margin-top:16px;${P}font-weight:300;text-align:center;">Al aprobar, el look de ${nombreInvitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
      `)
    })
  }
}

    if (tipo === 'cuenta_pendiente_eliminacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu cuenta será eliminada el ${fechaEliminacion}`,
        html: emailWrapper(`
          ${titulo('Solicitud de eliminación recibida')}
          ${alerta(`Hola <strong>${nombreInvitada}</strong>, hemos recibido tu solicitud. Tu cuenta y todos tus datos se eliminarán definitivamente el <strong>${fechaEliminacion}</strong>. Tienes <strong>30 días para cancelarlo</strong>.`, 'warn')}
          ${boton('Cancelar eliminación', cancelUrl)}
          ${parrafo('Si no solicitaste esto, cancela el proceso inmediatamente desde el enlace de arriba.')}
        `)
      })
    }

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