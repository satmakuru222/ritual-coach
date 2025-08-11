export type Tradition = "andhra_smarta" | "vaishnava";
export type Region = "south" | "north";
export type Language = "te" | "hi" | "en";
export type RitualStep = {
  id: string;
  title: string;
  description: string;
  duration_minutes?: number;
  materials?: string[];
  mantras?: string[];
};

export interface RitualProfile {
  user_id: string;
  tradition: Tradition;
  region: Region;
  language_pref: Language;
  daily_time: string;
  duration_minutes: number;
  dietary_rules: string;
  kid_mode: boolean;
}

export interface Ritual {
  id: string;
  name: string;
  tradition: Tradition;
  region: Region;
  steps: RitualStep[];
  materials: string[];
  mantras: string[];
  estimated_time: number;
}

export interface Festival {
  id: string;
  name: string;
  dates: Record<number, string>;
  tradition_notes: string;
  prep_checklist: string[];
  prasadam_suggestions: string[];
  decor_templates: string[];
}

export interface MantraText {
  te: string;
  hi: string;
  en: string;
  iast: string;
}

export interface Mantra {
  id: string;
  title: string;
  text_by_script: MantraText;
  cadence: "slow" | "medium" | "fast";
  breakpoints: number[];
}

export interface PrasadamDish {
  id: string;
  dish_name: string;
  festival_tags: string[];
  sattvic_notes: string;
  ingredients: string[];
  make_ahead: boolean;
  kid_friendly: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  target: "festival" | "daily";
  items: ChecklistItem[];
  status: Record<string, boolean>;
}

export interface AgentTool {
  name: string;
  parameters: Record<string, any>;
}

export interface CalendarEvent {
  title: string;
  start: string;
  duration: number;
  notes?: string;
}

export interface PDFGenerationOptions {
  title: string;
  sections: any[];
  language: Language;
  script: "te" | "hi" | "en";
}