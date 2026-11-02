import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AcademySpeech } from '../core/services/speech';
import { AcademyStorage } from '../core/services/storage';

interface ConversationScenario {
  id: string;
  title: string;
  persianTitle: string;
  role: string;
  context: string;
  persianContext: string;
  turns: {
    speaker: 'interlocutor' | 'user';
    text: string;
    persianText: string;
    naturalAlternative?: string;
    persianCritique?: string;
  }[];
}

const SCENARIOS: ConversationScenario[] = [
  {
    id: 'scen_arch_review',
    title: 'Distributed System Architecture Review',
    persianTitle: 'جلسه بررسی معماری سیستم توزیع‌شده با مهندس ارشد',
    role: 'Principal Staff Engineer (Silicon Valley)',
    context: 'You are defending an asynchronous event-driven design against latency and data consistency concerns.',
    persianContext: 'شما در حال دفاع از تصمیم استفاده از معماری مبتنی بر رخداد (Event-Driven) در برابر چالش‌های هماهنگی داده‌ها در زمان قطعی شبکه هستید.',
    turns: [
      {
        speaker: 'interlocutor',
        text: 'Ali, how does your proposed Kafka pipeline handle duplicate event delivery when a network partition forces producer retries?',
        persianText: 'علیرضا، وقتی قطعی شبکه باعث ارسال مجدد درخواست‌ها بشه، خط لوله کافکای پیشنهادی تو چطور جلوی پردازش پیام‌های تکراری رو می‌گیره؟'
      },
      {
        speaker: 'user',
        text: 'We are using an idempotent consumer with a distributed Redis lock and unique transaction IDs.',
        persianText: 'ما از یک مصرف‌کننده آیدمپوتنت همراه با قفل توزیع‌شده ردیس و شناسه‌های تراکنش یکتا استفاده می‌کنیم.',
        naturalAlternative: 'We enforce end-to-end idempotency at the consumer layer, relying on atomic Redis lockouts backed by UUID transaction keys.',
        persianCritique: 'جمله شما صحیح و قابل درک بود؛ نسخه پیشنهادی از اصطلاح طبیعی‌تر "enforce end-to-end idempotency" برای گفتمان مهندسان ارشد استفاده می‌کند.'
      },
      {
        speaker: 'interlocutor',
        text: 'Fair enough. What happens if the Redis cluster itself undergoes a failover election during a high-throughput burst?',
        persianText: 'منطقیه. حالا اگر خود کلاستر ردیس در اوج بار ترافیکی وارد فرآیند انتخاب لیدر جدید بشه، چه رخ میده؟'
      }
    ]
  },
  {
    id: 'scen_academic_defense',
    title: 'International Conference Q&A Defense',
    persianTitle: 'پاسخ به سوالات چالش‌برانگیز داوران کنفرانس بین‌المللی',
    role: 'Session Chair & Senior Academic Reviewer',
    context: 'A reviewer challenges the generalization capability of your reinforcement learning model.',
    persianContext: 'داور کنفرانس قدرت تعمیم مدل یادگیری تقویتی شما را در محیط‌های واقعی و خارج از شبیه‌ساز به چالش می‌کشد.',
    turns: [
      {
        speaker: 'interlocutor',
        text: 'Your simulation benchmarks show impressive sample efficiency, but how confident are you that this policy transfers to physical robotic hardware without catastrophic failure?',
        persianText: 'آزمایش‌های شبیه‌سازی شما نرخ یادگیری چشمگیری رو نشون میده، اما چقدر اطمینان دارید که این خط مشی روی سخت‌افزار واقعی بدون شکست فاجعه‌بار پیاده‌سازی بشه؟'
      },
      {
        speaker: 'user',
        text: 'In our research, we used domain randomization across friction and mass coefficients to minimize the reality gap.',
        persianText: 'ما در پژوهش خود از رندومایز کردن دامنه در ضرایب اصطکاک و جرم استفاده کردیم تا شکاف بین شبیه‌سازی و واقعیت رو به حداقل برسونیم.',
        naturalAlternative: 'To bridge the sim-to-real gap, we introduced extensive domain randomization over inertial and frictional parameters during policy training.',
        persianCritique: 'عبارت "bridge the sim-to-real gap" اصطلاح اصیل و مرسوم مقالات ICRA و IROS است.'
      }
    ]
  }
];

@Component({
  selector: 'app-conversation-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            TECHNICAL & ACADEMIC DIALOGUE SIMULATION
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Conversation Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          شبیه‌سازی مکالمات تخصصی واقعی (جلسات طراحی معماری، دفاع از مقاله در کنفرانس، استندآپ تیم ریموت) به همراه نقد زبان‌شناختی و ارتقای اصطلاحات کتابی به انگلیسی زنده.
        </p>

        <!-- Scenario Switcher -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (scen of scenarios; track scen.id; let idx = $index) {
            <button
              (click)="selectedScenarioIndex.set(idx)"
              [class.bg-cyan-500]="selectedScenarioIndex() === idx"
              [class.text-slate-950]="selectedScenarioIndex() === idx"
              [class.font-bold]="selectedScenarioIndex() === idx"
              [class.bg-[#050912]]="selectedScenarioIndex() !== idx"
              [class.text-slate-300]="selectedScenarioIndex() !== idx"
              [class.border-cyan-500]="selectedScenarioIndex() === idx"
              [class.border-slate-800]="selectedScenarioIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ scen.title }}
            </button>
          }
        </div>
      </div>

      <!-- Dialogue Arena -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <!-- Interlocutor Persona Header -->
        <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <span class="mat-icon text-lg">psychology</span>
            </div>
            <div>
              <div class="text-xs font-bold text-white font-mono-tech">{{ currentScenario().role }}</div>
              <div class="text-[11px] text-slate-400 font-persian">{{ currentScenario().persianTitle }}</div>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono-tech text-cyan-400">
            SIMULATION READY
          </span>
        </div>

        <!-- Chat Conversation Stream -->
        <div class="space-y-4">
          @for (turn of currentScenario().turns; track turn.text) {
            @if (turn.speaker === 'interlocutor') {
              <!-- Interlocutor message -->
              <div class="flex items-start gap-3 max-w-2xl">
                <div class="w-7 h-7 rounded bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono-tech">
                  AI
                </div>
                <div class="p-3.5 rounded-lg bg-[#0c1424] border border-cyan-950 text-xs space-y-1.5 shadow-md">
                  <div class="text-slate-100 font-mono-tech leading-relaxed">{{ turn.text }}</div>
                  <div class="text-[11px] font-persian text-slate-400">{{ turn.persianText }}</div>
                  <button
                    (click)="speech.speak(turn.text)"
                    class="flex items-center gap-1 text-[10px] font-mono-tech text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    <span class="mat-icon text-xs">volume_up</span>
                    <span>LISTEN</span>
                  </button>
                </div>
              </div>
            } @else {
              <!-- User spoken / written turn -->
              <div class="flex items-start gap-3 max-w-2xl ml-auto flex-row-reverse">
                <div class="w-7 h-7 rounded bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono-tech">
                  ALI
                </div>
                <div class="p-3.5 rounded-lg bg-[#07101e] border border-cyan-700/60 text-xs space-y-2 text-right">
                  <div class="text-white font-mono-tech leading-relaxed text-left">{{ turn.text }}</div>
                  <div class="text-[11px] font-persian text-slate-400 text-right">{{ turn.persianText }}</div>

                  <!-- Natural English Upgrade Callout -->
                  @if (turn.naturalAlternative) {
                    <div class="p-2.5 rounded bg-[#040810] border border-cyan-900 text-left space-y-1">
                      <div class="text-[10px] font-mono-tech text-emerald-400 font-bold flex items-center gap-1">
                        <span class="mat-icon text-xs">auto_awesome</span>
                        <span>NATURAL SILICON VALLEY UPGRADE:</span>
                      </div>
                      <div class="text-xs font-mono-tech text-slate-200">{{ turn.naturalAlternative }}</div>
                      <div class="text-[11px] font-persian text-slate-400">{{ turn.persianCritique }}</div>
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Live Turn Input Section -->
        <div class="p-4 rounded-lg bg-[#060a12] border border-slate-800 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>DELIVER YOUR SPOKEN OR WRITTEN ARGUMENT</span>
            <span class="text-cyan-400">MIC HARDWARE ACTIVE</span>
          </div>

          <div class="flex gap-2">
            <input
              type="text"
              [value]="customInput()"
              (input)="customInput.set($any($event.target).value)"
              placeholder="State your technical justification in English..."
              class="flex-1 bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-xs font-mono-tech text-white"
            />
            <button
              (click)="toggleMicrophone()"
              [class.bg-rose-600]="speech.isRecording()"
              [class.bg-slate-800]="!speech.isRecording()"
              class="px-3 rounded border border-slate-700 text-white hover:border-cyan-500 transition"
              title="Record voice turn"
            >
              <span class="mat-icon text-base">{{ speech.isRecording() ? 'mic' : 'mic_none' }}</span>
            </button>
            <button
              (click)="sendTurn()"
              class="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech uppercase transition"
            >
              SPEAK / SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConversationLab {
  readonly speech = inject(AcademySpeech);
  readonly storage = inject(AcademyStorage);

  readonly scenarios = SCENARIOS;
  readonly selectedScenarioIndex = signal<number>(0);
  readonly customInput = signal<string>('');

  readonly currentScenario = () => this.scenarios[this.selectedScenarioIndex()];

  async toggleMicrophone(): Promise<void> {
    if (this.speech.isRecording()) {
      this.speech.stopRecording();
      this.speech.stopSTT();
      if (this.speech.lastTranscript()) {
        this.customInput.set(this.speech.lastTranscript());
      }
    } else {
      await this.speech.startRecording();
      this.speech.startSTT();
    }
  }

  sendTurn(): void {
    const text = this.customInput().trim();
    if (!text) return;

    this.currentScenario().turns.push({
      speaker: 'user',
      text,
      persianText: 'پاسخ ارسالی شما در جلسه',
      naturalAlternative: 'Consider using tighter technical phrasing with active verbs for optimal authority.',
      persianCritique: 'پاسخ شما به شبیه‌ساز اضافه شد. تلفظ و ساختار جمله‌بندی را بررسی کنید.'
    });

    this.customInput.set('');
  }
}
