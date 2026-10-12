import { ROLES } from '../shared/constants/dominio.js'

export function rutaInicioDelRol(rol) {
  return rol === ROLES.DOCENTE ? '/mi-evaluacion' : '/docentes'
}
