import { NavLink } from 'react-router-dom'
import { useSesion } from '../../../../features/auth/sesionContext.js'
import { ETIQUETA_ROL, ROLES } from '../../../constants/dominio.js'
import { iniciales } from '../../../utils/formatters.js'
import './Sidebar.css'

const NAVEGACION = {
  [ROLES.DOCENTE]: [{ ruta: '/mi-evaluacion', etiqueta: 'Mi evaluación' }],
  [ROLES.COORDINADOR]: [{ ruta: '/docentes', etiqueta: 'Docentes' }],
  [ROLES.VICERRECTOR]: [{ ruta: '/docentes', etiqueta: 'Docentes' }],
}

export function Sidebar() {
  const { usuario, cerrarSesion } = useSesion()
  const enlaces = NAVEGACION[usuario.rol] ?? []

  return (
    <aside className="sidebar">
      <div className="sidebar__marca">
        <span className="sidebar__logo" aria-hidden="true">DA</span>
        <span className="sidebar__nombre">
          <strong>DOCENTIA</strong>
          <span>Evaluación docente</span>
        </span>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        <span className="sidebar__seccion">{ETIQUETA_ROL[usuario.rol]}</span>
        {enlaces.map((enlace) => (
          <NavLink key={enlace.ruta} to={enlace.ruta} className="sidebar__enlace">
            <span className="sidebar__punto" aria-hidden="true" />
            {enlace.etiqueta}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__usuario">
        <span className="sidebar__avatar" aria-hidden="true">
          {iniciales(usuario.nombreCompleto)}
        </span>
        <span className="sidebar__datos">
          <span className="sidebar__usuario-nombre">{usuario.nombreCompleto}</span>
          <span className="sidebar__usuario-meta">{usuario.correo}</span>
        </span>
        <button type="button" className="sidebar__salir" onClick={cerrarSesion}>
          Salir
        </button>
      </div>
    </aside>
  )
}
