import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AcademySpeech } from '../core/services/speech';

interface MinimalPair {
  soundA: string;
  soundB: string;
  persianNote: string;
  pairs: { wordA: string; ipaA: string; wordB: string; ipaB: string }[];
}

const MINIMAL_PAIRS: MinimalPair[] = [
  {
    soundA: '/w/ (Voiced Labiovelar Approximant)',
    soundB: '/v/ (Voiced Labiodental Fricative)',
    persianNote: 'زبان فارسی صدای /w/ ندارد؛ بنابراین فارسی‌زبانان به اشتباه لب‌ها را به دندان می‌زنند و /v/ تولید می‌کنند. برای /w/ لب‌ها باید گرد شوند (شبیه حالت سوت زدن) و دندان‌ها هیچ تماسی با لب نداشته باشند.',
    pairs: [
      { wordA: 'west', ipaA: '/west/', wordB: 'vest', ipaB: '/vest/' },
      { wordA: 'wine', ipaA: '/waɪn/', wordB: 'vine', ipaB: '/vaɪn/' },
      { wordA: 'wheel', ipaA: '/wiːl/', wordB: 'veal', ipaB: '/viːl/' },
      { wordA: 'worse', ipaA: '/wɜːrs/', wordB: 'verse', ipaB: '/vɜːrs/' }
    ]
  },
  {
    soundA: '/θ/ (Voiceless Dental Fricative)',
    soundB: '/s/ (Voiceless Alveolar Sibilant)',
    persianNote: 'صدای th بدون لرزش /θ/ با قرار گرفتن نوک زبان بین دندان‌های پیشین تولید می‌شود. نباید آن را با صدای /s/ فارسی جایگزین کنید.',
    pairs: [
      { wordA: 'think', ipaA: '/θɪŋk/', wordB: 'sink', ipaB: '/sɪŋk/' },
      { wordA: 'through', ipaA: '/θruː/', wordB: 'true', ipaB: '/truː/' },
      { wordA: 'theme', ipaA: '/θiːm/', wordB: 'seam', ipaB: '/siːm/' }
    ]
  }
];

interface StressPattern {
  word: string;
  ipa: string;
  stressSyllable: string;
  persianMeaning: string;
  sentence: string;
}

const STRESS_PATTERNS: StressPattern[] = [
  { word: 'parameter', ipa: '/pəˈræm.ɪ.tər/', stressSyllable: '2nd (pa-RA-me-ter)', persianMeaning: 'پارامتر (تکیه روی هجای دوم)', sentence: 'Tuning the hyperparameter boosted learning convergence.' },
  { word: 'analysis', ipa: '/əˈnæl.ə.sɪs/', stressSyllable: '2nd (a-NA-ly-sis)', persianMeaning: 'تحلیل، آنالیز (تکیه روی هجای دوم)', sentence: 'Our empirical analysis reveals a 20% throughput surge.' },
  { word: 'hypothesis', ipa: '/haɪˈpɒθ.ə.sɪs/', stressSyllable: '2nd (hy-PO-the-sis)', persianMeaning: 'فرضیه علمی (تکیه روی هجای دوم)', sentence: 'The experiment supports our primary hypothesis.' },
  { word: 'architecture', ipa: '/ˈɑːr.kə.tek.tʃər/', stressSyllable: '1st (AR-chi-tec-ture)', persianMeaning: 'معماری سیستم (تکیه روی هجای اول)', sentence: 'The microservice architecture minimizes single points of failure.' }
];

@Component({
  selector: 'app-pronunciation-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            PHONETICS, WORD STRESS & SHADOWING LAB
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Pronunciation Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          تمرین علمی تمایز جفت‌های کمینه (Minimal Pairs)، اصلاح استرس هجاهای واژگان تخصصی و ضبط همزمان صدا برای مقایسه پهلوبه‌پهلو با صدای مدل.
        </p>
      </div>

      <!-- Section 1: Minimal Pairs Drill -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-lg">record_voice_over</span>
            <h2 class="text-base font-bold text-white">1. Persian L1 Phonetic Discernment (/w/ vs /v/)</h2>
          </div>
          <span class="text-xs font-mono-tech text-slate-400">MINIMAL PAIRS</span>
        </div>

        <p class="text-xs text-slate-300 font-persian leading-relaxed bg-[#050912] p-3 rounded border border-slate-800">
          {{ minimalPairs[0].persianNote }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          @for (pair of minimalPairs[0].pairs; track pair.wordA) {
            <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 flex items-center justify-between">
              <!-- Word A (/w/) -->
              <div class="flex items-center gap-2">
                <button
                  (click)="speech.speak(pair.wordA)"
                  class="p-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 transition"
                  title="Speak word A"
                >
                  <span class="mat-icon text-sm">volume_up</span>
                </button>
                <div>
                  <div class="font-bold text-xs text-white">{{ pair.wordA }}</div>
                  <div class="text-[10px] font-mono-tech text-cyan-400">{{ pair.ipaA }}</div>
                </div>
              </div>

              <span class="text-xs font-mono-tech text-slate-500 font-bold">vs</span>

              <!-- Word B (/v/) -->
              <div class="flex items-center gap-2">
                <div>
                  <div class="font-bold text-xs text-white text-right">{{ pair.wordB }}</div>
                  <div class="text-[10px] font-mono-tech text-slate-400 text-right">{{ pair.ipaB }}</div>
                </div>
                <button
                  (click)="speech.speak(pair.wordB)"
                  class="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
                  title="Speak word B"
                >
                  <span class="mat-icon text-sm">volume_up</span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Section 2: Multisyllabic Technical Word Stress -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-lg">graphic_eq</span>
            <h2 class="text-base font-bold text-white">2. Multisyllabic Lexical Stress</h2>
          </div>
          <span class="text-xs font-mono-tech text-slate-400">STRESS PATTERNS</span>
        </div>

        <p class="text-xs text-slate-400 font-persian">
          در کلمات علمی، تکیه نادرست روی هجا باعث نامفهوم شدن صحبت در جلسات بین‌المللی می‌شود. به محل استرس دقت کنید:
        </p>

        <div class="space-y-3">
          @for (s of stressPatterns; track s.word) {
            <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm text-white font-mono-tech">{{ s.word }}</span>
                  <span class="text-xs font-mono-tech text-cyan-400">{{ s.ipa }}</span>
                  <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono-tech border border-cyan-800">
                    STRESS: {{ s.stressSyllable }}
                  </span>
                </div>
                <div class="text-xs text-slate-300 font-sans italic">"{{ s.sentence }}"</div>
                <div class="text-[11px] font-persian text-slate-400">{{ s.persianMeaning }}</div>
              </div>

              <button
                (click)="speech.speak(s.word)"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-mono-tech transition"
              >
                <span class="mat-icon text-sm">volume_up</span>
                <span>PRONOUNCE</span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Section 3: Comparative Recorder & Shadowing Studio -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-4">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-rose-400 text-lg">mic</span>
            <h2 class="text-base font-bold text-white">3. Side-by-Side Shadowing & Acoustic Playback</h2>
          </div>
          <span class="text-xs font-mono-tech text-slate-400">HARDWARE COMPARATOR</span>
        </div>

        <div class="p-4 rounded bg-[#060a12] border border-cyan-950 space-y-3">
          <div class="text-xs font-mono-tech text-slate-300">
            TARGET SHADOWING SENTENCE:
          </div>
          <div class="text-sm font-bold text-cyan-200 font-mono-tech">
            "We will write well-structured web workers without volatile variables."
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              (click)="speech.speak('We will write well-structured web workers without volatile variables.')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950 border border-cyan-600 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-900 transition"
            >
              <span class="mat-icon text-sm">volume_up</span>
              <span>1. LISTEN MODEL</span>
            </button>

            @if (!speech.isRecording()) {
              <button
                (click)="speech.startRecording()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono-tech font-bold transition"
              >
                <span class="mat-icon text-sm">mic</span>
                <span>2. RECORD YOUR VOICE</span>
              </button>
            } @else {
              <button
                (click)="speech.stopRecording()"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 text-slate-950 text-xs font-mono-tech font-bold animate-pulse transition"
              >
                <span class="mat-icon text-sm">stop</span>
                <span>STOP RECORDING</span>
              </button>
            }
          </div>

          @if (speech.recordedAudioUrl()) {
            <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
              <span class="text-xs font-mono-tech text-slate-400">YOUR RECORDING:</span>
              <audio [src]="speech.recordedAudioUrl()" controls class="h-8 flex-1"></audio>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class PronunciationLab {
  readonly speech = inject(AcademySpeech);

  readonly minimalPairs = MINIMAL_PAIRS;
  readonly stressPatterns = STRESS_PATTERNS;
}
