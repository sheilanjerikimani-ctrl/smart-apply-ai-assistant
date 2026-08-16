import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/generate", async (req, res) => {
  const { profile, skills, jobDesc } = req.body;

  // Input validation
  if (!profile || !profile.trim()) {
    return res.status(400).json({ error: "Profile is required." });
  }
  if (!skills || skills.length === 0) {
    return res.status(400).json({ error: "At least one skill is required." });
  }
  if (!jobDesc || !jobDesc.trim()) {
    return res.status(400).json({ error: "Job description is required." });
  }

  const prompt = `You are a professional resume and cover letter writer helping a job seeker apply for a specific role.

CANDIDATE PROFILE (this is the ONLY information you may use — do not invent experience, employers, dates, or qualifications not listed here):
${profile}

Skills: ${skills.join(", ")}

JOB DESCRIPTION:
${jobDesc}

Task:
1. Write a tailored, ATS-optimized resume that reflects the candidate's real background above, using vocabulary and keywords that mirror the job description where genuinely applicable.
2. Write a tailored cover letter (3-4 short paragraphs) connecting the candidate's real background to this specific role.
3. Do not fabricate any experience, certification, or skill not present in the profile above.

Do not use Markdown formatting anywhere in your response — no asterisks for bold, no # for headings, no markdown bullet syntax. Write plain text only, using capital letters or line breaks for section headings, and simple hyphens (-) for bullet points, so the output can be copied directly into a document without any editing to remove formatting symbols.

Respond in exactly this format, with no extra commentary before or after:
===RESUME===
<resume text here>
===COVER LETTER===
<cover letter text here>`;

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errBody?.error?.message || errBody?.message || "AI provider request failed."
      });
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || "";

    const resumeSplit = fullText.split("===RESUME===")[1] || "";
    const coverSplit = resumeSplit.split("===COVER LETTER===");
    const resumeText = (coverSplit[0] || "No resume generated.").trim();
    const coverText = (coverSplit[1] || "No cover letter generated.").trim();

    res.json({ resumeText, coverText });
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));