import { createContext, useContext } from 'react'

export const PeriodoContext = createContext({ periodo: null, cargando: false })

export function usePeriodoActivo() {
  return useContext(PeriodoContext)
}
