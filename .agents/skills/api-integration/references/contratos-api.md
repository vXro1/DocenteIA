# Contratos de la API DOCENTIA

Fuente: `docentia-backend/src/main/java/com/uniautonoma/docentia/controller` y `dto/`.
Si el backend cambia, actualizar este archivo antes de tocar servicios del frontend.

- Base: `http://localhost:8080/api` (context-path `/api`). En el frontend se usa la ruta relativa `/api`
  con el proxy de Vite (el backend no tiene CORS configurado).
- Autenticación: `Authorization: Bearer <token>` en todo excepto `POST /sesiones`. Token válido 480 min.
- Fechas `LocalDate` → `"YYYY-MM-DD"`; `LocalDateTime` → `"YYYY-MM-DDTHH:mm:ss(.SSS)"`.
- Números `BigDecimal` llegan como número JSON (ej. `4.25`). Enviar números, no strings.

## Errores

Todas las respuestas de error tienen la forma `ErrorResponse`:

```json
{ "mensaje": "Hay campos con datos inválidos", "errores": { "correo": "El correo no es válido" } }
```

| Estado | Cuándo                                                      | Qué hace la UI                                |
| ------ | ----------------------------------------------------------- | --------------------------------------------- |
| 400    | Validación (`errores` por campo) o datos incoherentes       | Mostrar `errores[campo]` junto a cada campo y `mensaje` arriba |
| 401    | Sin token, token vencido o credenciales inválidas           | En login: mostrar `mensaje`. En otro lado: cerrar sesión y llevar a `/login` |
| 403    | Rol sin permiso ("No tienes permiso para realizar esta acción") | Mostrar mensaje; no reintentar             |
| 404    | No existe o está fuera del alcance                          | Estado "no encontrado"                        |
| 409    | Regla de negocio (nombre duplicado, sin periodo activo, facultad con programas) | Mostrar `mensaje` tal cual |

## Sesiones

| Método | Ruta               | Rol      | Body / Respuesta |
| ------ | ------------------ | -------- | ---------------- |
| POST   | `/sesiones`        | público  | `{ correo, contrasena }` → **201** `SesionResponse` |
| GET    | `/sesiones/actual` | cualquiera autenticado | → `UsuarioSesion` |

```ts
SesionResponse = { token: string, usuario: UsuarioSesion }
UsuarioSesion  = { idUsuario, nombreCompleto, correo, rol: "VICERRECTOR"|"COORDINADOR"|"DOCENTE",
                   idFacultad: number|null, idPrograma: number|null }
```

## Docentes (VICERRECTOR, COORDINADOR)

| Método | Ruta                       | Notas |
| ------ | -------------------------- | ----- |
| GET    | `/docentes?idFacultad=`    | `idFacultad` opcional; ignorado para coordinador. Ordenados por nombre |
| GET    | `/docentes/{idDocente}`    | 404 si fuera del alcance |

```ts
DocenteResponse = { idDocente, nombreCompleto, correo, idPrograma, nombrePrograma, idFacultad, nombreFacultad }
```

## Calificaciones del periodo activo

| Método | Ruta                                          | Rol         |
| ------ | --------------------------------------------- | ----------- |
| GET    | `/docentes/{id}/calificaciones/coordinacion`  | COORDINADOR |
| PUT    | `/docentes/{id}/calificaciones/coordinacion`  | COORDINADOR |
| GET    | `/docentes/{id}/calificaciones/vicerrectoria` | VICERRECTOR |
| PUT    | `/docentes/{id}/calificaciones/vicerrectoria` | VICERRECTOR |

GET devuelve **204 sin cuerpo** si aún no hay calificación (no es error: formulario vacío).

```ts
CalificacionRequest = { dominioDisciplinar, planeacionAcademica, metodologiaEnsenanza,
                        evaluacionAprendizaje, compromisoInstitucional, // 1.0–5.0, 1 decimal
                        observacion?: string /* ≤1000 */ }
CalificacionResponse = { idCalificacion, idDocente, nombrePeriodo, fuente, ...5 aspectos,
                         observacion: string|null, fechaActualizacion }
```

## Expedientes

| Método | Ruta                       | Rol                      | Respuesta |
| ------ | -------------------------- | ------------------------ | --------- |
| GET    | `/expedientes/propio`      | DOCENTE                  | `ExpedientePropioResponse` |
| GET    | `/expedientes/{idDocente}` | COORDINADOR, VICERRECTOR | `ExpedienteDocenteResponse` |

```ts
PeriodoResumen   = { idPeriodo, nombre }
PromedioPonderado = { estado: "COMPLETO"|"INCOMPLETO", valor: number|null,
                      fuentesPendientes: ("ESTUDIANTES"|"COORDINACION"|"VICERRECTORIA")[] }
ResultadoDimension = { dimension, nombre, estado, resultado: number|null }
DimensionPorFuente = { dimension, nombre, notaEstudiantes, notaCoordinacion, notaVicerrectoria,
                       estado, resultado }           // notas null si esa fuente no calificó
NotaFuente = { fuente, nota: number|null, peso }
PromedioHistorico = { periodo: PeriodoResumen, promedio: PromedioPonderado }
Compromiso = { idCompromiso, descripcion, fechaLimite, nombrePeriodo }

ExpedientePropioResponse = { docente: DocenteResponse, periodo: PeriodoResumen|null,
  promedio: PromedioPonderado|null, dimensiones: ResultadoDimension[], compromisosVigentes: Compromiso[] }

ExpedienteDocenteResponse = { docente, periodo|null, promedio|null, notasPorFuente: NotaFuente[],
  dimensiones: DimensionPorFuente[], historico: PromedioHistorico[], compromisosVigentes: Compromiso[] }
```

## Periodos académicos

| Método | Ruta                                       | Rol         | Notas |
| ------ | ------------------------------------------ | ----------- | ----- |
| GET    | `/periodos-academicos`                     | autenticado | Del más reciente al más antiguo |
| GET    | `/periodos-academicos/activo`              | autenticado | 404 si no hay activo |
| GET    | `/periodos-academicos/{id}`                | autenticado | |
| POST   | `/periodos-academicos`                     | VICERRECTOR | 201, se crea inactivo |
| PUT    | `/periodos-academicos/{id}`                | VICERRECTOR | |
| PUT    | `/periodos-academicos/{id}/activacion`     | VICERRECTOR | Desactiva el anterior |
| DELETE | `/periodos-academicos/{id}/activacion`     | VICERRECTOR | 204 |

```ts
PeriodoAcademicoRequest = { nombre /* ≤20 */, fechaInicio, fechaFin,
  etapas: { tipoEtapa: "EVALUACION_ESTUDIANTES"|"CALIFICACION_COORDINACION"|
            "CALIFICACION_VICERRECTORIA"|"RETROALIMENTACION", fechaApertura, fechaCierre }[] }
PeriodoAcademicoResponse = { idPeriodo, nombre, fechaInicio, fechaFin, esActivo, etapas: [...] }
```

## Ponderaciones del periodo activo

| Método | Ruta                                        | Rol                      |
| ------ | ------------------------------------------- | ------------------------ |
| GET    | `/periodos-academicos/activo/ponderaciones` | VICERRECTOR, COORDINADOR |
| PUT    | `/periodos-academicos/activo/ponderaciones` | VICERRECTOR              |

```ts
PonderacionRequest  = { pesoEstudiantes, pesoCoordinacion, pesoVicerrectoria } // 0–100, 2 decimales, suman 100
PonderacionResponse = { periodo: PeriodoResumen, pesoEstudiantes, pesoCoordinacion,
                        pesoVicerrectoria, esPredeterminada: boolean }
```

## Facultades y programas (lectura: VICERRECTOR y COORDINADOR; escritura: VICERRECTOR)

| Método | Ruta                          | Notas |
| ------ | ----------------------------- | ----- |
| GET    | `/facultades`                 | Coordinador solo ve la suya |
| GET    | `/facultades/{id}`            | |
| POST   | `/facultades`                 | `{ nombre ≤120 }` → 201 |
| PUT    | `/facultades/{id}`            | |
| DELETE | `/facultades/{id}`            | 204; 409 si tiene programas activos |
| GET    | `/programas?idFacultad=`      | |
| GET    | `/programas/{id}`             | |
| POST   | `/programas`                  | `{ nombre ≤120, idFacultad }` → 201 |
| PUT    | `/programas/{id}`             | |
| DELETE | `/programas/{id}`             | 204 |

```ts
FacultadResponse = { idFacultad, nombre }
ProgramaResponse = { idPrograma, nombre, idFacultad, nombreFacultad }
```

## Usuarios de desarrollo (perfil `dev`, contraseña `Docentia2026*`)

`vicerrectoria@uniautonoma.edu.co`, `coordinacion.ingenieria@uniautonoma.edu.co`,
`coordinacion.derecho@uniautonoma.edu.co`, `julian.hoyos@uniautonoma.edu.co`, `luisa.mosquera@uniautonoma.edu.co`.
No incrustarlos en el código del frontend.
