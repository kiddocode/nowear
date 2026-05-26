'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'

export default function Ayuda() {
  const router = useRouter()
  const t = useTranslations('ayuda')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    cargar()
  }, [])

  const preguntas = t.raw('preguntas')

  return (
    <div className="cuenta-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div className="cuenta-sidebar"><Sidebar activo="/dashboard/ayuda" /></div>
      <main className="cuenta-main" style={{padding:'3rem',paddingBottom:'6rem',maxWidth:'680px'}}>
        <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('subtitulo')}</p>
        </div>

        {preguntas.map((item,i) => (
          <details key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
            <summary style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 0',fontSize:'0.88rem',fontWeight:500,color:'#0A0A0A',cursor:'pointer',listStyle:'none',lineHeight:1.4}}>
              {item.q}
              <span style={{fontSize:'1.2rem',fontWeight:100,color:'#BEBEBA',flexShrink:0,marginLeft:'1rem'}}>+</span>
            </summary>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#555552',lineHeight:2,paddingBottom:'1.25rem'}}>{item.a}</p>
          </details>
        ))}

        <div style={{marginTop:'3rem',padding:'2rem',background:'#0A0A0A'}}>
          <h2 style={{fontSize:'1.1rem',fontWeight:300,color:'#FFFFFF',marginBottom:'0.5rem'}}>{t('masAyuda')}</h2>
          <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'1.25rem',lineHeight:1.7}}>{t('masAyudaSub')}</p>
          <a href="mailto:support@nowear.es" style={{fontSize:'0.78rem',fontWeight:500,color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </div>
      </main>
    </div>
  )
}