'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COLORES = [
  {hex:'#F5C6D0',nombre:'Rosa palo'},
  {hex:'#E8C4D4',nombre:'Palo de rosa'},
  {hex:'#D4A8D4',nombre:'Lila'},
  {hex:'#6B3FA0',nombre:'Morado'},
  {hex:'#D4006A',nombre:'Fucsia'},
  {hex:'#A8C4E0',nombre:'Azul cielo'},
  {hex:'#8B9DC3',nombre:'Azul marino'},
  {hex:'#A8D4B4',nombre:'Verde menta'},
  {hex:'#4A7C59',nombre:'Verde botella'},
  {hex:'#6B7C3A',nombre:'Verde oliva'},
  {hex:'#F5E6C8',nombre:'Beige'},
  {hex:'#D4B896',nombre:'Camel'},
  {hex:'#C4956A',nombre:'Marrón claro'},
  {hex:'#8B4513',nombre:'Marrón'},
  {hex:'#E8E8E4',nombre:'Crudo'},
  {hex:'#F5D6A0',nombre:'Amarillo mostaza'},
  {hex:'#E07A5F',nombre:'Terracota'},
  {hex:'#C4917C',nombre:'Teja'},
  {hex:'#D4A8A8',nombre:'Nude'},
  {hex:'#6B1A2A',nombre:'Granate'},
  {hex:'#2C2C2C',nombre:'Negro'},
  {hex:'#888884',nombre:'Gris'},
  {hex:'#FFFFFF',nombre:'Blanco'},
  {hex:'#C8A86B',nombre:'Dorado'},
  {hex:'#C0C0C0',nombre:'Plateado'},
  {hex:'#E0E0DC',nombre:'Otro'},
]

export default function InvitadaPage() {
  const { slug } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [nombre, setNombre] = useState('')
  const [colores, setColores] = useState([])
  const [estado, setEstado] = useState('confirmado')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)

  const [marca1, setMarca1] = useState('')
  const [modelo1, setModelo1] = useState('')
  const [tipo1, setTipo1] = useState('')
  const [referencia1, setReferencia1] = useState('')

  const [marca2, setMarca2] = useState('')
  const [modelo2, setModelo2] = useState('')
  const [tipo2, setTipo2] = useState('')
  const [referencia2, setReferencia2] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('eventos').select('*').eq('slug', slug).single()
      setEvento(data || null)
      setLoading(false)
    }
    cargar()
  }, [slug])

  function toggleColor(hex) {
    if (colores.includes(hex)) {
      setColores(colores.filter(c => c !== hex))
    } else {
      if (colores.length >= 2) return
      setColores([...colores, hex])
    }
  }

  async function handleEnviar() {
    setError('')
    if (!nombre || colores.length === 0 || !marca1 || !modelo1 || !tipo1 || !estado) {
      setError('Rellena todos los campos obligatorios')
      return
    }
    setEnviando(true)

    let foto_url = null
    if (foto) {
      const ext = foto.name.split('.').pop()
      const fileName = `${evento.id}-${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage
        .from('fotos')
        .upload(fileName, foto, { contentType: foto.type })
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(fileName)
        foto_url = urlData.publicUrl
      }
    }

    const prenda2 = marca2 || modelo2 ? {
      marca: marca2 || null,
      modelo: modelo2 || null,
      tipo: tipo2 || null,
      referencia: referencia2 || null
    } : null

    const { error } = await supabase.from('looks').insert({
      evento_id: evento.id,
      nombre_invitada: nombre,
      color_hex: colores[0],
      color_hex_2: colores[1] || null,
      marca: marca1,
      modelo: modelo1,
      tipo: tipo1,
      referencia: referencia1 || null,
      marca2: prenda2?.marca || null,
      modelo2: prenda2?.modelo || null,
      tipo2: prenda2?.tipo || null,
      referencia2: prenda2?.referencia || null,
      estado,
      foto_url
    })

    setEnviando(false)
    if (error) { setError('Error al registrar el look. Inténtalo de nuevo.'); return }
    setEnviado(true)
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Cargando...</div>
  )

  if (!evento) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Evento no encontrado.</div>
  )

  if (enviado) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem',fontWeight:100,color:'#0A0A0A',letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>¡Look registrado!</div>
      <p style={{fontSize:'0.85rem',fontWeight:300,color:'#888884',marginBottom:'2rem',maxWidth:'400px',lineHeight:1.7}}>
        Tu look ha sido registrado para <strong style={{fontWeight:500,color:'#0A0A0A'}}>{evento.nombre}</strong>.
      </p>
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem'}}>
        {colores.map((c,i) => (
          <div key={i} style={{width:'32px',height:'32px',borderRadius:'50%',background:c,border:'1px solid #E0E0DC'}}></div>
        ))}
      </div>
      <button
        onClick={() => { setEnviado(false); setNombre(''); setColores([]); setMarca1(''); setModelo1(''); setTipo1(''); setReferencia1(''); setMarca2(''); setModelo2(''); setTipo2(''); setReferencia2(''); setEstado('confirmado'); setFoto(null); setFotoPreview(null) }}
        style={{fontSize:'0.72rem',fontWeight:500,padding:'0.75rem 2rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}
      >
        Registrar otro look
      </button>
    </div>
  )

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>

      {/* LADO IZQUIERDO */}
      <div style={{background:'#0A0A0A',padding:'4rem',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
        <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'1rem'}}>{evento.tipo}</div>
        <h1 style={{fontSize:'3rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'3rem'}}>
          {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
          {evento.lugar ? ` · ${evento.lugar}` : ''}
        </p>
        <p style={{fontSize:'0.85rem',fontWeight:300,color:'rgba(255,255,255,0.6)',lineHeight:1.8,maxWidth:'380px'}}>
          Registra tu look para que ninguna invitada llegue vestida igual. El sistema detecta coincidencias automáticamente.
        </p>
        {evento.colores_bloqueados && (
          <div style={{marginTop:'2rem',padding:'1rem 1.25rem',background:'rgba(196,145,124,0.15)',border:'1px solid rgba(196,145,124,0.3)'}}>
            <p style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#C4917C',marginBottom:'0.3rem'}}>Colores no disponibles</p>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'rgba(255,255,255,0.6)'}}>{evento.colores_bloqueados}</p>
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      <div style={{padding:'4rem',background:'#FFFFFF',overflowY:'auto'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Tu look</h2>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Registra tu outfit para {evento.nombre}</p>

        {/* NOMBRE */}
        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
            Tu nombre <span style={{color:'#C4917C'}}>*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: María García"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        {/* COLORES */}
        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>
            Color del look <span style={{color:'#C4917C'}}>*</span>
          </label>
          <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.55rem'}}>Selecciona hasta 2 colores</p>
          <select
            onChange={e => { if(e.target.value) toggleColor(e.target.value); e.target.value = '' }}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box',marginBottom:'0.75rem'}}
          >
            <option value="">Selecciona un color...</option>
            {COLORES.filter(c => !colores.includes(c.hex)).map((c,i) => (
              <option key={i} value={c.hex}>{c.nombre}</option>
            ))}
          </select>
          {colores.length > 0 && (
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
              {colores.map((hex,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',border:'1px solid #E0E0DC',background:'#F7F7F5'}}>
                  <div style={{width:'14px',height:'14px',borderRadius:'50%',background:hex,border:'1px solid #E0E0DC',flexShrink:0}}></div>
                  <span style={{fontSize:'0.72rem',fontWeight:300,color:'#0A0A0A'}}>{COLORES.find(c=>c.hex===hex)?.nombre}</span>
                  <button onClick={() => toggleColor(hex)} style={{background:'none',border:'none',cursor:'pointer',color:'#888884',fontSize:'0.75rem',padding:'0',lineHeight:1,marginLeft:'0.25rem'}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRENDA 1 */}
        <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC'}}>
          <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1.25rem'}}>
            Prenda 1 <span style={{color:'#C4917C'}}>*</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Marca <span style={{color:'#C4917C'}}>*</span></label>
              <input type="text" placeholder="Ej: Zara" value={marca1} onChange={e => setMarca1(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Tipo <span style={{color:'#C4917C'}}>*</span></label>
              <select value={tipo1} onChange={e => setTipo1(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}}>
                <option value="">Selecciona...</option>
                <option>Vestido corto</option>
                <option>Vestido midi</option>
                <option>Vestido largo</option>
                <option>Falda</option>
                <option>Pantalón</option>
                <option>Top</option>
                <option>Blusa</option>
                <option>Traje</option>
                <option>Conjunto</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Modelo <span style={{color:'#C4917C'}}>*</span></label>
            <input type="text" placeholder="Nombre del vestido o modelo" value={modelo1} onChange={e => setModelo1(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Referencia o link <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span>
            </label>
            <input type="text" placeholder="URL o referencia del producto" value={referencia1} onChange={e => setReferencia1(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>

        {/* PRENDA 2 */}
        <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC'}}>
          <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'1.25rem'}}>
            Prenda 2 <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Marca</label>
              <input type="text" placeholder="Ej: Mango" value={marca2} onChange={e => setMarca2(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Tipo</label>
              <select value={tipo2} onChange={e => setTipo2(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}}>
                <option value="">Selecciona...</option>
                <option>Vestido corto</option>
                <option>Vestido midi</option>
                <option>Vestido largo</option>
                <option>Falda</option>
                <option>Pantalón</option>
                <option>Top</option>
                <option>Blusa</option>
                <option>Traje</option>
                <option>Conjunto</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Modelo</label>
            <input type="text" placeholder="Nombre del vestido o modelo" value={modelo2} onChange={e => setModelo2(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Referencia o link</label>
            <input type="text" placeholder="URL o referencia del producto" value={referencia2} onChange={e => setReferencia2(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>

        {/* FOTO */}
        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
            Foto del look <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span>
          </label>
          <div
            onClick={() => document.getElementById('foto-input').click()}
            style={{border:'1px dashed #E0E0DC',padding:'1.5rem',textAlign:'center',cursor:'pointer',background:fotoPreview?'transparent':'#F7F7F5'}}
          >
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" style={{maxHeight:'200px',maxWidth:'100%',objectFit:'contain'}}/>
            ) : (
              <div>
                <div style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'0.25rem'}}>Toca para subir una foto de tu look</div>
                <div style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA'}}>JPG, PNG o WEBP</div>
              </div>
            )}
          </div>
          <input id="foto-input" type="file" accept="image/*" style={{display:'none'}}
            onChange={e => { const file = e.target.files[0]; if(file){ setFoto(file); setFotoPreview(URL.createObjectURL(file)) } }}/>
        </div>

        {/* ESTADO */}
        <div style={{marginBottom:'2rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
            Estado <span style={{color:'#C4917C'}}>*</span>
          </label>
          <div style={{display:'flex',gap:'1rem'}}>
            {[{val:'confirmado',label:'Confirmado'},{val:'prereservado',label:'Prereservado'}].map(e => (
              <button key={e.val} onClick={() => setEstado(e.val)}
                style={{flex:1,padding:'0.75rem',fontSize:'0.72rem',fontWeight:500,fontFamily:'Poppins,sans-serif',cursor:'pointer',border:'1px solid',borderColor:estado===e.val?'#0A0A0A':'#E0E0DC',background:estado===e.val?'#0A0A0A':'#FFFFFF',color:estado===e.val?'#FFFFFF':'#888884'}}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{fontSize:'0.72rem',fontWeight:300,color:'#C4917C',marginBottom:'1rem'}}>{error}</p>}

        <button onClick={handleEnviar} disabled={enviando}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:enviando?0.6:1}}>
          {enviando ? 'Registrando...' : 'Registrar mi look →'}
        </button>
      </div>
    </div>
  )
}