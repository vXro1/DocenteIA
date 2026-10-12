import './Boton.css'

/** Botón del maquetado. variante: 'primario' | 'secundario' | 'contorno' | 'enlace' */
export function Boton({ variante = 'primario', bloque = false, className = '', type = 'button', ...props }) {
  const clases = ['boton', `boton--${variante}`, bloque && 'boton--bloque', className]
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={clases} {...props} />
}
