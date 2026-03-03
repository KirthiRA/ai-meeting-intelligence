import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>📊 Dashboard</h1>
      <button style={styles.button} onClick={() => navigate("/meeting")}>
        Go to Meeting Analyzer
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  button: {
    padding: "12px 20px",
    background: "#764ba2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Dashboard;