---
name: autenticacion-roles
description: Inicio de sesión con JWT, contexto de sesión, rutas protegidas y navegación por rol (VICERRECTOR, COORDINADOR, DOCENTE) en DOCENTIA. Usar al tocar login, logout, ProtectedRoute, AppRouter, Sidebar o cualquier pantalla que dependa del rol.
---

# Autenticación y roles

## Flujo

1. `POST /sesiones` con `{ correo, contrasena }` → `{ token, usuario }` (201).
   Error 401 → mostrar `mensaje` ("credenciales inválidas"); 400 → errores por campo.
2. Guardar `token` y `usuario` (`UsuarioSesion`) en un contexto React (`features/auth`).
3. Al recargar la app, si hay token guardado, validar con `GET /sesiones/actual`; si responde 401,
   limpiar la sesión. Mostrar un estado de carga mientras se valida, sin parpadeo del login.
4. Logout: limpiar contexto y almacenamiento. No hay endpoint de logout (JWT sin estado).
5. Token válido 8 horas. Cualquier 401 posterior cierra la sesión y redirige a `/login` conservando
   la ruta de origen para volver tras iniciar sesión.

## Almacenamiento del token

El backend devuelve el JWT en el cuerpo (no cookie httpOnly). Usar `sessionStorage` (se borra al
cerrar la pestaña) y nunca exponerlo en URLs ni logs. Documentar en el PR que es temporal hasta el SSO.

## No crear

- Pantalla de registro (`Register.jsx` existe en el andamiaje pero **no hay endpoint**: eliminarla o
  no enrutarla).
- Recuperación de contraseña, "recordarme" o login social.
- Login simulado o usuarios quemados en el código.

## Rutas por rol

`ProtectedRoute` recibe `rolesPermitidos` y:
- sin sesión → `/login`;
- con sesión pero rol no permitido → página "Sin acceso" (no redirigir en silencio).

Ruta de inicio tras login según rol:

| Rol           | Inicio                 | Navegación (Sidebar)                                                    |
| ------------- | ---------------------- | ----------------------------------------------------------------------- |
| `DOCENTE`     | `/mi-evaluacion`       | Mi evaluación                                                           |
| `COORDINADOR` | `/inicio`              | Inicio, Docentes, Evaluación de estudiantes (`/importaciones`)          |
| `VICERRECTOR` | `/inicio`              | Inicio, Docentes, Cargas de estudiantes (`/importaciones`), Usuarios    |

Pendientes de pantalla (ya hay endpoints): Periodos, Ponderación, Facultades, Programas.
`/usuarios`, `/usuarios/nuevo` y `/usuarios/:idUsuario` son solo VICERRECTOR. Si se edita el rol o el
vínculo de alguien, su sesión abierta conserva el alcance anterior hasta que el token vence (8 h).

Rutas de detalle:
- `/docentes/:idDocente` → expediente completo (COORDINADOR, VICERRECTOR).
- `/docentes/:idDocente/calificar` → formulario de la fuente del rol actual
  (COORDINADOR → `coordinacion`, VICERRECTOR → `vicerrectoria`). La fuente se deduce del rol, nunca de la URL.

Si el maquetado de Claude Design define otras rutas o etiquetas, prevalece el maquetado en lo visual,
pero los permisos de esta tabla deben coincidir con los `@PreAuthorize` del backend.

## Encabezado / perfil

Mostrar `nombreCompleto` y una etiqueta legible del rol: Vicerrectoría, Coordinación, Docente.
