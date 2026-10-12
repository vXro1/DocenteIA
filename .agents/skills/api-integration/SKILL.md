---
name: api-integration
description: Integrar el frontend React con la API REST de DOCENTIA (Spring Boot). Usar al crear o modificar servicios HTTP, manejar errores de la API o consumir endpoints de sesiones, docentes, calificaciones, expedientes, periodos, ponderaciones, facultades o programas.
---

# API Integration — DOCENTIA

Contratos completos en [references/contratos-api.md](references/contratos-api.md). Leerlo antes de
escribir cualquier llamada. No inventar endpoints, campos ni formatos que no estén ahí o en el backend.

## Configuración

1. URL base: `import.meta.env.VITE_API_URL ?? '/api'`. En desarrollo se usa `/api` con proxy:
   ```js
   // vite.config.js
   server: { proxy: { '/api': 'http://localhost:8080' } }
   ```
   El backend **no tiene CORS**; no llamar directo a `http://localhost:8080` desde el navegador.
2. `src/services/api.js` es el único cliente HTTP (`fetch` nativo, sin axios salvo autorización):
   - Agrega `Authorization: Bearer <token>` si hay sesión.
   - Envía y recibe JSON.
   - Devuelve `null` en **204** (calificación inexistente, borrados).
   - Si la respuesta no es `ok`, lanza un `ApiError` con `status`, `mensaje` y `errores` (mapa por campo)
     tomados de `ErrorResponse`; si el cuerpo no es JSON, usa un mensaje genérico.
   - En **401** fuera de `POST /sesiones`, notifica el cierre de sesión (evento o callback del contexto de auth).
   - Captura fallos de red y los traduce a "No se pudo conectar con el servidor".
3. Cada feature tiene su servicio: `features/<feature>/services/<feature>Service.js`, con funciones
   que nombran la acción del negocio (`obtenerExpedientePropio`, `calificarComoCoordinacion`), no el verbo HTTP.

## Reglas

1. Los nombres de campos se usan tal cual vienen de la API (`nombreCompleto`, `idDocente`, `esActivo`).
   No renombrar a inglés ni a otro esquema.
2. Mostrar `mensaje` del backend al usuario: ya está en español y redactado para él.
3. En formularios, pintar `errores[campo]` junto al campo correspondiente.
4. Tratar 404 de recursos de docentes como "no encontrado", incluso si el motivo real es el alcance.
5. Valores `null` son esperables (`promedio.valor`, `periodo`, notas por fuente): manejarlos siempre.
6. Enviar notas y pesos como números (`4.5`), no strings. Fechas como `"YYYY-MM-DD"`.
7. No guardar el token en `localStorage` si puede evitarse; ver la skill `autenticacion-roles`.
8. No registrar tokens, contraseñas ni notas en consola.
9. La autorización real está en el servidor: ocultar botones por rol es solo UX.
10. Si falta un endpoint para lo que pide el maquetado, reportarlo; no simularlo con datos falsos.
