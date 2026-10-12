import './Panel.css'

/** Tarjeta blanca con borde del maquetado. */
export function Panel({ titulo, descripcion, acciones, children, className = '', ...props }) {
  return (
    <section className={`panel ${className}`} {...props}>
      {(titulo || acciones) && (
        <div className="panel__cabecera">
          <div>
            {titulo && <h2 className="panel__titulo">{titulo}</h2>}
            {descripcion && <p className="panel__descripcion">{descripcion}</p>}
          </div>
          {acciones}
        </div>
      )}
      {children}
    </section>
  )
}
