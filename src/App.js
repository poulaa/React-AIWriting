import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedOutput, setTypedOutput] = useState("");

  // Use the environment variable for the API key
 
  const API_KEY = process.env.REACT_APP_API_KEY;

  const generateText = async () => {
    if (!input) return;
    setLoading(true);
    setTypedOutput("");
    setOutput("");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: input }],
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setOutput(data.choices[0].message.content);
    } catch (err) {
      setOutput("Error: Unable to connect to the API.");
      console.error(err);
    }

    setLoading(false);
  };

  // Typing animation effect
  useEffect(() => {
    let i = 0;
    const speed = 15;

    if (output) {
      const interval = setInterval(() => {
        setTypedOutput((prev) => prev + output.charAt(i));
        i++;
        if (i >= output.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }
  }, [output]);

  return (
    <div
      className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column bg-dark text-white min-vh-100"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <header className="mb-auto">
        <div className="d-flex justify-content-between align-items-center"></div>
      </header>

      <main className="px-3 text-center">
        <h1 className="mb-4" style={{ fontWeight: "700", fontSize: "3rem" }}>
          SmartWrite AI Assistant
        </h1>
        <p className="lead mb-4" style={{ fontSize: "1.25rem" }}>
          Type your request below and let our AI generate a smart response tailored for you.
        </p>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="6"
            placeholder="Type your request here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ fontFamily: "'Lora', serif", fontSize: "1.1rem" }}
          />
        </div>
        <p className="lead">
          <button
            className="btn btn-lg btn-light fw-bold border-white bg-white"
            onClick={generateText}
            disabled={loading}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </p>

        {typedOutput && (
          <div className="mt-4 p-4 bg-white text-dark rounded text-start">
            <h5 style={{ fontWeight: "600", fontFamily: "'Playfair Display', serif" }}>
              AI Response:
            </h5>
            <p style={{ whiteSpace: "pre-wrap", fontFamily: "'Lora', serif" }}>
              {typedOutput}
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto text-white-50 text-center">
        <p style={{ fontFamily: "'Poppins', sans-serif" }}>Created By Poula Morcos</p>
      </footer>
    </div>
  );
}

export default App;
