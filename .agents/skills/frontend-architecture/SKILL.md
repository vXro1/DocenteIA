---
name: frontend-architecture
description: Define y mantiene la arquitectura del frontend React de DOCENTIA. Utilizar al crear funcionalidades, organizar archivos o decidir dónde ubicar código.
---

# Frontend Architecture

## Stack
- React 19 + Vite 8, JavaScript (JSX). No usar TypeScript salvo petición expresa.
- CSS convencional con variables en `src/styles/variables.css`.
- `fetch` nativo para HTTP. Enrutado con `react-router-dom` (instalar solo cuando se implemente el router).
- Lint: `npm run lint` (oxlint). Build: `npm run build`.
- Backend: `../docentia-backend` (Spring Boot, `http://localhost:8080/api`).

## Organización
- `src/app/`: `AppRouter.jsx`, `ProtectedRoute.jsx`, proveedores globales.
- `src/services/api.js`: cliente HTTP único.
- `src/shared/`: componentes UI y de layout, hooks (`useFetch`) y utilidades (`formatters`, `validators`).
- `src/styles/`: `variables.css`, `globals.css`, `responsive.css`.
- `src/features/`: una carpeta por área del negocio, alineada con los controladores del backend:

| Feature         | Backend                             | Roles                    |
| --------------- | ----------------------------------- | ------------------------ |
| `auth`          | `/sesiones`                         | todos                    |
| `docentes`      | `/docentes`                         | COORDINADOR, VICERRECTOR |
| `calificaciones`| `/docentes/{id}/calificaciones/*`   | COORDINADOR, VICERRECTOR |
| `expedientes`   | `/expedientes`                      | todos (vista según rol)  |
| `periodos`      | `/periodos-academicos`              | lectura todos; escritura VICERRECTOR |
| `ponderaciones` | `/periodos-academicos/activo/ponderaciones` | lectura COORD/VICE; escritura VICERRECTOR |
| `facultades`    | `/facultades`                       | COORDINADOR, VICERRECTOR |
| `programas`     | `/programas`                        | COORDINADOR, VICERRECTOR |

Cada feature: `pages/`, `components/`, `services/`, y `hooks/` solo si hace falta.

## Crear solo lo necesario
- Las carpetas y archivos se crean cuando se implementan; no dejar archivos vacíos de "plantilla".
- No crear `features/users`, `Register` ni `Dashboard` genérico: no corresponden a ningún endpoint.
- `App.jsx` es un marcador mínimo: se reemplaza por `AppRouter` al implementar el login.

## Reglas
1. Leer `docentia-dominio` antes de cualquier funcionalidad de negocio.
2. Mantener una separación clara de responsabilidades.
3. No duplicar componentes que puedan reutilizarse.
4. Evitar archivos excesivamente grandes.
5. No crear capas o abstracciones innecesarias.
6. Revisar la estructura existente antes de modificar archivos.
7. No eliminar ni sobrescribir código con contenido real sin justificación.
8. Mantener intactas las funcionalidades no relacionadas con la tarea.
