import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../features/auth/pages/Login.jsx'
import { SesionProvider } from '../features/auth/SesionProvider.jsx'
import { useSesion } from '../features/auth/sesionContext.js'
import CalificarDocente from '../features/calificaciones/pages/CalificarDocente.jsx'
import Docentes from '../features/docentes/pages/Docentes.jsx'
import ExpedienteDocente from '../features/expedientes/pages/ExpedienteDocente.jsx'
import MiEvaluacion from '../features/expedientes/pages/MiEvaluacion.jsx'
import { AppLayout } from '../shared/components/layout/AppLayout/AppLayout.jsx'
import { ROLES } from '../shared/constants/dominio.js'
import { PaginaNoEncontrada } from './PaginasSistema.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { rutaInicioDelRol } from './rutasPorRol.js'

const GESTION = [ROLES.COORDINADOR, ROLES.VICERRECTOR]

function Inicio() {
  const { usuario, validando } = useSesion()
  if (validando) return null
  return <Navigate to={usuario ? rutaInicioDelRol(usuario.rol) : '/login'} replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<ProtectedRoute rolesPermitidos={[ROLES.DOCENTE]} />}>
                <Route path="/mi-evaluacion" element={<MiEvaluacion />} />
              </Route>

              <Route element={<ProtectedRoute rolesPermitidos={GESTION} />}>
                <Route path="/docentes" element={<Docentes />} />
                <Route path="/docentes/:idDocente" element={<ExpedienteDocente />} />
                <Route path="/docentes/:idDocente/calificar" element={<CalificarDocente />} />
              </Route>

              <Route path="*" element={<PaginaNoEncontrada />} />
            </Route>
          </Route>
        </Routes>
      </SesionProvider>
    </BrowserRouter>
  )
}
