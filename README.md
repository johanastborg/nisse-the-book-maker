# 📚 Nisse The Book Maker

> **Autonomous AI Multi-Agent Academic Book Publishing System**  
> *Springer-grade Textbooks & Mathematical Monographs with Gemini 2.5 and LaTeX Typesetting*

![LaTeX](https://img.shields.io/badge/Typesetter-LaTeX_%2F_LuaLaTeX_%2F_Tectonic-008080?style=for-the-badge&logo=latex&logoColor=white)
![Gemini](https://img.shields.io/badge/LLM-Gemini_2.5_Pro_&_Flash-4285f4?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_15_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

---

## 🌟 Overview

**Nisse The Book Maker** transforms natural language topics into publication-quality, Springer-grade academic textbooks and monographs. It pairs an asynchronous multi-agent LLM pipeline (Gemini 2.5 Pro & Flash) with a high-performance **LaTeX / LuaLaTeX** compilation engine (powered by Tectonic or standard TeX Live).

---

## 🏛️ Multi-Agent Publishing Architecture

```
User Prompt / Academic Topic & Publishing Parameters
                      │
                      ▼
 ┌──────────────────────────────────────────────┐
 │ 1. Architect Agent (Gemini 2.5 Flash)        │ ──► Synthesizes structured JSON BookBlueprint
 │    - Table of contents, notation contracts   │     (Chapters, Sections, LaTeX Equations, Theorems)
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 2. Parallel Writer Agents (Gemini 2.5 Flash) │ ──► Concurrent section & chapter authoring
 │    - High-density mathematical derivations   │     (LaTeX markup, SpringerTheorem, proof, align)
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 3. Reviewer & Editor Agent (Gemini 2.5 Flash)│ ──► Editorial review, cross-chapter coherence,
 │    - Notation unification, bibliography      │     Springer \bibitem reference normalization
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 4. LaTeX Typesetting & Rendering Engine      │ ──► Injects into Springer Nature LaTeX template
 │    - LuaLaTeX / XeLaTeX / Tectonic Compiler  │     Generates publication-grade PDF & previews
 └──────────────────────────────────────────────┘
```

---

## ✨ Features

- **Prompt Studio**: Natural language monograph prompt interface with preset inspiration chips (*Space-Time Physics*, *Quantum Information*, *Deep Geometric Learning*, *Non-Equilibrium Thermodynamics*).
- **Customizable Publishing Specs**: Configure Series (*Graduate Texts in Physics*, *GTM*, *LNCS*), Audience (*Undergrad*, *PhD*, *Postdoc*), Rigor level, Chapter count (2–8), and mathematical notation conventions.
- **Live Real-time Pipeline Visualizer**: Watch agents progress stage-by-stage with a live streaming SSE terminal and real-time chapter status cards.
- **Publication PDF Viewer**: Built-in document viewer with zoom, page navigation, and download capabilities.
- **In-Browser LaTeX Source Editor**: Edit master LaTeX markup (`master.tex`) with live recompilation and error diagnostics.
- **Interactive Academic Reader**: Formatted digital reading experience with KaTeX mathematical rendering and styled Springer definition/theorem/lemma/proof callouts.
- **Pre-Seeded Showcase Books**: Pre-compiled masterworks ready to read immediately offline without burning API tokens.
- **Flexible Gemini API & Simulation Modes**: Configure Gemini API keys in the UI or use high-fidelity deterministic simulation mode for instant demonstrations.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **LaTeX Engine** (any of the following):
  - **Tectonic** (recommended, standalone & fast): `brew install tectonic`
  - **BasicTeX / MacTeX**: `brew install --cask basictex` or `pdflatex` / `lualatex` / `xelatex` on PATH

### 2. Setup & Installation
```bash
# Automatically sets up Python virtual environment, installs backend requirements and npm packages
npm run setup
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or in `backend/`) containing your Gemini API key:

```bash
# .env
GEMINI_API_KEY="your-gemini-api-key-here"
# or
GOOGLE_API_KEY="your-gemini-api-key-here"
```

> **Note:** You can also configure the Gemini API key directly in the web UI Settings modal at any time.

### 4. Run the Application

#### Start the FastAPI Backend:
```bash
./venv/bin/uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

#### Start the Next.js Frontend:
```bash
npm run dev --prefix frontend
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Repository Structure

```
nisse-the-book-maker/
├── backend/
│   ├── book_engine.py       # Multi-agent orchestrator & LaTeX compiler pipeline
│   ├── main.py              # FastAPI application (SSE stream, CRUD, recompilation)
│   ├── models.py            # Pydantic schemas for blueprints and requests
│   ├── requirements.txt     # Python dependencies (google-genai, fastapi, uvicorn, pydantic)
│   ├── templates/
│   │   └── springer_monograph.tex  # Springer Nature LaTeX monograph master template
│   └── storage/
│       └── books/           # Persistent book repository (master.tex, book.pdf, metadata.json)
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js 15 App Router pages
│   │   │   ├── page.tsx     # Prompt Studio & Book Workspace
│   │   │   ├── library/     # Repository bookshelf gallery
│   │   │   └── book/[id]/   # Dedicated monograph route
│   │   ├── components/      # React components (Visualizer, LaTeX Editor, Reader, PDF Viewer)
│   │   ├── lib/             # API client and settings manager
│   │   └── types/           # TypeScript data interfaces
│   └── package.json
├── package.json             # Root workspace runner
├── .gitignore               # Ignored build, LaTeX auxiliary, and storage files
└── README.md
```

---

## 📜 License
MIT License.
