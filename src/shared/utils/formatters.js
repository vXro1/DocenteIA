import { ETIQUETA_FUENTE, NIVELES } from '../constants/dominio.js'

const formatoNota = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** 4.375 → "4,38". Devuelve "—" si no hay nota. */
export function formatearNota(valor) {
  return valor === null || valor === undefined ? '—' : formatoNota.format(Number(valor))
}

/** 50 → "50 %" */
export function formatearPeso(peso) {
  return `${Number(peso).toLocaleString('es-CO')} %`
}

/** "2026-11-30" → "30 nov 2026", sin desfases de zona horaria. */
export function formatearFecha(fechaIso) {
  if (!fechaIso) return ''
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-').map(Number)
  return formatoFecha.format(new Date(anio, mes - 1, dia)).replace('.', '')
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function nivelDeNota(valor) {
  if (valor === null || valor === undefined) return null
  return NIVELES.find((nivel) => Number(valor) >= nivel.desde)
}

/** Porcentaje de una nota sobre 5 para el ancho de las barras. */
export function porcentajeNota(valor) {
  if (valor === null || valor === undefined) return '0%'
  return `${Math.max(0, Math.min(100, (Number(valor) / 5) * 100))}%`
}

/** ["COORDINACION", "VICERRECTORIA"] → "Coordinación y Vicerrectoría" */
export function listarFuentes(fuentes = []) {
  const nombres = fuentes.map((fuente) => ETIQUETA_FUENTE[fuente] ?? fuente)
  if (nombres.length <= 1) return nombres.join('')
  return `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
}
