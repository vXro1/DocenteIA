import { formatearFecha } from '../../shared/utils/formatters.js'

/** Texto con las fechas de una etapa. Sirve con una ventana o con el cuerpo del 409 de etapa cerrada. */
export function describirFechasEtapa({ fechaApertura, fechaCierre }) {
  if (!fechaApertura || !fechaCierre) return 'Aún no está programada; la vicerrectoría debe definir sus fechas.'
  return `Sus fechas son del ${formatearFecha(fechaApertura)} al ${formatearFecha(fechaCierre)}.`
}
