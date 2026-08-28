# 📚 Nisse The Book Maker

> **Autonomous AI Multi-Agent Academic Book Publishing System**  
> *Lovable for Springer-grade Textbooks & Mathematical Monographs*

![Typst](https://img.shields.io/badge/Typesetter-Typst_0.15-239dad?style=for-the-badge&logo=typst&logoColor=white)
![Gemini](https://img.shields.io/badge/LLM-Gemini_2.5_Pro_&_Flash-4285f4?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_15_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

---

## 🌟 Overview

**Nisse The Book Maker** generates publication-quality, Springer-grade academic textbooks and monographs from high-level natural language prompts. It couples an asynchronous multi-agent LLM pipeline (Gemini 2.5 Pro & Flash) with a deterministic, sub-second **Typst** compilation engine.

### 🏛️ Pipeline Architecture

```
User Prompt / Academic Topic & Publishing Parameters
                      │
                      ▼
 ┌──────────────────────────────────────────────┐
 │ 1. Architect Agent (Gemini 2.5 Flash)        │ ──► Synthesizes structured JSON BookBlueprint
 │    - Table of contents, notation contracts   │     (Chapters, Sections, Equations, Theorems)
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 2. Parallel Writer Agents (Gemini 2.5 Pro)   │ ──► Concurrent section & chapter authoring
 │    - High-density mathematical derivations   │     (Raw Typst markup, #theorem, #proof)
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 3. Reviewer & Editor Agent (Gemini 2.5 Pro)  │ ──► Editorial review, cross-chapter coherence,
 │    - Notation unification, bibliography      │     Springer reference normalization
 └──────────────────────┬───────────────────────┘
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │ 4. Typst Typesetting & Rendering Engine      │ ──► Injects into Springer Yellow template
 │    - Deterministic sub-50ms compilation     │     Generates publication-ready PDF & previews
 └──────────────────────────────────────────────┘
```

---

## ✨ Features

- **Lovable-Style Prompt Studio**: Natural language book prompt interface with preset inspiration chips (*Space-Time Physics*, *Quantum Information*, *Deep Geometric Learning*, *Non-Equilibrium Thermodynamics*).
- **Customizable Publishing Specs**: Configure Series (*Graduate Texts in Physics*, *GTM*, *LNCS*), Audience (*Undergrad*, *PhD*, *Postdoc*), Rigor level, Chapter count (2–8), and mathematical notation conventions.
- **Live Real-time Pipeline Visualizer**: Watch agents progress stage-by-stage with a live streaming terminal and real-time chapter status cards.
- **Publication PDF Viewer**: Built-in document viewer with zoom, fullscreen, and download capabilities.
- **In-Browser Typst Source Editor**: Edit master Typst markup with live syntax styling and sub-50ms recompilation.
- **Interactive Academic Reader**: Formatted digital reading experience with KaTeX mathematical formulas and styled Springer definition/theorem/lemma/proof callouts.
- **Pre-Seeded Showcase Books**: Pre-compiled masterworks ready to read immediately offline without burning tokens.
- **Flexible Gemini API & Simulation Modes**: Configure Gemini API keys in the UI or use high-fidelity simulation mode for demonstrations.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+ (tested with Python 3.13)

### 2. Setup & Installation
```bash
# Automatically sets up Python virtual environment and installs npm packages
npm run setup
```

### 3. Run the Development Server
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Repository Structure

```
nisse-the-book-maker/
├── backend/
│   ├── book_engine.py       # Multi-agent orchestrator & Typst runner
│   ├── main.py              # FastAPI application (SSE stream, CRUD, recompilation)
│   ├── models.py            # Pydantic schemas for blueprints and requests
│   ├── requirements.txt     # Python dependencies (typst, google-genai, fastapi)
│   ├── templates/
│   │   └── springer.typ     # Springer Yellow Book / GTM Typst template
│   └── storage/
│       └── books/           # Persistent book repository (master.typ, book.pdf, metadata.json)
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js 15 App Router pages
│   │   │   ├── page.tsx     # Prompt Studio & Book Workspace
│   │   │   ├── library/     # Repository bookshelf gallery
│   │   │   └── book/[id]/   # Dedicated monograph route
│   │   ├── components/      # React components (Visualizer, Editor, Reader, PDF Viewer)
│   │   ├── lib/             # API client and settings manager
│   │   └── types/           # TypeScript data interfaces
│   └── package.json
├── package.json             # Root workspace runner
└── README.md
```

---

## 📜 License
MIT License. Created with Antigravity.
