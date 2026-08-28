from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class SectionOutline(BaseModel):
    title: str = Field(..., description="Title of the section")
    key_points: List[str] = Field(default_factory=list, description="Key arguments and physical or mathematical concepts")
    equations_needed: List[str] = Field(default_factory=list, description="Essential equations in Typst math syntax")
    theorems_needed: List[str] = Field(default_factory=list, description="Theorems, lemmas, or definitions to formally state and prove")


class ChapterOutline(BaseModel):
    number: int = Field(..., description="Chapter number (1, 2, ...)")
    title: str = Field(..., description="Chapter title")
    subtitle: Optional[str] = Field(default="", description="Chapter subtitle or theme")
    abstract: str = Field(..., description="High-level abstract and academic scope of this chapter")
    sections: List[SectionOutline] = Field(default_factory=list, description="Ordered list of sections")
    notation_context: Optional[str] = Field(default="", description="Specialized notations or coordinate conventions for this chapter")


class BookBlueprint(BaseModel):
    title: str = Field(..., description="Full book title")
    subtitle: str = Field(..., description="Informative subtitle in the style of Springer monographs")
    author: str = Field(..., description="Primary author(s)")
    affiliation: Optional[str] = Field(default="Institute for Advanced Study & Theoretical Physics", description="Author institution")
    edition: Optional[str] = Field(default="First Edition", description="Book edition")
    series: Optional[str] = Field(default="Graduate Texts in Physics", description="Publisher series (e.g. Springer GTM, LNCS, Yellow Book)")
    discipline: Optional[str] = Field(default="Physics & Mathematics", description="Academic field")
    target_audience: str = Field(..., description="Target audience (e.g. Graduate students, Postdoctoral researchers)")
    dedication: Optional[str] = Field(default="To the explorers of nature's deepest mathematical structures.", description="Dedication text")
    preface: Optional[str] = Field(default="", description="Author preface framing the pedagogical philosophy and motivation")
    chapters: List[ChapterOutline] = Field(..., description="Ordered list of chapters")
    notation_conventions: Optional[str] = Field(default="Metric signature (-,+,+,+); natural units with c = \\hbar = 1.", description="Global mathematical notation conventions")
    bibliography_seeds: List[str] = Field(default_factory=list, description="Foundational references and citations in Springer format")


class GenerateBookRequest(BaseModel):
    topic: str = Field(..., description="Main topic or prompt for the book")
    author: Optional[str] = Field(default="Prof. Nisse Neumann", description="Author name")
    affiliation: Optional[str] = Field(default="Max Planck Institute for Physics", description="Author affiliation")
    series: Optional[str] = Field(default="Graduate Texts in Contemporary Physics", description="Springer Series style")
    discipline: Optional[str] = Field(default="Theoretical Physics", description="Field of study")
    audience: Optional[str] = Field(default="Graduate / PhD Level", description="Audience level")
    chapter_count: Optional[int] = Field(default=4, ge=2, le=8, description="Target number of chapters")
    rigor_level: Optional[str] = Field(default="Rigorous Proofs & Derivations", description="Rigor level")
    notation_convention: Optional[str] = Field(default="Metric (-,+,+,+), Einstein Summation", description="Notation convention")
    api_key: Optional[str] = Field(default=None, description="Optional Gemini API key from user")
    model_choice: Optional[str] = Field(default="gemini-2.5-pro", description="LLM model choice")
    use_simulation: Optional[bool] = Field(default=False, description="Whether to use high-quality simulated generation")


class RecompileRequest(BaseModel):
    typst_source: Optional[str] = Field(default="", description="Typst source code (deprecated)")
    latex_source: Optional[str] = Field(default="", description="Modified LaTeX source code to recompile")


class BookSummary(BaseModel):
    id: str
    title: str
    subtitle: str
    author: str
    series: str
    discipline: str
    chapter_count: int
    page_count: int
    created_at: str
    status: str
    pdf_size_bytes: int


class BookDetail(BaseModel):
    id: str
    blueprint: BookBlueprint
    master_typst: Optional[str] = Field(default="", description="Legacy Typst source")
    master_latex: Optional[str] = Field(default="", description="Master LaTeX source")
    chapter_drafts: List[str]
    created_at: str
    status: str
    pdf_url: str
    page_count: int
    pdf_size_bytes: int
    metadata: Dict[str, Any] = Field(default_factory=dict)
