import { api } from '../../../services/api.js'

/** Programas académicos; con `idFacultad` solo los de esa facultad. */
export function listarProgramas(idFacultad) {
  const consulta = idFacultad ? `?idFacultad=${encodeURIComponent(idFacultad)}` : ''
  return api.get(`/programas${consulta}`)
}
