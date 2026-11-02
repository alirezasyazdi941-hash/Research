import { Injectable, signal, computed } from '@angular/core';
import { 
  LearnerProfile, 
  VocabularyItem, 
  ErrorRecord, 
  KnowledgeDocument, 
  DailyMission, 
  LanguageSkill, 
  CefrLevel 
} from '../models/types';
import { 
  INITIAL_LEARNER_PROFILE, 
  INITIAL_VOCABULARY, 
  INITIAL_ERRORS, 
  INITIAL_KNOWLEDGE_DOCUMENTS 
} from '../data/initial-data';

interface AcademyExportPayload {
  version: string;
  exportedAt: string;
  profile: LearnerProfile;
  vocabulary: VocabularyItem[];
  errors: ErrorRecord[];
  knowledge: KnowledgeDocument[];
  dailyMissions: DailyMission[];
}

@Injectable({
  providedIn: 'root'
})
export class AcademyStorage {
  private readonly PROFILE_KEY = 'ali_eng_profile';
  private readonly VOCAB_KEY = 'ali_eng_vocab';
  private readonly ERRORS_KEY = 'ali_eng_errors';
  private readonly KNOWLEDGE_KEY = 'ali_eng_knowledge';
  private readonly MISSIONS_KEY = 'ali_eng_missions';

  // Signals for reactive state
  readonly profile = signal<LearnerProfile>(INITIAL_LEARNER_PROFILE);
  readonly vocabulary = signal<VocabularyItem[]>(INITIAL_VOCABULARY);
  readonly errors = signal<ErrorRecord[]>(INITIAL_ERRORS);
  readonly knowledge = signal<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCUMENTS);
  readonly missions = signal<DailyMission[]>([]);

  // Computed metrics
  readonly totalWords = computed(() => this.vocabulary().length);
  readonly masteredWords = computed(() => 
    this.vocabulary().filter(v => v.masteryStatus === 'mastered').length
  );
  readonly dueWords = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.vocabulary().filter(v => {
      const reviewDate = v.nextReviewDate ? v.nextReviewDate.split('T')[0] : '';
      return reviewDate <= today;
    }).length;
  });

  readonly activeErrorsCount = computed(() => 
    this.errors().filter(e => e.status === 'active').length
  );
  readonly masteredErrorsCount = computed(() => 
    this.errors().filter(e => e.status === 'mastered').length
  );

  constructor() {
    this.loadFromStorage();
    this.ensureMissionsGenerated();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const rawProfile = localStorage.getItem(this.PROFILE_KEY);
      if (rawProfile) {
        this.profile.set(JSON.parse(rawProfile));
      }

      const rawVocab = localStorage.getItem(this.VOCAB_KEY);
      if (rawVocab) {
        this.vocabulary.set(JSON.parse(rawVocab));
      }

      const rawErrors = localStorage.getItem(this.ERRORS_KEY);
      if (rawErrors) {
        this.errors.set(JSON.parse(rawErrors));
      }

      const rawKnowledge = localStorage.getItem(this.KNOWLEDGE_KEY);
      if (rawKnowledge) {
        this.knowledge.set(JSON.parse(rawKnowledge));
      }

      const rawMissions = localStorage.getItem(this.MISSIONS_KEY);
      if (rawMissions) {
        this.missions.set(JSON.parse(rawMissions));
      }
    } catch (e) {
      console.warn('AliEnglish: Failed to load from storage, using initial seed data.', e);
    }
  }

  updateProfile(partial: Partial<LearnerProfile>): void {
    const current = this.profile();
    const updated: LearnerProfile = { ...current, ...partial };
    this.profile.set(updated);
    this.persist(this.PROFILE_KEY, updated);
  }

  updateSkillProficiency(skill: LanguageSkill, level: CefrLevel, score: number, strengths: string[], weaknesses: string[]): void {
    const current = this.profile();
    const matrix = { ...current.skillMatrix };
    matrix[skill] = {
      level,
      score,
      assessedAt: new Date().toISOString(),
      strengths,
      weaknesses
    };

    // Calculate weighted overall CEFR
    const totalScore = Object.values(matrix).reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = totalScore / 7;

    let overall: CefrLevel = 'Pre-A1';
    if (avgScore >= 85) overall = 'C1';
    else if (avgScore >= 70) overall = 'B2';
    else if (avgScore >= 55) overall = 'B1';
    else if (avgScore >= 40) overall = 'A2';
    else if (avgScore >= 20) overall = 'A1';

    this.updateProfile({
      skillMatrix: matrix,
      overallCefr: overall,
      diagnosticCompleted: true,
      diagnosticDate: new Date().toISOString()
    });
  }

  saveVocabularyItem(item: VocabularyItem): void {
    const current = this.vocabulary();
    const idx = current.findIndex(v => v.id === item.id);
    let updated: VocabularyItem[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = item;
    } else {
      updated = [item, ...current];
    }
    this.vocabulary.set(updated);
    this.persist(this.VOCAB_KEY, updated);
  }

  deleteVocabularyItem(id: string): void {
    const updated = this.vocabulary().filter(v => v.id !== id);
    this.vocabulary.set(updated);
    this.persist(this.VOCAB_KEY, updated);
  }

  saveErrorRecord(err: ErrorRecord): void {
    const current = this.errors();
    const idx = current.findIndex(e => e.id === err.id);
    let updated: ErrorRecord[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = err;
    } else {
      updated = [err, ...current];
    }
    this.errors.set(updated);
    this.persist(this.ERRORS_KEY, updated);
  }

  saveKnowledgeDocument(doc: KnowledgeDocument): void {
    const current = this.knowledge();
    const idx = current.findIndex(d => d.id === doc.id);
    let updated: KnowledgeDocument[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = doc;
    } else {
      updated = [doc, ...current];
    }
    this.knowledge.set(updated);
    this.persist(this.KNOWLEDGE_KEY, updated);
  }

  deleteKnowledgeDocument(id: string): void {
    const updated = this.knowledge().filter(d => d.id !== id);
    this.knowledge.set(updated);
    this.persist(this.KNOWLEDGE_KEY, updated);
  }

  toggleMissionCompleted(missionId: string): void {
    const updated = this.missions().map(m => {
      if (m.id === missionId) {
        return { ...m, completed: !m.completed };
      }
      return m;
    });
    this.missions.set(updated);
    this.persist(this.MISSIONS_KEY, updated);
  }

  ensureMissionsGenerated(): void {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.missions();
    const hasToday = existing.some(m => m.date === today);

    if (!hasToday) {
      const generated: DailyMission[] = [
        {
          id: `mission_vocab_${today}`,
          date: today,
          title: 'Review Due Technical Vocabulary',
          persianSubtitle: 'مرور واژگان هوش مصنوعی و سیستم بر اساس الگوریتم فاصله‌دار SM-2',
          moduleRoute: 'vocabulary',
          estimatedMinutes: 8,
          skill: 'vocabulary',
          completed: false,
          priority: 'high'
        },
        {
          id: `mission_error_${today}`,
          date: today,
          title: 'Neutralize Active Persian L1 Errors',
          persianSubtitle: 'تمرین برطرف‌سازی خطاهای رایج فارسی‌زبانان (حروف اضافه و افعال حسی)',
          moduleRoute: 'errors',
          estimatedMinutes: 7,
          skill: 'grammar',
          completed: false,
          priority: 'high'
        },
        {
          id: `mission_listening_${today}`,
          date: today,
          title: 'Architecture Incident Dictation',
          persianSubtitle: 'دیکته شنیداری جمله به جمله گزارش حادثه دیتابیس در حالت سرعت ۰.۸۵',
          moduleRoute: 'listening',
          estimatedMinutes: 10,
          skill: 'listening',
          completed: false,
          priority: 'medium'
        },
        {
          id: `mission_pronunciation_${today}`,
          date: today,
          title: 'Phonetic Drill: /w/ vs /v/ Articulation',
          persianSubtitle: 'تمرین تمایز واو انگلیسی با لب گرد و بدون برخورد دندان',
          moduleRoute: 'pronunciation',
          estimatedMinutes: 5,
          skill: 'pronunciation',
          completed: false,
          priority: 'medium'
        }
      ];
      this.missions.set(generated);
      this.persist(this.MISSIONS_KEY, generated);
    }
  }

  // --- Export and Backup with Web Crypto AES-GCM ---

  async exportEncryptedBackup(password: string): Promise<string> {
    const payload: AcademyExportPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.profile(),
      vocabulary: this.vocabulary(),
      errors: this.errors(),
      knowledge: this.knowledge(),
      dailyMissions: this.missions()
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const result = {
      type: 'ALI_ENGLISH_ENCRYPTED_BACKUP',
      salt: Array.from(salt),
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encryptedContent))
    };

    return JSON.stringify(result, null, 2);
  }

  async restoreEncryptedBackup(backupJsonString: string, password: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(backupJsonString);
      if (parsed.type !== 'ALI_ENGLISH_ENCRYPTED_BACKUP') {
        throw new Error('Invalid backup file header');
      }

      const encoder = new TextEncoder();
      const salt = new Uint8Array(parsed.salt);
      const iv = new Uint8Array(parsed.iv);
      const ciphertext = new Uint8Array(parsed.ciphertext);

      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const decoder = new TextDecoder();
      const json = decoder.decode(decryptedBuffer);
      const payload: AcademyExportPayload = JSON.parse(json);

      if (payload.profile) this.profile.set(payload.profile);
      if (payload.vocabulary) this.vocabulary.set(payload.vocabulary);
      if (payload.errors) this.errors.set(payload.errors);
      if (payload.knowledge) this.knowledge.set(payload.knowledge);
      if (payload.dailyMissions) this.missions.set(payload.dailyMissions);

      this.persist(this.PROFILE_KEY, this.profile());
      this.persist(this.VOCAB_KEY, this.vocabulary());
      this.persist(this.ERRORS_KEY, this.errors());
      this.persist(this.KNOWLEDGE_KEY, this.knowledge());
      this.persist(this.MISSIONS_KEY, this.missions());

      return true;
    } catch (e) {
      console.error('Backup decryption failed:', e);
      return false;
    }
  }

  exportPlainJson(): string {
    const payload: AcademyExportPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.profile(),
      vocabulary: this.vocabulary(),
      errors: this.errors(),
      knowledge: this.knowledge(),
      dailyMissions: this.missions()
    };
    return JSON.stringify(payload, null, 2);
  }

  restorePlainJson(jsonString: string): boolean {
    try {
      const payload: AcademyExportPayload = JSON.parse(jsonString);
      if (payload.profile) {
        this.profile.set(payload.profile);
        this.persist(this.PROFILE_KEY, payload.profile);
      }
      if (payload.vocabulary) {
        this.vocabulary.set(payload.vocabulary);
        this.persist(this.VOCAB_KEY, payload.vocabulary);
      }
      if (payload.errors) {
        this.errors.set(payload.errors);
        this.persist(this.ERRORS_KEY, payload.errors);
      }
      if (payload.knowledge) {
        this.knowledge.set(payload.knowledge);
        this.persist(this.KNOWLEDGE_KEY, payload.knowledge);
      }
      if (payload.dailyMissions) {
        this.missions.set(payload.dailyMissions);
        this.persist(this.MISSIONS_KEY, payload.dailyMissions);
      }
      return true;
    } catch (err) {
      console.error('Plain JSON restore failed:', err);
      return false;
    }
  }

  resetAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.PROFILE_KEY);
      localStorage.removeItem(this.VOCAB_KEY);
      localStorage.removeItem(this.ERRORS_KEY);
      localStorage.removeItem(this.KNOWLEDGE_KEY);
      localStorage.removeItem(this.MISSIONS_KEY);
    }
    this.profile.set(INITIAL_LEARNER_PROFILE);
    this.vocabulary.set(INITIAL_VOCABULARY);
    this.errors.set(INITIAL_ERRORS);
    this.knowledge.set(INITIAL_KNOWLEDGE_DOCUMENTS);
    this.ensureMissionsGenerated();
  }

  private persist(key: string, data: unknown): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to persist key ${key}`, e);
    }
  }
}
