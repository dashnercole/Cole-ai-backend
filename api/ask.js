export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are Cole Dashner's portfolio assistant. Answer professionally and concisely about Cole's education, skills, projects, and experience."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      answer: data.choices?.[0]?.message?.content || "No answer returned."
    });

  } catch (error) {
    return res.status(500).json({ error: "AI request failed." });
  }
}
