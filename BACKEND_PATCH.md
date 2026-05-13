# Cambios para que el frontend funcione con tu API

> Repo: https://github.com/DanielChachagua/clasificador-residuos
> Para: **Daniel Marcelo Chachagua Garrido** (backend).

El frontend ya consume bien `POST /api/v1/predict` con `multipart/form-data` campo `file` — el contrato matchea 100% (probado).
Pero hoy falla desde el browser por dos cosas:

1. **No tenés CORS** habilitado → ningún navegador puede llamar a la API.
2. La API solo corre en **localhost** → un usuario en internet no la alcanza.

Solución: agregar CORS (4 líneas) y deployarla en **Railway** (gratis, ~5 min).

---

## 1. Agregar CORS — `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clasificador de residuos")

# 👇 AGREGAR
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # mientras es proyecto educativo
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

(Si después querés cerrarlo, reemplazá `"*"` por la lista:
`["http://localhost:3000", "https://kalu-20.github.io", "https://clasificadorresiduo.lat", "https://www.clasificadorresiduo.lat"]`.)

---

## 2. Preparar un Dockerfile sencillo

El `Dockerfile` que tenés ahora compila con Nuitka — pesa mucho y para deploy gratis conviene uno simple. Reemplazalo por:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx libglib2.0-0 wget && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Si el .onnx no está versionado en el repo, descargalo acá:
# RUN wget -O model.onnx "<URL pública del modelo>"
# RUN wget -O model.onnx.data "<URL pública del .data>"

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

⚠️ **Importante con el modelo `.onnx`:** Railway no clona Drive.
- **Opción A:** subilo a [GitHub Releases](https://github.com/DanielChachagua/clasificador-residuos/releases/new) y descargalo con `wget` en el Dockerfile (líneas comentadas arriba).
- **Opción B:** commiteá el `.onnx` al repo si pesa < 100 MB (usá Git LFS si pesa más).

---

## 3. Deploy en Railway (5 min)

1. Entrá a https://railway.app/new y logueate con GitHub.
2. **Deploy from GitHub repo** → seleccioná `DanielChachagua/clasificador-residuos`.
3. Railway detecta el Dockerfile automático y empieza a buildear.
4. Una vez deployado, vas a **Settings → Networking → Generate Domain** para obtener una URL pública tipo:
   ```
   https://clasificador-residuos-production.up.railway.app
   ```
5. Probalo:
   ```bash
   curl -X POST https://TU-DOMINIO.up.railway.app/api/v1/predict \
        -F "file=@imagen.jpg"
   ```

Railway da **$5/mes de crédito gratis** que sobran de sobra para una demo.

---

## 4. Avisar la URL al frontend

Pasale la URL pública a María Claudia. En la página `/clasificar` hay un botón **"Cambiar URL"** — pegás:

```
https://TU-DOMINIO.up.railway.app/api/v1/predict
```

Queda guardado en `localStorage` del browser.

---

## Test rápido de CORS desde la consola del browser

Una vez deployado, abrí la consola del browser en cualquier página y corré:

```js
fetch("https://TU-DOMINIO.up.railway.app/api/v1/predict", {
  method: "POST",
  body: new FormData()
}).then(r => console.log("OK status:", r.status))
  .catch(e => console.error("ERROR:", e));
```

Si devuelve `422` (porque mandamos FormData vacío) → **CORS OK**, todo joya.
Si devuelve `Failed to fetch` → CORS sigue sin estar.
