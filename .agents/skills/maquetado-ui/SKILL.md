---
name: maquetado-ui
description: Traducir el maquetado de DocenteIA hecho en Claude Design (claude.ai/design) a componentes React y CSS del proyecto. Usar al construir o ajustar cualquier pantalla, componente visual, color, tipografía o espaciado.
---

# Maquetado UI — Claude Design → React

El maquetado oficial vive en el proyecto **DocenteIA** de Claude Design:

- Proyecto: `64f2a713-c5ea-4827-a53b-33987dcdc508`
- Archivo principal: `DOCENTIA.dc.html`
- Enlace: https://claude.ai/design/p/64f2a713-c5ea-4827-a53b-33987dcdc508?file=DOCENTIA.dc.html

Copia local: `design/DOCENTIA-standalone.html` (exportación autocontenida; fuera de `src/`, no se
empaqueta). Es la referencia a leer antes de maquetar.

## Obtener el maquetado

Opciones, en orden:
1. Desde Claude Design: "Send to Claude Code" / exportar el proyecto y guardarlo en `design/`.
2. Desde Claude Code interactivo: ejecutar `/design-login` una vez; luego la IA puede leer el proyecto
   con la herramienta DesignSync (`list_projects` → `list_files` → `get_file`).
3. Capturas o HTML exportado copiados a `design/`.

Si `design/` está vacía y no hay acceso a Claude Design, **detenerse y pedir el maquetado**;
no inventar un diseño.

## Proceso

1. Inventariar el maquetado: pantallas, componentes repetidos, tokens (colores, tipografías,
   tamaños, radios, sombras, espaciados) y estados (hover, focus, disabled, vacío, carga, error).
2. Volcar los tokens en `src/styles/variables.css` como variables CSS (`--color-primario`,
   `--espacio-4`, `--radio-md`, `--fuente-base`...). Ningún componente usa colores o medidas sueltas.
3. Mapear cada pantalla a una ruta y rol (skill `autenticacion-roles`) y a sus datos reales
   (skill `api-integration`). Si una pantalla muestra datos que la API no entrega, anotarlo y
   preguntar; no rellenar con datos falsos.
4. Extraer primero los componentes compartidos a `src/shared/components/ui/` (Button, Input,
   Card, Badge de estado, Tabla, Modal, EmptyState, Spinner) y el layout a `shared/components/layout/`.
5. Construir las pantallas en `src/features/<feature>/pages/` componiendo esos componentes.
6. Comparar visualmente con el maquetado en escritorio y móvil antes de dar la tarea por terminada.

## Reglas de fidelidad

- El maquetado manda en lo visual (layout, jerarquía, textos de interfaz, colores).
- El backend manda en los datos y permisos: si el diseño muestra a un docente las notas de
  coordinación o vicerrectoría, **no** implementarlo (ver `docentia-dominio`) y avisarlo.
- Si el diseño usa una librería (Tailwind, shadcn, iconos), reproducirlo con CSS convencional;
  instalar dependencias solo con autorización.
- Textos en español, tal como en el maquetado. Nombres de dimensiones y fuentes según `docentia-dominio`.
- Los estados de promedio (`COMPLETO` / `INCOMPLETO`) llevan texto además de color.
- Todo estado que el maquetado no dibuje (carga, error, vacío, sin periodo activo) se diseña con
  los mismos tokens y se reporta como añadido.

## Cómo leer el archivo exportado

`DOCENTIA-standalone.html` es un paquete: el HTML real está en `<script type="__bundler/template">`
(JSON) y los recursos en `__bundler/manifest` (base64, a veces gzip). La lógica de la maqueta
(datos de ejemplo, navegación, colores) está en el `<script type="text/x-dc">` del template.
Los datos de la maqueta son ficticios: nunca copiarlos al código.

## Tokens (ya volcados en `src/styles/variables.css`)

| Token | Valor | Uso |
| ----- | ----- | --- |
| `--color-azul` | `#053686` | Sidebar, botones primarios, tarjeta destacada |
| `--color-azul-oscuro` | `#022A8A` | Hover, texto sobre amarillo |
| `--color-amarillo` | `#E3C924` | Logo, foco, punto de navegación activo |
| `--color-crema` / `--color-fondo` | `#FFFDF5` | Fondo de página y texto sobre azul |
| `--color-borde` | `#E6DFCE` | Bordes de tarjetas y campos |
| `--color-texto` | `#1E1E1E` | Texto principal |
| `--color-texto-tenue` | `#66625A` | Rótulos y texto secundario |
| Niveles | `#1B7F43` / `#053686` / `#7F9BCE` / `#A33116` | Excelente ≥4,5 · Bueno ≥4,0 · Aceptable ≥3,5 · Bajo |
| `--fuente-base` | Nunito 300/400/900 (autoalojada en `src/assets/fuentes`) | Todo el texto |

Ilustraciones del robot en `src/assets/ilustraciones/`: `saludo`, `pensando`, `esperando`
(vacío), `aprobada` (éxito), `error`, `senala`.

## Vistas del maquetado y estado

| Vista | Ruta | Estado |
| ----- | ---- | ------ |
| Docentes | `/docentes` | Implementada (sin columnas de notas/cédula/categoría: la API no las da) |
| Perfil docente | `/docentes/:id` | Implementada |
| Calificar | `/docentes/:id/calificar` | Implementada (coordinación y vicerrectoría) |
| Profesor | `/mi-evaluacion` | Implementada (sin nota separada de estudiantes) |
| Login | `/login` | No está en el maquetado; hecha con sus tokens |
| Inicio (KPIs) | `/inicio` | Implementada: filtros de periodo y facultad y las cuatro tarjetas. Sin filtro de programa ni buscador (la API de KPIs no los recibe). Añadido: panel de etapas del periodo |
| Inicio (evolución, distribución, ranking), Comparación de programas | — | Sin endpoints |
| Carga del CSV de estudiantes, Usuarios, Historial de correcciones | `/importaciones`, `/usuarios`, expediente | No están en el maquetado; hechas con sus tokens |
| DocentIA Insights, Mis hallazgos | — | Sin backend de IA ni comentarios |
| Agenda de turnos, Mi cita, Acta y firma | — | Sin backend |
