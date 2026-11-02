import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyStorage } from '../core/services/storage';

@Component({
  selector: 'app-daily-missions',
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
                DAILY ADAPTIVE CURRICULUM DISPATCHER
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Daily Missions</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              ماموریت‌های روزانه متناسب با بودجه زمانی شما ({{ storage.profile().dailyStudyMinutes }} دقیقه در روز)؛ اولویت‌بندی بر اساس موارد در انتظار مرور SM-2 و خطاهای اصلاح‌نشده.
            </p>
          </div>

          <div class="p-3 rounded bg-[#050912] border border-slate-800 font-mono-tech text-xs">
            <span class="text-slate-400">COMPLETION STATUS:</span>
            <span class="text-cyan-300 font-bold ml-2">{{ completedMissions() }} / {{ missions().length }}</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-800">
          <div
            class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
            [style.width.%]="completionPercentage()"
          ></div>
        </div>
      </div>

      <!-- Missions List -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <span class="text-xs font-mono-tech text-slate-400 uppercase">Today's Priority Dispatch</span>
          <span class="text-[11px] font-mono-tech text-cyan-400">ESTIMATED: 30 MINUTES TOTAL</span>
        </div>

        <div class="space-y-3">
          @for (m of missions(); track m.id) {
            <div
              class="p-4 rounded-lg bg-[#060a12] border transition flex items-center justify-between gap-4"
              [class.border-cyan-500/50]="!m.completed"
              [class.border-emerald-900/60]="m.completed"
              [class.opacity-70]="m.completed"
            >
              <div class="flex items-start gap-3">
                <button
                  (click)="toggleMission(m.id)"
                  class="mt-1 w-5 h-5 rounded border flex items-center justify-center transition"
                  [class.border-emerald-500]="m.completed"
                  [class.bg-emerald-950]="m.completed"
                  [class.text-emerald-300]="m.completed"
                  [class.border-slate-700]="!m.completed"
                >
                  @if (m.completed) {
                    <span class="mat-icon text-sm">check</span>
                  }
                </button>

                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold font-mono-tech" [class.line-through]="m.completed" [class.text-white]="!m.completed" [class.text-slate-400]="m.completed">
                      {{ m.title }}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase"
                          [class.bg-rose-950]="m.priority === 'high'"
                          [class.text-rose-300]="m.priority === 'high'"
                          [class.bg-slate-800]="m.priority !== 'high'"
                          [class.text-slate-400]="m.priority !== 'high'">
                      {{ m.priority }} PRIORITY
                    </span>
                    <span class="text-[10px] font-mono-tech text-slate-500">~{{ m.estimatedMinutes }}m</span>
                  </div>
                  <div class="text-[11px] font-persian text-slate-400">{{ m.persianSubtitle }}</div>
                </div>
              </div>

              <a
                [routerLink]="['/' + m.moduleRoute]"
                class="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono-tech uppercase shrink-0 transition"
              >
                <span>OPEN LAB</span>
                <span class="mat-icon text-sm">arrow_forward</span>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DailyMissions {
  readonly storage = inject(AcademyStorage);

  readonly missions = this.storage.missions;

  readonly completedMissions = computed(() => {
    return this.missions().filter(m => m.completed).length;
  });

  readonly completionPercentage = computed(() => {
    const total = this.missions().length;
    if (total === 0) return 0;
    return Math.round((this.completedMissions() / total) * 100);
  });

  toggleMission(id: string): void {
    this.storage.toggleMissionCompleted(id);
  }
}
