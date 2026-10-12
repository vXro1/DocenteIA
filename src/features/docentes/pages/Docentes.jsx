import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Encabezado } from '../../../shared/components/layout/Encabezado/Encabezado.jsx'
import { Boton } from '../../../shared/components/ui/Boton/Boton.jsx'
import { Cargando, EstadoVista } from '../../../shared/components/ui/EstadoVista/EstadoVista.jsx'
import { ROLES } from '../../../shared/constants/dominio.js'
import { useFetch } from '../../../shared/hooks/useFetch.js'
import { iniciales } from '../../../shared/utils/formatters.js'
import { useSesion } from '../../auth/sesionContext.js'
import { listarDocentes, listarFacultades } from '../services/docentesService.js'
import './Docentes.css'

const TODOS = ''

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function Docentes() {
  const { usuario } = useSesion()
  const navegar = useNavigate()
  const esVicerrector = usuario.rol === ROLES.VICERRECTOR

  const [idFacultad, setIdFacultad] = useState(TODOS)
  const [programa, setPrograma] = useState(TODOS)
  const [busqueda, setBusqueda] = useState('')

  const cargarDocentes = useCallback(() => listarDocentes(idFacultad || null), [idFacultad])
  const docentes = useFetch(cargarDocentes, [cargarDocentes])
  const facultades = useFetch(() => (esVicerrector ? listarFacultades() : Promise.resolve([])), [esVicerrector])

  const lista = useMemo(() => docentes.datos ?? [], [docentes.datos])
  const programas = useMemo(() => [...new Set(lista.map((d) => d.nombrePrograma))].sort(), [lista])

  const filas = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    return lista.filter(
      (d) =>
        (!programa || d.nombrePrograma === programa) &&
        (!termino || normalizar(`${d.nombreCompleto} ${d.correo} ${d.nombrePrograma}`).includes(termino)),
    )
  }, [lista, programa, busqueda])

  function limpiarFiltros() {
    setBusqueda('')
    setPrograma(TODOS)
    setIdFacultad(TODOS)
  }

  const alcance = esVicerrector ? 'toda la universidad' : (lista[0]?.nombreFacultad ?? 'tu facultad')

  return (
    <>
      <Encabezado
        miga={`${esVicerrector ? 'Vicerrectoría' : 'Coordinación'} · Docentes`}
        titulo={esVicerrector ? 'Docentes de la universidad' : 'Docentes de la facultad'}
        subtitulo="Filtra y abre el expediente de cada docente. La calificación final siempre la firma un humano."
      />

      <div className="pagina">
        <div className="docentes__filtros">
          <label className="docentes__buscador">
            <span aria-hidden="true">⌕</span>
            <span className="solo-lectores">Buscar docente</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar docente, correo o programa"
            />
          </label>

          {esVicerrector && (
            <label className="docentes__selector">
              <span className="solo-lectores">Facultad</span>
              <select
                value={idFacultad}
                onChange={(e) => {
                  setIdFacultad(e.target.value)
                  setPrograma(TODOS)
                }}
              >
                <option value={TODOS}>Todas las facultades</option>
                {(facultades.datos ?? []).map((f) => (
                  <option key={f.idFacultad} value={f.idFacultad}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="docentes__selector">
            <span className="solo-lectores">Programa</span>
            <select value={programa} onChange={(e) => setPrograma(e.target.value)}>
              <option value={TODOS}>Todos los programas</option>
              {programas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <span className="docentes__conteo" aria-live="polite">
            {filas.length} de {lista.length}
          </span>
        </div>

        <span className="docentes__alcance">Alcance: {alcance}</span>

        {docentes.cargando && <Cargando texto="Cargando docentes" bloques={1} />}

        {docentes.error && (
          <EstadoVista tipo="error" titulo="No fue posible cargar los docentes" mensaje={docentes.error.message}>
            <Boton onClick={docentes.recargar}>Intentar de nuevo</Boton>
          </EstadoVista>
        )}

        {!docentes.cargando && !docentes.error && lista.length === 0 && (
          <EstadoVista
            titulo="No hay docentes en tu alcance"
            mensaje="Cuando se registren docentes activos en los programas de la facultad aparecerán aquí."
          />
        )}

        {!docentes.cargando && !docentes.error && lista.length > 0 && (
          <div className="docentes__tabla-contenedor">
            {filas.length > 0 ? (
              <div className="docentes__desplazable">
                <table className="docentes__tabla">
                  <caption className="solo-lectores">Docentes</caption>
                  <thead>
                    <tr>
                      <th scope="col">Docente</th>
                      <th scope="col">Programa</th>
                      <th scope="col">Facultad</th>
                      <th scope="col">
                        <span className="solo-lectores">Acción</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((d) => (
                      <tr key={d.idDocente} onClick={() => navegar(`/docentes/${d.idDocente}`)}>
                        <td>
                          <div className="docentes__persona">
                            <span className="docentes__avatar" aria-hidden="true">
                              {iniciales(d.nombreCompleto)}
                            </span>
                            <span>
                              <Link
                                to={`/docentes/${d.idDocente}`}
                                className="docentes__nombre"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {d.nombreCompleto}
                              </Link>
                              <span className="docentes__correo">{d.correo}</span>
                            </span>
                          </div>
                        </td>
                        <td>{d.nombrePrograma}</td>
                        <td className="docentes__facultad">{d.nombreFacultad}</td>
                        <td className="docentes__flecha" aria-hidden="true">
                          ›
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EstadoVista
                titulo="Ningún docente coincide con el filtro"
                mensaje="Prueba con otro programa o limpia la búsqueda."
              >
                <Boton variante="contorno" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Boton>
              </EstadoVista>
            )}
          </div>
        )}
      </div>
    </>
  )
}
