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

/** Todos los periodos académicos, para elegir cuál consultar. */
export function listarPeriodos() {
  return api.get('/periodos-academicos')
}

/**
 * Las cuatro etapas del periodo activo con sus fechas y si hoy están abiertas.
 * Devuelve [] si no hay periodo activo (409).
 */
export async function obtenerVentanasActivas() {
  try {
    return await api.get('/periodos-academicos/activo/ventanas')
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) return []
    throw error
  }
}
