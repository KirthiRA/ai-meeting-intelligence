import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [actions, setActions] = useState([]);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        { text: text }
      );

      setSummary(response.data.summary);
      setActions(response.data.action_items);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Meeting Intelligence System</h1>

        <textarea
          style={styles.textarea}
          placeholder="Paste meeting transcript here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button style={styles.button} onClick={handleAnalyze}>
          Analyze Meeting
        </button>

        <div style={styles.resultSection}>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>

        <div style={styles.resultSection}>
          <h2>Action Items</h2>
          <ul>
            {actions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    width: "700px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2c3e50",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  resultSection: {
    marginTop: "20px",
  },
};

export default App;