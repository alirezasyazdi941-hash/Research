import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademySpeech } from '../core/services/speech';

interface ListeningPassage {
  id: string;
  title: string;
  persianTitle: string;
  level: string;
  sentences: string[];
  fullTranscript: string;
  persianTranslation: string;
  comprehensionQuestion: string;
  options: string[];
  correctOption: string;
}

const PASSAGES: ListeningPassage[] = [
  {
    id: 'list_pass_1',
    title: 'Distributed Consensus: The Raft Protocol',
    persianTitle: 'پروتکل اجماع رفت (Raft Consensus) در سیستم‌های توزیع‌شده',
    level: 'B2',
    sentences: [
      'Raft achieves distributed consensus by electing a distinguished leader node.',
      'The leader accepts log entries from clients and replicates them across followers.',
      'If followers do not receive periodic heartbeat messages, they initiate an election timeout.',
      'A candidate node must collect a majority of cluster votes to become the new leader.'
    ],
    fullTranscript: 'Raft achieves distributed consensus by electing a distinguished leader node. The leader accepts log entries from clients and replicates them across followers. If followers do not receive periodic heartbeat messages, they initiate an election timeout. A candidate node must collect a majority of cluster votes to become the new leader.',
    persianTranslation: 'پروتکل رفت با انتخاب یک گره لیدر، اجماع را در سیستم توزیع‌شده برقرار می‌کند. لیدر لاگ‌ها را از کلاینت‌ها گرفته و در میان فالوئرها تکثیر می‌نماید. اگر فالوئرها پیام تپش قلب (heartbeat) دریافت نکنند، تایم‌اوت انتخاب لیدر آغاز می‌شود. یک کاندیدا باید اکثریت آرا را جمع‌آوری کند تا به لیدر تبدیل شود.',
    comprehensionQuestion: 'What triggers follower nodes to start an election timeout in Raft?',
    options: [
      'When client throughput exceeds one million requests per second.',
      'When they stop receiving periodic heartbeat signals from the leader.',
      'When a hard drive failure corrupts the binary log.',
      'When the network latency drops to zero.'
    ],
    correctOption: 'When they stop receiving periodic heartbeat signals from the leader.'
  },
  {
    id: 'list_pass_2',
    title: 'Transformer Multi-Head Self-Attention',
    persianTitle: 'مکانیسم توجه چندسر در شبکه‌های عصبی ترنسفورمر',
    level: 'C1',
    sentences: [
      'Self-attention calculates token interactions regardless of their sequential distance.',
      'Queries and keys are multiplied and scaled by the square root of the head dimension.',
      'Applying the softmax function produces a probability distribution over all sequence positions.',
      'This architectural breakthrough allowed models to capture distant syntactic dependencies.'
    ],
    fullTranscript: 'Self-attention calculates token interactions regardless of their sequential distance. Queries and keys are multiplied and scaled by the square root of the head dimension. Applying the softmax function produces a probability distribution over all sequence positions. This architectural breakthrough allowed models to capture distant syntactic dependencies.',
    persianTranslation: 'مکانیزم سلف-اتنشن تعاملات بین توکن‌ها را فارغ از فاصله ترتیبی آنها محاسبه می‌کند. ماتریس پرسش‌ها و کلیدها ضرب شده و بر جذر ابعاد سر توجه تقسیم می‌شوند. اعمال تابع سافت‌مکس یک توزیع احتمال روی تمام موقعیت‌های دنباله ایجاد می‌کند. این دستاورد معماری امکان داد وابستگی‌های دور نحوی به خوبی استخراج شوند.',
    comprehensionQuestion: 'Why are queries and keys scaled by the square root of the head dimension?',
    options: [
      'To prevent the dot products from growing excessively large, which pushes softmax into regions with vanishing gradients.',
      'To force the model into a sequential recurrent execution loop.',
      'To reduce the batch size of the PyTorch dataloader.',
      'To encrypt the weights against adversary attacks.'
    ],
    correctOption: 'To prevent the dot products from growing excessively large, which pushes softmax into regions with vanishing gradients.'
  }
];

@Component({
  selector: 'app-listening-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            AUDIO COMPREHENSION & DICTATION LAB
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Listening Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          شنیدار تخصصی با سرعت‌های ۰.۷۵، ۱.۰ و ۱.۲۵ برابر، پخش جمله به جمله، تمرین دیکته تایپی و سنجش دقیق درک مطلب.
        </p>

        <!-- Passage Selector -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (p of passages; track p.id; let idx = $index) {
            <button
              (click)="selectPassage(idx)"
              [class.bg-cyan-500]="activePassageIndex() === idx"
              [class.text-slate-950]="activePassageIndex() === idx"
              [class.font-bold]="activePassageIndex() === idx"
              [class.bg-[#050912]]="activePassageIndex() !== idx"
              [class.text-slate-300]="activePassageIndex() !== idx"
              [class.border-cyan-500]="activePassageIndex() === idx"
              [class.border-slate-800]="activePassageIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ p.title }}
            </button>
          }
        </div>
      </div>

      <!-- Controls & Playback Console -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <!-- Speed Bar & Audio Triggers -->
        <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <button
              (click)="playFullPassage()"
              [disabled]="speech.isSpeaking()"
              class="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono-tech uppercase transition"
            >
              <span class="mat-icon text-base">{{ speech.isSpeaking() ? 'volume_up' : 'play_arrow' }}</span>
              <span>{{ speech.isSpeaking() ? 'PLAYING...' : 'PLAY FULL AUDIO' }}</span>
            </button>

            <button
              (click)="speech.stopSpeaking()"
              class="px-3 py-2 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-mono-tech"
            >
              STOP
            </button>
          </div>

          <!-- Speed Toggles -->
          <div class="flex items-center gap-1 font-mono-tech text-xs">
            <span class="text-slate-400 text-[11px] mr-1">PLAYBACK SPEED:</span>
            @for (rate of [0.75, 1.0, 1.25]; track rate) {
              <button
                (click)="selectedRate.set(rate)"
                [class.bg-cyan-950]="selectedRate() === rate"
                [class.text-cyan-300]="selectedRate() === rate"
                [class.border-cyan-500]="selectedRate() === rate"
                class="px-2.5 py-1 rounded border border-slate-700 bg-[#050912] text-slate-300 text-xs hover:border-slate-500"
              >
                {{ rate }}x
              </button>
            }
          </div>
        </div>

        <!-- Sentence-by-Sentence Breakdown -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>SENTENCE-BY-SENTENCE DRILL</span>
            <span class="text-cyan-400 font-persian">برای شنیدن هر جمله کلیک کنید</span>
          </div>

          <div class="space-y-2">
            @for (sent of activePassage().sentences; track sent; let sIdx = $index) {
              <div class="p-3 rounded bg-[#060a12] border border-slate-800 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded bg-slate-800 text-cyan-400 font-mono-tech text-xs flex items-center justify-center font-bold">
                    {{ sIdx + 1 }}
                  </span>
                  @if (revealedSentences()[sIdx]) {
                    <span class="text-xs text-slate-200 font-mono-tech">{{ sent }}</span>
                  } @else {
                    <span class="text-xs text-slate-500 italic font-mono-tech tracking-wider">
                      ••••••••••••••••••••••••••••••••••••••••••••
                    </span>
                  }
                </div>

                <div class="flex items-center gap-2">
                  <button
                    (click)="speech.speak(sent, selectedRate())"
                    class="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
                    title="Play sentence audio"
                  >
                    <span class="mat-icon text-base">volume_up</span>
                  </button>
                  <button
                    (click)="toggleRevealSentence(sIdx)"
                    class="px-2 py-1 rounded border border-slate-700 text-[10px] font-mono-tech text-slate-400 hover:text-slate-200"
                  >
                    {{ revealedSentences()[sIdx] ? 'HIDE' : 'REVEAL' }}
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Dictation Testing Studio -->
        <div class="p-5 rounded-lg bg-[#070c18] border border-cyan-900/60 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono-tech text-cyan-400">
            <span class="uppercase font-bold flex items-center gap-1.5">
              <span class="mat-icon text-sm">keyboard</span>
              <span>INTERACTIVE DICTATION TEST (SENTENCE #1)</span>
            </span>
            <button
              (click)="speech.speak(activePassage().sentences[0], selectedRate())"
              class="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span class="mat-icon text-sm">replay</span>
              <span>REPLAY DICTATION AUDIO</span>
            </button>
          </div>

          <p class="text-xs text-slate-400 font-persian">
            به جمله اول گوش دهید و متن دقیق آن را در کادر زیر تایپ کنید:
          </p>

          <input
            type="text"
            [value]="dictationInput()"
            (input)="dictationInput.set($any($event.target).value)"
            placeholder="Type exactly what you hear..."
            class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-xs font-mono-tech text-white"
          />

          @if (dictationInput().trim()) {
            <div class="flex items-center justify-between pt-1">
              <div class="text-xs font-mono-tech" [class.text-emerald-400]="isDictationMatch()" [class.text-amber-400]="!isDictationMatch()">
                ACCURACY: {{ isDictationMatch() ? '100% PERFECT MATCH' : 'DISCREPANCY DETECTED' }}
              </div>
              <button
                (click)="showDictationDiff.set(!showDictationDiff())"
                class="text-[11px] font-mono-tech text-cyan-400 underline"
              >
                {{ showDictationDiff() ? 'HIDE TARGET' : 'SHOW TARGET' }}
              </button>
            </div>
          }

          @if (showDictationDiff()) {
            <div class="p-2.5 rounded bg-[#040810] border border-slate-800 text-xs font-mono-tech text-slate-300">
              TARGET: "{{ activePassage().sentences[0] }}"
            </div>
          }
        </div>

        <!-- Comprehension Check -->
        <div class="border-t border-slate-800 pt-5 space-y-3">
          <div class="text-xs font-mono-tech text-cyan-400 uppercase font-bold">
            COMPREHENSION CHECK: {{ activePassage().comprehensionQuestion }}
          </div>

          <div class="grid grid-cols-1 gap-2">
            @for (opt of activePassage().options; track opt) {
              <button
                (click)="selectComprehensionAnswer(opt)"
                [class.border-cyan-500]="selectedOption() === opt"
                [class.bg-cyan-950/40]="selectedOption() === opt"
                [class.border-slate-800]="selectedOption() !== opt"
                class="w-full text-left p-3 rounded border bg-[#050912] hover:border-slate-700 transition text-xs font-mono-tech text-slate-200"
              >
                {{ opt }}
              </button>
            }
          </div>

          @if (selectedOption()) {
            <div class="p-3 rounded border text-xs font-mono-tech"
                 [class.border-emerald-500]="isComprehensionCorrect()"
                 [class.bg-emerald-950/30]="isComprehensionCorrect()"
                 [class.text-emerald-300]="isComprehensionCorrect()"
                 [class.border-rose-500]="!isComprehensionCorrect()"
                 [class.bg-rose-950/30]="!isComprehensionCorrect()"
                 [class.text-rose-300]="!isComprehensionCorrect()">
              {{ isComprehensionCorrect() ? 'EXCELLENT: Comprehension verified from audio.' : 'INCORRECT: Listen again carefully to the passage.' }}
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ListeningLab {
  readonly speech = inject(AcademySpeech);

  readonly passages = PASSAGES;
  readonly activePassageIndex = signal<number>(0);
  readonly selectedRate = signal<number>(1.0);
  readonly revealedSentences = signal<Record<number, boolean>>({});
  readonly dictationInput = signal<string>('');
  readonly showDictationDiff = signal<boolean>(false);
  readonly selectedOption = signal<string | null>(null);

  readonly activePassage = computed(() => this.passages[this.activePassageIndex()]);

  readonly isDictationMatch = computed(() => {
    const cleanUser = this.dictationInput().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTarget = this.activePassage().sentences[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanUser === cleanTarget;
  });

  readonly isComprehensionCorrect = computed(() => {
    return this.selectedOption() === this.activePassage().correctOption;
  });

  selectPassage(idx: number): void {
    this.activePassageIndex.set(idx);
    this.revealedSentences.set({});
    this.dictationInput.set('');
    this.selectedOption.set(null);
  }

  playFullPassage(): void {
    this.speech.speak(this.activePassage().fullTranscript, this.selectedRate());
  }

  toggleRevealSentence(idx: number): void {
    const current = { ...this.revealedSentences() };
    current[idx] = !current[idx];
    this.revealedSentences.set(current);
  }

  selectComprehensionAnswer(opt: string): void {
    this.selectedOption.set(opt);
  }
}
