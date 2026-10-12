import { api } from '../../../services/api.js'

/** Docentes dentro del alcance del usuario. El coordinador siempre recibe los de su facultad. */
export function listarDocentes(idFacultad) {
  const consulta = idFacultad ? `?idFacultad=${encodeURIComponent(idFacultad)}` : ''
  return api.get(`/docentes${consulta}`)
}

export function listarFacultades() {
  return api.get('/facultades')
}
