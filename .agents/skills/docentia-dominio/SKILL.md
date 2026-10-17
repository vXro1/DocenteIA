---
name: docentia-dominio
description: Reglas de negocio de DOCENTIA (evaluación docente de Uniautónoma del Cauca). Leer antes de construir cualquier pantalla, texto o cálculo que muestre notas, promedios, periodos, ponderaciones o compromisos.
---

# Dominio DOCENTIA

DOCENTIA es el sistema de evaluación docente de la Corporación Universitaria Autónoma del Cauca.
El backend (`docentia-backend`, Spring Boot) es la fuente de verdad: el frontend **muestra** lo que
la API calcula, no recalcula ni reinterpreta.

## Roles y alcance

| Rol (`rol`)   | Alcance                                   | Qué hace en la app                                              |
| ------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `VICERRECTOR` | Toda la universidad                       | Administra facultades, programas, periodos y ponderaciones; califica como vicerrectoría; ve expedientes completos. |
| `COORDINADOR` | Su facultad (`idFacultad` de la sesión)   | Lista docentes de su facultad; califica como coordinación; ve expedientes completos de su facultad. |
| `DOCENTE`     | Solo él mismo (`idPrograma` de la sesión) | Ve su expediente propio, sin notas individuales por fuente.     |

- Un docente de otra facultad responde **404 "Docente no encontrado"**, no 403. La UI lo trata como
  "no existe", nunca como "no tienes permiso".
- El coordinador puede enviar `idFacultad` al listar docentes, pero el backend lo ignora y usa su
  propia facultad. No mostrarle un selector de facultad.

## Fuentes de evaluación (`FuenteEvaluacion`)

`ESTUDIANTES`, `COORDINACION`, `VICERRECTORIA`. Pesos predeterminados: 50 / 30 / 20.

- `ESTUDIANTES` no tiene endpoint de escritura en el frontend: sus notas llegan por otro canal.
- Coordinación y vicerrectoría califican con `PUT` (registrar o reemplazar; no hay borrador).

## Aspectos / dimensiones

Cada fuente califica cinco aspectos de **1.0 a 5.0 con máximo un decimal**:

| Campo JSON                | `Dimension`                | Etiqueta en UI               |
| ------------------------- | -------------------------- | ---------------------------- |
| `dominioDisciplinar`      | `DOMINIO_DISCIPLINAR`      | Dominio disciplinar          |
| `planeacionAcademica`     | `PLANEACION_ACADEMICA`     | Planeación académica         |
| `metodologiaEnsenanza`    | `METODOLOGIA_ENSENANZA`    | Metodología de enseñanza     |
| `evaluacionAprendizaje`   | `EVALUACION_APRENDIZAJE`   | Evaluación del aprendizaje   |
| `compromisoInstitucional` | `COMPROMISO_INSTITUCIONAL` | Compromiso institucional     |

Las respuestas de dimensiones ya traen `nombre`; usarlo en vez de duplicar etiquetas.
Observación opcional, máximo 1000 caracteres.

## Promedios

- Nota de una fuente = promedio simple de sus cinco aspectos.
- Promedio ponderado = Σ(nota × peso) / 100, redondeado a 2 decimales (HALF_UP) **en el backend**.
- `PromedioPonderadoResponse.estado`:
  - `COMPLETO` → `valor` tiene número.
  - `INCOMPLETO` → `valor` es `null` y `fuentesPendientes` lista las fuentes que faltan.
- **Nunca** mostrar un promedio parcial calculado en el cliente: el backend lo omite a propósito
  para que no se confunda con uno definitivo. Mostrar "Pendiente" y las fuentes que faltan.
- No comunicar el estado solo con color: acompañarlo de texto ("Completo", "Pendiente: Coordinación").

## Privacidad del docente (regla crítica)

El docente **no puede ver** las notas individuales de coordinación ni de vicerrectoría.
`ExpedientePropioResponse` no contiene esos campos; no intentar obtenerlos por otra vía ni
componer pantallas de docente que reutilicen componentes que esperen `notasPorFuente`.
Los componentes de expediente deben separar claramente:

- Vista completa (coordinador/vicerrector): `notasPorFuente`, `dimensiones` con nota por fuente, `historico`.
- Vista propia (docente): `dimensiones` ya ponderadas (`resultado`), `promedio`, `compromisosVigentes`.

## Periodo académico

- Solo uno puede estar activo (`esActivo`). Calificaciones y ponderaciones siempre son del periodo activo.
- Sin periodo activo: el expediente trae `periodo` y `promedio` en `null`; calificar devuelve
  409 "No hay un periodo académico activo; la vicerrectoría debe activar uno"; `GET /periodos-academicos/activo` devuelve 404.
- Nombre máx. 20 caracteres (ej. `2026-1`). Etapas (`TipoEtapa`), cada una a lo sumo una vez, con
  fechas dentro del periodo y cierre ≥ apertura:
  `RECOLECCION_CALIFICACIONES`, `REVISION_HALLAZGOS`, `AGENDA_CITAS`, `FIRMA_ACTAS` (los nombres
  viejos responden 400). Una etapa sin fechas cuenta como cerrada; las fechas son inclusivas.
- El backend **bloquea** con 409 las acciones fuera de su etapa: calificar (coordinación y
  vicerrectoría) y cargar el CSV de estudiantes requieren `RECOLECCION_CALIFICACIONES` abierta.
  La UI lee `GET /periodos-academicos/activo/ventanas` (en `PeriodoContext`, hook `useVentanaEtapa`)
  para deshabilitar botones y explicar las fechas con `AvisoEtapaCerrada`; el 404 de alcance tiene
  prioridad sobre el 409 de etapa.

## Correcciones de notas (D2)

- Corregir es volver a enviar la calificación de una fuente con notas distintas (o recargar el CSV).
  `motivoCorreccion` (≤500) es opcional y solo aplica si la calificación ya existía y sus notas cambian.
- El historial (`GET /docentes/{id}/calificaciones/correcciones`) es solo para coordinación y
  vicerrectoría: el docente nunca lo ve (contiene notas por fuente).

## Ponderaciones

- Tres pesos de 0 a 100 con máximo 2 decimales que **deben sumar 100** (si no: 400 "Las ponderaciones deben sumar 100%").
- `esPredeterminada: true` indica que el periodo usa 50/30/20 porque nadie los configuró.
- Validar la suma en el formulario para dar feedback inmediato, pero el backend sigue validando.

## Compromisos de mejora

Solo lectura en el frontend: `descripcion`, `fechaLimite`, `nombrePeriodo`. Se muestran los vigentes.
No hay endpoint para crearlos ni marcarlos como cumplidos.

## Lo que NO existe (no inventarlo)

- Registro de usuarios ni recuperación de contraseña (el login por correo es temporal hasta el SSO institucional).
- Borrado o desactivación de usuarios (solo alta y edición, por vicerrectoría).
- Formulario web para que los estudiantes califiquen: su nota llega por la carga del CSV (coordinación).
- Mostrar los comentarios de estudiantes: se guardan al importar, pero ningún endpoint los expone aún.
- Creación/edición de compromisos.

Si una pantalla del maquetado requiere algo de esta lista, dejarla con estado "Próximamente" o
consultarlo, pero no simular datos ni crear contratos de API.
