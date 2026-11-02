import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { SkillRadar } from '../components/skill-radar';

@Component({
  selector: 'app-progress-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkillRadar],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            EVIDENCE-BASED METRICS & RETENTION DASHBOARD
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Progress & Analytics</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          تحلیل علمی روند یادگیری؛ محاسبه میزان تثبیت واژگان در حافظه بلندمدت با الگوریتم SM-2، سرعت برطرف‌سازی خطاهای فارسی، و رادارسنجی مهارت‌های هفت‌گانه.
        </p>

        <!-- Top Telemetry Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 font-mono-tech text-xs">
          <div class="bg-[#050912] p-3 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px]">CURRENT CEFR:</span>
            <div class="text-lg font-bold text-cyan-300 mt-0.5">{{ profile().overallCefr }}</div>
          </div>
          <div class="bg-[#050912] p-3 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px]">SM-2 RETENTION:</span>
            <div class="text-lg font-bold text-emerald-400 mt-0.5">{{ storage.masteredWords() }} / {{ storage.totalWords() }}</div>
          </div>
          <div class="bg-[#050912] p-3 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px]">ACTIVE L1 TRAPS:</span>
            <div class="text-lg font-bold text-rose-400 mt-0.5">{{ storage.activeErrorsCount() }}</div>
          </div>
          <div class="bg-[#050912] p-3 rounded border border-slate-800">
            <span class="text-slate-400 text-[10px]">CURRENT STREAK:</span>
            <div class="text-lg font-bold text-amber-400 mt-0.5">{{ profile().streakDays }} DAYS</div>
          </div>
        </div>
      </div>

      <!-- Radar and Breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 7-Skill Radar -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-xs font-mono-tech text-slate-300 font-bold uppercase">Multidimensional Radar</span>
            <span class="text-[10px] font-mono-tech text-cyan-400">7 SKILLS</span>
          </div>
          <app-skill-radar [matrix]="profile().skillMatrix"></app-skill-radar>
        </div>

        <!-- Retention Curve & Metrics -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-xs font-mono-tech text-slate-300 font-bold uppercase">SM-2 Memory Decay & Retention</span>
            <span class="text-[10px] font-mono-tech text-emerald-400">SUPERMEMO INTERVAL</span>
          </div>

          <p class="text-xs text-slate-400 font-persian leading-relaxed">
            منحنی فراموشی ابینگهاوس با تکرار فعال در فواصل روز اول، ششم و سپس بر اساس فاکتور سهولت (Ease Factor) خنثی می‌شود.
          </p>

          <div class="space-y-3 font-mono-tech text-xs">
            <div>
              <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>STAGE 1: INITIAL LEARNING</span>
                <span>{{ learningWordsCount() }} WORDS</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-400 h-full" [style.width.%]="learningPct()"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>STAGE 2: ACTIVE INTERVAL REVIEW (1-6 DAYS)</span>
                <span>{{ reviewingWordsCount() }} WORDS</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-sky-400 h-full" [style.width.%]="reviewingPct()"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                <span>STAGE 3: PERMANENT MASTERY (>30 DAYS)</span>
                <span>{{ storage.masteredWords() }} WORDS</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-400 h-full" [style.width.%]="masteredPct()"></div>
              </div>
            </div>
          </div>

          <!-- Error Resolution Velocity -->
          <div class="pt-3 border-t border-slate-800 space-y-2">
            <div class="text-xs font-mono-tech text-slate-300 font-bold uppercase">
              Persian L1 Error Neutralization Velocity
            </div>
            <div class="p-3 rounded bg-[#060a12] border border-slate-800 text-xs font-mono-tech text-slate-300 flex items-center justify-between">
              <span>ERRORS MASTERED & RESOLVED:</span>
              <span class="text-emerald-400 font-bold">{{ storage.masteredErrorsCount() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProgressAnalytics {
  readonly storage = inject(AcademyStorage);
  readonly profile = this.storage.profile;

  readonly learningWordsCount = computed(() => {
    return this.storage.vocabulary().filter(w => w.masteryStatus === 'learning').length;
  });

  readonly reviewingWordsCount = computed(() => {
    return this.storage.vocabulary().filter(w => w.masteryStatus === 'reviewing').length;
  });

  readonly learningPct = computed(() => {
    const total = this.storage.totalWords();
    return total > 0 ? (this.learningWordsCount() / total) * 100 : 0;
  });

  readonly reviewingPct = computed(() => {
    const total = this.storage.totalWords();
    return total > 0 ? (this.reviewingWordsCount() / total) * 100 : 0;
  });

  readonly masteredPct = computed(() => {
    const total = this.storage.totalWords();
    return total > 0 ? (this.storage.masteredWords() / total) * 100 : 0;
  });
}
