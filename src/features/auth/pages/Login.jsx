import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import robotSaludo from '../../../assets/ilustraciones/robot-saludo.svg'
import { Boton } from '../../../shared/components/ui/Boton/Boton.jsx'
import { rutaInicioDelRol } from '../../../app/rutasPorRol.js'
import { useSesion } from '../sesionContext.js'
import './Login.css'

export default function Login() {
  const { usuario, entrar } = useSesion()
  const ubicacion = useLocation()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  // Al abrirse la sesión, vuelve a la ruta protegida de origen o al inicio del rol.
  if (usuario) return <Navigate to={ubicacion.state?.desde ?? rutaInicioDelRol(usuario.rol)} replace />

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await entrar(correo.trim(), contrasena)
    } catch (fallo) {
      setError(fallo)
      setEnviando(false)
    }
  }

  const errorCampo = (campo) => error?.errores?.[campo]

  return (
    <div className="login">
      <section className="login__marca">
        <div className="login__logo">
          <span aria-hidden="true">DA</span>
          <strong>DOCENTIA</strong>
        </div>
        <img src={robotSaludo} alt="" aria-hidden="true" className="login__ilustracion" />
        <h1 className="login__titulo">Evaluación docente</h1>
        <p className="login__texto">
          Corporación Universitaria Autónoma del Cauca. Resultados, calificaciones y compromisos de
          mejora en un solo lugar.
        </p>
      </section>

      <section className="login__panel">
        <form className="login__formulario" onSubmit={manejarEnvio} noValidate>
          <h2 className="login__formulario-titulo">Iniciar sesión</h2>
          <p className="login__formulario-ayuda">Usa tu correo institucional.</p>

          {error && !Object.keys(error.errores ?? {}).length && (
            <div className="login__error" role="alert">
              {error.message}
            </div>
          )}

          <div className="login__campo">
            <label htmlFor="correo" className="rotulo">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              autoComplete="username"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              aria-invalid={Boolean(errorCampo('correo'))}
              aria-describedby={errorCampo('correo') ? 'correo-error' : undefined}
              placeholder="nombre@uniautonoma.edu.co"
              required
            />
            {errorCampo('correo') && (
              <span id="correo-error" className="login__error-campo">
                {errorCampo('correo')}
              </span>
            )}
          </div>

          <div className="login__campo">
            <label htmlFor="contrasena" className="rotulo">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              aria-invalid={Boolean(errorCampo('contrasena'))}
              aria-describedby={errorCampo('contrasena') ? 'contrasena-error' : undefined}
              required
            />
            {errorCampo('contrasena') && (
              <span id="contrasena-error" className="login__error-campo">
                {errorCampo('contrasena')}
              </span>
            )}
          </div>

          <Boton type="submit" bloque disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Boton>
        </form>
      </section>
    </div>
  )
}
