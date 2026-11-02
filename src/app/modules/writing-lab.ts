import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';

interface WritingPrompt {
  id: string;
  title: string;
  persianTitle: string;
  category: 'abstract' | 'email' | 'incident_report';
  instruction: string;
  persianInstruction: string;
  sampleInput: string;
}

const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'w_abstract',
    title: 'Research Abstract & Problem Statement',
    persianTitle: 'نگارش چکیده مقاله و بیانیه مسئله (IMRAD)',
    category: 'abstract',
    instruction: 'Compose an academic abstract paragraph (80 - 150 words) stating a machine learning challenge (e.g. latency, memory footprint), your proposed architecture, and empirical evaluation metrics.',
    persianInstruction: 'یک چکیده علمی بین ۸۰ تا ۱۵۰ کلمه بنویسید که مسئله محدودیت حافظه مدل‌های زبانی بزرگ، روش پیشنهادی شما (مانند هرس کردن وزن‌ها) و نتایج تجربی را بیان کند.',
    sampleInput: 'In our research, we carried out several researches on large language models. According to my opinion, the memory bottleneck is very big problem. I am agree with pruning weights. The results prove that latency drops 40%.'
  },
  {
    id: 'w_email',
    title: 'Formal Academic Email to Professor / Reviewer',
    persianTitle: 'نامه‌نگاری رسمی دانشگاهی به استاد راهنما یا داور کنفرانس',
    category: 'email',
    instruction: 'Draft a professional email requesting access to an unpublished robotics dataset or asking for clarification on a conference review rebuttal.',
    persianInstruction: 'یک ایمیل رسمی بنویسید که در آن از محقق درخواست دسترسی به دیتاست یا بازبینی مقاله را با لحن محترمانه دانشگاهی مطرح کنید.',
    sampleInput: 'Dear Professor, I am writing to you because I am agree with your paper. Please explain me how can I download the dataset. I will open account on your advice.'
  }
];

@Component({
  selector: 'app-writing-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            ACADEMIC WRITING & CRITICAL EVALUATOR
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Writing Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          آزمایشگاه نگارش مقالات علمی، چکیده‌نویسی و مکاتبات بین‌المللی؛ کالبدشکافی خطاهای تداخل زبان فارسی، اعمال احتیاط علمی (Hedging) و ارائه نسخه اصلاح‌شده سطح بالا.
        </p>

        <!-- Template Selector -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (p of prompts; track p.id; let idx = $index) {
            <button
              (click)="selectPrompt(idx)"
              [class.bg-cyan-500]="activePromptIndex() === idx"
              [class.text-slate-950]="activePromptIndex() === idx"
              [class.font-bold]="activePromptIndex() === idx"
              [class.bg-[#050912]]="activePromptIndex() !== idx"
              [class.text-slate-300]="activePromptIndex() !== idx"
              [class.border-cyan-500]="activePromptIndex() === idx"
              [class.border-slate-800]="activePromptIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ p.title }}
            </button>
          }
        </div>
      </div>

      <!-- Workbench -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-1">
          <div class="text-xs font-bold font-mono-tech text-white uppercase">{{ activePrompt().title }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">{{ activePrompt().instruction }}</p>
          <p class="text-xs text-slate-400 font-persian leading-relaxed">{{ activePrompt().persianInstruction }}</p>
        </div>

        <!-- Textarea Editor -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>DRAFT YOUR TEXT:</span>
            <div class="flex items-center gap-3">
              <span>WORDS: {{ wordCount() }}</span>
              <button
                (click)="loadSampleText()"
                class="text-cyan-400 hover:underline"
              >
                LOAD TEST TEXT
              </button>
            </div>
          </div>

          <textarea
            [value]="userText()"
            (input)="userText.set($any($event.target).value)"
            rows="7"
            placeholder="Type or paste your academic writing here..."
            class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-4 text-xs font-mono-tech text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
          ></textarea>
        </div>

        <!-- Action Bar -->
        <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div class="text-xs font-mono-tech text-slate-400">
            DETECTED ISSUES: <span class="text-rose-400 font-bold">{{ detectedL1Errors().length }}</span>
          </div>

          <button
            (click)="runEvaluation()"
            [disabled]="wordCount() < 5"
            class="flex items-center gap-2 px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-tech uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span class="mat-icon text-base">rule</span>
            <span>RUN CRITICAL EVALUATION</span>
          </button>
        </div>

        <!-- Evaluation Results Breakdown -->
        @if (hasEvaluated()) {
          <div class="space-y-5 pt-4 border-t border-slate-800">
            <!-- Detected Persian L1 Interference Cards -->
            @if (detectedL1Errors().length > 0) {
              <div class="space-y-2">
                <div class="text-xs font-mono-tech text-rose-400 uppercase font-bold flex items-center gap-1.5">
                  <span class="mat-icon text-sm">warning</span>
                  <span>PERSIAN L1 INTERFERENCE TRAPS IDENTIFIED IN YOUR TEXT</span>
                </div>
                <div class="space-y-2">
                  @for (err of detectedL1Errors(); track err.original) {
                    <div class="p-3.5 rounded bg-[#0e0709] border border-rose-950 space-y-1 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="text-rose-400 font-mono-tech font-bold line-through">"{{ err.original }}"</span>
                        <span class="text-emerald-400 font-mono-tech font-bold">REPLACE WITH: "{{ err.fix }}"</span>
                      </div>
                      <p class="text-[11px] text-slate-300 font-persian leading-relaxed pt-1">
                        {{ err.reason }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Polished High-Register Version (Before vs After) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
                <div class="text-xs font-mono-tech text-slate-400 uppercase font-bold">Original Submission</div>
                <div class="text-xs font-mono-tech text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {{ userText() }}
                </div>
              </div>

              <div class="p-4 rounded bg-[#06121c] border border-cyan-800/80 space-y-2">
                <div class="text-xs font-mono-tech text-cyan-300 uppercase font-bold flex items-center justify-between">
                  <span>Polished IEEE/Academic Version</span>
                  <span class="text-[10px] text-emerald-400">C1 REGISTER</span>
                </div>
                <div class="text-xs font-mono-tech text-emerald-200 whitespace-pre-wrap leading-relaxed">
                  {{ polishedText() }}
                </div>
              </div>
            </div>

            <!-- Targeted Exercises Generated from Mistakes -->
            <div class="p-4 rounded bg-[#050912] border border-slate-800 space-y-2">
              <div class="text-xs font-mono-tech text-cyan-400 uppercase font-bold">Targeted Remediation Drill</div>
              <p class="text-xs text-slate-300 font-persian">
                کدام بازنویسی برای جمله اول پاراگراف شما استاندارد دانشگاهی دارد؟
              </p>
              <div class="p-2.5 rounded bg-[#080d19] border border-slate-700 font-mono-tech text-xs text-slate-200">
                "In this paper, we conducted extensive research on large language models; empirical findings suggest that memory overhead is mitigated by weight pruning."
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class WritingLab {
  readonly storage = inject(AcademyStorage);

  readonly prompts = WRITING_PROMPTS;
  readonly activePromptIndex = signal<number>(0);
  readonly userText = signal<string>('');
  readonly hasEvaluated = signal<boolean>(false);

  readonly activePrompt = computed(() => this.prompts[this.activePromptIndex()]);

  readonly wordCount = computed(() => {
    const t = this.userText().trim();
    return t ? t.split(/\s+/).length : 0;
  });

  readonly detectedL1Errors = computed(() => {
    const text = this.userText().toLowerCase();
    const errors: { original: string; fix: string; reason: string }[] = [];

    if (text.includes('i am agree') || text.includes('we are agree')) {
      errors.push({
        original: 'I am agree',
        fix: 'I agree',
        reason: 'در فارسی می‌گوییم «من موافقم» (با فعل ربطی)، اما در انگلیسی agree خودش فعل اصلی است و نیازی به am ندارد.'
      });
    }

    if (text.includes('according to my opinion') || text.includes('according to me')) {
      errors.push({
        original: 'According to my opinion',
        fix: 'In my opinion / From our perspective',
        reason: 'عبارت According to فقط برای منابع شخص ثالث یا مقالات دیگر به کار می‌رود، هرگز برای نظر شخصی خودتان استفاده نکنید.'
      });
    }

    if (text.includes('researches')) {
      errors.push({
        original: 'researches',
        fix: 'research studies / investigations',
        reason: 'کلمه research در انگلیسی غیرقابل شمارش است و با s جمع بسته نمی‌شود.'
      });
    }

    if (text.includes('results prove') || text.includes('this proves')) {
      errors.push({
        original: 'proves that',
        fix: 'results suggest that / tend to indicate that',
        reason: 'در مقالات علمی از اصل احتیاط زبانی (Hedging) استفاده می‌شود تا از ادعاهای مطلق و جزمی پرهیز گردد.'
      });
    }

    if (text.includes('explain me')) {
      errors.push({
        original: 'explain me',
        fix: 'explain to me',
        reason: 'فعل explain نیازمند حرف اضافه to است (Explain something to someone).'
      });
    }

    return errors;
  });

  readonly polishedText = computed(() => {
    const orig = this.userText();
    if (!orig) return '';
    return orig
      .replace(/I am agree/gi, 'I agree')
      .replace(/According to my opinion/gi, 'In our perspective')
      .replace(/researches/gi, 'research studies')
      .replace(/results prove/gi, 'empirical findings suggest')
      .replace(/very big problem/gi, 'a critical operational bottleneck')
      .replace(/explain me/gi, 'explain to me');
  });

  selectPrompt(idx: number): void {
    this.activePromptIndex.set(idx);
    this.userText.set('');
    this.hasEvaluated.set(false);
  }

  loadSampleText(): void {
    this.userText.set(this.activePrompt().sampleInput);
    this.hasEvaluated.set(false);
  }

  runEvaluation(): void {
    this.hasEvaluated.set(true);

    // Persist discovered errors into Error Intelligence
    for (const err of this.detectedL1Errors()) {
      this.storage.saveErrorRecord({
        id: `err_writing_${Date.now()}_${err.original.slice(0, 5)}`,
        category: 'l1_interference',
        skill: 'writing',
        originalText: err.original,
        correctedText: err.fix,
        persianExplanation: err.reason,
        englishExplanation: 'Identified during Academic Writing Lab evaluation.',
        examples: [err.fix],
        status: 'active',
        occurrences: 1,
        createdAt: new Date().toISOString()
      });
    }
  }
}
