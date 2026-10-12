---
name: testing
description: Definir y ejecutar pruebas apropiadas para componentes, páginas y funcionalidades del frontend de DOCENTIA.
---

# Testing

## Estado actual
- No hay infraestructura de pruebas instalada (solo `npm run lint` y `npm run build`).
- Propuesta (requiere autorización antes de instalar): Vitest + React Testing Library + jsdom,
  con pruebas en `tests/` o junto al componente (`*.test.jsx`).

## Comprobaciones mínimas en cada tarea
1. `npm run lint`
2. `npm run build`
3. Si el backend está corriendo (`mvn spring-boot:run -Dspring-boot.run.profiles=dev`), probar el
   flujo manual con los usuarios de desarrollo de cada rol afectado.

## Casos que deben cubrirse cuando haya pruebas
- Login correcto, credenciales inválidas (401) y campos vacíos (400 con `errores`).
- Redirección por rol y página "Sin acceso".
- Cierre de sesión ante 401 en cualquier petición.
- Expediente propio del docente: no muestra notas por fuente.
- Promedio `INCOMPLETO`: muestra "Pendiente" y fuentes faltantes, nunca un número.
- Sin periodo activo: aviso específico.
- Calificación: validación 1.0–5.0 con un decimal, 204 → formulario vacío, PUT reemplaza.
- Ponderación: la suma distinta de 100 bloquea el envío; error 400 del backend se muestra.

## Reglas
1. Probar comportamiento observable, no detalles internos.
2. Simular la API en el borde (`fetch`), con respuestas copiadas de `api-integration/references/contratos-api.md`.
3. Reportar resultados reales; no afirmar que una prueba pasó si no se ejecutó.
