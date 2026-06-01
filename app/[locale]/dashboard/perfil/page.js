'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'

export default function Perfil() {
  const router = useRouter()
  const t = useTranslations('perfil')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [nombre, setNombre] = useState('')
  const [notifLook, setNotifLook] = useState(false)
  const [notifConflicto, setNotifConflicto] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [emailConfirm, setEmailConfirm] = useState('')
  const [errorEliminar, setErrorEliminar] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      setNombre(prof?.nombre || user?.user_metadata?.full_name || '')
      setNotifLook(prof?.notif_look ?? true)
      setNotifConflicto(prof?.notif_conflicto ?? true)
      setLoading(false)
    }
    cargar()
  }, [])

  async function handleGuardar() {
    setGuardando(true); setMensaje('')
    await supabase.from('profiles').update({ nombre, notif_look: notifLook, notif_conflicto: notifConflicto }).eq('id', user.id)
    setGuardando(false)
    setMensaje(t('guardado'))
    setTimeout(() => setMensaje(''), 3000)
  }

  async function handleSolicitarEliminacion() {
    setErrorEliminar('')
    if (emailConfirm.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      setErrorEliminar('El email no coincide con tu cuenta.'); return
    }
    setEliminando(true)
    const fechaEliminacion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Marcar cuenta como pendiente de eliminación
    await supabase.from('profiles').update({ pending_deletion_at: fechaEliminacion }).eq('id', user.id)

    // Desactivar todos sus eventos
    await supabase.from('eventos').update({ activo: false }).eq('organizadora_id', user.id)

    // Email al usuario con link para cancelar
    const cancelUrl = `https://nowear.es/cancelar-eliminacion?uid=${user.id}`
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'cuenta_pendiente_eliminacion',
        emailInvitada: user.email,
        nombreInvitada: nombre,
        cancelUrl,
        fechaEliminacion: new Date(fechaEliminacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      })
    })

    // Email a admin
    await fetch('/api/admin/nuevousuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'eliminacion_solicitada',
        email: user.email,
        nombre,
        fechaEliminacion
      })
    })

    setEliminando(false)
    setModalEliminar(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleCancelarEliminacion() {
    setCancelando(true)
    await fetch('/api/admin/cancelareliminar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    })
    await supabase.from('profiles').update({ pending_deletion_at: null }).eq('id', user.id)
    await supabase.from('eventos').update({ activo: true }).eq('organizadora_id', user.id)
    setProfile(prev => ({ ...prev, pending_deletion_at: null }))
    setCancelando(false)
    setMensaje('Eliminación cancelada. Tu cuenta sigue activa.')
    setTimeout(() => setMensaje(''), 4000)
  }

  function getNombreCompleto() {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    return profile?.nombre || user?.email || ''
  }

  function iniciales(n) {
    if (!n) return '?'
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  }

  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}
  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>...</div>

  const pendienteEliminacion = !!profile?.pending_deletion_at
  const fechaEliminacionStr = profile?.pending_deletion_at
    ? new Date(profile.pending_deletion_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <>
      {modalEliminar && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.6)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
          <div style={{background:'#FFFFFF',borderRadius:'12px',padding:'2rem',maxWidth:'420px',width:'100%',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'}}>
            <div style={{fontSize:'1.75rem',marginBottom:'0.75rem',textAlign:'center'}}>⚠️</div>
            <h3 style={{fontSize:'1rem',fontWeight:700,color:'#0A0A0A',marginBottom:'0.5rem',textAlign:'center'}}>¿Eliminar tu cuenta?</h3>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#555552',lineHeight:1.7,marginBottom:'1.5rem',textAlign:'center'}}>
              Tu cuenta y todos tus eventos se eliminarán definitivamente el <strong>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'})}</strong>. Tienes 30 días para cancelarlo.
            </p>
            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Confirma tu email para continuar</label>
              <input type="email" placeholder={user?.email} value={emailConfirm} onChange={e => setEmailConfirm(e.target.value)}
                style={{...inputStyle, borderColor: errorEliminar ? '#F07987' : '#E0E0DC'}}/>
              {errorEliminar && <p style={{fontSize:'0.72rem',color:'#F07987',marginTop:'0.35rem'}}>{errorEliminar}</p>}
            </div>
            <div style={{display:'flex',gap:'0.75rem'}}>
              <button onClick={() => { setModalEliminar(false); setEmailConfirm(''); setErrorEliminar('') }}
                style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,background:'transparent',color:'#888884',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px'}}>
                Cancelar
              </button>
              <button onClick={handleSolicitarEliminacion} disabled={eliminando}
                style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,background:'#F07987',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',opacity:eliminando?0.6:1}}>
                {eliminando ? 'Procesando...' : 'Eliminar mi cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cuenta-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
        <div className="cuenta-sidebar"><Sidebar activo="/dashboard/perfil" /></div>
        <main className="cuenta-main" style={{padding:'3rem',paddingBottom:'6rem',maxWidth:'680px'}}>
          <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('subtitulo')}</p>
          </div>

          {pendienteEliminacion && (
            <div style={{marginBottom:'2rem',padding:'1.25rem',background:'#FFF0F1',border:'1px solid #F07987',borderRadius:'8px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:600,color:'#F07987',marginBottom:'0.35rem'}}>Cuenta pendiente de eliminación</p>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#555552',lineHeight:1.7,marginBottom:'1rem'}}>
                Tu cuenta se eliminará definitivamente el <strong>{fechaEliminacionStr}</strong>. Si cambias de opinión, cancela el proceso ahora.
              </p>
              <button onClick={handleCancelarEliminacion} disabled={cancelando}
                style={{padding:'0.65rem 1.5rem',fontSize:'0.75rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:cancelando?0.6:1}}>
                {cancelando ? 'Cancelando...' : 'Cancelar eliminación'}
              </button>
            </div>
          )}

          <div style={{display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'2.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:600,flexShrink:0}}>
              {iniciales(getNombreCompleto())}
            </div>
            <div>
              <div style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.2rem'}}>{getNombreCompleto()}</div>
              <div style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{user?.email}</div>
            </div>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={labelStyle}>{t('nombre')}</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle}/>
          </div>

          <div style={{marginBottom:'2.5rem'}}>
            <label style={labelStyle}>{t('email')}</label>
            <input type="email" value={user?.email || ''} disabled style={{...inputStyle,background:'#F7F7F5',color:'#888884',cursor:'not-allowed'}}/>
            <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'0.4rem'}}>{t('emailNoCambia')}</p>
          </div>

          <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
            <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('notificaciones')}</h2>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>{t('notificacionesSub')}</p>
            {[
              {label:t('notifLookLabel'), sub:t('notifLookSub'), val:notifLook, set:setNotifLook},
              {label:t('notifConflictoLabel'), sub:t('notifConflictoSub'), val:notifConflicto, set:setNotifConflicto},
            ].map((item,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem',border:'1px solid #E0E0DC',background:'#FFFFFF',marginBottom:'0.75rem',borderRadius:'8px'}}>
                <div>
                  <div style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A',marginBottom:'0.2rem'}}>{item.label}</div>
                  <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>{item.sub}</div>
                </div>
                <button onClick={() => item.set(!item.val)} style={{width:'44px',height:'24px',borderRadius:'12px',border:'none',cursor:'pointer',background:item.val?'#0A0A0A':'#E0E0DC',position:'relative',transition:'background 0.2s',flexShrink:0}}>
                  <span style={{position:'absolute',top:'3px',left:item.val?'23px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'#FFFFFF',transition:'left 0.2s'}}></span>
                </button>
              </div>
            ))}
          </div>

          {mensaje && <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{mensaje}</p>}

          <button onClick={handleGuardar} disabled={guardando} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'4rem',opacity:guardando?0.6:1,borderRadius:'4px'}}>
            {guardando ? t('guardando') : t('guardar')}
          </button>

          <div style={{borderTop:'1px solid #E0E0DC',paddingTop:'2rem'}}>
            <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('zonaRiesgo')}</h2>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>{t('zonaRiesgoSub')}</p>
            {!pendienteEliminacion ? (
              <button onClick={() => setModalEliminar(true)} style={{padding:'0.9rem 2rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#C4917C',border:'1px solid #C4917C',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                {t('eliminarCuenta')}
              </button>
            ) : (
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
                Ya has solicitado la eliminación de tu cuenta. Se eliminará el <strong>{fechaEliminacionStr}</strong>.
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  )
}