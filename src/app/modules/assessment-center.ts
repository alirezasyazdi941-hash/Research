import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyStorage } from '../core/services/storage';

@Component({
  selector: 'app-assessment-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                FORMAL RIGOROUS EVALUATOR & BENCHMARKS
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Assessment Center</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              سنجش‌های دوره‌ای با معیارهای شفاف، محاسبه نمرات بدون توهم پیشرفت، و ثبت تاریخچه پیشرفت برای تعیین دقیق جهش‌های سطوح CEFR.
            </p>
          </div>

          <a
            routerLink="/placement-test"
            class="flex items-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span class="mat-icon text-sm">assignment</span>
            <span>LAUNCH COMPREHENSIVE RE-ASSESSMENT</span>
          </a>
        </div>
      </div>

      <!-- Current Diagnostic Evaluation Status -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <span class="text-xs font-mono-tech text-slate-400 uppercase font-bold">Current Certified Competency Matrix</span>
          <span class="text-xs font-mono-tech text-cyan-400">
            DIAGNOSTIC STATUS: {{ profile().diagnosticCompleted ? 'COMPLETED' : 'PENDING EVALUATION' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          @for (item of skillList; track item.skill) {
            <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 font-mono-tech text-xs space-y-1.5">
              <div class="flex items-center justify-between text-slate-400">
                <span class="uppercase font-bold">{{ item.skill }}</span>
                <span class="text-cyan-400 font-bold">{{ profile().skillMatrix[item.skill].score }}%</span>
              </div>
              <div class="text-base font-black text-white flex items-center gap-2">
                <span>{{ profile().skillMatrix[item.skill].level }}</span>
                <span class="text-[10px] text-slate-500 font-normal">CEFR</span>
              </div>
              <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div class="bg-cyan-400 h-full" [style.width.%]="profile().skillMatrix[item.skill].score || 10"></div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Transparent Assessment Rubric Principles -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-base">rule</span>
            <span>Transparent CEFR Rubric Standards</span>
          </h2>
          <p class="text-xs text-slate-400 font-persian mt-0.5">
            طبق الزامات سیستم علی، هیچ نمره یا سطح رسمی بدون شواهد مستند تولید کلامی یا نوشتاری اعطا نمی‌شود.
          </p>
        </div>

        <div class="space-y-3 font-mono-tech text-xs">
          <div class="p-3 rounded bg-[#060a12] border border-slate-800 space-y-1">
            <div class="text-cyan-300 font-bold">1. Reading & Technical Comprehension (20% Weight)</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">
              Inference from unadapted academic papers (IEEE/ACM), identifying authorial stance, and contextual vocabulary deduction.
            </div>
          </div>
          <div class="p-3 rounded bg-[#060a12] border border-slate-800 space-y-1">
            <div class="text-cyan-300 font-bold">2. Oral Fluency & Phonetic Accuracy (25% Weight)</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">
              Absence of Persian /w/ to /v/ substitutions, natural sentence stress, and continuous explanation of system architectures without filler stalls.
            </div>
          </div>
          <div class="p-3 rounded bg-[#060a12] border border-slate-800 space-y-1">
            <div class="text-cyan-300 font-bold">3. Academic Writing & Scientific Hedging (25% Weight)</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">
              Dense nominalization, zero Persian L1 calques ("according to my opinion", "researches"), and appropriate epistemic modality.
            </div>
          </div>
          <div class="p-3 rounded bg-[#060a12] border border-slate-800 space-y-1">
            <div class="text-cyan-300 font-bold">4. Active Lexical Retrieval & Grammatical Cohesion (30% Weight)</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">
              Active recall under pressure in the SM-2 engine and syntactic mastery of conditionals, passive voice, and cleft structures.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AssessmentCenter {
  readonly storage = inject(AcademyStorage);
  readonly profile = this.storage.profile;

  readonly skillList = [
    { skill: 'reading' as const },
    { skill: 'listening' as const },
    { skill: 'writing' as const },
    { skill: 'speaking' as const },
    { skill: 'grammar' as const },
    { skill: 'vocabulary' as const },
    { skill: 'pronunciation' as const }
  ];
}
