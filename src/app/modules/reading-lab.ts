import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademySpeech } from '../core/services/speech';
import { AcademyStorage } from '../core/services/storage';
import { VocabularyItem } from '../core/models/types';

interface ReadingArticle {
  id: string;
  title: string;
  persianTitle: string;
  topic: string;
  cefr: string;
  body: string;
  persianSummary: string;
  vocabularyHighlights: { word: string; ipa: string; fa: string; en: string }[];
}

const ARTICLES: ReadingArticle[] = [
  {
    id: 'art_attention',
    title: 'Self-Attention Mechanisms in Deep Neural Transformers',
    persianTitle: 'مکانیسم خود-توجه در معماری شبکه‌های عصبی عمیق ترنسفورمر',
    topic: 'Artificial Intelligence & Deep Learning',
    cefr: 'C1',
    body: `Modern foundational models predominantly rely on multi-head self-attention rather than recurrence or convolution. Unlike traditional recurrent architectures that suffer from sequential computation bottlenecks and vanishing gradients, self-attention maps a sequence of token representations directly onto pairwise compatibility weights. By projecting queries, keys, and values through learned linear transformations into multiple orthogonal subspaces, the system simultaneously captures localized syntactic dependencies and long-range semantic coreferences. Consequently, transformers exhibit remarkable empirical scaling laws when pre-trained over billions of diverse web-scale parameters.`,
    persianSummary: 'این مقاله توضیح می‌دهد که چرا مکانیزم خود-توجه با حذف پردازش ترتیبی و رفع مشکل محو شدگی گرادیان، توانست تحولی بنیادین در یادگیری ماشین و مقیاس‌پذیری شبکه‌های عصبی ایجاد کند.',
    vocabularyHighlights: [
      { word: 'predominantly', ipa: '/prɪˈdɒm.ɪ.nənt.li/', fa: 'عمدتاً، به طور غالب', en: 'Mainly; for the most part.' },
      { word: 'bottleneck', ipa: '/ˈbɒt.əl.nek/', fa: 'گلوگاه پردازشی یا عملکردی', en: 'A point of congestion in a system that stops or slows progress.' },
      { word: 'orthogonal', ipa: '/ɔːˈθɒɡ.ən.əl/', fa: 'متعامد، مستقل از یکدیگر', en: 'Statistically independent or mutually exclusive.' },
      { word: 'coreference', ipa: '/koʊˈref.ər.əns/', fa: 'هم‌مرجعی (ارجاع چند کلمه به یک موجودیت در متن)', en: 'When two or more expressions in a text refer to the same person or thing.' }
    ]
  },
  {
    id: 'art_raft',
    title: 'Consensus in the Presence of Network Partitions (Raft & Paxos)',
    persianTitle: 'اجماع توزیع‌شده در شرایط بروز شکستگی و قطعی شبکه',
    topic: 'Distributed Systems & Cloud Architecture',
    cefr: 'B2',
    body: `In distributed state machines, network partitions represent an inevitable operational risk. The CAP theorem mathematically establishes that no networked shared-data system can simultaneously achieve linearizable consistency, high availability, and partition tolerance. The Raft consensus algorithm resolves this challenge through decomposed state transitions: leader election, log replication, and safety guarantees. When an operational node fails to observe heartbeat telemetry, it increments its internal term counter and initiates an election, preventing split-brain anomalies through quorum voting.`,
    persianSummary: 'این متن به تحلیل قضیه CAP، اجماع گره‌ها در شبکه و مهار ناهنجاری مغز دوپاره (split-brain) در سیستم‌های پایگاه داده توزیع‌شده می‌پردازد.',
    vocabularyHighlights: [
      { word: 'linearizable', ipa: '/ˌlɪn.i.əˈraɪ.zə.bəl/', fa: 'خطی‌پذیر (خوانش داده‌ها دقیقاً منطبق بر آخرین تغییر)', en: 'Ensuring that read operations return the most recent write in real-time order.' },
      { word: 'quorum', ipa: '/ˈkwɔːr.əm/', fa: 'حد نصاب آرا برای تصمیم‌گیری معتبر', en: 'The minimum number of members of an assembly that must be present to make decisions valid.' },
      { word: 'split-brain', ipa: '/ˌsplɪtˈbreɪn/', fa: 'ناهنجاری مغز دوپاره در سیستم توزیع‌شده', en: 'A condition where cluster partitions act independently as competing leaders.' }
    ]
  }
];

@Component({
  selector: 'app-reading-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            TECHNICAL & SCIENTIFIC READING INTELLIGENCE
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Reading Lab</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          مطالعه عمیق مقالات مرجع هوش مصنوعی و معماری نرم‌افزار، استخراج واژگان کلیدی با یک کلیک و افزودن خودکار به جعبه لایتنر فاصله‌دار (SM-2).
        </p>

        <!-- Article Switcher -->
        <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          @for (art of articles; track art.id; let idx = $index) {
            <button
              (click)="selectArticle(idx)"
              [class.bg-cyan-500]="activeArticleIndex() === idx"
              [class.text-slate-950]="activeArticleIndex() === idx"
              [class.font-bold]="activeArticleIndex() === idx"
              [class.bg-[#050912]]="activeArticleIndex() !== idx"
              [class.text-slate-300]="activeArticleIndex() !== idx"
              [class.border-cyan-500]="activeArticleIndex() === idx"
              [class.border-slate-800]="activeArticleIndex() !== idx"
              class="px-3 py-1.5 rounded border text-xs font-mono-tech transition"
            >
              {{ art.title }}
            </button>
          }
        </div>
      </div>

      <!-- Main Reading Arena -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-6">
        <!-- Article Header -->
        <div class="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400 mb-1">
              <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">{{ activeArticle().cefr }}</span>
              <span>TOPIC: {{ activeArticle().topic }}</span>
            </div>
            <h2 class="text-lg font-bold text-white">{{ activeArticle().title }}</h2>
            <div class="text-xs font-persian text-cyan-300 mt-0.5">{{ activeArticle().persianTitle }}</div>
          </div>

          <button
            (click)="speech.speak(activeArticle().body)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-mono-tech transition"
          >
            <span class="mat-icon text-sm">volume_up</span>
            <span>LISTEN TO PAPER</span>
          </button>
        </div>

        <!-- Persian Context Summary Box -->
        <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 font-persian text-xs text-slate-300 leading-relaxed">
          <div class="text-[10px] font-mono-tech text-slate-400 uppercase mb-1 font-sans">Persian Conceptual Overview:</div>
          {{ activeArticle().persianSummary }}
        </div>

        <!-- Article Body -->
        <div class="p-5 rounded bg-[#040810] border border-slate-800/80 text-sm leading-relaxed text-slate-200 font-sans tracking-wide space-y-4">
          <p>{{ activeArticle().body }}</p>
        </div>

        <!-- Extracted Academic Vocabulary (1-Click SM-2 Importer) -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono-tech text-cyan-400 uppercase font-bold flex items-center gap-1">
              <span class="mat-icon text-sm">auto_stories</span>
              <span>KEY VOCABULARY EXTRACTED FROM PAPER</span>
            </span>
            <span class="text-[11px] font-mono-tech text-slate-500">CLICK TO ADD TO SM-2 QUEUE</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (v of activeArticle().vocabularyHighlights; track v.word) {
              <div class="p-3.5 rounded bg-[#060a12] border border-slate-800 flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs text-white font-mono-tech">{{ v.word }}</span>
                    <span class="text-[10px] font-mono-tech text-cyan-400">{{ v.ipa }}</span>
                  </div>
                  <div class="text-xs font-persian text-slate-300">{{ v.fa }}</div>
                  <div class="text-[11px] text-slate-400 font-sans italic">{{ v.en }}</div>
                </div>

                <div class="flex flex-col gap-1 shrink-0">
                  <button
                    (click)="speech.speak(v.word)"
                    class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                    title="Pronounce"
                  >
                    <span class="mat-icon text-base">volume_up</span>
                  </button>
                  <button
                    (click)="addWordToQueue(v)"
                    class="px-2 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-mono-tech hover:bg-cyan-900"
                    title="Add to SM-2 Spaced Repetition"
                  >
                    + SM-2
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReadingLab {
  readonly speech = inject(AcademySpeech);
  readonly storage = inject(AcademyStorage);

  readonly articles = ARTICLES;
  readonly activeArticleIndex = signal<number>(0);

  readonly activeArticle = computed(() => this.articles[this.activeArticleIndex()]);

  selectArticle(idx: number): void {
    this.activeArticleIndex.set(idx);
  }

  addWordToQueue(v: { word: string; ipa: string; fa: string; en: string }): void {
    const newItem: VocabularyItem = {
      id: `vocab_imported_${Date.now()}_${v.word}`,
      word: v.word,
      ipa: v.ipa,
      partOfSpeech: 'noun',
      persianMeaning: v.fa,
      englishDefinition: v.en,
      exampleSentence: `Imported from research article: ${this.activeArticle().title}`,
      contextTopic: this.activeArticle().topic,
      collocations: [],
      synonyms: [],
      antonyms: [],
      cefrLevel: 'C1',
      repetitions: 0,
      interval: 1,
      easeFactor: 2.5,
      confidenceScore: 30,
      nextReviewDate: new Date().toISOString(),
      masteryStatus: 'learning',
      tags: ['Research', 'Reading Lab']
    };
    this.storage.saveVocabularyItem(newItem);
  }
}
