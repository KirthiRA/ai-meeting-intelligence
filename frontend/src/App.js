import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Your real backend URL
  const BACKEND_URL = "https://ai-meeting-intelligence.onrender.com";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    setLoading(true);
    setTranscript("");
    setAnalysis("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 🔹 STEP 1: Transcribe Audio
      const transcribeResponse = await fetch(
        `${BACKEND_URL}/transcribe`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed");
      }

      const transcribeData = await transcribeResponse.json();
      setTranscript(transcribeData.transcript);

      // 🔹 STEP 2: Analyze Transcript
      const analyzeResponse = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcribeData.transcript }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Analysis failed");
      }

      const analyzeData = await analyzeResponse.json();
      setAnalysis(analyzeData.analysis);

    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AI Meeting Intelligence System</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload}>
        Upload & Analyze
      </button>

      {loading && <p>Processing... Please wait.</p>}

      <h2>Transcript</h2>
      <p>{transcript}</p>

      <h2>Analysis</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{analysis}</pre>
    </div>
  );
}

export default App;