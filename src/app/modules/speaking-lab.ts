import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademySpeech } from '../core/services/speech';

interface SpeakingTask {
  id: string;
  title: string;
  persianTitle: string;
  targetDurationSeconds: number;
  prompt: string;
  persianInstructions: string;
  keyVocabularyToInclude: string[];
  sampleModelResponse: string;
}

const SPEAKING_TASKS: SpeakingTask[] = [
  {
    id: 'spk_star_method',
    title: 'STAR Technical Behavioral Response',
    persianTitle: 'پاسخ به سوال مصاحبه فنی با متد STAR (وضعیت، وظیفه، اقدام، نتیجه)',
    targetDurationSeconds: 90,
    prompt: 'Describe a situation where a critical database production deadlock crashed your application. How did you diagnose the root cause, what mitigation was applied, and what was the quantifiable outcome?',
    persianInstructions: 'در ۹۰ ثانیه بحران قفل شدن دیتابیس را به زبان انگلیسی با ساختار STAR توضیح دهید: Situation (وضعیت)، Task (وظیفه شما)، Action (اقدام مهندسی)، و Result (نتیجه کمّی).',
    keyVocabularyToInclude: ['deadlock', 'mitigate', 'connection pool', 'latency', 'exponential backoff'],
    sampleModelResponse: 'In my previous project, we faced a severe database deadlock during peak shopping traffic. As lead backend engineer, my task was to isolate the conflicting transactions. I analyzed the postgres log locks, identified a missing composite index on the orders table, and patched the connection pool timeout with exponential backoff. Consequently, p99 latency dropped by 45% with zero dropped orders.'
  },
  {
    id: 'spk_system_explanation',
    title: 'Oral System Architecture Explanation',
    persianTitle: 'توضیح شفاهی جریان پردازش داده در کلاستر ترنسفورمر',
    targetDurationSeconds: 60,
    prompt: 'Explain to a new engineer on your team how self-attention scales quadratically with sequence length O(N²), and how FlashAttention alleviates this via GPU SRAM tiling.',
    persianInstructions: 'در ۶۰ ثانیه دلیل پیچیدگی زمانی O(N²) در مکانیزم سلف-اتنشن و نحوه بهینه‌سازی آن توسط FlashAttention را شفاهی شرح دهید.',
    keyVocabularyToInclude: ['quadratic complexity', 'memory bandwidth', 'SRAM tiling', 'throughput'],
    sampleModelResponse: 'Standard self-attention computes an N-by-N attention matrix between all queries and keys, resulting in quadratic memory complexity. FlashAttention mitigates this memory-bound bottleneck by tiling the computation into GPU on-chip SRAM, avoiding repeated high-latency roundtrips to HBM memory.'
  }
];

@Component({
  selector: 'app-speaking-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Speaking Lab Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            VOICE LAB & ORAL FLUENCY ENGINE
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Speaking Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          تمرین سخنرانی فنی با ضبط مستقیم صوت و بازپخش، تبدیل گفتار به متن مرور شواهد روانی، و مقایسه با پاسخ نمونه مهندسان بین‌المللی.
        </p>

        <!-- Task Selector Tabs -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (task of tasks; track task.id; let idx = $index) {
            <button
              (click)="selectTask(idx)"
              [class.bg-cyan-500]="activeTaskIndex() === idx"
              [class.text-slate-950]="activeTaskIndex() === idx"
              [class.font-bold]="activeTaskIndex() === idx"
              [class.bg-[#050912]]="activeTaskIndex() !== idx"
              [class.text-slate-300]="activeTaskIndex() !== idx"
              [class.border-cyan-500]="activeTaskIndex() === idx"
              [class.border-slate-800]="activeTaskIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ task.title }}
            </button>
          }
        </div>
      </div>

      <!-- Task Workbench -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <!-- Prompt Box -->
        <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span class="text-cyan-400 uppercase font-bold">ORAL PROMPT ({{ activeTask().targetDurationSeconds }}s TARGET)</span>
            <span>CEFR B2-C1 BENCHMARK</span>
          </div>
          <div class="text-sm font-semibold text-white leading-relaxed font-sans">
            {{ activeTask().prompt }}
          </div>
          <div class="text-xs text-slate-400 font-persian leading-relaxed">
            {{ activeTask().persianInstructions }}
          </div>

          <!-- Target Keywords to weave in -->
          <div class="pt-2 flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono-tech text-slate-500 uppercase mr-1">Target Lexicon:</span>
            @for (word of activeTask().keyVocabularyToInclude; track word) {
              <span class="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-mono-tech">
                {{ word }}
              </span>
            }
          </div>
        </div>

        <!-- Recording Console -->
        <div class="p-5 rounded-lg bg-[#070c18] border border-cyan-950 flex flex-col items-center justify-center text-center space-y-4">
          <div class="flex items-center justify-center gap-4">
            @if (!speech.isRecording()) {
              <button
                (click)="startRecording()"
                class="flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono-tech uppercase tracking-wider transition shadow-[0_0_20px_rgba(225,29,72,0.4)]"
              >
                <span class="mat-icon text-lg">mic</span>
                <span>START RECORDING AUDIO</span>
              </button>
            } @else {
              <button
                (click)="stopRecording()"
                class="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider transition animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <span class="mat-icon text-lg">stop</span>
                <span>STOP RECORDING (RECORDED)</span>
              </button>
            }
          </div>

          <!-- Status telemetry -->
          <div class="text-xs font-mono-tech" [class.text-rose-400]="speech.isRecording()" [class.text-slate-400]="!speech.isRecording()">
            {{ speech.isRecording() ? 'MICROPHONE HARDWARE ACTIVE — CAPTURING RAW AUDIO STREAM' : 'MICROPHONE READY' }}
          </div>

          <!-- Playback Element -->
          @if (speech.recordedAudioUrl()) {
            <div class="w-full max-w-md p-3 rounded bg-[#040810] border border-slate-800 flex items-center justify-between gap-3">
              <span class="text-xs font-mono-tech text-slate-300">YOUR RECORDING:</span>
              <audio [src]="speech.recordedAudioUrl()" controls class="h-8 flex-1"></audio>
            </div>
          }
        </div>

        <!-- STT Transcript & Fluency Breakdown -->
        @if (speech.lastTranscript()) {
          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
              <span class="text-cyan-400">SPOKEN TRANSCRIPT (BROWSER STT)</span>
              <span>WORDS: {{ transcriptWords() }}</span>
            </div>
            <p class="text-xs font-mono-tech text-slate-200 leading-relaxed bg-[#04070e] p-3 rounded border border-slate-900">
              "{{ speech.lastTranscript() }}"
            </p>
            <div class="text-[11px] text-slate-400 font-persian">
              توجه: سیستم تبدیل گفتار به متن بر اساس شنیدار مرورگر عمل کرده است. کلمات به کار رفته را با فهرست واژگان هدف در بالا تطبیق دهید.
            </div>
          </div>
        }

        <!-- Reference Model Delivery -->
        <div class="border-t border-slate-800 pt-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono-tech text-slate-400 uppercase">Native Reference Delivery</span>
            <button
              (click)="speech.speak(activeTask().sampleModelResponse)"
              class="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0f172a] hover:bg-slate-800 text-cyan-300 text-xs font-mono-tech border border-slate-700 transition"
            >
              <span class="mat-icon text-sm">volume_up</span>
              <span>LISTEN TO REFERENCE</span>
            </button>
          </div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed bg-[#050912] p-3 rounded border border-slate-800">
            {{ activeTask().sampleModelResponse }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class SpeakingLab {
  readonly speech = inject(AcademySpeech);

  readonly tasks = SPEAKING_TASKS;
  readonly activeTaskIndex = signal<number>(0);

  readonly activeTask = computed(() => this.tasks[this.activeTaskIndex()]);

  readonly transcriptWords = computed(() => {
    const t = this.speech.lastTranscript().trim();
    return t ? t.split(/\s+/).length : 0;
  });

  selectTask(idx: number): void {
    this.activeTaskIndex.set(idx);
    this.speech.clearRecordedAudio();
  }

  async startRecording(): Promise<void> {
    await this.speech.startRecording();
    this.speech.startSTT();
  }

  stopRecording(): void {
    this.speech.stopRecording();
    this.speech.stopSTT();
  }
}
