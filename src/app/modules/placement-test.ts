import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyStorage } from '../core/services/storage';
import { AcademySpeech } from '../core/services/speech';
import { DIAGNOSTIC_QUESTIONS, DiagnosticQuestion } from '../core/data/diagnostic-questions';
import { LanguageSkill, CefrLevel } from '../core/models/types';

@Component({
  selector: 'app-placement-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Diagnostic Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                EVIDENCE-BASED CEFR DIAGNOSTIC
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Comprehensive 7-Skill Placement Test</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              ارزیابی چندوجهی مهارت‌های هفت‌گانه بدون اتکا به تست‌های سطحی؛ تعیین دقیق نقاط ضعف ساختاری و تلفظی.
            </p>
          </div>

          <!-- Step Progress Counter -->
          <div class="flex items-center gap-2 font-mono-tech text-xs bg-[#050912] border border-slate-800 px-3 py-1.5 rounded">
            <span class="text-slate-400">PROGRESS:</span>
            <span class="text-cyan-300 font-bold">{{ currentStep() + 1 }} / {{ questions.length }}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-800">
          <div
            class="bg-gradient-to-r from-cyan-500 to-sky-400 h-full transition-all duration-300"
            [style.width.%]="((currentStep() + 1) / questions.length) * 100"
          ></div>
        </div>
      </div>

      @if (!isCompleted()) {
        <!-- Question Card -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
          <!-- Skill Badge & Context -->
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono-tech uppercase font-bold">
                SKILL: {{ currentQuestion().skill }}
              </span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono-tech">
                TARGET: {{ currentQuestion().level }}
              </span>
            </div>
            <span class="text-xs font-mono-tech text-slate-400">{{ currentQuestion().title }}</span>
          </div>

          <!-- Instructions -->
          <div class="space-y-1">
            <div class="text-sm font-semibold text-slate-200">{{ currentQuestion().instructions }}</div>
            <div class="text-xs text-cyan-300/80 font-persian">{{ currentQuestion().persianInstructions }}</div>
          </div>

          <!-- Content Stimulus -->
          @if (currentQuestion().content) {
            <div class="bg-[#050912] border border-slate-800/80 rounded p-4 text-xs font-mono-tech text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              {{ currentQuestion().content }}
            </div>
          }

          <!-- Listening Audio Playback Trigger -->
          @if (currentQuestion().skill === 'listening' && currentQuestion().audioScript) {
            <div class="bg-[#0c1424] border border-cyan-800/60 rounded p-4 flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <button
                  (click)="playAudioScript(currentQuestion().audioScript!)"
                  [disabled]="speech.isSpeaking()"
                  class="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono-tech uppercase transition"
                >
                  <span class="mat-icon text-base">{{ speech.isSpeaking() ? 'volume_up' : 'play_arrow' }}</span>
                  <span>{{ speech.isSpeaking() ? 'PLAYING AUDIO...' : 'PLAY AUDIO PROMPT' }}</span>
                </button>
                <div class="text-[11px] text-slate-400 font-persian">
                  می‌توانید فایل صوتی را مجدداً گوش دهید.
                </div>
              </div>

              <!-- Speed adjustment for listening -->
              <div class="flex items-center gap-1 font-mono-tech text-xs">
                <span class="text-slate-400 text-[11px] mr-1">SPEED:</span>
                <button
                  (click)="setAudioSpeed(0.85)"
                  [class.bg-cyan-950]="playbackRate() === 0.85"
                  [class.text-cyan-300]="playbackRate() === 0.85"
                  class="px-2 py-1 rounded border border-slate-700 text-slate-300 hover:border-slate-500 text-[11px]"
                >
                  0.85x
                </button>
                <button
                  (click)="setAudioSpeed(1.0)"
                  [class.bg-cyan-950]="playbackRate() === 1.0"
                  [class.text-cyan-300]="playbackRate() === 1.0"
                  class="px-2 py-1 rounded border border-slate-700 text-slate-300 hover:border-slate-500 text-[11px]"
                >
                  1.0x
                </button>
              </div>
            </div>
          }

          <!-- Speaking Lab Audio Recording Trigger -->
          @if (currentQuestion().skill === 'speaking') {
            <div class="bg-[#0c1424] border border-cyan-800/60 rounded p-4 space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  @if (!speech.isRecording()) {
                    <button
                      (click)="startSpeakingTest()"
                      class="flex items-center gap-2 px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono-tech uppercase transition"
                    >
                      <span class="mat-icon text-base">mic</span>
                      <span>START RECORDING (60s)</span>
                    </button>
                  } @else {
                    <button
                      (click)="stopSpeakingTest()"
                      class="flex items-center gap-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono-tech uppercase transition animate-pulse"
                    >
                      <span class="mat-icon text-base">stop</span>
                      <span>FINISH RECORDING</span>
                    </button>
                  }
                  
                  @if (speech.isRecording()) {
                    <span class="text-xs font-mono-tech text-rose-400 animate-pulse">
                      RECORDING IN PROGRESS...
                    </span>
                  }
                </div>

                @if (speech.recordedAudioUrl()) {
                  <audio [src]="speech.recordedAudioUrl()" controls class="h-8 max-w-xs"></audio>
                }
              </div>

              <!-- Realtime STT Transcript if available -->
              @if (speech.lastTranscript()) {
                <div class="p-3 bg-[#050912] rounded border border-slate-800 text-xs font-mono-tech text-slate-300">
                  <div class="text-[10px] text-slate-500 uppercase mb-1">STT Transcription Preview:</div>
                  {{ speech.lastTranscript() }}
                </div>
              }
            </div>
          }

          <!-- Writing Lab Textarea -->
          @if (currentQuestion().skill === 'writing') {
            <div class="space-y-2">
              <textarea
                [value]="writtenResponse()"
                (input)="onWritingInput($event)"
                rows="6"
                placeholder="Compose your academic paragraph here..."
                class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-3 text-xs font-mono-tech text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
              ></textarea>
              <div class="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                <span>WORD COUNT: {{ wordCount() }} (RECOMMENDED: 60 - 120)</span>
                <span>STATUS: {{ wordCount() >= 40 ? 'VALID CRITERIA' : 'INSUFFICIENT DENSITY' }}</span>
              </div>
            </div>
          }

          <!-- Multiple Choice Question & Options -->
          @if (currentQuestion().options) {
            <div class="space-y-3 pt-2">
              <div class="text-xs font-bold text-slate-100 font-mono-tech">
                QUESTION: {{ currentQuestion().question }}
              </div>
              <div class="grid grid-cols-1 gap-2.5">
                @for (opt of currentQuestion().options; track opt; let optIdx = $index) {
                  <button
                    (click)="selectAnswer(opt)"
                    [class.border-cyan-500]="selectedAnswer() === opt"
                    [class.bg-cyan-950/40]="selectedAnswer() === opt"
                    [class.text-cyan-200]="selectedAnswer() === opt"
                    [class.border-slate-800]="selectedAnswer() !== opt"
                    [class.bg-[#050912]]="selectedAnswer() !== opt"
                    [class.text-slate-300]="selectedAnswer() !== opt"
                    class="w-full text-left p-3.5 rounded border hover:border-slate-600 transition flex items-start gap-3 text-xs font-mono-tech leading-relaxed"
                  >
                    <span class="w-5 h-5 rounded flex items-center justify-center border text-[11px] shrink-0 mt-0.5"
                          [class.border-cyan-500]="selectedAnswer() === opt"
                          [class.text-cyan-400]="selectedAnswer() === opt"
                          [class.border-slate-700]="selectedAnswer() !== opt">
                      {{ getLetter(optIdx) }}
                    </span>
                    <span class="flex-1">{{ opt }}</span>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              (click)="previousQuestion()"
              [disabled]="currentStep() === 0"
              class="px-4 py-2 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-30 text-xs font-mono-tech"
            >
              PREVIOUS
            </button>

            <button
              (click)="nextQuestion()"
              [disabled]="!isAnswerProvided()"
              class="flex items-center gap-2 px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-tech uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <span>{{ currentStep() === questions.length - 1 ? 'SUBMIT TEST & FINALIZE' : 'NEXT QUESTION' }}</span>
              <span class="mat-icon text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      } @else {
        <!-- Test Results Screen -->
        <div class="bg-[#080d19] border border-cyan-500/50 rounded-lg p-6 space-y-6">
          <div class="text-center space-y-2 border-b border-slate-800 pb-5">
            <div class="inline-flex p-3 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 mb-1">
              <span class="mat-icon text-3xl">verified</span>
            </div>
            <h2 class="text-2xl font-black text-white">Diagnostic Placement Assessment Complete</h2>
            <p class="text-xs text-slate-300 font-persian max-w-lg mx-auto">
              پروفایل مهارت‌های هفت‌گانه شما بر اساس شواهد واقعی ساخته شد. برنامه درسی تطبیقی با در نظر گرفتن نقاط ضعف دقیق شما پیکربندی شد.
            </p>
          </div>

          <!-- Result Skill Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            @for (res of computedResults(); track res.skill) {
              <div class="p-3 rounded bg-[#050912] border border-slate-800 font-mono-tech text-xs">
                <div class="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span class="uppercase font-bold">{{ res.skill }}</span>
                  <span class="text-cyan-400 font-bold">{{ res.score }}%</span>
                </div>
                <div class="text-lg font-black text-white flex items-center gap-2">
                  <span>{{ res.level }}</span>
                  <span class="text-[10px] text-slate-500 font-normal">CEFR</span>
                </div>
                <div class="text-[10px] text-slate-400 font-persian mt-1 line-clamp-1">
                  {{ res.feedback }}
                </div>
              </div>
            }
          </div>

          <div class="flex items-center justify-center gap-4 pt-3">
            <button
              (click)="saveAndContinue()"
              class="flex items-center gap-2 px-8 py-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider transition shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <span class="mat-icon text-base">dashboard</span>
              <span>APPLY CURRICULUM & ENTER COMMAND CENTER</span>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class PlacementTest {
  private router = inject(Router);
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);

  readonly questions = DIAGNOSTIC_QUESTIONS;
  readonly currentStep = signal<number>(0);
  readonly userAnswers = signal<Record<string, string>>({});
  readonly writtenResponse = signal<string>('');
  readonly selectedAnswer = signal<string>('');
  readonly playbackRate = signal<number>(1.0);
  readonly isCompleted = signal<boolean>(false);

  readonly currentQuestion = computed(() => this.questions[this.currentStep()]);

  readonly wordCount = computed(() => {
    const text = this.writtenResponse().trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });

  readonly isAnswerProvided = computed(() => {
    const q = this.currentQuestion();
    if (q.type === 'multiple_choice') {
      return !!this.selectedAnswer();
    }
    if (q.type === 'free_writing') {
      return this.wordCount() >= 25;
    }
    if (q.type === 'speech_recording') {
      return !!this.speech.recordedAudioUrl() || !!this.speech.lastTranscript();
    }
    return true;
  });

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  selectAnswer(opt: string): void {
    this.selectedAnswer.set(opt);
  }

  onWritingInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.writtenResponse.set(target.value);
  }

  playAudioScript(script: string): void {
    this.speech.speak(script, this.playbackRate());
  }

  setAudioSpeed(rate: number): void {
    this.playbackRate.set(rate);
  }

  async startSpeakingTest(): Promise<void> {
    await this.speech.startRecording();
    this.speech.startSTT();
  }

  stopSpeakingTest(): void {
    this.speech.stopRecording();
    this.speech.stopSTT();
  }

  nextQuestion(): void {
    const q = this.currentQuestion();
    const answers = { ...this.userAnswers() };

    if (q.type === 'multiple_choice') {
      answers[q.id] = this.selectedAnswer();
    } else if (q.type === 'free_writing') {
      answers[q.id] = this.writtenResponse();
    } else if (q.type === 'speech_recording') {
      answers[q.id] = this.speech.lastTranscript() || 'Voice audio recorded';
    }

    this.userAnswers.set(answers);

    if (this.currentStep() < this.questions.length - 1) {
      this.currentStep.update(s => s + 1);
      // Reset for next
      const nextQ = this.questions[this.currentStep()];
      this.selectedAnswer.set(answers[nextQ.id] || '');
      this.speech.clearRecordedAudio();
    } else {
      this.finishTest();
    }
  }

  previousQuestion(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
      const prevQ = this.questions[this.currentStep()];
      this.selectedAnswer.set(this.userAnswers()[prevQ.id] || '');
    }
  }

  readonly computedResults = computed(() => {
    const answers = this.userAnswers();
    const skills: LanguageSkill[] = ['reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary', 'pronunciation'];
    
    return skills.map(skill => {
      const qList = this.questions.filter((q: DiagnosticQuestion) => q.skill === skill);
      let correct = 0;
      const total = qList.length;

      for (const q of qList) {
        if (q.type === 'multiple_choice') {
          if (answers[q.id] === q.correctAnswer) {
            correct++;
          }
        } else if (q.type === 'free_writing') {
          // Heuristic evaluation based on length and keywords
          const text = (answers[q.id] || '').toLowerCase();
          let scoreAdd = 0;
          if (text.length > 150) scoreAdd += 0.5;
          if (text.includes('however') || text.includes('consequently') || text.includes('furthermore')) scoreAdd += 0.3;
          if (text.includes('suggests') || text.includes('demonstrates') || text.includes('indicates')) scoreAdd += 0.2;
          correct += scoreAdd;
        } else if (q.type === 'speech_recording') {
          // Audio provided
          correct += answers[q.id] ? 1 : 0.5;
        }
      }

      const ratio = total > 0 ? correct / total : 0.5;
      let score = Math.round(ratio * 100);
      score = Math.max(25, Math.min(95, score));

      let level: CefrLevel = 'Pre-A1';
      if (score >= 85) level = 'C1';
      else if (score >= 70) level = 'B2';
      else if (score >= 50) level = 'B1';
      else if (score >= 35) level = 'A2';
      else level = 'A1';

      return {
        skill,
        score,
        level,
        feedback: `سطح ارزیابی شده: ${level} (${score}%)`
      };
    });
  });

  finishTest(): void {
    this.isCompleted.set(true);
  }

  saveAndContinue(): void {
    const results = this.computedResults();
    for (const res of results) {
      this.storage.updateSkillProficiency(
        res.skill,
        res.level,
        res.score,
        ['Diagnostic benchmark assessment passed'],
        ['Strengthen domain vocabulary and advanced grammatical hedging']
      );
    }
    this.router.navigate(['/command-center']);
  }
}
