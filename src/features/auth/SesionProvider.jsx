import { useCallback, useEffect, useMemo, useState } from 'react'
import { alCerrarSesionPorExpiracion, guardarToken, leerToken } from '../../services/api.js'
import { iniciarSesion, obtenerSesionActual } from './services/authService.js'
import { SesionContext } from './sesionContext.js'

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [validando, setValidando] = useState(() => Boolean(leerToken()))

  const cerrarSesion = useCallback(() => {
    guardarToken(null)
    setUsuario(null)
  }, [])

  useEffect(() => {
    alCerrarSesionPorExpiracion(cerrarSesion)
  }, [cerrarSesion])

  useEffect(() => {
    if (!leerToken()) return
    let vigente = true
    obtenerSesionActual()
      .then((sesion) => vigente && setUsuario(sesion))
      .catch(() => vigente && cerrarSesion())
      .finally(() => vigente && setValidando(false))
    return () => {
      vigente = false
    }
  }, [cerrarSesion])

  const entrar = useCallback(async (correo, contrasena) => {
    const { token, usuario: sesion } = await iniciarSesion(correo, contrasena)
    guardarToken(token)
    setUsuario(sesion)
    return sesion
  }, [])

  const valor = useMemo(
    () => ({ usuario, validando, entrar, cerrarSesion }),
    [usuario, validando, entrar, cerrarSesion],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
