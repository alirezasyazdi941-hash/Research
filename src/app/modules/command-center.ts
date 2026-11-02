import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyStorage } from '../core/services/storage';
import { AcademySpeech } from '../core/services/speech';
import { SkillRadar } from '../components/skill-radar';

@Component({
  selector: 'app-command-center',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SkillRadar],
  template: `
    <div class="space-y-6">
      <!-- Top HUD Header Banner -->
      <div class="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#070d18] via-[#091529] to-[#040810] border border-cyan-500/40 p-6 shadow-2xl">
        <div class="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                ALI ENGLISH INTELLIGENCE ENGINE v2.0
              </span>
              <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono-tech border border-cyan-800">
                OFFLINE-FIRST
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Command Center</span>
              <span class="text-xs font-mono-tech px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 text-slate-300 font-normal">
                {{ profile().name }}
              </span>
            </h1>
            <p class="mt-1 text-sm text-slate-300 max-w-2xl font-persian">
              سیستم جامع آموزش زبان انگلیسی تخصصی، هوش مصنوعی، رباتیک و نگارش مقالات علمی بر پایه متدولوژی سنجش شواهد‌محور.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            @if (!profile().diagnosticCompleted) {
              <a
                routerLink="/placement-test"
                class="flex items-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <span class="mat-icon text-base">assignment_turned_in</span>
                <span>TAKE 7-SKILL PLACEMENT TEST</span>
              </a>
            } @else {
              <a
                routerLink="/teacher"
                class="flex items-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <span class="mat-icon text-base">school</span>
                <span>LAUNCH PERSONAL TEACHER</span>
              </a>
            }
            <a
              routerLink="/missions"
              class="flex items-center gap-2 px-4 py-2.5 rounded bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700 text-slate-200 text-xs font-mono-tech tracking-wider transition-all"
            >
              <span class="mat-icon text-base">today</span>
              <span>DAILY MISSIONS</span>
            </a>
          </div>
        </div>

        <!-- Telemetry Stats Strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 font-mono-tech text-xs">
          <div class="bg-[#050912]/80 p-3 rounded border border-slate-800">
            <div class="text-slate-400 text-[11px]">OVERALL CEFR</div>
            <div class="text-lg font-bold text-cyan-300 flex items-center gap-1.5 mt-0.5">
              <span>{{ profile().overallCefr }}</span>
              <span class="text-[10px] text-slate-500 font-normal">
                {{ profile().diagnosticCompleted ? 'ASSESSED' : 'UNVERIFIED' }}
              </span>
            </div>
          </div>
          <div class="bg-[#050912]/80 p-3 rounded border border-slate-800">
            <div class="text-slate-400 text-[11px]">ACTIVE RECALL (SM-2)</div>
            <div class="text-lg font-bold text-emerald-400 mt-0.5">
              {{ storage.masteredWords() }} / {{ storage.totalWords() }}
              <span class="text-[10px] text-slate-500 font-normal">WORDS</span>
            </div>
          </div>
          <div class="bg-[#050912]/80 p-3 rounded border border-slate-800">
            <div class="text-slate-400 text-[11px]">WORDS DUE TODAY</div>
            <div class="text-lg font-bold text-amber-400 mt-0.5">
              {{ storage.dueWords() }}
              <span class="text-[10px] text-slate-500 font-normal">QUEUED</span>
            </div>
          </div>
          <div class="bg-[#050912]/80 p-3 rounded border border-slate-800">
            <div class="text-slate-400 text-[11px]">PERSIAN L1 ERRORS</div>
            <div class="text-lg font-bold text-rose-400 mt-0.5">
              {{ storage.activeErrorsCount() }}
              <span class="text-[10px] text-slate-500 font-normal">TRACKED</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left 2 Cols: Radar & Core Practice Hubs -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Skill Radar and CEFR Matrix -->
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-base font-bold text-white flex items-center gap-2">
                  <span class="mat-icon text-cyan-400 text-lg">radar</span>
                  <span>CEFR Competency Matrix (7 Independent Skills)</span>
                </h2>
                <p class="text-xs text-slate-400 font-persian mt-0.5">
                  ارزیابی مستقل هر یک از مهارت‌های هفت‌گانه بدون پیش‌فرض یکسان بودن سطح
                </p>
              </div>
              <a
                routerLink="/placement-test"
                class="text-xs font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>RE-DIAGNOSE</span>
                <span class="mat-icon text-sm">arrow_forward</span>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <app-skill-radar [matrix]="profile().skillMatrix"></app-skill-radar>

              <!-- Detailed Skill Pill List -->
              <div class="space-y-2">
                @for (skill of skillEntries(); track skill.key) {
                  <div class="flex items-center justify-between p-2 rounded bg-[#060a12] border border-slate-800/80 text-xs">
                    <div class="flex items-center gap-2">
                      <span class="mat-icon text-cyan-400 text-sm">{{ getSkillIcon(skill.key) }}</span>
                      <span class="capitalize text-slate-200 font-medium">{{ skill.key }}</span>
                    </div>
                    <div class="flex items-center gap-2 font-mono-tech">
                      <div class="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-cyan-400 h-full" [style.width.%]="skill.prof.score || 10"></div>
                      </div>
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold"
                            [class.bg-slate-800]="skill.prof.level === 'Pre-A1'"
                            [class.bg-blue-950]="skill.prof.level === 'A1' || skill.prof.level === 'A2'"
                            [class.bg-cyan-950]="skill.prof.level === 'B1' || skill.prof.level === 'B2'"
                            [class.bg-emerald-950]="skill.prof.level === 'C1' || skill.prof.level === 'C2'"
                            [class.text-cyan-300]="true">
                        {{ skill.prof.level }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Rapid Lab Access Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a
              routerLink="/speaking"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">mic</span>
                <span class="text-[10px] font-mono-tech text-slate-500">VOICE LAB</span>
              </div>
              <div class="font-bold text-sm text-slate-100">Speaking Lab</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">ضبط صوت، سنجش روانی و تلفظ</div>
            </a>

            <a
              routerLink="/listening"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">headphones</span>
                <span class="text-[10px] font-mono-tech text-slate-500">AUDIO LAB</span>
              </div>
              <div class="font-bold text-sm text-slate-100">Listening Lab</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">دیکته جمله به جمله و سرعت چندگانه</div>
            </a>

            <a
              routerLink="/writing"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">edit_note</span>
                <span class="text-[10px] font-mono-tech text-slate-500">TEXT LAB</span>
              </div>
              <div class="font-bold text-sm text-slate-100">Writing Lab</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">چکیده مقالات، گزارش فنی و نامه‌نگاری</div>
            </a>

            <a
              routerLink="/pronunciation"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">record_voice_over</span>
                <span class="text-[10px] font-mono-tech text-slate-500">IPA TRAINER</span>
              </div>
              <div class="font-bold text-sm text-slate-100">Pronunciation Lab</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">تمایز آوایی، استرس واژگان و شادوینگ</div>
            </a>

            <a
              routerLink="/academic"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">science</span>
                <span class="text-[10px] font-mono-tech text-slate-500">RESEARCH</span>
              </div>
              <div class="font-bold text-sm text-slate-100">Academic English</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">فرمول ۵ جمله‌ای IMRAD و عبارات مرجع</div>
            </a>

            <a
              routerLink="/prompt-studio"
              class="group p-4 rounded-lg bg-[#080d19] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1426] transition-all"
            >
              <div class="flex items-center justify-between text-cyan-400 mb-2">
                <span class="mat-icon text-2xl group-hover:scale-110 transition-transform">terminal</span>
                <span class="text-[10px] font-mono-tech text-slate-500">PROMPT TOOL</span>
              </div>
              <div class="font-bold text-sm text-slate-100">AI Prompt Studio</div>
              <div class="text-[11px] text-slate-400 font-persian mt-1">پرامپت‌های مهندسی‌شده و ورود داده</div>
            </a>
          </div>
        </div>

        <!-- Right Col: Daily Priorities, Due Vocab & Error Defense -->
        <div class="space-y-6">
          <!-- Spaced Repetition Due Queue Card -->
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="mat-icon text-amber-400 text-base">alarm</span>
                <span>Spaced Repetition (SM-2)</span>
              </h3>
              <a routerLink="/vocabulary" class="text-xs font-mono-tech text-cyan-400 hover:underline">
                START REVIEW ({{ storage.dueWords() }})
              </a>
            </div>

            <p class="text-xs text-slate-400 font-persian mb-3">
              الگوریتم بر اساس عملکرد قبلی شما فواصل مرور را به طور خودکار تعیین می‌کند.
            </p>

            <div class="space-y-2">
              @for (item of sampleDueWords(); track item.id) {
                <div class="p-2.5 rounded bg-[#060a12] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-white">{{ item.word }}</span>
                      <span class="text-[10px] font-mono-tech text-slate-400">{{ item.ipa }}</span>
                    </div>
                    <div class="text-[11px] text-slate-400 font-persian mt-0.5 line-clamp-1">
                      {{ item.persianMeaning }}
                    </div>
                  </div>
                  <button
                    (click)="speakWord(item.word)"
                    class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                    title="Pronounce word"
                  >
                    <span class="mat-icon text-base">volume_up</span>
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Active Persian L1 Interference Errors -->
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="mat-icon text-rose-400 text-base">warning</span>
                <span>Recurring L1 Error Database</span>
              </h3>
              <a routerLink="/errors" class="text-xs font-mono-tech text-cyan-400 hover:underline">
                OPEN LAB
              </a>
            </div>

            <p class="text-xs text-slate-400 font-persian mb-3">
              خطاهایی که ناشی از انتقال ناخودآگاه گرامر و کلمات فارسی به انگلیسی هستند:
            </p>

            <div class="space-y-2.5">
              @for (err of sampleErrors(); track err.id) {
                <div class="p-3 rounded bg-[#0b0709] border border-rose-950/80 text-xs">
                  <div class="text-rose-300 font-mono-tech line-through text-[11px]">
                    {{ err.originalText }}
                  </div>
                  <div class="text-emerald-400 font-mono-tech font-semibold text-xs mt-0.5 flex items-center gap-1">
                    <span class="mat-icon text-xs">check_circle</span>
                    <span>{{ err.correctedText }}</span>
                  </div>
                  <div class="text-[11px] text-slate-300 font-persian mt-1 line-clamp-2 leading-relaxed">
                    {{ err.persianExplanation }}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Rahe Alireza Knowledge Grounding -->
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-4">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
              <span class="mat-icon text-cyan-400 text-sm">verified</span>
              <span>VERIFIED KNOWLEDGE SOURCE</span>
            </div>
            <p class="text-xs text-slate-400 font-persian leading-relaxed">
              بر مبنای فلسفه آموزشی پلتفرم راه علیرضا: یادگیری عمیق، سنجش شواهد‌محور، پرهیز از تظاهر، و زبان انگلیسی به عنوان زبان مادری تفکر مهندسی.
            </p>
            <div class="mt-2 text-[10px] font-mono-tech text-cyan-400/80">
              https://alirezasyazdi941-hash.github.io/Rahe_alireza/
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CommandCenter {
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);

  readonly profile = this.storage.profile;

  readonly skillEntries = computed(() => {
    const matrix = this.profile().skillMatrix;
    return (Object.keys(matrix) as (keyof typeof matrix)[]).map(key => ({
      key,
      prof: matrix[key]
    }));
  });

  readonly sampleDueWords = computed(() => {
    return this.storage.vocabulary().slice(0, 4);
  });

  readonly sampleErrors = computed(() => {
    return this.storage.errors().slice(0, 3);
  });

  getSkillIcon(skill: string): string {
    const icons: Record<string, string> = {
      reading: 'menu_book',
      listening: 'hearing',
      writing: 'edit',
      speaking: 'mic',
      grammar: 'spellcheck',
      vocabulary: 'translate',
      pronunciation: 'record_voice_over'
    };
    return icons[skill] || 'star';
  }

  speakWord(word: string): void {
    this.speech.speak(word);
  }
}
