export default function EventoCrisPablo() {
  return (
    <div>
      {/* HERO */}
      <div style={{background:'#0A0A0A',padding:'4rem 3rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
        <div>
          <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.65rem'}}>Boda · Plan regalo</div>
          <h1 style={{fontSize:'3rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.4rem'}}>Cris & Pablo</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>10 de octubre de 2026 · Zahara de los Atunes</p>
        </div>
        <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'1.25rem 1.5rem',minWidth:'280px'}}>
          <p style={{fontSize:'0.56rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Link para invitadas</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
            <span style={{fontSize:'0.8rem',fontWeight:300,color:'#FFFFFF'}}>nowear.es/cris-pablo</span>
            <button style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C4917C',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Copiar</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',padding:'0 3rem',borderBottom:'1px solid #E0E0DC',background:'#FFFFFF',position:'sticky',top:'68px',zIndex:100,overflowX:'auto'}}>
        {['Looks registrados','Conflictos','Colores bloqueados','Ajustes'].map((tab,i)=>(
          <button key={i} style={{padding:'1.25rem 0',marginRight:'2rem',fontSize:'0.7rem',fontWeight:i===0?600:400,color:i===0?'#0A0A0A':'#888884',cursor:'pointer',borderBottom:i===0?'2px solid #0A0A0A':'2px solid transparent',background:'none',border:'none',borderBottom:i===0?'2px solid #0A0A0A':'none',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',paddingBottom:'1.25rem',paddingTop:'1.25rem'}}>
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{padding:'2.5rem 3rem'}}>
        
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'2.5rem'}}>
          {[
            {n:'12',l:'Looks registrados'},
            {n:'3',l:'Prereservados'},
            {n:'0',l:'Conflictos'},
            {n:'142',l:'Días restantes'},
          ].map((s,i)=>(
            <div key={i} style={{background:'#F7F7F5',padding:'1.5rem 2rem'}}>
              <div style={{fontSize:'2rem',fontWeight:100,color:'#0A0A0A',lineHeight:1,marginBottom:'0.3rem',letterSpacing:'-0.03em'}}>{s.n}</div>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* TABLA */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <span style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>12 looks registrados</span>
          <button style={{fontSize:'0.62rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Exportar lista</button>
        </div>

        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              {['Color','Nombre','Marca','Modelo','Referencia','Tipo','Estado'].map((h,i)=>(
                <th key={i} style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.75rem 1rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {hex:'#F5C6D0',nombre:'Ana P.',marca:'Mango',modelo:'Vestido Rosalía',ref:'MNG-2026-4521',tipo:'Midi',estado:'Confirmado',ok:true},
              {hex:'#D4A8D4',nombre:'Laura M.',marca:'Zara',modelo:'Col. Primavera 26',ref:'—',tipo:'Largo',estado:'Confirmado',ok:true},
              {hex:'#E07A5F',nombre:'Sofía R.',marca:'Sandro',modelo:'Vestido Cannes',ref:'sandro.com/...',tipo:'Midi',estado:'Prereservado',ok:false},
              {hex:'#A8C4E0',nombre:'María G.',marca:'& Other Stories',modelo:'Blue Haze Dress',ref:'—',tipo:'Largo',estado:'Confirmado',ok:true},
            ].map((row,i)=>(
              <tr key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
                <td style={{padding:'0.9rem 1rem'}}>
                  <span style={{width:'18px',height:'18px',borderRadius:'50%',background:row.hex,border:'1px solid #E0E0DC',display:'inline-block',verticalAlign:'middle'}}></span>
                </td>
                <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{row.nombre}</td>
                <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.marca}</td>
                <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.modelo}</td>
                <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.ref}</td>
                <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo}</td>
                <td style={{padding:'0.9rem 1rem'}}>
                  <span style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',background:row.ok?'#EEF4E8':'#F5EDE8',color:row.ok?'#4A6B42':'#C4917C'}}>{row.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
