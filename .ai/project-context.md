# Contexto del proyecto frontend — DOCENTIA

## Objetivo
Aplicación web del sistema de evaluación docente de la Corporación Universitaria Autónoma del Cauca.
Coordinación y vicerrectoría califican a los docentes por cinco aspectos; el sistema combina esas
notas con la de estudiantes según ponderaciones del periodo activo, y cada docente consulta su
resultado sin ver las notas individuales por fuente.

## Tecnologías
- React 19, Vite 8, JavaScript/JSX, CSS convencional, oxlint.
- Backend: `../docentia-backend` — Spring Boot 3.5, Java 21, PostgreSQL, JWT. API en `http://localhost:8080/api`.
- Diseño: maquetado "DocenteIA" en Claude Design (copia local en `design/`).

## Arquitectura
- Component-Based y Feature-Based. Features alineadas con los controladores del backend
  (ver skill `frontend-architecture`).

## Convenciones
- Componentes en PascalCase; funciones y variables en camelCase; código y textos en español.
- Campos de la API sin renombrar (`nombreCompleto`, `idDocente`...).
- Componentes compartidos en `src/shared/components/`, features en `src/features/`,
  cliente HTTP en `src/services/api.js`, estilos globales en `src/styles/`.

## Skills (en `.agents/skills/`)
| Skill                  | Cuándo leerla |
| ---------------------- | ------------- |
| `docentia-dominio`     | Siempre que haya notas, promedios, periodos, ponderaciones o roles |
| `api-integration`      | Al llamar a la API (contratos en `references/contratos-api.md`) |
| `autenticacion-roles`  | Login, sesión, rutas protegidas, navegación por rol |
| `maquetado-ui`         | Al construir cualquier pantalla o componente visual |
| `frontend-architecture`| Al crear archivos o features |
| `react-pages` / `react-components` | Al crear páginas o componentes |
| `styling-css` / `responsive-design` / `accessibility` | Estilos y calidad visual |
| `testing` / `code-review` | Antes de cerrar una tarea |

## Reglas de trabajo para la IA
- Leer las skills pertinentes antes de realizar cambios.
- Inspeccionar el código existente (y el backend si hay dudas de contrato) antes de editar.
- No reemplazar archivos completos sin necesidad.
- No inventar contratos de API ni datos de ejemplo en pantallas reales.
- No instalar dependencias sin justificación.
- Ejecutar `npm run lint` y `npm run build`.
- Resumir los archivos modificados y las pruebas realizadas.

## Estado (2026-10-12)
- Backend con demo de semana 1: sesiones, docentes, calificaciones de coordinación y vicerrectoría,
  expedientes, periodos, ponderaciones, facultades y programas.
- Frontend: login con JWT, rutas por rol, layout del maquetado y pantallas Docentes, Expediente,
  Calificar y Mi evaluación conectadas a la API real.
- Maquetado en `design/DOCENTIA-standalone.html`; tokens en `src/styles/variables.css`.
  Las vistas sin backend están listadas en la skill `maquetado-ui`.
- Pendiente: elegir herramienta de pruebas; crear el repo `docentia-frontend` en GitHub.
