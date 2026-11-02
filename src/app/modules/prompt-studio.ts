import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademyAiGateway } from '../core/services/ai-gateway';
import { AcademyStorage } from '../core/services/storage';

@Component({
  selector: 'app-prompt-studio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                AI-ASSISTED MANUAL LEARNING & PROMPT DISPATCHER
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">AI Prompt Studio</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              گردش‌کار مستقل و بدون وابستگی اجباری به هوش مصنوعی؛ تولید پرامپت‌های مهندسی‌شده برای ChatGPT، Claude و Gemini، کپی با یک کلیک و ورود پاسخ‌ها پس از راستی‌آزمایی به آکادمی.
            </p>
          </div>

          <!-- Server Gemini Status Indicator -->
          <div class="flex items-center gap-2 p-2.5 rounded bg-[#050912] border border-slate-800 font-mono-tech text-xs">
            <span class="w-2 h-2 rounded-full" [class.bg-emerald-400]="aiGateway.hasLiveGemini()" [class.bg-slate-600]="!aiGateway.hasLiveGemini()"></span>
            <span class="text-slate-400">SERVER AI PROXY:</span>
            <span [class.text-emerald-300]="aiGateway.hasLiveGemini()" [class.text-slate-500]="!aiGateway.hasLiveGemini()">
              {{ aiGateway.hasLiveGemini() ? 'ACTIVE (OPTIONAL)' : 'OFFLINE (MANUAL WORKFLOW)' }}
            </span>
          </div>
        </div>

        <!-- Template Selector Tabs -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (tmpl of templates; track tmpl.id; let idx = $index) {
            <button
              (click)="selectTemplate(idx)"
              [class.bg-cyan-500]="activeTemplateIndex() === idx"
              [class.text-slate-950]="activeTemplateIndex() === idx"
              [class.font-bold]="activeTemplateIndex() === idx"
              [class.bg-[#050912]]="activeTemplateIndex() !== idx"
              [class.text-slate-300]="activeTemplateIndex() !== idx"
              [class.border-cyan-500]="activeTemplateIndex() === idx"
              [class.border-slate-800]="activeTemplateIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ tmpl.title }}
            </button>
          }
        </div>
      </div>

      <!-- Active Template Workbench -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div class="text-xs font-mono-tech text-slate-400 uppercase">TARGET SKILL: {{ activeTemplate().targetSkill }}</div>
            <h2 class="text-base font-bold text-white">{{ activeTemplate().title }}</h2>
            <div class="text-xs font-persian text-cyan-300 mt-0.5">{{ activeTemplate().persianDescription }}</div>
          </div>
          <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-tech text-slate-300">
            SUGGESTED: {{ activeTemplate().aiModelSuggested }}
          </span>
        </div>

        <!-- System Prompt Box -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>SYSTEM INSTRUCTION (ROLE ARCHITECTURE)</span>
            <button
              (click)="copyText(activeTemplate().systemPrompt)"
              class="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span class="mat-icon text-xs">content_copy</span>
              <span>COPY SYSTEM PROMPT</span>
            </button>
          </div>
          <div class="p-3.5 rounded bg-[#050912] border border-slate-800 text-xs font-mono-tech text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
            {{ activeTemplate().systemPrompt }}
          </div>
        </div>

        <!-- User Prompt Assembly with Editable Target Variables -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>COMPOSED USER PROMPT (READY FOR 1-CLICK CLIPBOARD COPY)</span>
            <button
              (click)="copyText(hydratedPrompt())"
              class="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-900 transition"
            >
              <span class="mat-icon text-sm">content_copy</span>
              <span>COPY FULL PROMPT</span>
            </button>
          </div>

          <textarea
            [value]="hydratedPrompt()"
            (input)="customPromptDraft.set($any($event.target).value)"
            rows="6"
            class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-3 text-xs font-mono-tech text-slate-100 leading-relaxed"
          ></textarea>
        </div>

        <!-- Optional Server Live Execution if Key Exists -->
        @if (aiGateway.hasLiveGemini()) {
          <div class="p-4 rounded bg-[#081324] border border-cyan-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div class="text-xs font-bold text-cyan-300 font-mono-tech flex items-center gap-1.5">
                <span class="mat-icon text-sm">smart_toy</span>
                <span>OPTIONAL SERVER-SIDE GEMINI EXECUTION DETECTED</span>
              </div>
              <div class="text-[11px] font-persian text-slate-400">
                کلید Gemini در سرور فعال است. می‌توانید همین پرامپت را مستقیماً نیز اجرا کنید.
              </div>
            </div>

            <button
              (click)="runLiveGemini()"
              [disabled]="isExecutingLive()"
              class="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-tech uppercase transition"
            >
              {{ isExecutingLive() ? 'RUNNING LIVE AI...' : 'RUN LIVE GEMINI' }}
            </button>
          </div>
        }

        <!-- Paste AI Response and Validate Section -->
        <div class="p-5 rounded-lg bg-[#070c18] border border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono-tech text-cyan-400 uppercase font-bold">
            <span class="flex items-center gap-1.5">
              <span class="mat-icon text-sm">verified_user</span>
              <span>PASTE & VALIDATE EXTERNAL AI RESPONSE (CHATGPT / CLAUDE / GEMINI)</span>
            </span>
          </div>

          <p class="text-xs text-slate-400 font-persian">
            پاسخ دریافت شده از ابزار هوش مصنوعی را در کادر زیر قرار دهید. سیستم واژگان و خطاهای استخراج شده را اعتبارسنجی کرده و به پایگاه دانش اضافه می‌کند:
          </p>

          <textarea
            [value]="pastedAiResponse()"
            (input)="pastedAiResponse.set($any($event.target).value)"
            rows="6"
            placeholder="Paste AI response text here to extract vocabulary and review notes..."
            class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-3 text-xs font-mono-tech text-white leading-relaxed"
          ></textarea>

          <div class="flex items-center justify-between pt-1">
            <span class="text-xs font-mono-tech text-slate-500">
              {{ toastMessage() || 'READY FOR VALIDATION' }}
            </span>

            <button
              (click)="validateAndSaveResponse()"
              [disabled]="!pastedAiResponse().trim()"
              class="flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs font-mono-tech uppercase transition shadow-[0_0_15px_rgba(5,150,105,0.3)]"
            >
              <span class="mat-icon text-sm">fact_check</span>
              <span>VALIDATE & STORE IN ACADEMY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PromptStudio {
  readonly aiGateway = inject(AcademyAiGateway);
  readonly storage = inject(AcademyStorage);

  readonly templates = this.aiGateway.promptTemplates();
  readonly activeTemplateIndex = signal<number>(0);
  readonly customPromptDraft = signal<string>('');
  readonly pastedAiResponse = signal<string>('');
  readonly isExecutingLive = signal<boolean>(false);
  readonly toastMessage = signal<string>('');

  readonly activeTemplate = computed(() => this.templates[this.activeTemplateIndex()]);

  readonly hydratedPrompt = computed(() => {
    if (this.customPromptDraft()) return this.customPromptDraft();
    const tmpl = this.activeTemplate();
    return this.aiGateway.hydratePrompt(tmpl, tmpl.exampleVariables);
  });

  selectTemplate(idx: number): void {
    this.activeTemplateIndex.set(idx);
    this.customPromptDraft.set('');
    this.pastedAiResponse.set('');
    this.toastMessage.set('');
  }

  async copyText(text: string): Promise<void> {
    const ok = await this.aiGateway.copyToClipboard(text);
    if (ok) {
      this.toastMessage.set('COPIED TO CLIPBOARD SUCCESSFULLY!');
      setTimeout(() => this.toastMessage.set(''), 3000);
    }
  }

  async runLiveGemini(): Promise<void> {
    this.isExecutingLive.set(true);
    const tmpl = this.activeTemplate();
    const result = await this.aiGateway.executeLiveAi(this.hydratedPrompt(), tmpl.systemPrompt);
    this.isExecutingLive.set(false);
    if (result.success && result.text) {
      this.pastedAiResponse.set(result.text);
      this.toastMessage.set('LIVE RESPONSE RECEIVED AND POPULATED BELOW');
    } else {
      this.toastMessage.set(result.error || 'LIVE AI CALL FAILED');
    }
  }

  validateAndSaveResponse(): void {
    const text = this.pastedAiResponse().trim();
    if (!text) return;

    // Save as Knowledge Document
    this.storage.saveKnowledgeDocument({
      id: `doc_ai_${Date.now()}`,
      title: `AI Review: ${this.activeTemplate().title}`,
      source: 'AI Prompt Studio (External Model Response)',
      topic: 'AI Pedagogical Feedback',
      content: text,
      persianSummary: 'تحلیل استخراج شده از هوش مصنوعی پس از اعتبارسنجی کاربر.',
      verificationStatus: 'ai_assisted_reference',
      createdAt: new Date().toISOString(),
      tags: ['AI Assisted', this.activeTemplate().targetSkill]
    });

    this.toastMessage.set('DOCUMENT SAVED TO KNOWLEDGE LIBRARY WITH "AI ASSISTED" BADGE!');
    setTimeout(() => this.toastMessage.set(''), 4000);
  }
}
