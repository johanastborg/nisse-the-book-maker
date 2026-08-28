export interface SectionOutline {
  title: string;
  key_points: string[];
  equations_needed: string[];
  theorems_needed?: string[];
}

export interface ChapterOutline {
  number: number;
  title: string;
  subtitle?: string;
  abstract: string;
  sections: SectionOutline[];
  notation_context?: string;
}

export interface BookBlueprint {
  title: string;
  subtitle: string;
  author: string;
  affiliation?: string;
  edition?: string;
  series: string;
  discipline?: string;
  target_audience: string;
  dedication?: string;
  preface?: string;
  chapters: ChapterOutline[];
  notation_conventions?: string;
  bibliography_seeds?: string[];
}

export interface GenerateBookRequest {
  topic: string;
  author?: string;
  affiliation?: string;
  series?: string;
  discipline?: string;
  audience?: string;
  chapter_count?: number;
  rigor_level?: string;
  notation_convention?: string;
  api_key?: string;
  model_choice?: string;
  use_simulation?: boolean;
}

export interface BookSummary {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  series: string;
  discipline: string;
  chapter_count: number;
  page_count: number;
  created_at: string;
  status: string;
  pdf_size_bytes: number;
}

export interface BookDetail {
  id: string;
  blueprint: BookBlueprint;
  master_typst: string;
  chapter_drafts: string[];
  created_at: string;
  status: string;
  pdf_url: string;
  page_count: number;
  pdf_size_bytes: number;
  metadata?: {
    compile_duration_ms?: number;
    coherence_score?: number;
    series?: string;
    discipline?: string;
    author?: string;
    last_recompile_ms?: number;
    recompile_timestamp?: string;
  };
}

export interface PresetTopic {
  id: string;
  topic: string;
  subtitle: string;
  series: string;
  discipline: string;
  author: string;
  chapter_count: number;
  rigor_level: string;
  description: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'thought';
}

export interface UserSettings {
  geminiApiKey: string;
  selectedModel: string;
  useSimulation: boolean;
  autoRecompile: boolean;
  defaultAuthor: string;
  defaultAffiliation: string;
}
