import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { LearnerProficiencyMatrix, LanguageSkill } from '../core/models/types';

@Component({
  selector: 'app-skill-radar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative flex flex-col items-center justify-center p-4 bg-[#080d1a] border border-cyan-950/60 rounded-lg">
      <div class="flex items-center justify-between w-full mb-2">
        <span class="text-xs font-mono-tech text-cyan-400 tracking-wider flex items-center gap-1.5">
          <span class="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          7-SKILL PROFICIENCY RADAR
        </span>
        <span class="text-[11px] font-mono-tech text-slate-400">CEFR MATRIX</span>
      </div>

      <svg viewBox="0 0 340 320" class="w-full max-w-[320px] h-auto overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45" />
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.15" />
          </linearGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="3" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Concentric Guideline Polygons (20%, 40%, 60%, 80%, 100%) -->
        @for (ring of [0.2, 0.4, 0.6, 0.8, 1.0]; track ring) {
          <polygon
            [attr.points]="getRingPoints(ring)"
            fill="none"
            stroke="#1e293b"
            stroke-width="1"
            stroke-dasharray="2 3"
          />
        }

        <!-- Radial Spokes -->
        @for (axis of axes; track axis.label; let i = $index) {
          <line
            x1="170"
            y1="160"
            [attr.x2]="axis.x"
            [attr.y2]="axis.y"
            stroke="#1e293b"
            stroke-width="1"
          />
        }

        <!-- Active Data Polygon -->
        <polygon
          [attr.points]="dataPolygon()"
          fill="url(#radarFill)"
          stroke="#38bdf8"
          stroke-width="2"
          filter="url(#radarGlow)"
        />

        <!-- Data Points and Labels -->
        @for (pt of dataPoints(); track pt.skill) {
          <circle
            [attr.cx]="pt.x"
            [attr.cy]="pt.y"
            r="4.5"
            fill="#38bdf8"
            stroke="#080d1a"
            stroke-width="1.5"
          />
          <text
            [attr.x]="pt.labelX"
            [attr.y]="pt.labelY"
            text-anchor="middle"
            fill="#94a3b8"
            class="text-[10px] font-mono-tech select-none"
          >
            {{ pt.label }} ({{ pt.score }}%)
          </text>
        }
      </svg>
    </div>
  `
})
export class SkillRadar {
  readonly matrix = input.required<LearnerProficiencyMatrix>();

  private readonly skills: { key: LanguageSkill; label: string }[] = [
    { key: 'reading', label: 'Reading' },
    { key: 'listening', label: 'Listening' },
    { key: 'writing', label: 'Writing' },
    { key: 'speaking', label: 'Speaking' },
    { key: 'grammar', label: 'Grammar' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'pronunciation', label: 'Pronunciation' }
  ];

  readonly center = { x: 170, y: 160 };
  readonly radius = 105;

  readonly axes = this.skills.map((s, i) => {
    const angle = (Math.PI * 2 * i) / this.skills.length - Math.PI / 2;
    return {
      label: s.label,
      x: this.center.x + this.radius * Math.cos(angle),
      y: this.center.y + this.radius * Math.sin(angle)
    };
  });

  getRingPoints(factor: number): string {
    return this.skills.map((_, i) => {
      const angle = (Math.PI * 2 * i) / this.skills.length - Math.PI / 2;
      const x = this.center.x + this.radius * factor * Math.cos(angle);
      const y = this.center.y + this.radius * factor * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }

  readonly dataPoints = computed(() => {
    const m = this.matrix();
    return this.skills.map((s, i) => {
      const score = Math.max(10, Math.min(100, m[s.key]?.score || 10));
      const factor = score / 100;
      const angle = (Math.PI * 2 * i) / this.skills.length - Math.PI / 2;
      const x = this.center.x + this.radius * factor * Math.cos(angle);
      const y = this.center.y + this.radius * factor * Math.sin(angle);

      // Label positioning slightly past the max radius
      const labelDist = this.radius + 20;
      const labelX = this.center.x + labelDist * Math.cos(angle);
      const labelY = this.center.y + labelDist * Math.sin(angle) + 4;

      return {
        skill: s.key,
        label: s.label,
        score: m[s.key]?.score || 0,
        level: m[s.key]?.level || 'Pre-A1',
        x,
        y,
        labelX,
        labelY
      };
    });
  });

  readonly dataPolygon = computed(() => {
    return this.dataPoints().map(pt => `${pt.x},${pt.y}`).join(' ');
  });
}
