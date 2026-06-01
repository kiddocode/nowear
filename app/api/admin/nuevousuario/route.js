import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'mnavarretegon@gmail.com'
const LOGO = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/No%20Wear.png'

export async function POST(req) {
  try {
    const body = await req.json()

    const user = body?.user || body?.event?.user || body?.record || (body?.email ? body : null)

    if (!user) {
      return Response.json({ ok: false, error: 'No user data' }, { status: 400 })
    }

    const email = user.email || 'Sin email'
    const nombre = user.user_metadata?.full_name || user.raw_user_meta_data?.full_name || user.nombre || user.user_metadata?.name || 'Sin nombre'
    const proveedor = user.app_metadata?.provider || user.raw_app_meta_data?.provider || user.proveedor || 'email'
    const fechaStr = user.created_at
      ? new Date(user.created_at).toLocaleString('es-ES', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', timeZone:'Europe/Madrid' })
      : new Date().toLocaleString('es-ES', { day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', timeZone:'Europe/Madrid' })

    const proveedorLabel = proveedor === 'google' ? '🔵 Google' : '📧 Email'
    const supabaseUrl = 'https://supabase.com/dashboard/project/qhuatexjyxbunotvghjh/auth/users'

    await resend.emails.send({
      from: 'NOWEAR <support@nowear.es>',
      to: ADMIN_EMAIL,
      subject: `Nueva usuaria registrada · ${email}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;">
        <tr><td style="background:#0A0A0A;padding:20px 28px;">
          <img src="${LOGO}" alt="NOWEAR" style="height:28px;display:block;"/>
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:32px 28px;border:1px solid #E0E0DC;border-top:none;">
          <h1 style="font-size:20px;font-weight:300;color:#0A0A0A;margin:0 0 24px;font-family:'Helvetica Neue',Arial,sans-serif;">Nueva usuaria registrada</h1>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F5;border:1px solid #E0E0DC;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:6px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;width:100px;font-family:'Helvetica Neue',Arial,sans-serif;">Nombre</td>
                  <td style="padding:6px 0;font-size:14px;color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">${nombre}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;">Registro</td>
                  <td style="padding:6px 0;font-size:14px;color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">${proveedorLabel}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;font-family:'Helvetica Neue',Arial,sans-serif;">Fecha</td>
                  <td style="padding:6px 0;font-size:14px;color:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">${fechaStr}</td>
                </tr>
              </table>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:#0A0A0A;border-radius:4px;">
              <a href="${supabaseUrl}" style="display:inline-block;padding:10px 20px;font-size:12px;font-weight:600;color:#FFFFFF;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">Ver en Supabase</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 28px;text-align:center;">
          <p style="font-size:11px;color:#BEBEBA;margin:0;font-family:'Helvetica Neue',Arial,sans-serif;">NOWEAR · nowear.es</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Error en nuevo-usuario webhook:', error)
    return Response.json({ ok: false, error: error.message }, { status: 500 })
  }
}