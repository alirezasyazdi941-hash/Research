import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

interface PhrasebankCategory {
  title: string;
  persianTitle: string;
  phrases: { en: string; fa: string; register: string }[];
}

const PHRASEBANK: PhrasebankCategory[] = [
  {
    title: '1. Establishing Research Territory & Background',
    persianTitle: 'معرفی زمینه کلی پژوهش و اهمیت مسئله',
    phrases: [
      { en: 'Recent advancements in distributed transformers have demonstrated unprecedented scalability.', fa: 'پیشرفت‌های اخیر در ترنسفورمرهای توزیع‌شده مقیاس‌پذیری بی‌سابقه‌ای را نشان داده‌اند.', register: 'Opening Context' },
      { en: 'Autonomous multi-agent navigation remains a prominent research area in modern robotics.', fa: 'ناوبری سیستم‌های چندعاملی خودمختار همچنان یکی از حوزه‌های برجسته پژوهش در رباتیک مدرن است.', register: 'Significance' }
    ]
  },
  {
    title: '2. Highlighting the Research Gap & Problem Statement',
    persianTitle: 'تبیین خلاء علمی و محدودیت‌های روش‌های پیشین',
    phrases: [
      { en: 'However, existing paradigms incur prohibitive memory overheads during real-time inference.', fa: 'با این حال، الگوهای کنونی در زمان استنتاج بی‌درنگ حافظه بسیار سنگینی تحمیل می‌کنند.', register: 'Critical Gap' },
      { en: 'Despite notable empirical progress, rigorous convergence guarantees remain elusive.', fa: 'علیرغم پیشرفت‌های تجربی قابل توجه، اثبات دقیق همگرایی همچنان دست‌نیافتنی مانده است.', register: 'Theoretical Limitation' }
    ]
  },
  {
    title: '3. Introducing Proposed Architecture & Methodology',
    persianTitle: 'معرفی متدولوژی و نوآوری معماری پیشنهادی',
    phrases: [
      { en: 'To alleviate this bottleneck, we propose a lightweight, lock-free consensus algorithm.', fa: 'برای کاهش این گلوگاه، ما یک الگوریتم اجماع سبک و بدون قفل پیشنهاد می‌کنیم.', register: 'Novel Contribution' },
      { en: 'In this paper, we devise an end-to-end differentiable framework termed [ModelName].', fa: 'در این مقاله، ما یک فریم‌ورک کاملاً مشتق‌پذیر به نام [نام مدل] طراحی کرده‌ایم.', register: 'System Formulation' }
    ]
  },
  {
    title: '4. Presenting Empirical Quantitative Findings',
    persianTitle: 'گزارش نتایج تجربی و کمّی آزمایش‌ها',
    phrases: [
      { en: 'Empirical evaluations substantiate that our method achieves a 3.4x throughput speedup.', fa: 'ارزیابی‌های تجربی اثبات می‌کنند که روش ما به افزایش ۳.۴ برابری توان پردازش دست یافته است.', register: 'Empirical Evidence' },
      { en: 'The results indicate significant reductions in latency while preserving baseline fidelity.', fa: 'نتایج حاکی از کاهش چشمگیر تاخیر زمانی با حفظ دقت اولیه است.', register: 'Hedging with Results' }
    ]
  }
];

@Component({
  selector: 'app-academic-english',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            SCIENTIFIC RESEARCH, IMRAD & ACADEMIC PHRASEBANK
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Academic English Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          مرجع اصطلاحات استاندارد مقالات IEEE، ACM و کنفرانس‌های معتبر هوش مصنوعی؛ فرمول ۵ بخشی ساختار چکیده (IMRAD) و عبارات حرفه‌ای داوری مقاله.
        </p>
      </div>

      <!-- IMRAD Abstract Architecture Interactive Workbench -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-lg">science</span>
            <h2 class="text-base font-bold text-white">IMRAD 5-Sentence Abstract Builder</h2>
          </div>
          <span class="text-xs font-mono-tech text-slate-400">RESEARCH WORKBENCH</span>
        </div>

        <p class="text-xs text-slate-400 font-persian">
          هر چکیده مقاله بین‌المللی کامپیوتر باید دقیقاً از این ۵ لایه عبور کند:
        </p>

        <div class="space-y-3 font-mono-tech text-xs">
          <!-- Step 1: Background -->
          <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-cyan-400 font-bold">
              <span>1. BACKGROUND & MOTIVATION</span>
              <span class="text-[10px] text-slate-500 font-normal">Why does this matter?</span>
            </div>
            <input
              type="text"
              [value]="abstractPart1()"
              (input)="abstractPart1.set($any($event.target).value)"
              class="w-full bg-[#040810] border border-slate-800 rounded p-2 text-slate-200"
            />
          </div>

          <!-- Step 2: Problem Statement -->
          <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-amber-400 font-bold">
              <span>2. PROBLEM STATEMENT & RESEARCH GAP</span>
              <span class="text-[10px] text-slate-500 font-normal">What is the bottleneck?</span>
            </div>
            <input
              type="text"
              [value]="abstractPart2()"
              (input)="abstractPart2.set($any($event.target).value)"
              class="w-full bg-[#040810] border border-slate-800 rounded p-2 text-slate-200"
            />
          </div>

          <!-- Step 3: Proposed Method -->
          <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-sky-400 font-bold">
              <span>3. PROPOSED ARCHITECTURE / METHOD</span>
              <span class="text-[10px] text-slate-500 font-normal">What did you build?</span>
            </div>
            <input
              type="text"
              [value]="abstractPart3()"
              (input)="abstractPart3.set($any($event.target).value)"
              class="w-full bg-[#040810] border border-slate-800 rounded p-2 text-slate-200"
            />
          </div>

          <!-- Step 4: Experimental Results -->
          <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-emerald-400 font-bold">
              <span>4. EMPIRICAL QUANTITATIVE FINDINGS</span>
              <span class="text-[10px] text-slate-500 font-normal">What are the numbers?</span>
            </div>
            <input
              type="text"
              [value]="abstractPart4()"
              (input)="abstractPart4.set($any($event.target).value)"
              class="w-full bg-[#040810] border border-slate-800 rounded p-2 text-slate-200"
            />
          </div>

          <!-- Step 5: Significance -->
          <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-purple-400 font-bold">
              <span>5. BROADER SCIENTIFIC SIGNIFICANCE</span>
              <span class="text-[10px] text-slate-500 font-normal">Why does the world care?</span>
            </div>
            <input
              type="text"
              [value]="abstractPart5()"
              (input)="abstractPart5.set($any($event.target).value)"
              class="w-full bg-[#040810] border border-slate-800 rounded p-2 text-slate-200"
            />
          </div>
        </div>

        <!-- Combined Synthesized Abstract -->
        <div class="p-4 rounded-lg bg-[#04070e] border border-cyan-800/80 space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-tech text-cyan-400 font-bold">
            <span>SYNTHESIZED IEEE/ACM ABSTRACT:</span>
            <span>TOTAL WORDS: {{ totalAbstractWords() }}</span>
          </div>
          <p class="text-xs font-sans text-slate-200 leading-relaxed tracking-wide">
            {{ synthesizedAbstract() }}
          </p>
        </div>
      </div>

      <!-- Academic Phrasebank Directory -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-lg">menu_book</span>
            <h2 class="text-base font-bold text-white">Academic Phrasebank for AI Researchers</h2>
          </div>
          <span class="text-xs font-mono-tech text-slate-400">PUBLISHING PATTERNS</span>
        </div>

        <div class="space-y-4">
          @for (cat of phrasebank; track cat.title) {
            <div class="space-y-2">
              <div class="text-xs font-mono-tech text-cyan-300 font-bold">{{ cat.title }}</div>
              <div class="text-[11px] font-persian text-slate-400">{{ cat.persianTitle }}</div>

              <div class="grid grid-cols-1 gap-2 pt-1">
                @for (phrase of cat.phrases; track phrase.en) {
                  <div class="p-3 rounded bg-[#060a12] border border-slate-800 space-y-1 font-mono-tech text-xs">
                    <div class="text-white font-semibold">{{ phrase.en }}</div>
                    <div class="text-[11px] font-persian text-slate-400">{{ phrase.fa }}</div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AcademicEnglish {
  readonly phrasebank = PHRASEBANK;

  readonly abstractPart1 = signal<string>(
    'Recent advancements in deep reinforcement learning have demonstrated remarkable dexterity in robotic manipulation.'
  );
  readonly abstractPart2 = signal<string>(
    'However, high simulation-to-reality latency and unmodeled sensor noise frequently lead to catastrophic hardware failure.'
  );
  readonly abstractPart3 = signal<string>(
    'In this work, we propose RobustPolicy, an adaptive actor-critic architecture that introduces dynamic domain randomization.'
  );
  readonly abstractPart4 = signal<string>(
    'Extensive empirical trials across thirty physical robotic trials reveal a 94.6% task completion rate with zero hardware stalls.'
  );
  readonly abstractPart5 = signal<string>(
    'These findings substantiate the viability of zero-shot sim-to-real transfer for autonomous robotic agents.'
  );

  readonly synthesizedAbstract = computed(() => {
    return `${this.abstractPart1()} ${this.abstractPart2()} ${this.abstractPart3()} ${this.abstractPart4()} ${this.abstractPart5()}`;
  });

  readonly totalAbstractWords = computed(() => {
    const text = this.synthesizedAbstract().trim();
    return text ? text.split(/\s+/).length : 0;
  });
}
