import { useState } from "react";

export default function GeminiAi() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askGemini = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await fetch("http://localhost:7000/api/gemini", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResponse(data.text);
        } catch (err) {
            setResponse("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>Gemini AI</h2>

            <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask something..."
                style={{ width: "100%", padding: 10 }}
            />

            <button
                onClick={askGemini}
                disabled={loading}
                style={{ marginTop: 10 }}
            >
                {loading ? "Thinking..." : "Ask Gemini"}
            </button>

            {response && (
                <div
                    style={{
                        marginTop: 20,
                        padding: 10,
                        border: "1px solid #ddd",
                    }}
                >
                    {response}
                </div>
            )}
        </div>
    );
}
