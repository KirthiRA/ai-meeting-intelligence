import React, { useState } from "react";

function Meeting() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

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
      // 🔹 Step 1: Transcribe
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

      // 🔹 Step 2: Analyze
      const analyzeResponse = await fetch(
        `${BACKEND_URL}/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: transcribeData.transcript }),
        }
      );

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎙 AI Meeting Intelligence</h1>

        <div style={styles.uploadSection}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />

          <button style={styles.button} onClick={handleUpload}>
            🚀 Upload & Analyze
          </button>
        </div>

        {loading && <div style={styles.loader}>Processing... ⏳</div>}

        {transcript && (
          <div style={styles.section}>
            <h2>📝 Transcript</h2>
            <p>{transcript}</p>
          </div>
        )}

        {analysis && (
          <div style={styles.section}>
            <h2>📊 Analysis</h2>
            <pre style={styles.pre}>{analysis}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  uploadSection: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  loader: {
    textAlign: "center",
    margin: "15px 0",
    fontWeight: "bold",
    color: "#764ba2",
  },
  section: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
  },
  pre: {
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
  },
};

export default Meeting;