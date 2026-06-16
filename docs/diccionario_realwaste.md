# Diccionario de datos — Dataset RealWaste

## 1. Título y resumen

**Diccionario de datos del conjunto RealWaste** utilizado para el entrenamiento por transferencia del modelo ResNet50 del proyecto **EcoClasificador** (UPATecO, Salta).

RealWaste es un conjunto de imágenes de residuos sólidos urbanos fotografiados en un entorno real de gestión de residuos (un centro de tratamiento en Australia), organizado en 9 clases de materiales. A diferencia de datasets de estudio como TrashNet, las imágenes muestran objetos sucios, deformados, parcialmente cubiertos y con iluminación de planta, lo que acerca la tarea a las condiciones reales de uso. El proyecto EcoClasificador utiliza las 9 clases originales sin modificar para alimentar un clasificador ResNet50 ajustado por transferencia y exportado a ONNX.

Este documento describe el origen, la licencia, la composición por clases, las características técnicas, el preprocesado aplicado en producción y la partición train/val/test. Todos los conteos del dataset son verificables contra la ficha oficial del UCI Machine Learning Repository.

---

## 2. Origen y licencia

- **Repositorio:** UCI Machine Learning Repository.
- **URL:** https://archive.ics.uci.edu/dataset/908/realwaste
- **DOI:** `10.24432/C5SS4G`
- **Licencia:** Creative Commons Attribution 4.0 International (CC BY 4.0). Permite compartir y adaptar el material con la atribución correspondiente.

**Cita (formato APA):**

> Single, S., Iranmanesh, S., & Raad, R. (2023). *RealWaste* [Conjunto de datos]. UCI Machine Learning Repository. https://doi.org/10.24432/C5SS4G

**Artículo de referencia (formato APA):**

> Single, S., Iranmanesh, S., & Raad, R. (2023). RealWaste: A novel real-life data set for landfill waste classification using deep learning. *Information, 14*(12), 633. https://doi.org/10.3390/info14120633

> **Nota sobre la autoría:** el tercer autor es **Raad, R.** (Raad Raad), según figura en la ficha oficial del UCI Machine Learning Repository y en el artículo publicado en la revista *Information* (MDPI). Una referencia interna previa del proyecto lo citaba como "Behdad, R."; ese dato es incorrecto y se corrige aquí conforme a la fuente oficial.

---

## 3. Clases y conteo de imágenes

El conjunto contiene **9 clases**. Los nombres se reproducen exactamente como los usa el modelo en producción (ver `backend/service/model_service.py`). Los conteos corresponden a la ficha oficial del UCI Machine Learning Repository.

| # | Clase | Imágenes | % del total |
|---|-------|---------:|------------:|
| 1 | Cardboard | 461 | 9,70 % |
| 2 | Food Organics | 411 | 8,65 % |
| 3 | Glass | 420 | 8,84 % |
| 4 | Metal | 790 | 16,62 % |
| 5 | Miscellaneous Trash | 495 | 10,42 % |
| 6 | Paper | 500 | 10,52 % |
| 7 | Plastic | 921 | 19,38 % |
| 8 | Textile Trash | 318 | 6,69 % |
| 9 | Vegetation | 436 | 9,18 % |
| | **Total** | **4 752** | **100 %** |

Los porcentajes se calcularon sobre el total de 4 752 imágenes y se redondearon a dos decimales; la suma puede no dar exactamente 100,00 % por redondeo.

---

## 4. Características técnicas

| Atributo | Valor |
|----------|-------|
| Número total de imágenes | 4 752 |
| Número de clases | 9 |
| Resolución original | 524 × 524 píxeles |
| Formato de archivo | JPG |
| Espacio de color | RGB (color) |
| Organización | Una carpeta por clase, con sus imágenes dentro |
| Tipo de tarea | Clasificación de imágenes (un solo rótulo por imagen) |

> **Nota sobre la resolución:** la ficha oficial de UCI indica una resolución de 524 × 524 píxeles. El informe del proyecto observa además que la proporción y resolución pueden presentar variaciones, lo que motiva el redimensionado uniforme a 224 × 224 antes de la inferencia (ver Sección 5). En cualquier caso, todas las imágenes se llevan a 224 × 224 en el pipeline de inferencia, por lo que la resolución original no afecta la entrada del modelo.

---

## 5. Preprocesado aplicado (pipeline de inferencia)

El preprocesado en producción está implementado en `backend/service/model_service.py` (clase `ModelService`, método `predict`). El mismo pipeline debe replicarse en entrenamiento para evitar *training/serving skew*. Pasos exactos:

1. **Decodificación y espacio de color:** la imagen se abre con Pillow y se convierte a `RGB` (`Image.open(...).convert('RGB')`).
2. **Redimensionado:** a 224 × 224 píxeles con interpolación **bilineal** (`img.resize((224, 224), Image.Resampling.BILINEAR)`).
3. **Escalado a [0, 1]:** se convierte a `numpy.float32` y se divide por 255 (`np.array(img, dtype=np.float32) / 255.0`).
4. **Reordenamiento de ejes HWC → CHW:** `np.transpose(img_array, (2, 0, 1))`.
5. **Normalización ImageNet:**
   - media (mean) = `[0.485, 0.456, 0.406]`
   - desviación estándar (std) = `[0.229, 0.224, 0.225]`
   - operación: `(img_array - mean) / std`
6. **Dimensión de batch:** se añade el eje de lote, quedando un tensor `(1, C, H, W)` = `(1, 3, 224, 224)`.
7. **Inferencia ONNX:** *forward pass* sobre la sesión ONNX Runtime en CPU (`CPUExecutionProvider`), produciendo 9 *logits*.
8. **Softmax:** se aplica softmax estable (resta del máximo antes de exponenciar) sobre los 9 *logits* para obtener la distribución de probabilidades por clase.
9. **Salida:** clase predicha (argmax) más la lista de las 9 clases con su probabilidad, ordenada de mayor a menor.

---

## 6. Partición train / val / test

> **Partición train/val/test pendiente de confirmar con el responsable del modelo (DC).** RealWaste no provee splits oficiales; el conjunto se distribuye únicamente como imágenes organizadas en una carpeta por clase. Se asume una partición estratificada estándar (p. ej. 70/15/15) — **confirmar valor real.**

Lo que sí está documentado en el informe del proyecto (`INFORME_ECOCLASIFICADOR/informe_v2.md`) es el **criterio**: la división train/val/test se realiza de forma **estratificada por clase**, para preservar la proporción de cada categoría en cada partición, dada la naturaleza no balanceada del dataset. Las proporciones numéricas exactas y los conteos por partición no fueron medidos ni registrados en el código del backend ni en el informe, por lo que **no se reportan cifras** para evitar inventar valores que se presenten como medidos.

---

## 7. Notas y consideraciones

- **Desbalance de clases.** El dataset está claramente desbalanceado: la clase mayoritaria es **Plastic (921 imágenes, 19,38 %)** y la minoritaria es **Textile Trash (318 imágenes, 6,69 %)**, una relación de aproximadamente **2,9 a 1**. **Metal (790)** también está sobrerrepresentada frente a clases como **Textile Trash (318)** o **Food Organics (411)**. Esto justifica:
  - la partición estratificada por clase (Sección 6),
  - y la conveniencia de reportar, al cierre experimental, F1 por clase y matriz de confusión además de la exactitud global, ya que la exactitud agregada puede ocultar mal desempeño en las clases minoritarias.
- **Sesgo de dominio.** Las fotografías fueron tomadas en una planta de gestión de residuos en Australia, con una iluminación y un perfil de residuos que no necesariamente coinciden con los del consumo argentino. El modelo puede generalizar peor frente a envases, marcas y tipos de packaging típicamente argentinos no representados en el entrenamiento.
- **Condiciones reales vs. estudio.** Las imágenes incluyen suciedad, deformaciones y oclusiones parciales (a diferencia de TrashNet, con fondo limpio). Esto encarece la tarea pero acerca el modelo a las condiciones reales de uso final.
- **Coherencia de nombres de clase.** Los 9 nombres de clase de este documento coinciden exactamente, en orden y ortografía, con la lista `class_names` del backend, de modo que el índice del *softmax* mapea directamente al nombre de clase correcto.
- **Honestidad sobre métricas.** Este diccionario describe únicamente el dato (dataset y preprocesado). **No incluye métricas del modelo** (exactitud, F1, matriz de confusión); según el informe, esas cifras se publicarán al cierre del sprint experimental y no fueron medidas en condiciones controladas al momento de redactar.

---

*Fuentes verificadas: ficha oficial del UCI Machine Learning Repository (https://archive.ics.uci.edu/dataset/908/realwaste) y artículo Single, Iranmanesh & Raad (2023), Information, 14(12), 633. Preprocesado tomado de `backend/service/model_service.py`. Criterio de partición tomado de `INFORME_ECOCLASIFICADOR/informe_v2.md`.*
