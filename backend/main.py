from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS (so React frontend can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "Meeting Intelligence Backend Running"}


@app.post("/analyze")
async def analyze_transcript(request: TranscriptRequest):
    text = request.text

    # Simple lightweight summary logic
    sentences = text.split(".")
    summary = ". ".join(sentences[:3]).strip()

    # Simple action item detection
    action_items = []
    for sentence in sentences:
        if "will" in sentence.lower() or "should" in sentence.lower():
            action_items.append(sentence.strip())

    return {
        "summary": summary,
        "action_items": action_items
    }