from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ProbabilityResponse(BaseModel):
    class_name: str
    probability: float

class PredictionResponse(BaseModel):
    predicted_class: str
    probabilities: List[ProbabilityResponse]

@router.post("/predict", response_model=PredictionResponse)
async def predict_image(request: Request, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        contents = await file.read()
        # Recuperar el servicio desde el estado de la app
        model_service = request.app.state.model_service
        result = model_service.predict(contents)
        
        # Transformar respuesta para Pydantic
        formatted_probs = [
            ProbabilityResponse(class_name=item["class"], probability=item["probability"]) 
            for item in result["probabilities"]
        ]
        
        return PredictionResponse(
            predicted_class=result["predicted_class"],
            probabilities=formatted_probs
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
