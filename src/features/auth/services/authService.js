import { api } from '../../../services/api.js'

export function iniciarSesion(correo, contrasena) {
  return api.post('/sesiones', { correo, contrasena }, { publica: true })
}

export function obtenerSesionActual() {
  return api.get('/sesiones/actual')
}
