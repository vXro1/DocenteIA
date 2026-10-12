---
name: react-components
description: Crear, refactorizar y mantener componentes reutilizables de React con JavaScript y JSX.
---

# React Components

## Reglas
1. Crear componentes funcionales con nombres en PascalCase.
2. Usar props explícitas y nombres descriptivos.
3. Mantener una responsabilidad principal por componente.
4. Extraer lógica compartida cuando exista una necesidad real.
5. Evitar duplicar código.
6. Utilizar listas con una propiedad `key` estable.
7. No modificar directamente las props.
8. Evitar componentes gigantes y condiciones excesivamente complejas.
9. Gestionar correctamente estados de carga, error y contenido vacío cuando corresponda.
10. Mantener la accesibilidad de botones, formularios y elementos interactivos.

## Archivos
Cuando el componente lo requiera, organizarlo así:

- `ComponentName.jsx`
- `ComponentName.css`
- `index.js`, únicamente si aporta valor a las importaciones.

No crear archivos adicionales innecesarios.
