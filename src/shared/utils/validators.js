/** Valida una nota de aspecto: 1.0 a 5.0 con máximo un decimal (regla @NotaAspecto del backend). */
export function validarNotaAspecto(texto) {
  if (texto === '' || texto === null || texto === undefined) return 'La nota es obligatoria'
  const normalizado = String(texto).replace(',', '.')
  if (!/^\d(\.\d)?$/.test(normalizado)) return 'Usa un número con máximo un decimal'
  const valor = Number(normalizado)
  if (valor < 1 || valor > 5) return 'La nota debe estar entre 1,0 y 5,0'
  return null
}

export function aNumero(texto) {
  return Number(String(texto).replace(',', '.'))
}
