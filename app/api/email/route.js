import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const { tipo, emailInvitada, nombreInvitada, nombreEvento, nombreOrganizadora, marca, modelo, color, eventoId, organizadoraId } = await req.json()

  try {
    // Obtener email y preferencias de la organizadora
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

    if (tipo === 'confirmacion') {
      // Email a invitada
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look está registrado · ${nombreEvento}`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#0A0A0A">
            <div style="margin-bottom:32px">
              <span style="font-size:18px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase">NOWEAR</span>
            </div>
            <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin-bottom:8px">Look registrado</h1>
            <p style="font-size:14px;color:#888884;margin-bottom:32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <div style="background:#F7F7F5;padding:24px;margin-bottom:32px">
              <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-bottom:16px">Tu look</p>
              <p style="font-size:15px;font-weight:400;margin-bottom:4px">${marca} · ${modelo}</p>
              <p style="font-size:13px;color:#888884">${color}</p>
            </div>
            <p style="font-size:14px;color:#555552;line-height:1.8">Hola <strong>${nombreInvitada}</strong>, tu look ha sido registrado correctamente. Si necesitas hacer algún cambio, vuelve al link del evento.</p>
            <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0E0DC">
              <p style="font-size:11px;color:#BEBEBA">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA">nowear.es</a></p>
            </div>
          </div>
        `
      })

      // Email a organizadora si tiene notif_look activo
      if (emailOrganizadora && notifLook) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Nueva invitada registrada · ${nombreEvento}`,
          html: `
            <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#0A0A0A">
              <div style="margin-bottom:32px">
                <span style="font-size:18px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase">NOWEAR</span>
              </div>
              <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin-bottom:8px">Nueva invitada</h1>
              <p style="font-size:14px;color:#888884;margin-bottom:32px">En <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
              <div style="background:#F7F7F5;padding:24px;margin-bottom:32px">
                <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-bottom:16px">Detalle del look</p>
                <p style="font-size:15px;font-weight:600;margin-bottom:4px">${nombreInvitada}</p>
                <p style="font-size:14px;font-weight:400;margin-bottom:4px">${marca} · ${modelo}</p>
                <p style="font-size:13px;color:#888884">${color}</p>
              </div>
              <a href="https://nowear.es/evento/${eventoId}" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500">Ver mi evento →</a>
              <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0E0DC">
                <p style="font-size:11px;color:#BEBEBA">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA">nowear.es</a></p>
              </div>
            </div>
          `
        })
      }
    }

    if (tipo === 'conflicto_invitada') {
      // Email a invitada
      await resend.emails.send({
        from: 'NOWEAR <support@nowear.es>',
        to: emailInvitada,
        subject: `Tu look no está disponible · ${nombreEvento}`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#0A0A0A">
            <div style="margin-bottom:32px">
              <span style="font-size:18px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase">NOWEAR</span>
            </div>
            <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin-bottom:8px">Look no disponible</h1>
            <p style="font-size:14px;color:#888884;margin-bottom:32px">Para <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
            <div style="background:#FFF0F1;padding:24px;margin-bottom:32px;border-left:3px solid #F07987">
              <p style="font-size:14px;color:#0A0A0A;line-height:1.8">Hola <strong>${nombreInvitada}</strong>, el look que intentaste registrar (<strong>${marca}, ${modelo}</strong>) ya está reservado por otra invitada.</p>
            </div>
            <p style="font-size:14px;color:#555552;line-height:1.8">Por favor, contacta con <strong>${nombreOrganizadora}</strong> para coordinar un look alternativo, o vuelve al link del evento y elige otro.</p>
            <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0E0DC">
              <p style="font-size:11px;color:#BEBEBA">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA">nowear.es</a></p>
            </div>
          </div>
        `
      })

      // Email a organizadora si tiene notif_conflicto activo
      if (emailOrganizadora && notifConflicto) {
        await resend.emails.send({
          from: 'NOWEAR <support@nowear.es>',
          to: emailOrganizadora,
          subject: `Conflicto detectado · ${nombreEvento}`,
          html: `
            <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#0A0A0A">
              <div style="margin-bottom:32px">
                <span style="font-size:18px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase">NOWEAR</span>
              </div>
              <h1 style="font-size:28px;font-weight:300;letter-spacing:-0.02em;margin-bottom:8px">Conflicto detectado</h1>
              <p style="font-size:14px;color:#888884;margin-bottom:32px">En <strong style="color:#0A0A0A">${nombreEvento}</strong></p>
              <div style="background:#FFF0F1;padding:24px;margin-bottom:32px;border-left:3px solid #F07987">
                <p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-bottom:12px">Detalle del conflicto</p>
                <p style="font-size:14px;color:#0A0A0A;line-height:1.8"><strong>${nombreInvitada}</strong> intentó registrar <strong>${marca}, ${modelo}</strong> pero ya estaba reservado por otra invitada.</p>
              </div>
              <p style="font-size:14px;color:#555552;line-height:1.8">Puedes ver todos los conflictos en el panel de tu evento.</p>
              <div style="margin-top:24px">
                <a href="https://nowear.es/evento/${eventoId}" style="display:inline-block;padding:12px 24px;background:#0A0A0A;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:500">Ver mi evento →</a>
              </div>
              <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E0E0DC">
                <p style="font-size:11px;color:#BEBEBA">NOWEAR · No two looks alike · <a href="https://nowear.es" style="color:#BEBEBA">nowear.es</a></p>
              </div>
            </div>
          `
        })
      }
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}