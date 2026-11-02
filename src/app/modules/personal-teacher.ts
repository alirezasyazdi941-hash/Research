import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyStorage } from '../core/services/storage';
import { AcademySpeech } from '../core/services/speech';
import { AcademyAiGateway } from '../core/services/ai-gateway';

export type TeacherMode = 'personal_teacher' | 'conversation_partner' | 'strict_examiner' | 'academic_professor' | 'pronunciation_coach';

interface TeacherLesson {
  id: string;
  mode: TeacherMode;
  title: string;
  persianTitle: string;
  conceptEnglish: string;
  conceptPersian: string;
  examples: { en: string; fa: string; note?: string }[];
  exerciseQuestion: string;
  exercisePersianHint: string;
  options: string[];
  correctAnswer: string;
  persianFeedbackCorrect: string;
  persianFeedbackWrong: string;
}

const TEACHER_LESSONS: TeacherLesson[] = [
  {
    id: 't_lesson_1',
    mode: 'personal_teacher',
    title: 'Present Simple vs Present Continuous in Code Architecture',
    persianTitle: 'حال ساده در برابر حال استمراری در گزارش رفتار سیستم و باگ‌ها',
    conceptEnglish: 'In technical engineering discourse, use the Present Simple to state architectural invariants, system specifications, and immutable algorithmic truths (e.g., "The hash map guarantees O(1) average lookup"). Use the Present Continuous strictly for transient, ongoing run-time states or temporary anomalies (e.g., "The cluster is currently experiencing latency spikes due to cache invalidation").',
    conceptPersian: 'در زبان فنی مهندسی، از حال ساده برای اصول تغییرناپذیر سیستم، الگوریتم‌ها و ویژگی‌های ابدی کد استفاده می‌شود. اما حال استمراری منحصراً برای شرایط موقتی، وضعیت در حال اجرا، یا باگ‌های گذرا به کار می‌رود.',
    examples: [
      { en: 'Kafka partitions distribute messages across multiple brokers.', fa: 'پارتیشن‌های کافکا پیام‌ها را در میان چندین بروکر توزیع می‌کنند (حقیقت معماری پایدار - حال ساده).', note: 'Standard invariant' },
      { en: 'The background thread is consuming 98% of CPU right now.', fa: 'ترد پس‌زمینه در حال حاضر ۹۸ درصد پردازنده را مصرف می‌کند (رفتار موقتی و در جریان - حال استمراری).', note: 'Transient state' }
    ],
    exerciseQuestion: 'Choose the sentence that correctly expresses an architectural invariant of an immutable data structure:',
    exercisePersianHint: 'کدام گزینه ویژگی ذاتی و ابدی ساختار داده را با گرامر صحیح بیان می‌کند؟',
    options: [
      'The binary search tree is always having at most two children per node.',
      'The binary search tree has at most two children per node.',
      'The binary search tree is having at most two children per node right now.',
      'The binary search tree was have at most two children.'
    ],
    correctAnswer: 'The binary search tree has at most two children per node.',
    persianFeedbackCorrect: 'کاملاً درست است! ویژگی‌های ذاتی و پایدار ساختارهای داده همواره با حال ساده (has) بیان می‌شوند، زیرا یک قانون الگوریتمی تغییرناپذیر هستند.',
    persianFeedbackWrong: 'نادرست است. بیان قوانین ذاتی ساختار داده با حال استمراری ("is having") اشتباه است؛ چون این یک ویژگی ابدی است، باید از حال ساده ("has") استفاده شود.'
  },
  {
    id: 't_lesson_2',
    mode: 'academic_professor',
    title: 'The Art of Scientific Hedging in AI Research',
    persianTitle: 'تکنیک احتیاط زبانی (Hedging) در مقالات علمی هوش مصنوعی',
    conceptEnglish: 'International academic reviewers penalize over-confident declarations such as "Our neural architecture proves that human intelligence is obsolete." Elite researchers employ epistemic hedging: verbs like "suggests", "indicates", "tends to support", and modals like "may substantially reduce". This protects your scientific integrity while maintaining peer-reviewed credibility.',
    conceptPersian: 'داوران بین‌المللی مقالات IEEE و Nature ادعاهای قطعی و اغراق‌آمیز را رد می‌کنند. محققان برجسته از کلمات محتاطانه (Hedging) نظیر suggests یا tends to استفاده می‌کنند تا ادعا دقیقاً متناسب با نتایج تجربی باشد.',
    examples: [
      { en: 'The empirical metrics suggest that quantization mitigates memory pressure.', fa: 'معیارهای تجربی نشان می‌دهند که کوانتیزاسیون احتمالا فشار حافظه را تعدیل می‌کند.', note: 'Academically sound' },
      { en: 'Our algorithm proves beyond doubt that all existing models are flawed.', fa: 'این جمله به دلیل لحن جزمی و غیرعلمی بلافاصله ریجکت خواهد شد.', note: 'Flawed dogmatic style' }
    ],
    exerciseQuestion: 'Select the sentence that complies with IEEE academic peer-review standards:',
    exercisePersianHint: 'کدام جمله اصل احتیاط علمی را رعایت کرده است؟',
    options: [
      'This study indisputably proves that our model solves all robotics pathing issues forever.',
      'The experimental findings suggest that the proposed attention mechanism tends to enhance sample efficiency.',
      'Our method is 100% perfect and nobody can doubt its superiority.',
      'We proved that reinforcement learning is completely without any error.'
    ],
    correctAnswer: 'The experimental findings suggest that the proposed attention mechanism tends to enhance sample efficiency.',
    persianFeedbackCorrect: 'عالی است! کاربرد "findings suggest" و "tends to enhance" استاندارد دقیق نگارش مقالات علمی در بالاترین سطح است.',
    persianFeedbackWrong: 'نادرست. در مقالات علمی هرگز از واژگانی مثل "indisputably proves" یا "100% perfect" استفاده نمی‌شود، زیرا داوران آن را علامت ادعای توخالی می‌دانند.'
  },
  {
    id: 't_lesson_3',
    mode: 'pronunciation_coach',
    title: 'Eliminating the Persian Epenthetic Vowel in Consonant Clusters',
    persianTitle: 'حذف صدای اضافه (واکه میانجی) قبل از خوشه‌های صامت نظیر /st-/, /sp-/',
    conceptEnglish: 'Because Persian syllable phonotactics historically disallow initial consonant clusters like /st/, /sp/, or /sk/, Iranian speakers often subconsciously insert an /e/ sound before words like "student" (saying "es-tudent"), "special" ("es-pecial"), or "structure" ("es-tructure"). Native English speakers perceive this immediately. You must start articulation directly with the voiceless sibilant /s/ without opening the vocal cords first.',
    conceptPersian: 'در دستور زبان فارسی هجای ابتدایی نمی‌تواند با دو صامت پشت سر هم آغاز شود، به همین دلیل فارسی‌زبانان به طور ناخودآگاه یک صدای "اِ" به اول کلماتی مثل struct یا special اضافه می‌کنند (می‌گویند: اس‌تراکت). برای تلفظ حرفه‌ای باید لب‌ها و زبان را در موقعیت سوت زدن قرار داده و مستقیماً صدای سسسسس را بدون هیچ صدای "اِ" اولیه خارج کنید.',
    examples: [
      { en: 'struct Point { int x; };', fa: 'تلفظ درست: /strʌkt/ (بدون es-truct)', note: 'C++ keyword' },
      { en: 'static analysis pipeline', fa: 'تلفظ درست: /ˈstæt.ɪk/ (بدون es-tatic)', note: 'Direct /st/ onset' }
    ],
    exerciseQuestion: 'Which word should be pronounced starting immediately with /st/ with NO preceding vowel sound?',
    exercisePersianHint: 'کدام کلمه را باید بدون هیچ واکه اضافی در ابتدا تلفظ کنید؟',
    options: ['status', 'estate', 'establishment', 'escape'],
    correctAnswer: 'status',
    persianFeedbackCorrect: 'آفرین! واژه "status" با خوشه /st/ آغاز می‌شود و نباید به شکل "es-tatus" خوانده شود (برخلاف estate که واکه e جزو املای رسمی آن است).',
    persianFeedbackWrong: 'دقت کنید: کلماتی مثل estate یا escape ذاتاً با حرف e شروع می‌شوند، اما status نباید با صدای اضافه e تلفظ شود.'
  }
];

@Component({
  selector: 'app-personal-teacher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Teacher Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                ALI ENGLISH PRIVATE TUTOR & COACH
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Socratic English Teaching Lab</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              تدریس گام‌به‌گام با توضیحات دقیق به زبان فارسی، افزایش تدریجی غوطه‌وری در انگلیسی و اصلاح بی‌درنگ خطاهای ذهنی.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <a
              routerLink="/prompt-studio"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-900/80 text-cyan-300 text-xs font-mono-tech hover:border-cyan-500 transition"
              title="Open Prompt Studio for ChatGPT / Claude / Gemini manual workflow"
            >
              <span class="mat-icon text-sm">terminal</span>
              <span>AI PROMPT STUDIO</span>
            </a>
          </div>
        </div>

        <!-- Mode Selector Bar -->
        <div class="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
          @for (m of modes; track m.key) {
            <button
              (click)="selectMode(m.key)"
              [class.bg-cyan-500]="activeMode() === m.key"
              [class.text-slate-950]="activeMode() === m.key"
              [class.font-bold]="activeMode() === m.key"
              [class.bg-[#050912]]="activeMode() !== m.key"
              [class.text-slate-300]="activeMode() !== m.key"
              [class.border-cyan-500]="activeMode() === m.key"
              [class.border-slate-800]="activeMode() !== m.key"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              <span class="mat-icon text-sm">{{ m.icon }}</span>
              <span>{{ m.label }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Active Lesson Container -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <!-- Lesson Header -->
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between text-xs font-mono-tech text-cyan-400 mb-1">
            <span>LESSON FOCUS</span>
            <button
              (click)="speakConcept()"
              class="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition"
              title="Listen to English concept summary"
            >
              <span class="mat-icon text-sm">volume_up</span>
              <span>READ ALOUD</span>
            </button>
          </div>
          <h2 class="text-lg font-bold text-white">{{ currentLesson().title }}</h2>
          <div class="text-xs font-persian text-cyan-300 mt-0.5">{{ currentLesson().persianTitle }}</div>
        </div>

        <!-- Socratic Concept Walkthrough (Dual-Language Scaffold) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- English Concept -->
          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span class="mat-icon text-sm text-cyan-400">language</span>
              <span>ENGLISH PEDAGOGICAL EXPLANATION</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed font-sans">
              {{ currentLesson().conceptEnglish }}
            </p>
          </div>

          <!-- Persian Grounding -->
          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span class="mat-icon text-sm text-cyan-400">translate</span>
              <span>توضیحات تحلیلی به زبان فارسی</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed font-persian">
              {{ currentLesson().conceptPersian }}
            </p>
          </div>
        </div>

        <!-- Concrete Technical Examples -->
        <div class="space-y-2">
          <div class="text-xs font-mono-tech text-slate-400 uppercase">Contextual Engineering Examples</div>
          <div class="space-y-2">
            @for (ex of currentLesson().examples; track ex.en) {
              <div class="p-3 rounded bg-[#050912] border border-slate-800/80 flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="text-xs font-mono-tech text-cyan-200 font-semibold flex items-center gap-1.5">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{{ ex.en }}</span>
                  </div>
                  <div class="text-[11px] font-persian text-slate-400">{{ ex.fa }}</div>
                </div>
                <button
                  (click)="speech.speak(ex.en)"
                  class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                  title="Speak example"
                >
                  <span class="mat-icon text-base">volume_up</span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Socratic Exercise & Check -->
        <div class="p-5 rounded-lg bg-[#070c18] border border-cyan-900/60 space-y-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 mb-1">
              <span class="mat-icon text-sm">quiz</span>
              <span>SOCRATIC CHECK</span>
            </div>
            <div class="text-sm font-bold text-white">{{ currentLesson().exerciseQuestion }}</div>
            <div class="text-xs font-persian text-slate-400 mt-0.5">{{ currentLesson().exercisePersianHint }}</div>
          </div>

          <div class="grid grid-cols-1 gap-2">
            @for (opt of currentLesson().options; track opt) {
              <button
                (click)="submitAnswer(opt)"
                [disabled]="isSubmitted()"
                [class.border-cyan-500]="selectedOption() === opt && !isSubmitted()"
                [class.border-emerald-500]="isSubmitted() && opt === currentLesson().correctAnswer"
                [class.bg-emerald-950/40]="isSubmitted() && opt === currentLesson().correctAnswer"
                [class.border-rose-500]="isSubmitted() && selectedOption() === opt && opt !== currentLesson().correctAnswer"
                [class.bg-rose-950/30]="isSubmitted() && selectedOption() === opt && opt !== currentLesson().correctAnswer"
                [class.border-slate-800]="selectedOption() !== opt && !isSubmitted()"
                class="w-full text-left p-3 rounded border bg-[#050912] hover:border-slate-600 transition text-xs font-mono-tech text-slate-200 leading-relaxed"
              >
                {{ opt }}
              </button>
            }
          </div>

          <!-- Feedback Box -->
          @if (isSubmitted()) {
            <div class="p-4 rounded border text-xs leading-relaxed"
                 [class.border-emerald-500]="isCorrect()"
                 [class.bg-emerald-950/30]="isCorrect()"
                 [class.text-emerald-200]="isCorrect()"
                 [class.border-rose-500]="!isCorrect()"
                 [class.bg-rose-950/30]="!isCorrect()"
                 [class.text-rose-200]="!isCorrect()">
              <div class="font-bold font-mono-tech flex items-center gap-2 mb-1">
                <span class="mat-icon text-base">{{ isCorrect() ? 'check_circle' : 'cancel' }}</span>
                <span>{{ isCorrect() ? 'CORRECT ASSESSMENT' : 'PEDAGOGICAL CORRECTION' }}</span>
              </div>
              <p class="font-persian text-xs">
                {{ isCorrect() ? currentLesson().persianFeedbackCorrect : currentLesson().persianFeedbackWrong }}
              </p>
            </div>
          }

          <div class="flex items-center justify-between pt-2">
            <button
              (click)="resetExercise()"
              class="text-xs font-mono-tech text-slate-400 hover:text-slate-200"
            >
              TRY AGAIN
            </button>

            <button
              (click)="nextLesson()"
              class="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech transition"
            >
              <span>NEXT LESSON MODULE</span>
              <span class="mat-icon text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PersonalTeacher {
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);
  readonly aiGateway = inject(AcademyAiGateway);

  readonly modes: { key: TeacherMode; label: string; icon: string }[] = [
    { key: 'personal_teacher', label: 'Personal Teacher', icon: 'school' },
    { key: 'academic_professor', label: 'Academic Professor', icon: 'science' },
    { key: 'pronunciation_coach', label: 'Pronunciation Coach', icon: 'record_voice_over' },
    { key: 'conversation_partner', label: 'Conversation Partner', icon: 'forum' },
    { key: 'strict_examiner', label: 'Strict Examiner', icon: 'rule' }
  ];

  readonly activeMode = signal<TeacherMode>('personal_teacher');
  readonly lessonIndex = signal<number>(0);
  readonly selectedOption = signal<string | null>(null);
  readonly isSubmitted = signal<boolean>(false);
  readonly isCorrect = signal<boolean>(false);

  readonly currentLesson = computed(() => {
    const mode = this.activeMode();
    const matching = TEACHER_LESSONS.filter(l => l.mode === mode);
    if (matching.length === 0) return TEACHER_LESSONS[0];
    return matching[this.lessonIndex() % matching.length];
  });

  selectMode(mode: TeacherMode): void {
    this.activeMode.set(mode);
    this.lessonIndex.set(0);
    this.resetExercise();
  }

  speakConcept(): void {
    this.speech.speak(this.currentLesson().conceptEnglish);
  }

  submitAnswer(opt: string): void {
    this.selectedOption.set(opt);
    this.isSubmitted.set(true);
    const correct = opt === this.currentLesson().correctAnswer;
    this.isCorrect.set(correct);

    if (!correct) {
      // Record error to Error Intelligence
      this.storage.saveErrorRecord({
        id: `err_auto_${Date.now()}`,
        category: 'grammar',
        skill: 'grammar',
        originalText: opt,
        correctedText: this.currentLesson().correctAnswer,
        persianExplanation: this.currentLesson().persianFeedbackWrong,
        englishExplanation: 'Identified during Socratic Teacher Exercise.',
        examples: [this.currentLesson().correctAnswer],
        status: 'active',
        occurrences: 1,
        createdAt: new Date().toISOString()
      });
    }
  }

  resetExercise(): void {
    this.selectedOption.set(null);
    this.isSubmitted.set(false);
    this.isCorrect.set(false);
  }

  nextLesson(): void {
    this.lessonIndex.update(i => i + 1);
    this.resetExercise();
  }
}
