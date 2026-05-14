<div align="center">

<img src="public/logo-eco.png" alt="EcoClasificador" width="120" />

# EcoClasificador

**Reciclá mejor. Una foto basta.**

Plataforma full-stack que clasifica residuos en 9 categorías usando una red neuronal **ResNet50** entrenada sobre el dataset abierto **RealWaste**.

[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ONNX](https://img.shields.io/badge/ONNX-Runtime-005CED?logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![License](https://img.shields.io/badge/license-MIT-A21CAF.svg)](LICENSE)

🌐 **Demo:** https://clasificadorresiduo.lat &nbsp;·&nbsp; [GitHub Pages mirror](https://kalu-20.github.io/Front-clasificador/) &nbsp;·&nbsp; [API docs](https://ecoclasificador-api-production.up.railway.app/docs)

</div>

---

## 🧬 Visión general

EcoClasificador es un **proyecto educativo** que demuestra cómo bajar la fricción del reciclaje doméstico usando visión computacional. El usuario sube una foto del residuo y el sistema:

1. **Procesa la imagen** (resize 224×224, normalización ImageNet).
2. **Infiere** sobre un modelo ResNet50 fine-tuned (ONNX Runtime, CPU).
3. **Devuelve** la clase predicha + distribución de probabilidades sobre 9 categorías.
4. **Recomienda** el contenedor de reciclaje correcto.

Detrás hay una **arquitectura monorepo**: el frontend está hecho en Next.js con animaciones cinematográficas, y el backend en FastAPI con Docker, desplegado en Railway.

---

## 🗂️ Estructura del monorepo

```
.
├── app/                    # Next.js App Router — páginas
├── components/             # UI por feature (home/, sobre/, clasificar/, ui/)
├── hooks/                  # React hooks reutilizables (lenis, parallax, tilt, glow)
├── lib/                    # api client, motion variants, data mock, cn()
├── public/                 # assets estáticos (logo, canecas, fonts)
│
├── backend/                # 🐍 FastAPI + ONNX (ResNet50)
│   ├── handler/            # routers
│   ├── service/            # carga del modelo + preprocesado
│   ├── main.py             # entrypoint
│   ├── requirements.txt
│   ├── Dockerfile          # build prod para Railway
│   └── README.md
│
├── .github/workflows/      # CI/CD — deploy a GitHub Pages
└── README.md
```

---

## 🎨 Diseño

| Color           | Hex       | Uso                                    |
| --------------- | --------- | -------------------------------------- |
| Verde oliva     | `#447A00` | Header, accents, indicadores           |
| Amarillo pastel | `#FCF291` | Fondo principal                        |
| Morado vino     | `#7C1155` | Botones primarios, títulos             |
| Crema           | `#FFF6C2` | Texto sobre superficies oscuras        |
| Magenta footer  | `#820F52` | Variante del morado                    |

- **Tipografía**: [Alice](https://fonts.google.com/specimen/Alice) (serif clásica, transmite formalidad y conexión con la naturaleza).
- **Animaciones**: Framer Motion + Lenis smooth scroll + Swiper.
- **Accesibilidad**: respeta `prefers-reduced-motion`, focus rings visibles, contraste AA.

---

## 🚀 Cómo correrlo localmente

### Prerequisitos

- Node.js ≥ 18
- Python ≥ 3.10
- Docker (opcional, para el backend)

### Frontend (Next.js)

```bash
npm install
npm run dev          # http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Descargar el modelo (~250 MB)
python -m gdown --id 12vOZKjBJ_2XhtSDgNPVNjkijKscUKK7O -O model.onnx
python -m gdown --id 1u4q5QCdn2PjFiZX4mHyY9ED3S6kxbOYu -O model.onnx.data

uvicorn main:app --reload   # http://127.0.0.1:8000/docs
```

### O todo con Docker (solo backend)

```bash
cd backend
docker build -t ecoclasificador-api .
docker run -p 8000:8000 --rm ecoclasificador-api
```

---

## ☁️ Despliegue

| Capa     | Proveedor      | URL                                                                |
| -------- | -------------- | ------------------------------------------------------------------ |
| Frontend | **Vercel**     | https://clasificadorresiduo.lat (custom domain via Namecheap)      |
| Frontend | GitHub Pages   | https://kalu-20.github.io/Front-clasificador/ (mirror)             |
| Backend  | **Railway**    | https://ecoclasificador-api-production.up.railway.app              |
| Dominio  | Namecheap      | `clasificadorresiduo.lat` apuntando a Vercel                       |

### Build estático del frontend

```bash
npm run build           # Vercel y self-hosting (root)
npm run build:pages     # GitHub Pages (basePath /Front-clasificador)
```

### Deploy del backend en Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template?template=https%3A%2F%2Fgithub.com%2Fkalu-20%2FFront-clasificador&rootDirectory=backend)

Ver guía paso a paso en [`backend/README.md`](backend/README.md#-desplegar-en-railway-recomendado). Resumen:

1. `railway.app/new` → Deploy from GitHub repo.
2. **Root Directory**: `backend`.
3. Railway detecta el `Dockerfile` y el `railway.json`, buildea, descarga el modelo, expone la API.
4. Settings → Networking → **Generate Domain**.

---

## 📡 API

### `POST /api/v1/predict`

```http
Content-Type: multipart/form-data
file: <imagen JPG / JPEG / PNG>
```

Respuesta:

```json
{
  "predicted_class": "Plastic",
  "probabilities": [
    { "class_name": "Plastic", "probability": 0.95 },
    { "class_name": "Metal",   "probability": 0.03 }
  ]
}
```

Documentación interactiva: **`/docs`** (Swagger UI).

### Categorías (9)

| Emoji | Clase                | Contenedor               |
| ----- | -------------------- | ------------------------ |
| 📦    | Cardboard            | Azul (papel/cartón)      |
| 🍎    | Food Organics        | Marrón (compost)         |
| 🍾    | Glass                | Verde                    |
| 🥫    | Metal                | Amarillo / Gris          |
| 🗑️    | Miscellaneous Trash  | Gris                     |
| 📄    | Paper                | Azul                     |
| 🥤    | Plastic              | Amarillo                 |
| 👕    | Textile Trash        | Punto verde textil       |
| 🌿    | Vegetation           | Compost                  |

---

## 👥 Equipo

| Rol         | Persona                                  |
| ----------- | ---------------------------------------- |
| **Frontend** | María Claudia Fabián                     |
| **Frontend** | Fátima Isabel Sumbaine                   |
| **Backend**  | Daniel Marcelo Chachagua Garrido         |
| **Backend**  | Victoria Macarena Alvarez                |

Proyecto educativo · **UPATecO Salta · 2026**.

---

## 📚 Dataset y referencia académica

> Single, S., Iranmanesh, S., & Raad, R. (2023). **RealWaste** [Dataset].
> UCI Machine Learning Repository.
> https://doi.org/10.24432/C5SS4G

El dataset RealWaste tiene **4 752 imágenes** etiquetadas en 9 categorías recolectadas en un centro real de manejo de residuos en Australia. Se usó como base para el fine-tuning de ResNet50 vía transfer learning.

---

## 🤝 Contribuir

Pull Requests bienvenidos. Para cambios mayores, abrí primero un issue para discutirlo.

```bash
# Workflow recomendado
git checkout -b feature/mi-cambio
git commit -m "feat: descripción corta"
git push origin feature/mi-cambio
# Después abrir PR en GitHub
```

---

## 📄 Licencia

[MIT](LICENSE) — libre uso educativo y comercial con atribución.
