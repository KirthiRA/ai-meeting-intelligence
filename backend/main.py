from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import spacy

app = FastAPI()

# Enable CORS (so React frontend can connect later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
nlp = spacy.load("en_core_web_sm")

class TranscriptRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Meeting Intelligence Backend Running"}

@app.post("/analyze")
async def analyze_transcript(request: TranscriptRequest):
    text = request.text

    # Limit input size for summarizer
    summary = summarizer(text[:1024], max_length=150, min_length=40, do_sample=False)

    action_items = []
    doc = nlp(text)

    for sent in doc.sents:
        if "will" in sent.text or "should" in sent.text:
            action_items.append(sent.text)

    return {
        "summary": summary[0]["summary_text"],
        "action_items": action_items
    }