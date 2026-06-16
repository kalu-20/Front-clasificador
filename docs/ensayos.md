# Ensayos y preparación de la defensa — EcoClasificador

**Proyecto:** EcoClasificador — Clasificador de residuos por visión computacional.
**Cátedra:** Modelado de Sistemas de Inteligencia Artificial Aplicada — UPATecO Salta · 2026.
**Defensa:** lunes 23 de junio de 2026.
**Equipo:** María Claudia Fabián (MC) · Fátima Isabel Sumbaine (FS) · Daniel Marcelo Chachagua Garrido (DC) · Victoria Macarena Alvarez (VA).
**Demo en vivo:** https://clasificadorresiduo.lat — API: https://ecoclasificador-api-production.up.railway.app/docs
**Duración objetivo total:** 3:00 ± 0:15.

Este documento concentra la planificación de los dos ensayos previos a la defensa y el banco de preguntas probables del jurado.

---

## Ensayo 1 — jueves 18 de junio de 2026

**Objetivo:** primera corrida completa cronometrada de las 4 partes, de punta a punta, en condiciones lo más parecidas posibles a la defensa real. El foco no es la perfección sino medir tiempos reales y detectar dónde nos pasamos o quedamos cortos.

### Script / guía de cronometraje

Tomar el tiempo de cada parte por separado (no solo el total). Una persona del equipo que no esté narrando hace de cronometrista. Tiempos objetivo extraídos del guion (`GUION_VIDEO/guion_v1.md`).

| # | Parte | Quién narra | Foco del bloque | Tiempo objetivo (mm:ss) | Tiempo real | Observaciones |
|---|-------|-------------|-----------------|--------------------------|-------------|---------------|
| 0 | Intro | (sin voz) | Logo, equipo, contexto académico | 0:07 | | |
| 1 | Parte 1 | MC | Gancho + problema + propuesta | 0:45 (00:07 → 00:52) | | |
| 2 | Parte 2 | FS | Demo en vivo + UX + accesibilidad / i18n | 0:45 (00:52 → 01:37) | | |
| 3 | Parte 3 | DC | Backend, API y arquitectura | 0:45 (01:37 → 02:22) | | |
| 4 | Parte 4 | VA | Modelo, dataset, cierre con CTA | 0:38 (02:22 → 03:00) | | |
| 5 | Cierre | (sin voz) | Créditos, "Gracias / Thanks" | 0:07 (02:53 → 03:00, solapado) | | |
| — | **TOTAL** | — | — | **~3:00** | | |

Notas de cronometraje:
- Ritmo de lectura asumido: ~140 palabras por minuto. Si suena apresurado, bajar a 130.
- Si una parte se pasa más de 5 s del objetivo, marcarlo en "Observaciones" y decidir qué frase recortar.
- Anotar también el tiempo de las transiciones entre integrantes (los "pases" tipo "Ahora Dani les muestra...", "Vicky te cuenta..."): suelen comerse segundos.

### Checklist técnico PRE-ensayo

Completar de arriba hacia abajo antes de empezar a cronometrar:

- [ ] Proyector / salida HDMI probada con la notebook real que se va a usar (resolución correcta, sin recortes de pantalla).
- [ ] Audio / micrófono probado: nivel de voz audible al fondo del aula, sin saturar.
- [ ] Conexión a internet estable verificada (probar abrir la demo, no solo "tener wifi"). Tener a mano el celular como hotspot de respaldo.
- [ ] Navegador con la demo ya abierta en dos pestañas: `https://clasificadorresiduo.lat/clasificar` y el Swagger `…/docs`.
- [ ] **Backend Railway DESPIERTO:** hacer un request a `/health` unos 5 minutos antes de empezar para despertarlo del sueño por inactividad. Ver Plan B abajo.
- [ ] 3 fotos de prueba listas en el escritorio / carpeta a mano y ya verificadas que clasifican bien:
  - [ ] Botella PET (plástico).
  - [ ] Jarra / frasco de vidrio.
  - [ ] Caja de cartón.
- [ ] Modo oscuro y toggle de idioma (ES/EN) probados al menos una vez antes (FS los usa en vivo).
- [ ] Guion impreso o en pantalla secundaria por si alguien se traba.
- [ ] Batería de la notebook al 100% o enchufada.

Comando rápido para despertar y verificar el backend (correr 5 min antes):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ecoclasificador-api-production.up.railway.app/health
```

Si devuelve `200`, el backend está despierto. Si tarda mucho o falla la primera vez, repetir: el primer request paga el cold start.

### PLAN B — si Railway está dormido o caído

El backend en Railway puede dormirse por inactividad. Es un riesgo conocido. Tres niveles de respaldo, en orden:

**(a) Despertar con un GET a `/health` y esperar el cold start.**
- Es lo primero y lo más probable. El plan gratuito de Railway suspende el servicio tras un rato sin tráfico.
- Hacer el `curl` de arriba (o simplemente abrir `…/health` en el navegador) **5 minutos antes** de la defensa.
- El cold start tarda aproximadamente 30 a 60 segundos: el servicio levanta el contenedor y carga el modelo ONNX en memoria una sola vez (en el `lifespan` de FastAPI). El primer request es lento, el resto ya van rápido.
- Una vez despierto, hacer una clasificación de prueba para confirmar que responde antes de mostrarlo al jurado.

**(b) Capturas / video pregrabado de la clasificación funcionando, como respaldo.**
- Tener listo, en una carpeta accesible sin internet, un screen recording corto (10–20 s) mostrando el flujo completo: subir foto → spinner → panel de resultado con clase y contenedor.
- También dejar 2–3 capturas de pantalla del panel de resultado ya resuelto (ej. "Plastic" con sus barras de probabilidad).
- Si la demo en vivo no carga, VA/FS narran sobre el video pregrabado sin frenar la presentación. Aclarar con honestidad que es una grabación de respaldo por la latencia del hosting gratuito.

**(c) Backend en local con `uvicorn`, apuntando el front a localhost.**
- Tener el repo del backend clonado y el entorno instalado en la notebook **antes** de la defensa (no improvisar en el aula).
- Levantar el servidor:
  ```bash
  cd backend
  uvicorn main:app --host 0.0.0.0 --port 8000
  ```
- Apuntar el frontend a `http://localhost:8000` mediante la variable de entorno de la URL de la API (la misma que usa para Railway). Probar este escenario una vez en el Ensayo 1 para que no sea la primera vez el día de la defensa.
- Ventaja: no depende de internet ni del estado de Railway. Verificar que el modelo `model.onnx` esté presente localmente.

Orden de decisión el día de la defensa: intentar (a); si en ~60 s no responde, pasar a (c) si está todo preparado; si tampoco, caer a (b) sin dramatizar.

### Rúbrica de auto-evaluación (Ensayo 1)

Puntuar cada criterio de 1 (flojo) a 5 (excelente). Anotar una acción concreta de mejora por cada criterio que quede por debajo de 4.

| Criterio | MC | FS | DC | VA | Equipo | Acción de mejora |
|----------|----|----|----|----|--------|------------------|
| Claridad (se entiende el mensaje, sin tecnicismos fuera de lugar) | | | | | | |
| Tiempo (cada parte dentro de su objetivo) | | | | | | |
| Fluidez en las transiciones (los "pases" entre integrantes) | | | | | | |
| Manejo de la demo (sin titubeos, sin pantallas en blanco) | | | | | | |

---

## Ensayo 2 — sábado 20 de junio de 2026

**Objetivo:** segunda corrida completa incorporando todos los ajustes detectados en el Ensayo 1. Debe quedar muy cerca de la versión final.

### Foco

- Pulir las transiciones entre integrantes: que los pases ("Les muestro cómo funciona", "Ahora Dani les muestra qué hay detrás", "Vicky te cuenta cómo entrenamos el modelo") salgan naturales y sin pausas muertas.
- Asegurar que la demo en vivo no falle: repetir la clasificación de las 3 fotos hasta que salga limpia varias veces seguidas.
- Recortar o expandir las partes que se pasaron de tiempo en el Ensayo 1, según lo anotado en la tabla de cronometraje.
- Ensayar el Plan B al menos una vez (levantar el backend en local) para que el equipo sepa ejecutarlo bajo presión.

### Checklist técnico Ensayo 2

El mismo checklist del Ensayo 1, más estas verificaciones de despliegue:

- [ ] Todo el checklist técnico PRE-ensayo (proyector, audio, internet, navegador, backend despierto, 3 fotos, dark mode, idioma).
- [ ] **El PR está mergeado** a la rama principal (no quedan cambios pendientes sin integrar).
- [ ] **El deploy de Vercel está en verde** (último despliegue exitoso, sin errores de build). Verificar que `https://clasificadorresiduo.lat` carga la última versión.
- [ ] El deploy del backend en Railway corresponde a la última versión del código.
- [ ] Re-cronometrar las 4 partes y confirmar que el total quedó dentro de 3:00 ± 0:15.

### Rúbrica de auto-evaluación (Ensayo 2)

Misma rúbrica que el Ensayo 1. Comparar los puntajes contra el Ensayo 1: todos los criterios deberían haber subido. Cualquier criterio que siga por debajo de 4 necesita un plan concreto antes del lunes 23.

---

## Banco de preguntas probables del jurado

Respuestas cortas, concretas y honestas. **Nunca inventar métricas:** sobre el desempeño numérico siempre se responde que las métricas finales sobre el conjunto de test están pendientes de medición.

**1. ¿Por qué eligieron ResNet50 y no otra arquitectura (VGG, MobileNet, EfficientNet, un Transformer de visión)?**
ResNet50 es un punto medio sólido y muy probado para clasificación de imágenes: sus conexiones residuales evitan el problema del gradiente que se desvanece en redes profundas, hay pesos pre-entrenados en ImageNet muy disponibles y la comunidad la conoce bien, lo que facilita la reproducibilidad. Para nuestro dataset de tamaño medio (4 752 imágenes) es suficientemente expresiva sin ser excesiva. MobileNet sería una alternativa válida si necesitáramos inferencia en dispositivos muy limitados; queda como línea de trabajo futuro comparar arquitecturas.

**2. ¿Qué es transfer learning y cómo lo aplicaron?**
Es reutilizar una red ya entrenada en una tarea grande (ImageNet, 1000 clases, millones de imágenes) y adaptarla a nuestra tarea específica. Aprovechamos que las capas tempranas ya aprendieron a detectar bordes, texturas y formas generales. Concretamente: congelamos las capas tempranas y reentrenamos las capas finales, reemplazando la última capa por una de 9 salidas, una por cada categoría de RealWaste. Así entrenamos con muchos menos datos y en mucho menos tiempo que entrenar desde cero.

**3. ¿Por qué exportaron el modelo a ONNX?**
ONNX (Open Neural Network Exchange) es un formato estándar e interoperable. Nos permite ejecutar la inferencia con ONNX Runtime en CPU, sin depender del framework de entrenamiento ni de una GPU. Eso hace el despliegue más liviano y barato (el hosting tiende a costo cero), y desacopla el entrenamiento del servicio en producción: podemos reentrenar con cualquier herramienta y solo exportar el `.onnx`.

**4. ¿Cómo manejan el desbalance de clases? Hay clases con muchas más imágenes que otras (por ejemplo Plastic con 921 frente a Textile Trash con 318).**
Es una limitación real del dataset. Las estrategias previstas son: ponderar la función de pérdida según la frecuencia de cada clase (class weights), aplicar data augmentation más agresivo en las clases minoritarias, y reportar métricas por clase (no solo accuracy global) para que el desbalance quede visible. La evaluación final por clase está pendiente de medición sobre el conjunto de test; ahí es donde se verá el impacto real del desbalance.

**5. ¿Qué exactitud (accuracy) tiene el modelo?**
Con honestidad: las métricas finales sobre el conjunto de test están pendientes de medición. Cuando estén, vamos a reportar accuracy y F1 por clase, además de la matriz de confusión, que es lo que realmente muestra dónde se confunde el modelo. En pruebas manuales clasifica correctamente las 9 categorías de RealWaste con buen desempeño, pero preferimos no dar un número global sin haberlo medido rigurosamente sobre test.

**6. ¿Qué pasa si la foto es ambigua o es de algo que el modelo nunca vio (una clase fuera de las 9)?**
El modelo siempre devuelve probabilidades sobre las 9 clases conocidas, así que ante algo fuera de distribución va a forzar una de esas 9, posiblemente con baja confianza. Por eso devolvemos las probabilidades completas, no solo la clase ganadora: una predicción con probabilidad baja o repartida es señal de ambigüedad. Como mejora futura se puede agregar un umbral de confianza que muestre "no estoy seguro" cuando ninguna clase supera cierto valor.

**7. ¿Es escalable? ¿Qué pasa si lo usan muchas personas a la vez?**
La inferencia es por CPU y stateless, así que escala horizontalmente: se pueden levantar más instancias del contenedor detrás de un balanceador. El cuello de botella sería la concurrencia de inferencias por instancia; para volumen alto se puede agregar una cola de procesamiento o pasar a inferencia por GPU. Para el alcance académico actual, una instancia alcanza.

**8. ¿Cuánto cuesta mantenerlo en Railway y Vercel?**
Hoy corre en los planes gratuitos de ambos. Vercel sirve el frontend estático sin costo para este nivel de tráfico. Railway en plan gratuito tiene la contrapartida de que el backend se duerme por inactividad (el primer request tras un período inactivo paga un cold start de 30 a 60 s). El modelo corre en CPU sin GPU, lo que mantiene el costo bajo. Para producción real se pasaría a un plan pago con instancia siempre activa.

**9. ¿Es accesible? ¿Soporta varios idiomas?**
Sí. La interfaz apunta a accesibilidad nivel AA (doble A): navegación completa por teclado con anillo de foco visible, skip-link inicial, y soporte de modo oscuro. Tiene internacionalización español/inglés con cambio de idioma en un click. Está pensado para que lo use cualquier persona, desde el celular o la computadora, sin instalar nada.

**10. ¿Qué consideraciones éticas o ambientales tuvieron?**
En lo ambiental, el objetivo del proyecto es justamente mejorar la separación en origen para que se pierda menos material reciclable. En lo técnico, elegimos inferencia en CPU para reducir el consumo energético frente a una solución con GPU permanente. En lo de datos, usamos un dataset público con licencia abierta (CC BY 4.0) y citamos a los autores. No almacenamos las imágenes que sube el usuario: se procesan para clasificar y no se persisten.

**11. ¿Qué limitaciones tiene el dataset?**
RealWaste son fotos tomadas en condiciones controladas, relativamente limpias y de objetos individuales. La basura real suele venir mezclada, sucia, deformada y con mala iluminación. Por eso el modelo puede funcionar peor frente a fotos del mundo real que frente a las del dataset. Reconocerlo es parte de la honestidad del proyecto; ampliar el dataset con fotos reales y variadas es trabajo futuro.

**12. ¿Hay riesgos de seguridad al permitir que cualquiera suba imágenes?**
Sí, y se mitigan. El endpoint recibe un multipart y se valida tipo y tamaño del archivo antes de procesar. La imagen se preprocesa (redimensionado a 224×224 y normalización) y no se ejecuta ni se almacena. CORS está configurado para permitir solo los dominios reales del proyecto. Mejoras futuras: rate limiting para evitar abuso y límites de tamaño más estrictos.

**13. ¿Por qué Next.js para el frontend?**
Next.js (sobre React) nos da una base moderna con buen rendimiento, renderizado optimizado, ruteo simple y un ecosistema maduro para accesibilidad e internacionalización. Se despliega muy bien en Vercel con integración continua desde el repositorio, lo que nos dio deploys automáticos en verde con cada cambio.

**14. ¿Cómo se reentrena el modelo si quieren mejorarlo o agregar clases?**
El entrenamiento está desacoplado del servicio. El flujo es: ampliar/ajustar el dataset, reentrenar la ResNet50 con transfer learning, evaluar sobre el conjunto de test, exportar el nuevo `model.onnx` y reemplazar el archivo en el backend. Como el modelo se carga una sola vez en el `lifespan` de FastAPI, basta con desplegar la nueva versión. Agregar una clase implica además cambiar la última capa a la nueva cantidad de salidas.

**15. ¿Cuál es el trabajo futuro del proyecto?**
Principalmente: (a) medir y publicar las métricas finales sobre test (accuracy, F1 por clase, matriz de confusión); (b) atacar el desbalance de clases con class weights y augmentation; (c) ampliar el dataset con fotos reales del norte argentino; (d) agregar umbral de confianza para casos ambiguos o fuera de distribución; (e) comparar arquitecturas (MobileNet/EfficientNet) buscando un modelo más liviano; (f) rate limiting y endurecimiento de seguridad; (g) instancia de backend siempre activa para eliminar el cold start.

**16. ¿Por qué FastAPI para el backend?**
Es un framework Python moderno, rápido, con validación y tipado mediante Pydantic y documentación interactiva automática (Swagger en `/docs`). Encaja naturalmente con un modelo en Python y con ONNX Runtime, y permite cargar el modelo una sola vez al arranque mediante el `lifespan`, evitando recargarlo en cada request.

**17. ¿Qué tan rápida es una predicción?**
Una vez el backend está despierto, la inferencia en CPU devuelve la respuesta en menos de un segundo. La excepción es el primer request tras un período de inactividad en Railway, que paga el cold start del servicio (30 a 60 s); eso es latencia de infraestructura, no del modelo.

---

## Recordatorios finales para el equipo

- Nadie menciona accuracy, F1, precision ni recall como números concretos: sobre desempeño numérico, "las métricas finales sobre el conjunto de test están pendientes de medición".
- Honestidad total ante el jurado: las limitaciones (dataset de laboratorio, desbalance, cold start de Railway) se cuentan como decisiones conscientes y trabajo futuro, no se esconden.
- Despertar el backend 5 minutos antes. Tener listo el Plan B.
