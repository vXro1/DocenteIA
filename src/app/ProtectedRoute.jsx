import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '../features/auth/sesionContext.js'
import { Cargando } from '../shared/components/ui/EstadoVista/EstadoVista.jsx'
import { PaginaSinAcceso } from './PaginasSistema.jsx'

/**
 * Sin sesión redirige a /login recordando la ruta de origen. Con sesión pero sin el rol
 * requerido muestra "Sin acceso". La autorización real la hace el backend.
 */
export function ProtectedRoute({ rolesPermitidos }) {
  const { usuario, validando } = useSesion()
  const ubicacion = useLocation()

  if (validando) {
    return (
      <div className="pagina">
        <Cargando texto="Verificando tu sesión" bloques={1} />
      </div>
    )
  }

  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) return <PaginaSinAcceso />

  return <Outlet />
}
