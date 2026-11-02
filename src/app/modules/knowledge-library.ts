import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { KnowledgeDocument } from '../core/models/types';

@Component({
  selector: 'app-knowledge-library',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
                VERIFIED KNOWLEDGE & RESEARCH LIBRARY
              </span>
            </div>
            <h1 class="text-2xl font-black text-white">Knowledge Library</h1>
            <p class="text-xs text-slate-300 font-persian mt-1">
              پایگاه دانش مستند؛ حاوی آموزه‌ها و فلسفه آموزشی پلتفرم راه علیرضا، استانداردهای نگارش آکادمیک و قابلیت ورود متون و مقالات جدید با تفکیک دقیق منابع معتبر از پیش‌نویس‌ها.
            </p>
          </div>

          <button
            (click)="isImportModalOpen.set(true)"
            class="flex items-center gap-2 px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-tech uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span class="mat-icon text-sm">upload_file</span>
            <span>IMPORT NEW RESOURCE</span>
          </button>
        </div>
      </div>

      <!-- Search & Status Filter -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
        <input
          type="text"
          [value]="searchQuery()"
          (input)="searchQuery.set($any($event.target).value)"
          placeholder="Search library documents, topics, or philosophies..."
          class="w-full sm:w-72 bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-xs font-mono-tech text-white"
        />

        <div class="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
          <span>STATUS:</span>
          <select
            [value]="statusFilter()"
            (change)="statusFilter.set($any($event.target).value)"
            class="bg-[#050912] border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-mono-tech"
          >
            <option value="ALL">ALL RESOURCES</option>
            <option value="verified_original">VERIFIED ORIGINAL</option>
            <option value="imported_user_content">USER IMPORTED</option>
            <option value="ai_assisted_reference">AI REFERENCE</option>
          </select>
        </div>
      </div>

      <!-- Documents Stream -->
      <div class="space-y-4">
        @for (doc of filteredDocuments(); track doc.id) {
          <div class="bg-[#090e18] border border-slate-800 rounded-lg p-5 space-y-4">
            <div class="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase"
                        [class.bg-cyan-950]="doc.verificationStatus === 'verified_original'"
                        [class.border]="true"
                        [class.border-cyan-700]="doc.verificationStatus === 'verified_original'"
                        [class.text-cyan-300]="doc.verificationStatus === 'verified_original'"
                        [class.bg-purple-950]="doc.verificationStatus !== 'verified_original'"
                        [class.text-purple-300]="doc.verificationStatus !== 'verified_original'">
                    {{ doc.verificationStatus.replace('_', ' ') }}
                  </span>
                  <span class="text-xs font-mono-tech text-slate-400">TOPIC: {{ doc.topic }}</span>
                </div>
                <h2 class="text-base font-bold text-white">{{ doc.title }}</h2>
              </div>

              @if (doc.verificationStatus !== 'verified_original') {
                <button
                  (click)="deleteDoc(doc.id)"
                  class="text-slate-500 hover:text-rose-400 p-1 rounded"
                  title="Remove document"
                >
                  <span class="mat-icon text-base">delete</span>
                </button>
              }
            </div>

            <!-- Metadata info -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tech text-slate-400 bg-[#050912] p-2.5 rounded border border-slate-800/80">
              <div>SOURCE: <span class="text-slate-300">{{ doc.source }}</span></div>
              @if (doc.originalUrl) {
                <div class="truncate">
                  URL: <a [href]="doc.originalUrl" target="_blank" class="text-cyan-400 hover:underline">{{ doc.originalUrl }}</a>
                </div>
              }
              <div>DATE: <span class="text-slate-300">{{ formatDate(doc.createdAt) }}</span></div>
              <div class="flex items-center gap-1">
                TAGS:
                @for (tag of doc.tags; track tag) {
                  <span class="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">{{ tag }}</span>
                }
              </div>
            </div>

            <!-- Persian Summary -->
            @if (doc.persianSummary) {
              <div class="p-3 rounded bg-[#060a12] border border-cyan-950/60 font-persian text-xs text-cyan-200 leading-relaxed">
                {{ doc.persianSummary }}
              </div>
            }

            <!-- Document Content Excerpt -->
            <div class="p-4 rounded bg-[#040810] border border-slate-800/80 text-xs text-slate-200 font-mono-tech whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {{ doc.content }}
            </div>
          </div>
        }
      </div>

      <!-- Import Document Modal -->
      @if (isImportModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="w-full max-w-lg rounded-lg bg-[#0a0f1d] border border-cyan-500/50 p-6 text-slate-200 shadow-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="font-bold text-sm tracking-wide text-cyan-300 font-mono-tech">IMPORT KNOWLEDGE DOCUMENT</h3>
              <button (click)="isImportModalOpen.set(false)" class="text-slate-400 hover:text-white">
                <span class="mat-icon text-lg">close</span>
              </button>
            </div>

            <div class="space-y-3 font-mono-tech text-xs">
              <div>
                <label for="doc-title-input" class="block text-slate-400 mb-1">DOCUMENT TITLE</label>
                <input
                  id="doc-title-input"
                  type="text"
                  [value]="newDocTitle()"
                  (input)="newDocTitle.set($any($event.target).value)"
                  placeholder="e.g., Notes on Rahe Alireza Architecture"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="doc-source-input" class="block text-slate-400 mb-1">AUTHOR / SOURCE</label>
                <input
                  id="doc-source-input"
                  type="text"
                  [value]="newDocSource()"
                  (input)="newDocSource.set($any($event.target).value)"
                  placeholder="e.g., Alireza S. Yazdi / Research Paper"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="doc-url-input" class="block text-slate-400 mb-1">ORIGINAL URL (OPTIONAL)</label>
                <input
                  id="doc-url-input"
                  type="text"
                  [value]="newDocUrl()"
                  (input)="newDocUrl.set($any($event.target).value)"
                  placeholder="https://..."
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="doc-topic-input" class="block text-slate-400 mb-1">TOPIC</label>
                <input
                  id="doc-topic-input"
                  type="text"
                  [value]="newDocTopic()"
                  (input)="newDocTopic.set($any($event.target).value)"
                  placeholder="e.g., Machine Learning / Engineering Strategy"
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div>
                <label for="doc-content-input" class="block text-slate-400 mb-1">CONTENT / TEXT / MARKDOWN</label>
                <textarea
                  id="doc-content-input"
                  [value]="newDocContent()"
                  (input)="newDocContent.set($any($event.target).value)"
                  rows="5"
                  placeholder="Paste article, abstract, or extracted lecture text here..."
                  class="w-full bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2 text-white leading-relaxed"
                ></textarea>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                (click)="isImportModalOpen.set(false)"
                class="px-4 py-2 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono-tech"
              >
                CANCEL
              </button>
              <button
                (click)="saveNewDoc()"
                [disabled]="!newDocTitle() || !newDocContent()"
                class="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono-tech uppercase"
              >
                SAVE TO KNOWLEDGE BASE
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class KnowledgeLibrary {
  readonly storage = inject(AcademyStorage);

  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string>('ALL');
  readonly isImportModalOpen = signal<boolean>(false);

  // Form states
  readonly newDocTitle = signal<string>('');
  readonly newDocSource = signal<string>('');
  readonly newDocUrl = signal<string>('');
  readonly newDocTopic = signal<string>('Computer Science & Methodology');
  readonly newDocContent = signal<string>('');

  readonly docs = this.storage.knowledge;

  readonly filteredDocuments = computed(() => {
    let list = this.docs();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.content.toLowerCase().includes(q) ||
        d.topic.toLowerCase().includes(q)
      );
    }
    const status = this.statusFilter();
    if (status !== 'ALL') {
      list = list.filter(d => d.verificationStatus === status);
    }
    return list;
  });

  formatDate(date: string): string {
    return date ? date.substring(0, 10) : '';
  }

  saveNewDoc(): void {
    const title = this.newDocTitle().trim();
    const content = this.newDocContent().trim();
    if (!title || !content) return;

    const doc: KnowledgeDocument = {
      id: `doc_user_${Date.now()}`,
      title,
      source: this.newDocSource().trim() || 'User Imported Source',
      originalUrl: this.newDocUrl().trim() || undefined,
      topic: this.newDocTopic().trim() || 'Engineering Research',
      content,
      verificationStatus: 'imported_user_content',
      createdAt: new Date().toISOString(),
      tags: ['Imported', 'Research']
    };

    this.storage.saveKnowledgeDocument(doc);
    this.isImportModalOpen.set(false);
    this.newDocTitle.set('');
    this.newDocSource.set('');
    this.newDocUrl.set('');
    this.newDocContent.set('');
  }

  deleteDoc(id: string): void {
    this.storage.deleteKnowledgeDocument(id);
  }
}
