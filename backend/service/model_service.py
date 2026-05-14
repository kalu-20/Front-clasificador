import onnxruntime as ort
import numpy as np
from PIL import Image
from io import BytesIO
import os

class ModelService:
    def __init__(self, model_path: str):
        self.class_names = ['Cardboard', 'Food Organics', 'Glass', 'Metal', 'Miscellaneous Trash', 'Paper', 'Plastic', 'Textile Trash', 'Vegetation']
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        # Cargar la sesión ONNX
        self.session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name

    def predict(self, image_bytes: bytes) -> dict:
        try:
            # Cargar imagen y preprocesar usando Pillow y Numpy (reemplazo de torchvision)
            img = Image.open(BytesIO(image_bytes)).convert('RGB')
            img = img.resize((224, 224), Image.Resampling.BILINEAR)
            
            # Convertir a numpy array y escalar a [0, 1]
            img_array = np.array(img, dtype=np.float32) / 255.0
            
            # Cambiar de HWC a CHW
            img_array = np.transpose(img_array, (2, 0, 1))
            
            # Normalizar con promedios y desviaciones estándar típicos de ImageNet
            mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
            std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)
            img_array = (img_array - mean) / std
            
            # Añadir la dimensión de batch (1, C, H, W)
            input_numpy = np.expand_dims(img_array, axis=0)
            
            # Inferencia
            outputs = self.session.run(None, {self.input_name: input_numpy})
            logits = outputs[0]
            
            # Softmax
            exp_logits = np.exp(logits - np.max(logits))
            probs = exp_logits / exp_logits.sum()
            
            # Resultados
            idx_max = np.argmax(probs)
            predicted_class = self.class_names[idx_max]
            
            # Formatear la lista de probabilidades
            predicciones = list(zip(self.class_names, probs[0].tolist()))
            predicciones.sort(key=lambda x: x[1], reverse=True)
            
            return {
                "predicted_class": predicted_class,
                "probabilities": [{"class": nombre, "probability": prob} for nombre, prob in predicciones]
            }
        except Exception as e:
            raise RuntimeError(f"Error during prediction: {str(e)}")
