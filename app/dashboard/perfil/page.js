'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../components/Sidebar'

export default function Perfil() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [nombre, setNombre] = useState('')
  const [notifLook, setNotifLook] = useState(false)
  const [notifConflicto, setNotifConflicto] = useState(false)

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
    setGuardando(true)
    setMensaje('')
    await supabase.from('profiles').update({
      nombre, notif_look: notifLook, notif_conflicto: notifConflicto
    }).eq('id', user.id)
    setGuardando(false)
    setMensaje('Cambios guardados correctamente.')
    setTimeout(() => setMensaje(''), 3000)
  }

  async function handleEliminarCuenta() {
    if (!confirm('¿Segura que quieres eliminar tu cuenta? Esta acción es irreversible.')) return
    if (!confirm('Última confirmación: ¿eliminar cuenta permanentemente?')) return
    setEliminando(true)
    await supabase.from('eventos').delete().eq('organizadora_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
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

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Cargando...</div>

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <Sidebar activo="/dashboard/perfil" />
      <main style={{padding:'3rem',maxWidth:'680px'}}>
        <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Perfil</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Gestiona tu información personal y preferencias</p>
        </div>

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
          <label style={labelStyle}>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle}/>
        </div>

        <div style={{marginBottom:'2.5rem'}}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={user?.email || ''} disabled style={{...inputStyle,background:'#F7F7F5',color:'#888884',cursor:'not-allowed'}}/>
          <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'0.4rem'}}>El email no se puede cambiar.</p>
        </div>

        <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>Notificaciones por email</h2>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>Elige cuándo quieres recibir avisos en tu bandeja de entrada.</p>
          {[
            {label:'Nueva invitada registra un look', sub:'Te avisamos cada vez que alguien registre su outfit en tu evento.', val:notifLook, set:setNotifLook},
            {label:'Conflicto detectado', sub:'Te avisamos si dos invitadas registran el mismo look.', val:notifConflicto, set:setNotifConflicto},
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
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <div style={{borderTop:'1px solid #E0E0DC',paddingTop:'2rem'}}>
          <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>Zona de peligro</h2>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>Esta acción es permanente e irreversible.</p>
          <button onClick={handleEliminarCuenta} disabled={eliminando} style={{padding:'0.9rem 2rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#C4917C',border:'1px solid #C4917C',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:eliminando?0.6:1,borderRadius:'4px'}}>
            {eliminando ? 'Eliminando...' : 'Eliminar mi cuenta'}
          </button>
        </div>
      </main>
    </div>
  )
}
