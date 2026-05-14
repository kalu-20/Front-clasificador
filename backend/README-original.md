# Clasificador de Residuos - API (FastAPI)

Esta aplicación provee una API robusta construida en **FastAPI** para clasificar imágenes de residuos utilizando un modelo de inteligencia artificial (ResNet50). Permite a los usuarios enviar una imagen y recibir la clase predicha junto con el nivel de probabilidad.

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para levantar la aplicación en tu entorno local:

### 1. Requisitos previos
- Python 3.10 o superior (recomendado 3.12).

### 2. Crear y activar el entorno virtual
Es altamente recomendado aislar las dependencias del proyecto usando un entorno virtual.

**En Linux / macOS:**
```bash
# Crear el entorno virtual llamado 'env'
python3 -m venv env

# Activar el entorno virtual
source env/bin/activate
```

**En Windows:**
```cmd
# Crear el entorno virtual llamado 'env'
python -m venv env

# Activar el entorno virtual
env\Scripts\activate
```

### 3. Instalar dependencias
Con tu entorno virtual activo (verás un `(env)` al inicio de la línea en tu terminal), instala las librerías requeridas ejecutando:
```bash
pip install -r requirements.txt
```

### 3. Descargar y colocar el Modelo
Por motivos de peso, los modelos no se incluyen en el repositorio de código. Debes descargarlos desde los siguientes enlaces:
- [Modelo ONNX (`.onnx`)](https://drive.google.com/file/d/12vOZKjBJ_2XhtSDgNPVNjkijKscUKK7O/view?usp=sharing)
- [Pesos del Modelo (`.onnx.data`)](https://drive.google.com/file/d/1u4q5QCdn2PjFiZX4mHyY9ED3S6kxbOYu/view?usp=sharing)

**¿Cómo usarlos?**
Descarga **ambos archivos** y colócalos directamente en la **carpeta raíz** de este proyecto (donde se encuentra `main.py`). La aplicación detectará automáticamente el archivo `.onnx` al arrancar.

### 4. Levantar el servidor
Una vez que las dependencias estén instaladas y el modelo se encuentre en la raíz, arranca la API con Uvicorn:
```bash
uvicorn main:app --reload
```
La aplicación estará corriendo en: `http://127.0.0.1:8000`

---

## 📖 Documentación interactiva y uso del Endpoint

FastAPI genera automáticamente documentación interactiva (Swagger UI). 

1. Con el servidor corriendo, abre tu navegador y ve a:
   👉 **http://127.0.0.1:8000/docs**
2. Verás el endpoint `POST /api/v1/predict`.
3. Haz clic en el botón **"Try it out"**.
4. En el campo `file`, selecciona una imagen de basura o residuo desde tu computadora.
5. Presiona **"Execute"**. 
6. Recibirás un JSON de respuesta con la categoría predicha y las probabilidades, por ejemplo:
```json
{
  "predicted_class": "Plastic",
  "probabilities": [
    {
      "class_name": "Plastic",
      "probability": 0.95
    },
    {
      "class_name": "Metal",
      "probability": 0.03
    },
    ...
  ]
}
```

---

## 🧠 ¿Cómo toma decisiones el modelo?

El motor principal de esta API es un modelo desarrollado en PyTorch (visible en el archivo *`Modelo_de_Reconocimiento_Residuos.ipynb`*) que luego fue exportado al formato universal **ONNX** para inferencia eficiente.

El funcionamiento se basa en el principio de **Transfer Learning**:
1. **Arquitectura Base**: Utiliza una red neuronal convolucional **ResNet50**, que ha sido pre-entrenada con millones de imágenes genéricas para aprender características visuales fundamentales (bordes, texturas, formas).
2. **Adaptación**: Las capas iniciales de ResNet50 se "congelan", y se reemplaza la capa final (Fully Connected Layer) para ajustarse específicamente a las 9 categorías de nuestro proyecto.
3. **Preprocesamiento**: Cuando envías una imagen, el servicio la redimensiona a $224 \times 224$ píxeles, la convierte en un Tensor y la normaliza utilizando las medias y desviaciones estándar estándar de la red ResNet original.
4. **Decisión**: La imagen pasa a través de la red, y la última capa arroja *logits* que se pasan por una función *Softmax* para convertirlos en porcentajes de probabilidad para cada una de estas 9 clases:
   - *Cardboard* (Cartón), *Food Organics* (Orgánicos), *Glass* (Vidrio), *Metal*, *Miscellaneous Trash* (Basura miscelánea), *Paper* (Papel), *Plastic* (Plástico), *Textile Trash* (Textiles), *Vegetation* (Vegetación).

---

## 📚 Referencia del Dataset

Este modelo fue entrenado utilizando el **RealWaste Dataset**.  
Agradecemos y reconocemos el uso de esta base de datos pública:

> Single, S., Iranmanesh, S., & Raad, R. (2023). RealWaste [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5SS4G.
