import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { obtenerPeriodoActivo } from '../../../../features/periodos/services/periodosService.js'
import { useFetch } from '../../../hooks/useFetch.js'
import { Sidebar } from '../Sidebar/Sidebar.jsx'
import { PeriodoContext } from './periodoContext.js'
import './AppLayout.css'

/** Estructura de las páginas autenticadas: barra lateral, encabezado (en cada página) y contenido. */
export function AppLayout() {
  const { datos: periodo, cargando } = useFetch(obtenerPeriodoActivo)
  const valor = useMemo(() => ({ periodo, cargando }), [periodo, cargando])

  return (
    <PeriodoContext.Provider value={valor}>
      <div className="app-layout">
        <Sidebar />
        <main className="app-layout__principal">
          <Outlet />
        </main>
      </div>
    </PeriodoContext.Provider>
  )
}
