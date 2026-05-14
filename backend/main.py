"""
EcoClasificador — Waste Classifier API
FastAPI + ONNX (ResNet50) — entrenado sobre RealWaste (UCI ML Repository).
"""
from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from handler.prediction_handler import router as prediction_router
from service.model_service import ModelService

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("ecoclasificador.api")


def find_model():
    """Busca un archivo .onnx en la carpeta del proyecto o el cwd."""
    for directory in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
        if not os.path.isdir(directory):
            continue
        for entry in os.listdir(directory):
            lower = entry.lower()
            if lower.endswith(".onnx") and not lower.endswith(".data"):
                return os.path.join(directory, entry)
    return None


def parse_origins(raw):
    """
    Parsea CORS_ALLOW_ORIGINS. Acepta:
    - "*"  → wildcard
    - "https://a.com,https://b.com" → lista exacta
    Default: lista segura conocida del proyecto.
    """
    if raw and raw.strip() == "*":
        return ["*"]
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://kalu-20.github.io",
        "https://clasificadorresiduo.lat",
        "https://www.clasificadorresiduo.lat",
    ]


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_file = find_model()
    if not model_file:
        raise RuntimeError(
            "No se encontró ningún archivo .onnx en la raíz del proyecto. "
            "Asegurate de que el Dockerfile descargue el modelo en /app."
        )
    log.info("Cargando modelo ONNX: %s", model_file)
    app.state.model_service = ModelService(model_file)
    log.info("Modelo cargado exitosamente.")
    yield
    log.info("Apagando aplicación.")


app = FastAPI(
    title="EcoClasificador API",
    description=(
        "API de clasificación de residuos basada en visión computacional. "
        "Recibe una imagen y devuelve la clase predicha + distribución de "
        "probabilidades sobre 9 categorías del dataset RealWaste."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_origins(os.getenv("CORS_ALLOW_ORIGINS")),
    allow_origin_regex=os.getenv("CORS_ALLOW_ORIGIN_REGEX"),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/api/v1")


@app.get("/", tags=["meta"])
def root():
    return {
        "name": "EcoClasificador API",
        "version": "1.0.0",
        "docs": "/docs",
        "predict": "/api/v1/predict",
    }


@app.get("/health", tags=["meta"])
def health():
    """Health check para Railway/Render."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
    )
