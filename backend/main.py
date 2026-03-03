import os
import requests
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

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
    return {"message": "AI Meeting Intelligence Backend Running"}


# 🔹 Step 1: Transcribe Audio
@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):

    audio_bytes = await file.read()

    response = requests.post(
        "https://api.openai.com/v1/audio/transcriptions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        },
        files={
            "file": (file.filename, audio_bytes)
        },
        data={
            "model": "whisper-1"
        }
    )

    transcript = response.json().get("text")

    return {"transcript": transcript}


# 🔹 Step 2: Analyze Transcript
@app.post("/analyze")
async def analyze_transcript(request: TranscriptRequest):

    prompt = f"""
    Analyze the following meeting transcript.

    Provide:
    - Summary
    - Action Items
    - Key Decisions
    - Important Highlights

    Transcript:
    {request.text}
    """

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    result = response.json()["choices"][0]["message"]["content"]

    return {"analysis": result}