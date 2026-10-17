---
name: react-pages
description: Construir las páginas React de DOCENTIA, organizar su composición y conectarlas con componentes, servicios y roles.
---

# React Pages

## Páginas del sistema

| Página                 | Ruta                             | Rol                      | Datos |
| ---------------------- | -------------------------------- | ------------------------ | ----- |
| Login                  | `/login`                         | público                  | `POST /sesiones` |
| Mi evaluación          | `/mi-evaluacion`                 | DOCENTE                  | `GET /expedientes/propio` |
| Inicio (KPIs)          | `/inicio`                        | COORDINADOR, VICERRECTOR | `GET /kpis`, `GET /periodos-academicos`, ventanas |
| Evaluación de estudiantes | `/importaciones`              | COORDINADOR (carga); VICERRECTOR (historial) | `/importaciones/*` |
| Usuarios               | `/usuarios`, `/usuarios/nuevo`, `/usuarios/:idUsuario` | VICERRECTOR | `/usuarios` |
| Docentes               | `/docentes`                      | COORDINADOR, VICERRECTOR | `GET /docentes` (+ `GET /facultades` para filtrar, solo vicerrector) |
| Expediente del docente | `/docentes/:idDocente`           | COORDINADOR, VICERRECTOR | `GET /expedientes/{id}` |
| Calificar docente      | `/docentes/:idDocente/calificar` | COORDINADOR, VICERRECTOR | `GET`/`PUT /docentes/{id}/calificaciones/{fuente}` |
| Periodos académicos    | `/periodos`                      | lectura todos los admin; edición VICERRECTOR | `/periodos-academicos` |
| Ponderación            | `/ponderacion`                   | lectura COORDINADOR; edición VICERRECTOR | `/periodos-academicos/activo/ponderaciones` |
| Facultades             | `/facultades`                    | VICERRECTOR (CRUD)       | `/facultades` |
| Programas              | `/programas`                     | VICERRECTOR (CRUD)       | `/programas` |
| Sin acceso / 404       | `*`                              | —                        | — |

La apariencia de cada página sale del maquetado (skill `maquetado-ui`).

## Estados obligatorios
- Carga, error (con `mensaje` del backend), vacío y éxito.
- **Sin periodo activo**: expedientes con `periodo === null`, calificar con 409 y ponderación con
  404/409 muestran un aviso claro ("No hay un periodo académico activo") en vez de un error genérico.
- **Promedio incompleto**: "Pendiente" + fuentes que faltan; nunca un número parcial.
- Formulario de calificación: si el GET devuelve 204, formulario vacío; si devuelve datos, precargar
  y avisar que guardar reemplaza la calificación anterior.

## Reglas
1. Las páginas componen la interfaz y coordinan estado; la lógica de negocio va en la feature.
2. Usar componentes compartidos para elementos comunes; no duplicar la navegación global.
3. La vista de docente no reutiliza componentes que muestren notas por fuente (ver `docentia-dominio`).
4. Confirmar acciones destructivas (eliminar facultad/programa, desactivar periodo) con un modal.
5. Verificar el comportamiento en móvil, tableta y escritorio.
6. Ocultar una página no sustituye la autorización del backend.
