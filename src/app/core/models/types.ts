// CEFR Levels and Core Data Contracts for Ali English Academy

export type CefrLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LanguageSkill = 
  | 'reading' 
  | 'listening' 
  | 'writing' 
  | 'speaking' 
  | 'grammar' 
  | 'vocabulary' 
  | 'pronunciation';

export interface SkillProficiency {
  level: CefrLevel;
  score: number; // 0 - 100
  assessedAt?: string;
  strengths: string[];
  weaknesses: string[];
}

export type LearnerProficiencyMatrix = Record<LanguageSkill, SkillProficiency>;

export interface LearnerProfile {
  id: string;
  name: string;
  nativeLanguage: 'fa'; // Persian
  targetLanguage: 'en';
  learningIntensity: 'relaxed' | 'standard' | 'intensive' | 'immersive';
  dailyStudyMinutes: number; // e.g. 15, 30, 45, 60
  immersionPreference: 'persian_scaffolded' | 'balanced' | 'english_dominant';
  interests: string[];
  diagnosticCompleted: boolean;
  diagnosticDate?: string;
  skillMatrix: LearnerProficiencyMatrix;
  overallCefr: CefrLevel;
  streakDays: number;
  totalStudyMinutes: number;
  lastStudyDate?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'idiom';
  persianMeaning: string;
  englishDefinition: string;
  exampleSentence: string;
  contextTopic: string;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  commonPersianMistake?: string;
  cefrLevel: CefrLevel;
  
  // SM-2 Spaced Repetition fields
  repetitions: number;
  interval: number; // in days
  easeFactor: number; // default 2.5
  confidenceScore: number; // 0 - 100
  nextReviewDate: string; // ISO date string
  lastReviewedDate?: string;
  masteryStatus: 'learning' | 'reviewing' | 'mastered';
  tags: string[];
}

export interface ErrorRecord {
  id: string;
  category: 
    | 'grammar' 
    | 'word_choice' 
    | 'sentence_structure' 
    | 'pronunciation' 
    | 'listening_misunderstanding' 
    | 'spelling' 
    | 'l1_interference' 
    | 'unnatural_expression' 
    | 'fluency';
  skill: LanguageSkill;
  originalText: string;
  correctedText: string;
  persianExplanation: string;
  englishExplanation: string;
  examples: string[];
  drillQuestion?: string;
  drillOptions?: string[];
  drillAnswer?: string;
  status: 'active' | 'in_remediation' | 'mastered';
  occurrences: number;
  createdAt: string;
  lastTestedAt?: string;
  remediatedAt?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  originalUrl?: string;
  topic: string;
  content: string;
  persianSummary?: string;
  verificationStatus: 'verified_original' | 'imported_user_content' | 'ai_assisted_reference';
  createdAt: string;
  tags: string[];
}

export interface DailyMission {
  id: string;
  date: string;
  title: string;
  persianSubtitle: string;
  moduleRoute: string;
  estimatedMinutes: number;
  skill: LanguageSkill;
  completed: boolean;
  priority: 'high' | 'medium' | 'routine';
}

export interface PromptTemplate {
  id: string;
  title: string;
  persianDescription: string;
  targetSkill: LanguageSkill;
  aiModelSuggested: 'ChatGPT' | 'Claude' | 'Gemini' | 'Universal';
  systemPrompt: string;
  userPromptTemplate: string;
  exampleVariables: Record<string, string>;
  expectedOutputFormat: string;
}
