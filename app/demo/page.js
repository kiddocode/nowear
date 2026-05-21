export default function Demo() {
  return (
    <div>
      {/* HERO */}
      <div style={{background:'#0A0A0A',position:'relative',overflow:'hidden',minHeight:'420px',display:'flex',alignItems:'flex-end',padding:'4rem 3rem 3rem'}}>
        <img
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80"
          alt="Boda"
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.3}}
        />
        <div style={{position:'relative',zIndex:2}}>
          <div style={{fontSize:'3.5rem',fontWeight:100,color:'#FFFFFF',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.5rem'}}>Cris & Pablo</div>
          <div style={{fontSize:'0.65rem',fontWeight:500,letterSpacing:'0.2em',textTransform:'uppercase',color:'#888884'}}>10 · 10 · 2026 · Zahara de los Atunes</div>
        </div>
      </div>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'4rem 2rem'}}>
        <p style={{fontSize:'0.88rem',fontWeight:300,lineHeight:2.1,color:'#888884',marginBottom:'3.5rem',paddingBottom:'2.5rem',borderBottom:'1px solid #E0E0DC'}}>
          Cris ha creado este espacio para que registres tu look antes de la boda. Solo necesitamos la marca, el modelo y el color. El resto sigue siendo tu secreto hasta el día. Si alguien ya lleva lo mismo que tú, te avisamos al instante.
        </p>

        {/* LOOKS REGISTRADOS */}
        <div style={{marginBottom:'3rem'}}>
          <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1.5rem'}}>Looks ya registrados</div>
          {[
            {nombre:'Ana P.',marca:'Mango',tipo:'Midi',color:'Rosa polvos',hex:'#F5C6D0',estado:'Confirmado',ok:true},
            {nombre:'Laura M.',marca:'Zara',tipo:'Largo',color:'Lila',hex:'#D4A8D4',estado:'Confirmado',ok:true},
            {nombre:'Sofía R.',marca:'Sandro',tipo:'Midi',color:'Terracota',hex:'#E07A5F',estado:'Prereservado',ok:false},
          ].map((look,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 0',borderBottom:'1px solid #E0E0DC'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'50%',background:look.hex,border:'1px solid #E0E0DC',flexShrink:0}}></div>
              <div style={{flex:1}}>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A',marginBottom:'0.15rem'}}>{look.nombre}</div>
                <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>{look.marca} · {look.tipo} · {look.color}</div>
              </div>
              <span style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',background:look.ok?'#EEF4E8':'#F5EDE8',color:look.ok?'#4A6B42':'#C4917C'}}>{look.estado}</span>
            </div>
          ))}
        </div>

        {/* FORMULARIO */}
        <h2 style={{fontSize:'2.5rem',fontWeight:100,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1.05,marginBottom:'0.6rem'}}>
          Registra<br/><strong style={{fontWeight:600}}>tu look.</strong>
        </h2>
        <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem',lineHeight:1.8}}>
          Los campos con <span style={{color:'#C4917C'}}>*</span> son obligatorios. El resto es opcional.
        </p>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Tu nombre <span style={{color:'#C4917C'}}>*</span></label>
          <input type="text" placeholder="Como quieras que te vean" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Marca o tienda <span style={{color:'#C4917C'}}>*</span></label>
          <input type="text" placeholder="Zara, Mango, Sandro..." style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Modelo o nombre de la prenda <span style={{color:'#C4917C'}}>*</span></label>
          <input type="text" placeholder="Ej: Vestido Flora, Blazer Linen..." style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Segunda prenda (opcional)</label>
          <input type="text" placeholder="Si es un conjunto, ej: falda, top..." style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Referencia o link (opcional)</label>
          <input type="text" placeholder="Código del artículo o enlace a la tienda" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Tipo de prenda (opcional)</label>
          <select style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none'}}>
            <option value="">Selecciona si quieres...</option>
            <option>Vestido largo</option>
            <option>Vestido midi</option>
            <option>Vestido corto</option>
            <option>Conjunto falda + top</option>
            <option>Conjunto pantalón + top</option>
            <option>Mono / jumpsuit</option>
            <option>Traje</option>
            <option>Otro</option>
          </select>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Color principal (opcional)</label>
          <select style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none'}}>
            <option value="">Selecciona si quieres...</option>
            <option>Rosa polvos</option><option>Rosa fucsia</option><option>Lila / malva</option>
            <option>Morado</option><option>Azul empolvado</option><option>Azul marino</option>
            <option>Verde sage</option><option>Verde esmeralda</option><option>Turquesa</option>
            <option>Arena / camel</option><option>Beige</option><option>Amarillo / mostaza</option>
            <option>Naranja</option><option>Terracota / coral</option><option>Rojo</option>
            <option>Burdeos / ciruela</option><option>Topo / marrón</option><option>Gris plata</option>
            <option>Dorado</option><option>Plateado</option><option>Estampado floral</option>
            <option>Estampado geométrico</option><option>Animal print</option><option>Multicolor</option><option>Otro</option>
          </select>
        </div>

        <div style={{marginBottom:'2rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Foto (opcional)</label>
          <div style={{border:'1.5px dashed #E0E0DC',padding:'2.5rem',textAlign:'center',cursor:'pointer'}}>
            <div style={{fontSize:'1.5rem',color:'#BEBEBA',marginBottom:'0.75rem'}}>↑</div>
            <div style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#3A3A38',marginBottom:'0.25rem'}}>Subir foto del look</div>
            <div style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Solo tú decides si quieres compartirla. Es completamente opcional.</div>
          </div>
        </div>

        <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
          <button style={{flex:1,minWidth:'140px',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Confirmar look</button>
          <button style={{flex:1,minWidth:'140px',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Prereservar</button>
        </div>
        <p style={{fontSize:'0.68rem',fontWeight:300,color:'#888884',lineHeight:1.8,marginTop:'1rem'}}>
          Prereservar significa que has visto el look pero todavía no lo has comprado. Nadie más podrá registrar ese mismo look mientras tengas tu prerreserva activa.
        </p>
      </div>
    </div>
  )
}
