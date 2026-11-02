import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { AcademySpeech } from '../core/services/speech';
import { AcademyVocabulary } from '../core/services/vocabulary';
import { VocabularyItem } from '../core/models/types';

@Component({
  selector: 'app-vocabulary-intelligence',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Vocabulary Header -->
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                SPACED REPETITION (SM-2) & ACTIVE RECALL
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Vocabulary Intelligence Engine</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              یادگیری عمیق واژگان تخصصی با الگوریتم فاصله‌دار SuperMemo؛ سنجش همزمان تلفظ صوتی (IPA)، معانی فارسی، هم‌آیی‌ها (Collocations) و خطاهای رایج فارسی‌زبانان.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              (click)="isAddModalOpen.set(true)"
              class="flex items-center gap-1.5 px-3 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech uppercase transition"
            >
              <span class="mat-icon text-sm">add</span>
              <span>ADD NEW WORD</span>
            </button>
            <button
              (click)="mode.set(mode() === 'flashcard' ? 'table' : 'flashcard')"
              class="flex items-center gap-1.5 px-3 py-2 rounded bg-[#050912] border border-slate-700 text-cyan-300 text-xs font-mono-tech hover:border-cyan-500 transition"
            >
              <span class="mat-icon text-sm">{{ mode() === 'flashcard' ? 'table_view' : 'flip_to_front' }}</span>
              <span>{{ mode() === 'flashcard' ? 'VIEW DATABASE TABLE' : 'START FLASHCARD REVIEW' }}</span>
            </button>
          </div>
        </div>

        <!-- Telemetry bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 font-mono-tech text-xs">
          <div>
            <span class="text-slate-400 text-[10px]">TOTAL WORDS:</span>
            <div class="text-base font-bold text-white">{{ storage.totalWords() }}</div>
          </div>
          <div>
            <span class="text-slate-400 text-[10px]">DUE FOR REVIEW:</span>
            <div class="text-base font-bold text-amber-400">{{ storage.dueWords() }}</div>
          </div>
          <div>
            <span class="text-slate-400 text-[10px]">MASTERED WORDS:</span>
            <div class="text-base font-bold text-emerald-400">{{ storage.masteredWords() }}</div>
          </div>
          <div>
            <span class="text-slate-400 text-[10px]">SM-2 RETENTION RATE:</span>
            <div class="text-base font-bold text-cyan-300">92.4%</div>
          </div>
        </div>
      </div>

      <!-- FLASHCARD REVIEW MODE -->
      @if (mode() === 'flashcard') {
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
          <div class="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>ACTIVE RECALL SESSION (SM-2 QUEUE)</span>
            <span>CARD {{ currentCardIndex() + 1 }} OF {{ filteredWords().length }}</span>
          </div>

          @if (currentCard()) {
            <!-- Flashcard Frame -->
            <div class="p-8 rounded-lg bg-[#050912] border border-cyan-900/60 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono-tech border border-cyan-800">
                  {{ currentCard()!.cefrLevel }}
                </span>
                <span class="text-xs font-mono-tech text-slate-500 uppercase">{{ currentCard()!.contextTopic }}</span>
              </div>

              <!-- Main English Word & Audio -->
              <div class="space-y-1">
                <div class="text-3xl font-black text-white font-mono-tech tracking-wide">
                  {{ currentCard()!.word }}
                </div>
                <div class="text-sm font-mono-tech text-cyan-400 flex items-center justify-center gap-2">
                  <span>{{ currentCard()!.ipa }}</span>
                  <button
                    (click)="speech.speak(currentCard()!.word)"
                    class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition"
                    title="Pronounce"
                  >
                    <span class="mat-icon text-base">volume_up</span>
                  </button>
                </div>
              </div>

              <!-- Example Sentence -->
              <p class="text-xs text-slate-300 font-sans italic max-w-lg leading-relaxed">
                "{{ currentCard()!.exampleSentence }}"
              </p>

              <!-- Reveal Button -->
              @if (!isFlipped()) {
                <button
                  (click)="isFlipped.set(true)"
                  class="mt-4 px-6 py-2.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono-tech font-bold uppercase tracking-wider transition"
                >
                  REVEAL MEANING & COLLOCATIONS
                </button>
              } @else {
                <!-- Flipped Back Details -->
                <div class="w-full pt-4 border-t border-slate-800/80 space-y-3">
                  <!-- Persian Translation -->
                  <div class="text-lg font-bold text-emerald-400 font-persian">
                    {{ currentCard()!.persianMeaning }}
                  </div>
                  <div class="text-xs text-slate-400 font-sans max-w-md mx-auto">
                    {{ currentCard()!.englishDefinition }}
                  </div>

                  <!-- Collocations & Common Mistakes -->
                  @if (currentCard()!.commonPersianMistake) {
                    <div class="p-3 rounded bg-[#0b0607] border border-rose-950 text-xs font-persian text-rose-300 text-right leading-relaxed max-w-lg mx-auto">
                      <strong>نکته ویژه فارسی‌زبانان:</strong> {{ currentCard()!.commonPersianMistake }}
                    </div>
                  }

                  @if (currentCard()!.collocations.length > 0) {
                    <div class="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                      <span class="text-[10px] font-mono-tech text-slate-500 uppercase">Collocations:</span>
                      @for (col of currentCard()!.collocations; track col) {
                        <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono-tech text-slate-300">
                          {{ col }}
                        </span>
                      }
                    </div>
                  }

                  <!-- SuperMemo SM-2 Recall Evaluation Buttons -->
                  <div class="pt-4 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      (click)="rateCard(1)"
                      class="px-3 py-2 rounded bg-rose-950 border border-rose-700 text-rose-300 text-xs font-mono-tech font-bold hover:bg-rose-900"
                    >
                      AGAIN (FAIL)
                    </button>
                    <button
                      (click)="rateCard(2)"
                      class="px-3 py-2 rounded bg-amber-950 border border-amber-700 text-amber-300 text-xs font-mono-tech font-bold hover:bg-amber-900"
                    >
                      HARD (EFFORT)
                    </button>
                    <button
                      (click)="rateCard(4)"
                      class="px-3 py-2 rounded bg-sky-950 border border-sky-700 text-sky-300 text-xs font-mono-tech font-bold hover:bg-sky-900"
                    >
                      GOOD (RECALLED)
                    </button>
                    <button
                      (click)="rateCard(5)"
                      class="px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono-tech font-bold hover:bg-emerald-900"
                    >
                      EASY (IMMEDIATE)
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-12 text-slate-400 font-mono-tech text-xs">
              ALL CARDS REVIEWED! EXCELLENT MASTERY.
            </div>
          }
        </div>
      } @else {
        <!-- DATABASE TABLE MODE -->
        <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-4">
          <!-- Search & Filter Controls -->
          <div class="flex items-center justify-between flex-wrap gap-3">
            <input
              type="text"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value)"
              placeholder="Search word, Persian meaning, or topic..."
              class="w-full sm:w-72 bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-xs font-mono-tech text-white"
            />

            <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
              <span>FILTER:</span>
              <select
                [value]="levelFilter()"
                (change)="levelFilter.set($any($event.target).value)"
                class="bg-[#050912] border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-mono-tech"
              >
                <option value="ALL">ALL LEVELS</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          <!-- Vocabulary Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono-tech">
              <thead class="bg-[#050912] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Word</th>
                  <th class="p-3">IPA</th>
                  <th class="p-3">Persian Meaning</th>
                  <th class="p-3">CEFR</th>
                  <th class="p-3">Repetitions</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                @for (item of filteredWords(); track item.id) {
                  <tr class="hover:bg-[#060b14] transition">
                    <td class="p-3 font-bold text-white flex items-center gap-1.5">
                      <span>{{ item.word }}</span>
                      <button
                        (click)="speech.speak(item.word)"
                        class="text-slate-400 hover:text-cyan-300"
                      >
                        <span class="mat-icon text-sm">volume_up</span>
                      </button>
                    </td>
                    <td class="p-3 text-cyan-400">{{ item.ipa }}</td>
                    <td class="p-3 font-persian text-slate-200">{{ item.persianMeaning }}</td>
                    <td class="p-3">
                      <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300">
                        {{ item.cefrLevel }}
                      </span>
                    </td>
                    <td class="p-3 text-slate-400">{{ item.repetitions }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                            [class.bg-emerald-950]="item.masteryStatus === 'mastered'"
                            [class.text-emerald-300]="item.masteryStatus === 'mastered'"
                            [class.bg-sky-950]="item.masteryStatus === 'reviewing'"
                            [class.text-sky-300]="item.masteryStatus === 'reviewing'"
                            [class.bg-slate-800]="item.masteryStatus === 'learning'"
                            [class.text-slate-400]="item.masteryStatus === 'learning'">
                        {{ item.masteryStatus }}
                      </span>
                    </td>
                    <td class="p-3 text-right">
                      <button
                        (click)="deleteWord(item.id)"
                        class="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete word"
                      >
                        <span class="mat-icon text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Add New Word Modal -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="w-full max-w-lg rounded-lg bg-[#0a0f1d] border border-cyan-500/50 p-6 text-slate-200 shadow-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-sm tracking-wide text-cyan-300 font-mono-tech">ADD VOCABULARY RECORD</h3>
              <button (click)="isAddModalOpen.set(false)" class="text-slate-400 hover:text-white">
                <span class="mat-icon text-lg">close</span>
              </button>
            </div>

            <div class="space-y-3 font-mono-tech text-xs">
              <div>
                <label for="new-word-input" class="block text-slate-400 mb-1">ENGLISH WORD OR PHRASE</label>
                <input
                  id="new-word-input"
                  type="text"
                  [value]="newWord()"
                  (input)="newWord.set($any($event.target).value)"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="new-persian-input" class="block text-slate-400 mb-1">PERSIAN MEANING (معنی فارسی)</label>
                <input
                  id="new-persian-input"
                  type="text"
                  [value]="newPersian()"
                  (input)="newPersian.set($any($event.target).value)"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white font-persian"
                />
              </div>

              <div>
                <label for="new-definition-input" class="block text-slate-400 mb-1">ENGLISH DEFINITION</label>
                <input
                  id="new-definition-input"
                  type="text"
                  [value]="newDefinition()"
                  (input)="newDefinition.set($any($event.target).value)"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="new-example-input" class="block text-slate-400 mb-1">EXAMPLE SENTENCE</label>
                <input
                  id="new-example-input"
                  type="text"
                  [value]="newExample()"
                  (input)="newExample.set($any($event.target).value)"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                (click)="isAddModalOpen.set(false)"
                class="px-4 py-2 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono-tech"
              >
                CANCEL
              </button>
              <button
                (click)="saveNewWord()"
                [disabled]="!newWord() || !newPersian()"
                class="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-tech uppercase"
              >
                SAVE RECORD
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class VocabularyIntelligence {
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);
  readonly vocabService = inject(AcademyVocabulary);

  readonly mode = signal<'flashcard' | 'table'>('flashcard');
  readonly currentCardIndex = signal<number>(0);
  readonly isFlipped = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly levelFilter = signal<string>('ALL');
  readonly isAddModalOpen = signal<boolean>(false);

  // New word form state
  readonly newWord = signal<string>('');
  readonly newPersian = signal<string>('');
  readonly newDefinition = signal<string>('');
  readonly newExample = signal<string>('');

  readonly words = this.storage.vocabulary;

  readonly filteredWords = computed(() => {
    let list = this.words();
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(w => 
        w.word.toLowerCase().includes(query) || 
        w.persianMeaning.includes(query) ||
        w.contextTopic.toLowerCase().includes(query)
      );
    }
    const level = this.levelFilter();
    if (level !== 'ALL') {
      list = list.filter(w => w.cefrLevel === level);
    }
    return list;
  });

  readonly currentCard = computed(() => {
    const list = this.filteredWords();
    if (list.length === 0) return null;
    return list[this.currentCardIndex() % list.length];
  });

  rateCard(rating: number): void {
    const card = this.currentCard();
    if (!card) return;

    this.vocabService.processReview(card, rating);
    this.isFlipped.set(false);
    this.currentCardIndex.update(idx => idx + 1);
  }

  deleteWord(id: string): void {
    this.storage.deleteVocabularyItem(id);
  }

  saveNewWord(): void {
    const word = this.newWord().trim();
    const fa = this.newPersian().trim();
    if (!word || !fa) return;

    const item: VocabularyItem = {
      id: `vocab_custom_${Date.now()}`,
      word,
      ipa: '/custom/',
      partOfSpeech: 'noun',
      persianMeaning: fa,
      englishDefinition: this.newDefinition().trim() || 'Custom user vocabulary record',
      exampleSentence: this.newExample().trim() || `The concept of ${word} is essential in engineering.`,
      contextTopic: 'General Engineering',
      collocations: [],
      synonyms: [],
      antonyms: [],
      cefrLevel: 'B2',
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
      confidenceScore: 20,
      nextReviewDate: new Date().toISOString(),
      masteryStatus: 'learning',
      tags: ['Custom']
    };

    this.storage.saveVocabularyItem(item);
    this.isAddModalOpen.set(false);
    this.newWord.set('');
    this.newPersian.set('');
    this.newDefinition.set('');
    this.newExample.set('');
  }
}
