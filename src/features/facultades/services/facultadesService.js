import { api } from '../../../services/api.js'

/** Facultades dentro del alcance del usuario (el coordinador solo recibe la suya). */
export function listarFacultades() {
  return api.get('/facultades')
}
