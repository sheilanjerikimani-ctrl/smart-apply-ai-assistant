# Smart-Apply — AI Resume & Cover Letter Assistant

**Programme:** AnalystLab Africa — Generative AI Internship
**Week 2:** Building AI-Powered Applications with Large Language Models (LLMs)
**Author:** Sheila Kimani

## What This Is

Smart-Apply is a web application that generates a tailored resume and cover letter from a user's own background (their "Master Profile") and a pasted job description. It uses an LLM to align the output with the job description's vocabulary for ATS (Applicant Tracking System) compatibility, while being explicitly instructed never to fabricate experience the user hasn't actually stated.

## Problem It Solves

Tailoring a resume and cover letter for every job application is repetitive and time-consuming, often taking 60+ minutes per application. Many resumes are also rejected by ATS software before a human ever sees them, because they lack the specific keywords in the job posting. Smart-Apply lets a user maintain one accurate profile and generate a tailored, ATS-aware application in minutes.

## How It Works

- **Frontend** (`Frontend/index.html`): a single-page HTML/CSS/JS interface where the user enters their background, adds skills one at a time, and pastes a job description.
- **Backend** (`Backend/server.js`): a small Node.js/Express server that receives the profile + job description, builds a structured prompt, and calls the Mistral AI API. The API key is kept server-side and is never exposed to the browser.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript (no framework, no build step)
- Backend: Node.js, Express
- LLM Provider: Mistral AI (`mistral-large-latest`)

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/sheilanjerikimani-ctrl/smart-apply-ai-assistant.git
cd smart-apply-ai-assistant
```

### 2. Set up the backend
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/` (this file is not included in the repo, for security) with:
```
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=3000
```

Get a free API key at [console.mistral.ai](https://console.mistral.ai) → API Keys → Create new key.

Start the backend:
```bash
npm start
```
You should see: `Backend running on http://localhost:3000`

### 3. Run the frontend
Open `Frontend/index.html` directly in your browser (or serve it with a tool like VS Code's Live Server extension). Make sure the backend is running first, since the frontend calls `http://localhost:3000/api/generate`.

### 4. Use the app
1. Fill in your Master Profile (background, education, work history)
2. Add your skills one at a time
3. Paste a job description
4. Click **Generate Tailored Resume & Cover Letter**
5. Review both tabs, then copy the output

## Project Structure
```
smart-apply-ai-assistant/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── .env          (create this yourself — not in repo)
├── Frontend/
│   └── index.html
├── docs/
│   ├── Problem_Definition_Report.docx
│   ├── Prompt_Evaluation_Report.docx
│   └── Reflection_Report.docx
├── screenshots/
└── README.md
```

## Documentation

Full reports covering the problem definition, five tested prompts with evaluation, application testing, and reflection are in [`/docs`](./docs).

## Known Limitations

- The Master Profile is only as accurate as what the user manually enters; the app cannot verify claims.
- No persistent storage beyond browser local storage — generated output is lost on refresh unless copied.
- Currently tied to one LLM provider's request/response format; switching providers requires editing `server.js`.

## Future Enhancements

- Agentic job search: automatically find and surface new postings matching the user's field.
- Export generated output directly as a formatted PDF or Word document.
- Abstract the LLM-calling logic to support switching providers without code changes.
- Deploy to a cloud host (e.g. Vercel) so the app isn't limited to localhost.