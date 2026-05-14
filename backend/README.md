# EcoClasificador · Backend API

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX-1.18-005CED?logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](Dockerfile)

API REST de clasificación de residuos basada en una **red neuronal convolucional ResNet50** entrenada por **Transfer Learning** sobre el dataset abierto [**RealWaste**](https://doi.org/10.24432/C5SS4G) (UCI Machine Learning Repository).

---

## 🧠 Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (async + auto-docs en `/docs`).
- **Runtime de inferencia**: [ONNX Runtime](https://onnxruntime.ai/) (CPU).
- **Preprocesado**: Pillow + NumPy (resize 224×224 + normalización estilo ImageNet).
- **Server**: Uvicorn `[standard]`.
- **Deploy**: Docker → Railway / Render / Fly.io.

---

## 📡 Endpoints

| Método | Ruta              | Descripción                                                 |
| ------ | ----------------- | ----------------------------------------------------------- |
| GET    | `/`               | Metadata de la API (nombre, versión, links a docs y predict)|
| GET    | `/health`         | Health check (usado por Railway / Render)                   |
| GET    | `/docs`           | Swagger UI auto-generada                                    |
| GET    | `/redoc`          | ReDoc auto-generada                                         |
| POST   | `/api/v1/predict` | Recibe una imagen y devuelve la clase + probabilidades       |

### Request `POST /api/v1/predict`

```http
Content-Type: multipart/form-data
file: <imagen JPG / JPEG / PNG>
```

### Response

```json
{
  "predicted_class": "Plastic",
  "probabilities": [
    { "class_name": "Plastic", "probability": 0.9521 },
    { "class_name": "Metal",   "probability": 0.0312 },
    { "class_name": "Glass",   "probability": 0.0098 }
  ]
}
```

### Categorías soportadas

`Cardboard · Food Organics · Glass · Metal · Miscellaneous Trash · Paper · Plastic · Textile Trash · Vegetation`

---

## 🏃 Correr localmente

```bash
# 1. Entorno virtual
python3 -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate

# 2. Dependencias
pip install -r requirements.txt

# 3. Descargar el modelo (lo hace gdown automáticamente)
python -m gdown --id 12vOZKjBJ_2XhtSDgNPVNjkijKscUKK7O -O model.onnx
python -m gdown --id 1u4q5QCdn2PjFiZX4mHyY9ED3S6kxbOYu -O model.onnx.data

# 4. Levantar API
uvicorn main:app --reload
```

Abrí http://127.0.0.1:8000/docs y probá el endpoint con cualquier imagen.

---

## 🐳 Correr con Docker

El `Dockerfile` descarga el modelo en build (no hace falta tenerlo local):

```bash
docker build -t ecoclasificador-api .
docker run -p 8000:8000 --rm ecoclasificador-api
```

---

## 🚀 Desplegar en Railway (recomendado)

1. **Login** en https://railway.app con GitHub.
2. **New Project → Deploy from GitHub repo** → seleccioná `kalu-20/Front-clasificador`.
3. **Root Directory**: `backend` (importante — el repo es monorepo).
4. Railway detecta el `Dockerfile` y el `railway.json` automáticamente.
5. **Settings → Networking → Generate Domain** te da una URL pública tipo
   `https://ecoclasificador-api-production.up.railway.app`.

### Variables de entorno opcionales en Railway

| Variable                   | Default       | Descripción                                         |
| -------------------------- | ------------- | --------------------------------------------------- |
| `PORT`                     | (inyectada)   | Railway la setea sola. No la toques.                |
| `LOG_LEVEL`                | `INFO`        | `DEBUG`, `INFO`, `WARNING`, `ERROR`.                |
| `CORS_ALLOW_ORIGINS`       | lista segura  | `*` o lista separada por coma.                      |
| `CORS_ALLOW_ORIGIN_REGEX`  | (vacío)       | Útil para previews de Vercel: `https://.*\.vercel\.app` |

Por defecto el backend ya permite:

- `http://localhost:3000` (dev)
- `https://kalu-20.github.io` (GH Pages)
- `https://clasificadorresiduo.lat` y `https://www.clasificadorresiduo.lat`

---

## 📦 Estructura

```
backend/
├── handler/
│   └── prediction_handler.py   # router POST /predict
├── service/
│   └── model_service.py        # carga ONNX + inferencia + preproc
├── main.py                     # FastAPI app + CORS + lifespan
├── requirements.txt
├── Dockerfile                  # build prod para Railway
├── railway.json                # config de deploy
├── .dockerignore
├── .env.example
└── README.md
```

---

## 🔬 Modelo

- **Arquitectura**: ResNet50 fine-tuned.
- **Input shape**: `(1, 3, 224, 224)` float32.
- **Preproc**: resize bilineal a 224×224 → escala `[0,1]` → normalización ImageNet (`mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]`).
- **Output**: logits sobre 9 clases → softmax.

### Dataset

> Single, S., Iranmanesh, S., & Raad, R. (2023). **RealWaste** [Dataset].
> UCI Machine Learning Repository. https://doi.org/10.24432/C5SS4G

---

## ✍️ Créditos

Backend implementado por **Daniel Marcelo Chachagua Garrido** y **Victoria Macarena Alvarez** como parte del proyecto educativo **EcoClasificador** — UPATecO Salta · 2026.

Repo original del backend: https://github.com/DanielChachagua/clasificador-residuos
