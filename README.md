# EcoClasificador — Frontend

Frontend premium para EcoClasificador: una experiencia ultra moderna para clasificar residuos con IA.

🌐 **Demo:** https://kalu-20.github.io/Front-clasificador/

## Stack

- [Next.js 14](https://nextjs.org/) (App Router · static export)
- [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) con design system propio
- [Framer Motion](https://www.framer.com/motion/) · [GSAP](https://gsap.com/)
- [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling
- [Swiper](https://swiperjs.com/) para sliders

## Paleta institucional

| Color           | Hex       | Uso                                        |
| --------------- | --------- | ------------------------------------------ |
| Verde oliva     | `#447A00` | Header, accents, líneas de progreso        |
| Amarillo pastel | `#FCF291` | Fondo principal                            |
| Morado vino     | `#7C1155` | Botones primarios, títulos                 |
| Crema           | `#FFF6C2` | Texto sobre superficies oscuras            |
| Magenta footer  | `#820F52` | Variante del morado (footer)               |

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:3000
```

## Build estático

```bash
npm run build:pages   # genera /out con basePath = /Front-clasificador
```

## Despliegue automático

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) corre en cada push a `main`:

1. Instala dependencias con `npm ci`.
2. Genera el build estático con `GITHUB_PAGES=true npm run build:pages`.
3. Agrega `.nojekyll` y publica el contenido de `out/` a GitHub Pages.

Para activar el deploy:

1. En el repo: **Settings → Pages → Source: GitHub Actions**.
2. Hacé push a `main`. GitHub Actions se encarga del resto.

## API backend

La página `/clasificar` consume una API REST (FastAPI + ResNet50 ONNX).
URL configurable desde la UI (`Cambiar URL`) o por defecto:

```
http://127.0.0.1:8000/api/v1/predict
```

Respuesta esperada:

```json
{
  "predicted_class": "Plastic",
  "probabilities": [
    { "class_name": "Plastic", "probability": 0.95 },
    { "class_name": "Metal",   "probability": 0.03 }
  ]
}
```

## Estructura

```
app/                  páginas (App Router)
components/           UI por feature (home/, sobre/, clasificar/, ui/)
hooks/                hooks reutilizables (lenis, parallax, tilt, glow)
lib/                  motion variants, data mock, API client, cn()
public/               assets estáticos (svg, og)
.github/workflows/    deploy.yml a GitHub Pages
```

## Categorías soportadas (9)

📦 Cartón · 🍎 Orgánico · 🍾 Vidrio · 🥫 Metal · 🗑️ Misceláneo · 📄 Papel · 🥤 Plástico · 👕 Textil · 🌿 Vegetación

## Créditos

Proyecto educativo — **UPATecO Salta · 2026**.
Dataset: Single, S., Iranmanesh, S., & Raad, R. (2023). RealWaste. UCI ML Repository.
[doi.org/10.24432/C5SS4G](https://doi.org/10.24432/C5SS4G)
