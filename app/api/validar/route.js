import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const LOGO = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/No%20Wear.png'

function emailBase(contenido) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#F7F7F5;padding:40px 20px;min-height:100vh">
      <div style="max-width:520px;margin:0 auto">
        <div style="background:#0A0A0A;padding:28px 32px;margin-bottom:0">
          <img src="${LOGO}" alt="NOWEAR" style="height:32px;display:block"/>
        </div>
        <div style="background:#FFFFFF;padding:40px 32px;border:1px solid #E0E0DC;border-top:none">
          ${contenido}
        </div>
        <div style="padding:24px 32px;text-align:center">
          <p style="font-size:11px;color:#BEBEBA;margin:0">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA;text-decoration:none">nowear.es</a></p>
        </div>
      </div>
    </div>
  `
}

function lookCard(marca, modelo, color, fotoUrl) {
  return `
    <div style="background:#F7F7F5;border:1px solid #E0E0DC;padding:20px 24px;margin-bottom:8px">
      ${fotoUrl ? `<img src="${fotoUrl}" alt="Look" style="width:100%;max-height:200px;object-fit:cover;display:block;margin-bottom:16px"/>` : ''}
      <p style="font-size:15px;font-weight:600;color:#0A0A0A;margin:0 0 4px">${marca} · ${modelo}</p>
      <p style="font-size:13px;color:#888884;margin:0">${color}</p>
    </div>
  `
}

export async function POST(req) {
  const {
    tipo, emailInvitada, nombreInvitada, nombreEvento, nombreOrganizadora,
    marca, modelo, color, eventoId, organizadoraId,
    // Para ambigüedad con foto
    fotoUrl, lookId, candidatoId, nombreCandidata, emailCandidata,
    marcaCandidata, modeloCandidata, colorCandidata, fotoCandidataUrl,
    token,
    // Para aviso a primera invitada
    emailPrimera, nombrePrimera,
  } = await req.json()

  try {
    let emailOrganizadora = null
    let notifLook = true
    let notifConflicto = true

    if (organizadoraId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(organizadoraId)
      emailOrganizadora = authUser?.user?.email || null
      const { data: prof } = await supabaseAdmin.from('profiles').select('notif_look, notif_conflicto').eq('id', organizadoraId).single()
      notifLook = prof?.notif_look ?? true
      notifConflicto = prof?.notif_conflicto ?? true
    }

    // ─── CONFIRMACION ───────────────────────────────────────────────
    if (tipo === 'confirmacion') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está registrado · ${nombreEvento}`,
        html: emailBase(`
          <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Look registrado</h1>
          <p style="font-size:14px;color:#888884;margin:0 0 32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
          ${lookCard(marca, modelo, color, null)}
          <p style="font-size:14px;color:#555552;line-height:1.8;margin-top:24px">Hola <strong>${nombreInvitada}</strong>, tu look ha sido registrado correctamente. Si necesitas hacer algún cambio, vuelve al link del evento.</p>
        `)
      })

      if (emailOrganizadora && notifLook) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Nueva invitada registrada · ${nombreEvento}`,
          html: emailBase(`
            <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Nueva invitada</h1>
            <p style="font-size:14px;color:#888884;margin:0 0 32px">En <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <p style="font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888884;margin:0 0 8px">Invitada</p>
            <p style="font-size:16px;font-weight:600;color:#0A0A0A;margin:0 0 20px">${nombreInvitada}</p>
            ${lookCard(marca, modelo, color, null)}
            <div style="margin-top:28px">
              <a href="https://nowear.es/evento/${eventoId}" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500;border-radius:4px">Ver mi evento</a>
            </div>
          `)
        })
      }
    }

    // ─── CONFLICTO INVITADA ─────────────────────────────────────────
    if (tipo === 'conflicto_invitada') {
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look no está disponible · ${nombreEvento}`,
        html: emailBase(`
          <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Look no disponible</h1>
          <p style="font-size:14px;color:#888884;margin:0 0 32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
          <div style="background:#FFF0F1;border-left:3px solid #F07987;padding:20px 24px;margin-bottom:24px">
            <p style="font-size:14px;color:#0A0A0A;line-height:1.8;margin:0">Hola <strong>${nombreInvitada}</strong>, el look que intentaste registrar (<strong>${marca}, ${modelo}</strong>) ya está reservado por otra invitada.</p>
          </div>
          <p style="font-size:14px;color:#555552;line-height:1.8">Vuelve al link del evento y elige otro look.</p>
        `)
      })

      if (emailOrganizadora && notifConflicto) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Conflicto detectado · ${nombreEvento}`,
          html: emailBase(`
            <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Conflicto detectado</h1>
            <p style="font-size:14px;color:#888884;margin:0 0 32px">En <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <div style="background:#FFF0F1;border-left:3px solid #F07987;padding:20px 24px;margin-bottom:24px">
              <p style="font-size:14px;color:#0A0A0A;line-height:1.8;margin:0"><strong>${nombreInvitada}</strong> intentó registrar <strong>${marca}, ${modelo}</strong> pero ya estaba reservado por otra invitada.</p>
            </div>
            <div style="margin-top:28px">
              <a href="https://nowear.es/evento/${eventoId}" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500;border-radius:4px">Ver mi evento</a>
            </div>
          `)
        })
      }

      // Aviso a la primera invitada que registró el look
      if (emailPrimera && nombrePrimera) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailPrimera,
          subject: `Alguien ha intentado registrar tu mismo look · ${nombreEvento}`,
          html: emailBase(`
            <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Tu look sigue siendo único</h1>
            <p style="font-size:14px;color:#888884;margin:0 0 32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <div style="background:#F0FFF4;border:1px solid #C4E8C4;padding:20px 24px;margin-bottom:24px">
              <p style="font-size:14px;color:#2D6A2D;line-height:1.8;margin:0">Hola <strong>${nombrePrimera}</strong>, otra invitada intentó registrar el mismo look que tú (<strong>${marca}, ${modelo}</strong>), pero el sistema lo ha bloqueado. Tu look sigue siendo exclusivo.</p>
            </div>
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
          subject: `Necesitas validar un look · ${nombreEvento}`,
          html: emailBase(`
            <h1 style="font-size:26px;font-weight:300;letter-spacing:-0.02em;margin:0 0 8px">Validación pendiente</h1>
            <p style="font-size:14px;color:#888884;margin:0 0 24px">En <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <p style="font-size:14px;color:#555552;line-height:1.8;margin:0 0 28px">Hay una posible coincidencia entre dos looks. Revisa las fotos y decide si son el mismo producto.</p>

            <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:0 0 8px">Look nuevo · ${nombreInvitada}</p>
            ${lookCard(marca, modelo, color, fotoUrl)}

            <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin:16px 0 8px">Look registrado · ${nombreCandidata}</p>
            ${lookCard(marcaCandidata, modeloCandidata, colorCandidata, fotoCandidataUrl)}

            <div style="margin-top:32px;display:flex;gap:12px">
              <a href="${urlAprobar}" style="display:inline-block;padding:14px 28px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:600;border-radius:4px;margin-right:12px">Aprobar look</a>
              <a href="${urlRechazar}" style="display:inline-block;padding:14px 28px;background:#FFFFFF;color:#F07987;text-decoration:none;font-size:13px;font-weight:600;border-radius:4px;border:1px solid #F07987">Rechazar look</a>
            </div>
            <p style="font-size:11px;color:#BEBEBA;margin-top:16px;line-height:1.6">Al aprobar, el look de ${nombreInvitada} queda confirmado. Al rechazar, se le pedirá que elija otro.</p>
          `)
        })
      }
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}