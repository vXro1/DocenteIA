const URL_BASE = import.meta.env.VITE_API_URL ?? '/api'
const CLAVE_TOKEN = 'docentia.token'

let alExpirarSesion = () => {}

/** Error de la API con el formato ErrorResponse del backend: { mensaje, errores }. */
export class ApiError extends Error {
  constructor(status, mensaje, errores = {}) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.errores = errores
  }
}

export function leerToken() {
  try {
    return sessionStorage.getItem(CLAVE_TOKEN)
  } catch {
    return null
  }
}

export function guardarToken(token) {
  try {
    if (token) sessionStorage.setItem(CLAVE_TOKEN, token)
    else sessionStorage.removeItem(CLAVE_TOKEN)
  } catch {
    // Sin almacenamiento disponible la sesión dura lo que la pestaña.
  }
}

/** Registra qué hacer cuando el backend responde 401 a una petición autenticada. */
export function alCerrarSesionPorExpiracion(callback) {
  alExpirarSesion = callback
}

async function leerCuerpo(respuesta) {
  const texto = await respuesta.text()
  if (!texto) return null
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

/**
 * Hace una petición JSON a la API. Devuelve null en 204 y lanza ApiError si la respuesta no es ok.
 */
export async function peticion(ruta, { metodo = 'GET', cuerpo, publica = false } = {}) {
  const cabeceras = { Accept: 'application/json' }
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
  const token = leerToken()
  if (token && !publica) cabeceras.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
  }

  if (respuesta.status === 204) return null

  const datos = await leerCuerpo(respuesta)
  if (respuesta.ok) return datos

  if (respuesta.status === 401 && !publica) alExpirarSesion()
  throw new ApiError(
    respuesta.status,
    datos?.mensaje ?? 'Ocurrió un error inesperado. Intenta de nuevo.',
    datos?.errores ?? {},
  )
}

export const api = {
  get: (ruta) => peticion(ruta),
  post: (ruta, cuerpo, opciones) => peticion(ruta, { metodo: 'POST', cuerpo, ...opciones }),
  put: (ruta, cuerpo) => peticion(ruta, { metodo: 'PUT', cuerpo }),
  delete: (ruta) => peticion(ruta, { metodo: 'DELETE' }),
}
