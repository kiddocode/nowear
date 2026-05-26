'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'
import ModalPlanes from '../../../components/ModalPlanes'

export default function Facturacion() {
  const router = useRouter()
  const t = useTranslations('facturacion')
  const [user, setUser] = useState(null)
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalPlanes, setModalPlanes] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: evs } = await supabase.from('eventos').select('*').eq('organizadora_id', user.id).order('created_at', { ascending: false })
      setEventos(evs || [])
      setLoading(false)
    }
    cargar()
  }, [])

  const PRECIOS = { basico: 9, estandar: 19, premium: 29 }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>...</div>

  return (
    <div className="cuenta-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div className="cuenta-sidebar"><Sidebar activo="/dashboard/facturacion" /></div>
      <main className="cuenta-main" style={{padding:'3rem',paddingBottom:'6rem',maxWidth:'760px'}}>

        {/* HEADER */}
        <div className="facturacion-header" style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('subtitulo')}</p>
          </div>
          <button onClick={() => { setEventoSeleccionado(null); setModalPlanes(true) }}
            style={{fontSize:'0.72rem',fontWeight:600,padding:'0.75rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',whiteSpace:'nowrap'}}>
            {t('verPlanes')}
          </button>
        </div>

        {eventos.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem',border:'1px dashed #E0E0DC',color:'#888884',fontSize:'0.75rem',borderRadius:'8px'}}>
            {t('sinEventos')}
          </div>
        ) : (
          <>
            {/* TABLA DESKTOP */}
            <div className="facturacion-tabla-desktop" style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 120px',padding:'0.75rem 1.5rem',borderBottom:'1px solid #E0E0DC',background:'#F7F7F5'}}>
                {[t('colEvento'),t('colPlan'),t('colImporte'),t('colFecha'),''].map((h,i) => (
                  <div key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552'}}>{h}</div>
                ))}
              </div>
              {eventos.map((ev,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 120px',padding:'1rem 1.5rem',borderBottom:i<eventos.length-1?'1px solid #E0E0DC':'none',alignItems:'center',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                  <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{ev.nombre}</div>
                  <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',textTransform:'capitalize'}}>{ev.plan}</div>
                  <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{PRECIOS[ev.plan] ? `${PRECIOS[ev.plan]}€` : 'N/A'}</div>
                  <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>
                    {ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}) : 'N/A'}
                  </div>
                  <div>
                    {ev.plan !== 'premium' && ev.plan !== 'enterprise' && (
                      <button onClick={() => { setEventoSeleccionado(ev); setModalPlanes(true) }}
                        style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.4rem 0.75rem',background:'transparent',color:'#C4917C',border:'1px solid #C4917C',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',whiteSpace:'nowrap'}}>
                        {t('mejorar')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{padding:'1rem 1.5rem',borderTop:'1px solid #E0E0DC',display:'flex',justifyContent:'flex-end',background:'#F7F7F5'}}>
                <div style={{fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>
                  {t('total')}: {eventos.reduce((acc,ev) => acc + (PRECIOS[ev.plan] || 0), 0)}€
                </div>
              </div>
            </div>

            {/* CARDS MÓVIL */}
            <div className="facturacion-cards-mobile" style={{display:'none'}}>
              {eventos.map((ev,i) => (
                <div key={i} style={{padding:'1.25rem',border:'1px solid #E0E0DC',borderRadius:'12px',background:'#FFFFFF'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                    <div style={{fontSize:'0.9rem',fontWeight:600,color:'#0A0A0A',flex:1,marginRight:'1rem'}}>{ev.nombre}</div>
                    <div style={{fontSize:'0.9rem',fontWeight:700,color:'#0A0A0A',flexShrink:0}}>{PRECIOS[ev.plan] ? `${PRECIOS[ev.plan]}€` : 'N/A'}</div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',textTransform:'capitalize',marginBottom:'0.25rem'}}>{ev.plan}</div>
                      <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                        {ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}) : 'N/A'}
                      </div>
                    </div>
                    {ev.plan !== 'premium' && ev.plan !== 'enterprise' && (
                      <button onClick={() => { setEventoSeleccionado(ev); setModalPlanes(true) }}
                        style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.5rem 0.85rem',background:'transparent',color:'#C4917C',border:'1px solid #C4917C',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                        {t('mejorar')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{padding:'1rem 0',textAlign:'right',fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A',borderTop:'1px solid #E0E0DC',marginTop:'0.5rem'}}>
                {t('total')}: {eventos.reduce((acc,ev) => acc + (PRECIOS[ev.plan] || 0), 0)}€
              </div>
            </div>
          </>
        )}

        <div style={{marginTop:'2rem',padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',lineHeight:1.7}}>
            {t('facturaInfo')}
          </p>
        </div>
      </main>

      {modalPlanes && (
        <ModalPlanes
          onClose={() => { setModalPlanes(false); setEventoSeleccionado(null) }}
          planActual={eventoSeleccionado?.plan}
          eventoId={eventoSeleccionado?.id}
        />
      )}
    </div>
  )
}