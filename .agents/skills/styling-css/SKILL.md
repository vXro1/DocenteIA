---
name: styling-css
description: Crear y mantener estilos CSS consistentes, reutilizables y fáciles de mantener en el frontend de DOCENTIA, a partir de los tokens del maquetado.
---

# Styling CSS

1. Utilizar CSS convencional; no instalar librerías de estilos sin autorización.
2. Los tokens (colores, tipografías, espaciados, radios, sombras) salen del maquetado de Claude Design
   (skill `maquetado-ui`) y se definen una sola vez en `src/styles/variables.css`.
3. Ningún componente usa colores hex ni medidas mágicas sueltas: siempre `var(--token)`.
4. `globals.css`: reset, tipografía base, `body` y foco visible. `responsive.css`: breakpoints compartidos.
5. Cada componente tiene su `.css` con clases prefijadas por el nombre del componente
   (`.button`, `.button--primario`, `.expediente-card__titulo`) para evitar colisiones.
6. Estados de evaluación con tokens semánticos (`--color-completo`, `--color-pendiente`) y siempre
   acompañados de texto o icono.
7. Evitar `!important` salvo razón técnica clara.
8. Definir estados hover, focus-visible, disabled y active en elementos interactivos.
9. Mantener contraste AA como mínimo.
10. Respetar `prefers-reduced-motion`.
11. Eliminar `App.css` e `index.css` de la plantilla de Vite cuando se reemplacen por los estilos propios.
