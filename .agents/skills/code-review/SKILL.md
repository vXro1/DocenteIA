---
name: code-review
description: Revisar cambios del frontend para detectar errores, duplicación, riesgos y problemas de mantenibilidad.
---

# Code Review

Antes de finalizar una tarea:

1. Revisar todos los archivos modificados.
2. Comprobar importaciones y rutas.
3. Buscar duplicación y lógica innecesariamente compleja.
4. Verificar estados de carga, error y vacío.
5. Revisar accesibilidad y diseño responsive.
6. Comprobar que no se hayan introducido dependencias innecesarias.
7. No modificar archivos ajenos a la tarea sin justificación.
8. Ejecutar las comprobaciones disponibles en el proyecto.
9. Informar los errores que no hayan podido resolverse.
10. No afirmar que una prueba pasó si no se ejecutó.

## Comprobaciones específicas de DOCENTIA

11. Ninguna vista de rol DOCENTE muestra o solicita notas de coordinación o vicerrectoría.
12. Ningún promedio se calcula en el cliente; `INCOMPLETO` se muestra como pendiente.
13. Los endpoints, campos y roles usados coinciden con `api-integration/references/contratos-api.md`.
14. Se manejan `null` en `periodo`, `promedio.valor` y notas por fuente, y el 204 de calificaciones.
15. El token no aparece en logs, URLs ni `localStorage`.
16. Lo visual coincide con el maquetado de Claude Design (skill `maquetado-ui`).
