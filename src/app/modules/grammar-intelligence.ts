import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

interface GrammarRule {
  id: string;
  topic: string;
  persianTopic: string;
  cefr: string;
  summary: string;
  persianExplanation: string;
  formula: string;
  examples: { correct: string; incorrect: string; note: string }[];
  quiz: {
    question: string;
    options: string[];
    correct: string;
    explanationFa: string;
  };
}

const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'g_nominalization',
    topic: 'Nominalization in Academic Prose',
    persianTopic: 'اسم‌سازی (Nominalization) برای تراکم علمی متن',
    cefr: 'B2-C1',
    summary: 'Converting verbs and adjectives into academic nouns (e.g., "analyze" -> "analysis", "quantize" -> "quantization"). It makes technical prose dense, objective, and authoritative by shifting focus from personal actors to scientific phenomena.',
    persianExplanation: 'در نگارش مقالات معتبر، به جای استفاده از افعال ساده و فاعل‌های متعدد، افعال به اسم‌های آکادمیک تبدیل می‌شوند تا لحن متن کاملاً بی‌طرفانه، فشرده و فاخر شود.',
    formula: 'Verb + (-tion / -ment / -ance) -> Scientific Abstract Noun',
    examples: [
      {
        correct: 'Quantization of neural weights significantly reduces memory latency.',
        incorrect: 'When we quantize the neural weights, we make the memory fast.',
        note: 'Quantize -> Quantization creates dense academic flow.'
      }
    ],
    quiz: {
      question: 'Which sentence demonstrates effective academic nominalization?',
      options: [
        'Because the engineers investigated the cluster, they discovered a bug.',
        'Investigation of the distributed cluster revealed a race condition in the mutex lock.',
        'We were investigating and then we saw the bug.',
        'The investigating of the cluster was very good.'
      ],
      correct: 'Investigation of the distributed cluster revealed a race condition in the mutex lock.',
      explanationFa: 'جمله دوم با تبدیل فعل به اسم "Investigation" تمرکز را روی رخداد فنی و کشف بن‌بست معطوف کرده و استاندارد ژورنال‌های IEEE است.'
    }
  },
  {
    id: 'g_third_conditional',
    topic: 'Third Conditionals in Post-Mortem Diagnostics',
    persianTopic: 'شرطی نوع سوم در تحلیل حوادث سرور و پس‌مرگ حادثه',
    cefr: 'B1-B2',
    summary: 'Expresses hypothetical scenarios in the past that did not happen. Essential for incident post-mortems and debugging analysis.',
    persianExplanation: 'برای توضیح اینکه چه چیزی در گذشته رخ داد و اگر سناریوی دیگری پیش می‌آمد نتیجه چه می‌شد، از ساختار If + Had + P.P همراه با Would have + P.P استفاده می‌شود.',
    formula: 'If + Past Perfect (had + V3), ... would have + V3',
    examples: [
      {
        correct: 'If the circuit breaker had triggered earlier, the cascading failure would have been avoided.',
        incorrect: 'If the circuit breaker triggered earlier, it would avoid the failure.',
        note: 'Third conditional requires past perfect and would have.'
      }
    ],
    quiz: {
      question: 'Complete the sentence: "If the Kubernetes replica ______ healthy, the load balancer ______ traffic to the backup pod."',
      options: [
        'had remained / would have directed',
        'remained / will direct',
        'would have remained / had directed',
        'is remaining / directs'
      ],
      correct: 'had remained / would have directed',
      explanationFa: 'شرطی نوع سوم نیازمند had remained در بند شرط و would have directed در بند اصلی است.'
    }
  },
  {
    id: 'g_scientific_passive',
    topic: 'The Scientific Passive Voice',
    persianTopic: 'مجهول علمی و پرهیز از فاعل‌های اضافه در متدولوژی',
    cefr: 'B1-B2',
    summary: 'Used in the methodology and results sections of IEEE/ACM papers to focus on the experiment rather than the researcher.',
    persianExplanation: 'در بخش متدولوژی مقالات، تمرکز بر فرآیند و داده‌هاست، نه بر شخص محقق. بنابراین از مجهول زمان گذشته ساده استفاده می‌شود.',
    formula: 'Subject + was/were + Past Participle (+ by...)',
    examples: [
      {
        correct: 'The sensor telemetry was sampled at 100 Hz.',
        incorrect: 'We sampled the sensor telemetry at 100 Hz every time.',
        note: 'Passive voice shifts focus to the scientific artifact.'
      }
    ],
    quiz: {
      question: 'Which sentence best fits the Methodology section of an IEEE paper?',
      options: [
        'We decided to train our neural network for 50 epochs on a GPU.',
        'The deep reinforcement learning policy was trained across 50 epochs on an NVIDIA H100 GPU cluster.',
        'Our team had a lot of fun training the network.',
        'Someone trained the policy on a GPU.'
      ],
      correct: 'The deep reinforcement learning policy was trained across 50 epochs on an NVIDIA H100 GPU cluster.',
      explanationFa: 'جمله دوم با ساختار مجهول رسمی و مشخص کردن دقیق سخت‌افزار، متدولوژی استاندارد مقاله علمی است.'
    }
  }
];

@Component({
  selector: 'app-grammar-intelligence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            ENGINEERING & SCIENTIFIC SYNTAX SYLLABUS
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Grammar Intelligence</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          گرامر تخصصی متون فنی و دانشگاهی: اسم‌سازی، مجهول علمی، شرطی‌های مهندسی خطایابی و بندهای قیدی پیوسته.
        </p>

        <!-- Rule Selector -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (rule of rules; track rule.id; let idx = $index) {
            <button
              (click)="selectRule(idx)"
              [class.bg-cyan-500]="activeRuleIndex() === idx"
              [class.text-slate-950]="activeRuleIndex() === idx"
              [class.font-bold]="activeRuleIndex() === idx"
              [class.bg-[#050912]]="activeRuleIndex() !== idx"
              [class.text-slate-300]="activeRuleIndex() !== idx"
              [class.border-cyan-500]="activeRuleIndex() === idx"
              [class.border-slate-800]="activeRuleIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ rule.topic }}
            </button>
          }
        </div>
      </div>

      <!-- Active Grammar Rule Workspace -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400 mb-1">
              <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">{{ activeRule().cefr }}</span>
              <span>SYNTAX MODULE</span>
            </div>
            <h2 class="text-lg font-bold text-white">{{ activeRule().topic }}</h2>
            <div class="text-xs font-persian text-cyan-300 mt-0.5">{{ activeRule().persianTopic }}</div>
          </div>
        </div>

        <!-- Formula Callout -->
        <div class="p-3.5 rounded bg-[#060a12] border border-cyan-900/60 font-mono-tech text-xs text-cyan-300 flex items-center gap-3">
          <span class="mat-icon text-cyan-400">functions</span>
          <span class="font-bold">SYNTACTIC FORMULA:</span>
          <span>{{ activeRule().formula }}</span>
        </div>

        <!-- Explanations -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <span class="text-xs font-mono-tech text-slate-400 uppercase">English Linguistic Rule</span>
            <p class="text-xs text-slate-200 leading-relaxed font-sans">{{ activeRule().summary }}</p>
          </div>

          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <span class="text-xs font-mono-tech text-slate-400 uppercase">تحلیل کاربردی به فارسی</span>
            <p class="text-xs text-slate-300 leading-relaxed font-persian">{{ activeRule().persianExplanation }}</p>
          </div>
        </div>

        <!-- Concrete Comparisons -->
        <div class="space-y-2">
          <span class="text-xs font-mono-tech text-slate-400 uppercase">Contrasting Patterns</span>
          @for (ex of activeRule().examples; track ex.correct) {
            <div class="p-4 rounded bg-[#050912] border border-slate-800 space-y-2">
              <div class="flex items-center gap-2 text-xs font-mono-tech text-emerald-400">
                <span class="mat-icon text-xs">check</span>
                <span>ACADEMIC STANDARD: {{ ex.correct }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs font-mono-tech text-rose-400">
                <span class="mat-icon text-xs">close</span>
                <span>SUB-OPTIMAL / CASUAL: {{ ex.incorrect }}</span>
              </div>
              <div class="text-[11px] font-mono-tech text-slate-400 pt-1 border-t border-slate-900">
                NOTE: {{ ex.note }}
              </div>
            </div>
          }
        </div>

        <!-- Interactive Drill Quiz -->
        <div class="p-5 rounded-lg bg-[#070c18] border border-cyan-950 space-y-3">
          <div class="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 uppercase font-bold">
            <span class="mat-icon text-sm">quiz</span>
            <span>SYNTACTIC COMPREHENSION DRILL</span>
          </div>
          <div class="text-sm font-bold text-white">{{ activeRule().quiz.question }}</div>

          <div class="grid grid-cols-1 gap-2 pt-2">
            @for (opt of activeRule().quiz.options; track opt) {
              <button
                (click)="answerQuiz(opt)"
                [class.border-cyan-500]="selectedQuizOption() === opt && !isQuizSubmitted()"
                [class.border-emerald-500]="isQuizSubmitted() && opt === activeRule().quiz.correct"
                [class.bg-emerald-950/40]="isQuizSubmitted() && opt === activeRule().quiz.correct"
                [class.border-rose-500]="isQuizSubmitted() && selectedQuizOption() === opt && opt !== activeRule().quiz.correct"
                [class.border-slate-800]="selectedQuizOption() !== opt && !isQuizSubmitted()"
                class="w-full text-left p-3 rounded border bg-[#050912] hover:border-slate-600 transition text-xs font-mono-tech text-slate-200"
              >
                {{ opt }}
              </button>
            }
          </div>

          @if (isQuizSubmitted()) {
            <div class="p-3.5 rounded border text-xs font-persian leading-relaxed"
                 [class.border-emerald-500]="isQuizCorrect()"
                 [class.bg-emerald-950/30]="isQuizCorrect()"
                 [class.text-emerald-200]="isQuizCorrect()"
                 [class.border-rose-500]="!isQuizCorrect()"
                 [class.bg-rose-950/30]="!isQuizCorrect()"
                 [class.text-rose-200]="!isQuizCorrect()">
              {{ activeRule().quiz.explanationFa }}
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class GrammarIntelligence {
  readonly rules = GRAMMAR_RULES;
  readonly activeRuleIndex = signal<number>(0);
  readonly selectedQuizOption = signal<string | null>(null);
  readonly isQuizSubmitted = signal<boolean>(false);

  readonly activeRule = computed(() => this.rules[this.activeRuleIndex()]);

  readonly isQuizCorrect = computed(() => {
    return this.selectedQuizOption() === this.activeRule().quiz.correct;
  });

  selectRule(idx: number): void {
    this.activeRuleIndex.set(idx);
    this.selectedQuizOption.set(null);
    this.isQuizSubmitted.set(false);
  }

  answerQuiz(opt: string): void {
    this.selectedQuizOption.set(opt);
    this.isQuizSubmitted.set(true);
  }
}
