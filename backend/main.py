import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional

from models import GenerateBookRequest, RecompileRequest, BookSummary, BookDetail
from book_engine import engine, STORAGE_DIR

app = FastAPI(
    title="Nisse Academic Book Maker API",
    description="Multi-Agent Academic Textbook & Monograph Publishing Engine with Typst Compiler",
    version="1.0.0"
)

# CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Nisse Academic Book Maker",
        "engine": "Typst 0.15.0 + Gemini Multi-Agent Pipeline",
        "version": "1.0.0"
    }


@app.get("/api/presets")
async def get_presets():
    """Returns curated academic monograph presets for quick prompts."""
    return [
        {
            "id": "spacetime_geometry",
            "topic": "Space-Time Physics & Differential Geometry",
            "subtitle": "Mathematical Foundations of General Relativity, Curvature, and Gauge Fields",
            "series": "Graduate Texts in Contemporary Physics",
            "discipline": "Theoretical Physics",
            "author": "Prof. N. Bohr & A. Einstein",
            "chapter_count": 4,
            "rigor_level": "Rigorous Proofs & Derivations",
            "description": "Comprehensive textbook covering smooth manifolds, Levi-Civita connections, Einstein field equations, exact black hole solutions, and singularity theorems."
        },
        {
            "id": "quantum_fault_tolerance",
            "topic": "Quantum Information & Fault-Tolerant Architectures",
            "subtitle": "Algebraic Foundations of Stabilizer Codes, Surface Lattices, and Quantum Supremacy",
            "series": "Springer Monographs in Quantum Science",
            "discipline": "Quantum Information",
            "author": "Prof. J. Preskill & P. Shor",
            "chapter_count": 4,
            "rigor_level": "Axiomatic & Proof-Heavy",
            "description": "Axiomatic formulation of stabilizer codes, topological surface codes, anyonic excitations, Eastin-Knill theorem, and magic state distillation."
        },
        {
            "id": "deep_geometric_learning",
            "topic": "Foundations of Deep Generative Models & Geometric Learning",
            "subtitle": "Diffusion Stochastic PDEs, Equivariant Gauge Representations, and Variational Inference",
            "series": "Springer Monographs in Mathematics and Computing",
            "discipline": "Machine Learning & Applied Mathematics",
            "author": "Prof. Y. LeCun, G. Hinton & S. Bengio",
            "chapter_count": 3,
            "rigor_level": "Formal Derivations & Algorithmic",
            "description": "Mathematical foundations of score-based diffusion SDEs, optimal transport, gauge equivariant neural networks, and Lie group representation theory."
        },
        {
            "id": "nonequilibrium_thermo",
            "topic": "Non-Equilibrium Thermodynamics & Active Matter",
            "subtitle": "Stochastic Langevin Dynamics, Jarzynski Equalities, and Fluctuation Theorems",
            "series": "Frontiers in Statistical Physics",
            "discipline": "Statistical Physics",
            "author": "Prof. L. Boltzmann & I. Prigogine",
            "chapter_count": 4,
            "rigor_level": "Rigorous Derivations",
            "description": "Stochastic thermodynamics, fluctuation-dissipation theorems, active Brownian particles, collective flocking dynamics, and entropy production in living matter."
        }
    ]


@app.post("/api/books/stream-generate")
async def stream_generate(request: GenerateBookRequest):
    """Server-Sent Events (SSE) streaming endpoint for real-time generation."""
    return StreamingResponse(
        engine.stream_generate_book(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.get("/api/books", response_model=List[BookSummary])
async def list_books():
    """Lists all generated and saved books."""
    return engine.list_books()


@app.get("/api/books/{book_id}", response_model=BookDetail)
async def get_book(book_id: str):
    """Returns full details of a specific book including master Typst source."""
    book = engine.get_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.get("/api/books/{book_id}/pdf")
async def get_book_pdf(book_id: str):
    """Streams the compiled publication PDF for a book."""
    pdf_path = os.path.join(STORAGE_DIR, book_id, "book.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found for this book")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{book_id}.pdf"
    )


@app.get("/api/books/{book_id}/typst")
async def get_book_typst(book_id: str):
    """Downloads raw master Typst source code."""
    typ_path = os.path.join(STORAGE_DIR, book_id, "master.typ")
    if not os.path.exists(typ_path):
        raise HTTPException(status_code=404, detail="Typst source not found for this book")
    return FileResponse(
        typ_path,
        media_type="text/plain",
        filename=f"{book_id}.typ"
    )


@app.post("/api/books/{book_id}/recompile", response_model=BookDetail)
async def recompile_book(book_id: str, req: RecompileRequest):
    """Live re-compiles updated Typst source code in sub-seconds."""
    try:
        updated_book = engine.recompile_book(book_id, req.typst_source)
        return updated_book
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Typst compilation error: {str(e)}")


@app.delete("/api/books/{book_id}")
async def delete_book(book_id: str):
    """Deletes a book from storage."""
    folder = os.path.join(STORAGE_DIR, book_id)
    if os.path.exists(folder):
        import shutil
        shutil.rmtree(folder)
        return {"status": "success", "message": f"Deleted book {book_id}"}
    raise HTTPException(status_code=404, detail="Book not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
