import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { LanguageSkill, SkillProficiency, LearnerProfile } from '../core/models/types';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Profile Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                PERSONALIZED LEARNER INTELLIGENCE PROFILE
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Learner Profile & Academic Preferences</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              پروفایل شخصی‌سازی‌شده علیرضا؛ تطبیق شدت آموزش و علایق تخصصی هوش مصنوعی و رباتیک.
            </p>
          </div>

          <button
            (click)="saveProfile()"
            class="flex items-center gap-2 px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech tracking-wider uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span class="mat-icon text-sm">save</span>
            <span>SAVE PROFILE CHANGES</span>
          </button>
        </div>
      </div>

      <!-- Core Configuration Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left: Identity & Constraints -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
          <h2 class="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span class="mat-icon text-cyan-400 text-base">person</span>
            <span>Identity & Pedagogical Parameters</span>
          </h2>

          <div class="space-y-1">
            <label for="learner-name-input" class="block text-xs font-mono-tech text-slate-400">LEARNER FULL NAME</label>
            <input
              id="learner-name-input"
              type="text"
              [value]="name()"
              (input)="onNameChange($event)"
              class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-xs font-mono-tech text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <span class="block text-xs font-mono-tech text-slate-400">NATIVE LANGUAGE (L1)</span>
              <div class="p-2.5 rounded bg-[#050912] border border-slate-800 text-xs font-mono-tech text-cyan-300">
                Persian (فارسی)
              </div>
            </div>
            <div class="space-y-1">
              <span class="block text-xs font-mono-tech text-slate-400">TARGET LANGUAGE (L2)</span>
              <div class="p-2.5 rounded bg-[#050912] border border-slate-800 text-xs font-mono-tech text-emerald-300">
                English (Advanced)
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <span class="block text-xs font-mono-tech text-slate-400">DAILY STUDY TIME BUDGET</span>
            <div class="grid grid-cols-4 gap-2">
              @for (mins of [15, 30, 45, 60]; track mins) {
                <button
                  type="button"
                  (click)="dailyMinutes.set(mins)"
                  [class.border-cyan-500]="dailyMinutes() === mins"
                  [class.bg-cyan-950/60]="dailyMinutes() === mins"
                  [class.text-cyan-300]="dailyMinutes() === mins"
                  [class.border-slate-800]="dailyMinutes() !== mins"
                  [class.bg-[#050912]]="dailyMinutes() !== mins"
                  class="py-2 rounded border text-xs font-mono-tech font-bold text-center transition"
                >
                  {{ mins }}m
                </button>
              }
            </div>
          </div>

          <div class="space-y-1">
            <label for="intensity-select" class="block text-xs font-mono-tech text-slate-400">LEARNING INTENSITY</label>
            <select
              id="intensity-select"
              [value]="intensity()"
              (change)="onIntensityChange($event)"
              class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-xs font-mono-tech text-white"
            >
              <option value="relaxed">Relaxed (Steady retention)</option>
              <option value="standard">Standard (Balanced progression)</option>
              <option value="intensive">Intensive (Rapid academic surge)</option>
              <option value="immersive">Immersive (Daily comprehensive lab)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="immersion-select" class="block text-xs font-mono-tech text-slate-400">INSTRUCTIONAL IMMERSION</label>
            <select
              id="immersion-select"
              [value]="immersion()"
              (change)="onImmersionChange($event)"
              class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-xs font-mono-tech text-white"
            >
              <option value="persian_scaffolded">Persian Scaffolded (Explanations in Persian, content in English)</option>
              <option value="balanced">Balanced (Bilingual contextual explanations)</option>
              <option value="english_dominant">English Dominant (Full target language immersion)</option>
            </select>
          </div>
        </div>

        <!-- Right: Primary Engineering Interests -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
          <h2 class="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span class="mat-icon text-cyan-400 text-base">interests</span>
            <span>Target Engineering & Research Interests</span>
          </h2>

          <p class="text-xs text-slate-400 font-persian">
            تمامی مثال‌ها، ریدینگ‌ها و مباحث مکالمه بر اساس این حوزه‌ها اولویت‌بندی می‌شوند:
          </p>

          <div class="space-y-2">
            @for (interest of availableInterests; track interest) {
              <label class="flex items-center gap-3 p-2.5 rounded bg-[#050912] border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  [checked]="isInterestSelected(interest)"
                  (change)="toggleInterest(interest)"
                  class="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span class="text-xs font-mono-tech text-slate-200">{{ interest }}</span>
              </label>
            }
          </div>
        </div>
      </div>

      <!-- Skill Matrix Overrides / Inspection -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-base">tune</span>
            <span>Independent CEFR Skill Baselines</span>
          </h2>
          <span class="text-xs font-mono-tech text-slate-400">
            DIAGNOSTIC STATUS: {{ profile().diagnosticCompleted ? 'VERIFIED' : 'PENDING' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          @for (s of skillsList; track s) {
            <div class="p-3 rounded bg-[#050912] border border-slate-800 space-y-1.5 font-mono-tech text-xs">
              <div class="uppercase text-slate-400 font-bold flex items-center justify-between">
                <span>{{ s }}</span>
                <span class="text-cyan-400">{{ getSkill(s).score }}%</span>
              </div>
              <div class="text-sm font-black text-white">
                {{ getSkill(s).level }}
              </div>
              <div class="text-[10px] text-slate-500">
                Assessed: {{ formatDate(getSkill(s).assessedAt) }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LearnerProfileComponent {
  readonly storage = inject(AcademyStorage);
  readonly profile = this.storage.profile;

  readonly name = signal<string>(this.profile().name);
  readonly dailyMinutes = signal<number>(this.profile().dailyStudyMinutes);
  readonly intensity = signal<LearnerProfile['learningIntensity']>(this.profile().learningIntensity);
  readonly immersion = signal<LearnerProfile['immersionPreference']>(this.profile().immersionPreference);
  readonly selectedInterests = signal<string[]>([...this.profile().interests]);

  readonly skillsList: LanguageSkill[] = [
    'reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary', 'pronunciation'
  ];

  readonly availableInterests = [
    'Artificial Intelligence',
    'Computer Engineering',
    'Robotics & Autonomous Systems',
    'Programming & Distributed Systems',
    'Software Architecture & Scalability',
    'Scientific Research & Publications',
    'International Academic Communication',
    'Remote Engineering & Tech Leadership'
  ];

  getSkill(skill: LanguageSkill): SkillProficiency {
    return this.profile().skillMatrix[skill];
  }

  formatDate(date?: string): string {
    return date ? date.substring(0, 10) : 'Never';
  }

  onNameChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  onIntensityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.intensity.set(select.value as LearnerProfile['learningIntensity']);
  }

  onImmersionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.immersion.set(select.value as LearnerProfile['immersionPreference']);
  }

  isInterestSelected(interest: string): boolean {
    return this.selectedInterests().includes(interest);
  }

  toggleInterest(interest: string): void {
    const current = this.selectedInterests();
    if (current.includes(interest)) {
      this.selectedInterests.set(current.filter(i => i !== interest));
    } else {
      this.selectedInterests.set([...current, interest]);
    }
  }

  saveProfile(): void {
    this.storage.updateProfile({
      name: this.name(),
      dailyStudyMinutes: this.dailyMinutes(),
      learningIntensity: this.intensity(),
      immersionPreference: this.immersion(),
      interests: this.selectedInterests()
    });
  }
}
