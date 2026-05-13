# Assets requeridos en `public/`

El frontend referencia estos archivos. **Guardalos en esta carpeta exactamente con estos nombres y extensiones**:

| Archivo            | Qué es                                  | Dónde se usa                                |
| ------------------ | --------------------------------------- | ------------------------------------------- |
| `logo-eco.png`     | Logo "ECO CLASIFICADOR" (cuadrado)      | Header, Footer, LoadingScreen, Hero, CTA, favicon |
| `canecas.png`      | Ilustración de 6 contenedores de colores | Sección "Aprendé a separar" en Home         |
| `logo.svg`         | Logo viejo (compat, se mantiene como fallback) | Favicon de fallback                  |
| `hero.svg`         | Ilustración hero original (legacy)      | (no se usa en la versión actual)            |

## Cómo agregarlos desde el Finder

1. Arrastrá el PNG del logo a esta carpeta y renombralo a **`logo-eco.png`**.
2. Arrastrá el PNG de las canecas y renombralo a **`canecas.png`**.

Listo. Recargá la página (`npm run dev` ya tiene HMR) y los assets aparecen sin tocar código.
