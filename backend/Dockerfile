# syntax=docker/dockerfile:1.6
# EcoClasificador API — production image for Railway / Render / Fly.io

FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Dependencias del sistema (Pillow + onnxruntime las usan, además de wget para fallback)
# Nota: en las bases Debian recientes de python:3.12-slim el paquete
# libgl1-mesa-glx fue reemplazado por libgl1 (el nombre viejo ya no existe y
# rompe el build). Usamos libgl1.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 \
        wget \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Usuario no-root (mejor práctica de seguridad)
RUN useradd --create-home --shell /bin/bash app
WORKDIR /app

# 1. Dependencias Python primero (mejor cache de capas Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Descargar el modelo ONNX desde Google Drive durante el build
#    IDs del modelo público del proyecto (RealWaste · ResNet50 fine-tuned).
#    Si querés overridearlos, pasá build-args:
#        docker build --build-arg MODEL_ID=NUEVO_ID --build-arg MODEL_DATA_ID=NUEVO_ID_DATA ...
ARG MODEL_ID=12vOZKjBJ_2XhtSDgNPVNjkijKscUKK7O
ARG MODEL_DATA_ID=1u4q5QCdn2PjFiZX4mHyY9ED3S6kxbOYu

# gdown 5.x eliminó la opción --id; ahora se pasa la URL de Drive (o el id posicional).
# IMPORTANTE: el .onnx referencia su data externa por el nombre
# "waste_classifier_resnet50.onnx.data" (ruta relativa embebida en el modelo),
# así que el archivo de datos DEBE llamarse exactamente así y estar junto al .onnx.
RUN python -m gdown "https://drive.google.com/uc?id=${MODEL_ID}"      -O /app/waste_classifier_resnet50.onnx \
 && python -m gdown "https://drive.google.com/uc?id=${MODEL_DATA_ID}" -O /app/waste_classifier_resnet50.onnx.data \
 && ls -lh /app/waste_classifier_resnet50.onnx /app/waste_classifier_resnet50.onnx.data

# 3. Copiar el código de la app
COPY . .

# 4. Permisos al usuario non-root
RUN chown -R app:app /app
USER app

# 5. Health check (Railway / Render lo aprovechan)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:${PORT:-8000}/health || exit 1

# Railway/Render inyectan $PORT
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
