// ===============================
// Cole AI Backend - Vercel API Route
// File: api/ask.js
// ===============================

export default async function handler(req, res) {
  // ===============================
  // CORS SETTINGS
  // Allows your GitHub Pages website to call this Vercel backend
  // ===============================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handles the browser's preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ===============================
    // GET QUESTION FROM WEBSITE
    // ===============================
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided." });
    }

    // ===============================
    // SEND QUESTION TO GROQ
    // ===============================
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are Cole Dashner's portfolio assistant. Answer professionally and concisely about Cole's education, skills, projects, and experience. If you do not know something about Cole, say that the portfolio does not provide that information."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    // ===============================
    // READ GROQ RESPONSE
    // ===============================
    const data = await response.json();

    // If Groq returns an error, send that error back to your website
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq request failed."
      });
    }

    // ===============================
    // SEND ANSWER BACK TO WEBSITE
    // ===============================
    return res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "No answer returned."
    });

  } catch (error) {
    // ===============================
    // SERVER ERROR
    // ===============================
    return res.status(500).json({
      error: "AI request failed."
    });
  }
}
