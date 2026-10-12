import { api, ApiError } from '../../../services/api.js'

/** Devuelve el periodo activo, o null si la vicerrectoría no ha activado ninguno (404). */
export async function obtenerPeriodoActivo() {
  try {
    return await api.get('/periodos-academicos/activo')
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
