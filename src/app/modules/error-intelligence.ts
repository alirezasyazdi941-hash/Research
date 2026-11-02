import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { ErrorRecord } from '../core/models/types';

@Component({
  selector: 'app-error-intelligence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Error Intelligence Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                PERMANENT ADAPTIVE ERROR INTELLIGENCE DATABASE
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Error Intelligence Lab</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              کالبدشکافی ریشه‌ای خطاهای زبانی و تداخل‌های مادری؛ هر خطای ثبت‌شده دارای تحلیل چرایی، نسخه جایگزین، تمرین اختصاصی و برنامه مرور است.
            </p>
          </div>

          <!-- Counter metrics -->
          <div class="flex items-center gap-3 font-mono-tech text-xs">
            <div class="p-2.5 rounded bg-[#050912] border border-slate-800">
              <span class="text-slate-400 text-[10px]">ACTIVE ERRORS:</span>
              <span class="text-rose-400 font-bold ml-1.5">{{ storage.activeErrorsCount() }}</span>
            </div>
            <div class="p-2.5 rounded bg-[#050912] border border-slate-800">
              <span class="text-slate-400 text-[10px]">REMEDIATED:</span>
              <span class="text-emerald-400 font-bold ml-1.5">{{ storage.masteredErrorsCount() }}</span>
            </div>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-800 text-xs font-mono-tech">
          @for (cat of categories; track cat.key) {
            <button
              (click)="selectedCategory.set(cat.key)"
              [class.bg-cyan-500]="selectedCategory() === cat.key"
              [class.text-slate-950]="selectedCategory() === cat.key"
              [class.font-bold]="selectedCategory() === cat.key"
              [class.bg-[#050912]]="selectedCategory() !== cat.key"
              [class.text-slate-300]="selectedCategory() !== cat.key"
              [class.border-cyan-500]="selectedCategory() === cat.key"
              [class.border-slate-800]="selectedCategory() !== cat.key"
              class="px-2.5 py-1 rounded border transition"
            >
              {{ cat.label }}
            </button>
          }
        </div>
      </div>

      <!-- Active Errors List -->
      <div class="space-y-4">
        @for (err of filteredErrors(); track err.id) {
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
            <!-- Error Card Header -->
            <div class="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase"
                      [class.bg-rose-950]="err.category === 'l1_interference'"
                      [class.text-rose-300]="err.category === 'l1_interference'"
                      [class.border]="true"
                      [class.border-rose-800]="err.category === 'l1_interference'"
                      [class.bg-slate-800]="err.category !== 'l1_interference'"
                      [class.text-slate-300]="err.category !== 'l1_interference'">
                  {{ err.category.replace('_', ' ') }}
                </span>
                <span class="text-xs font-mono-tech text-slate-400">SKILL: {{ err.skill }}</span>
                <span class="text-[10px] font-mono-tech text-slate-500">OCCURRENCES: {{ err.occurrences }}x</span>
              </div>

              <!-- Status Action -->
              <button
                (click)="toggleStatus(err)"
                class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-tech border transition"
                [class.border-emerald-700]="err.status === 'mastered'"
                [class.bg-emerald-950]="err.status === 'mastered'"
                [class.text-emerald-300]="err.status === 'mastered'"
                [class.border-amber-700]="err.status === 'active'"
                [class.bg-amber-950/40]="err.status === 'active'"
                [class.text-amber-300]="err.status === 'active'"
              >
                <span class="mat-icon text-xs">{{ err.status === 'mastered' ? 'check_circle' : 'hourglass_top' }}</span>
                <span>{{ err.status === 'mastered' ? 'MASTERED (RESOLVED)' : 'IN REMEDIATION' }}</span>
              </button>
            </div>

            <!-- Original vs Corrected -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono-tech text-xs">
              <div class="p-3 rounded bg-[#0e0709] border border-rose-950 text-rose-300">
                <div class="text-[10px] text-rose-500 uppercase font-bold mb-1">INCORRECT / RECORDED FORM:</div>
                <div class="line-through">{{ err.originalText }}</div>
              </div>

              <div class="p-3 rounded bg-[#061214] border border-emerald-950 text-emerald-300">
                <div class="text-[10px] text-emerald-500 uppercase font-bold mb-1">STANDARD CORRECT FORM:</div>
                <div>{{ err.correctedText }}</div>
              </div>
            </div>

            <!-- Persian Root Cause Explanation -->
            <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-1">
              <div class="text-[10px] font-mono-tech text-slate-400 uppercase font-sans">علت ریشه‌ای بروز خطا (Persian Linguistic Explanation):</div>
              <p class="text-xs text-slate-300 font-persian leading-relaxed">
                {{ err.persianExplanation }}
              </p>
            </div>

            <!-- Interactive Remediation Drill -->
            @if (err.drillQuestion && err.drillOptions) {
              <div class="p-4 rounded bg-[#070c18] border border-cyan-950 space-y-2.5">
                <div class="flex items-center gap-1.5 text-xs font-mono-tech text-cyan-400 font-bold">
                  <span class="mat-icon text-sm">quiz</span>
                  <span>TARGETED REMEDIATION DRILL</span>
                </div>
                <div class="text-xs font-bold text-white font-mono-tech">{{ err.drillQuestion }}</div>

                <div class="grid grid-cols-1 gap-1.5 pt-1">
                  @for (opt of err.drillOptions; track opt) {
                    <button
                      (click)="answerDrill(err.id, opt)"
                      [class.border-emerald-500]="activeDrillAnswers()[err.id] === opt && opt === err.drillAnswer"
                      [class.bg-emerald-950/40]="activeDrillAnswers()[err.id] === opt && opt === err.drillAnswer"
                      [class.border-rose-500]="activeDrillAnswers()[err.id] === opt && opt !== err.drillAnswer"
                      [class.border-slate-800]="activeDrillAnswers()[err.id] !== opt"
                      class="w-full text-left p-2.5 rounded border bg-[#050912] hover:border-slate-600 transition text-xs font-mono-tech text-slate-200"
                    >
                      {{ opt }}
                    </button>
                  }
                </div>

                @if (activeDrillAnswers()[err.id]) {
                  <div class="text-[11px] font-mono-tech pt-1"
                       [class.text-emerald-400]="activeDrillAnswers()[err.id] === err.drillAnswer"
                       [class.text-rose-400]="activeDrillAnswers()[err.id] !== err.drillAnswer">
                    {{ activeDrillAnswers()[err.id] === err.drillAnswer ? 'CORRECT: Linguistic interference neutralized.' : 'INCORRECT: Review Persian explanation above.' }}
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ErrorIntelligence {
  readonly storage = inject(AcademyStorage);

  readonly selectedCategory = signal<string>('ALL');
  readonly activeDrillAnswers = signal<Record<string, string>>({});

  readonly categories = [
    { key: 'ALL', label: 'ALL CATEGORIES' },
    { key: 'l1_interference', label: 'PERSIAN L1 TRAPS' },
    { key: 'grammar', label: 'GRAMMAR' },
    { key: 'word_choice', label: 'WORD CHOICE' },
    { key: 'pronunciation', label: 'PRONUNCIATION' },
    { key: 'unnatural_expression', label: 'UNNATURAL PHRASING' }
  ];

  readonly errors = this.storage.errors;

  readonly filteredErrors = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'ALL') return this.errors();
    return this.errors().filter(e => e.category === cat);
  });

  toggleStatus(err: ErrorRecord): void {
    const newStatus = err.status === 'mastered' ? 'active' : 'mastered';
    this.storage.saveErrorRecord({
      ...err,
      status: newStatus,
      remediatedAt: newStatus === 'mastered' ? new Date().toISOString() : undefined
    });
  }

  answerDrill(errId: string, opt: string): void {
    const updated = { ...this.activeDrillAnswers() };
    updated[errId] = opt;
    this.activeDrillAnswers.set(updated);
  }
}
