import { Injectable, inject } from '@angular/core';
import { AcademyStorage } from './storage';
import { VocabularyItem } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AcademyVocabulary {
  private storage = inject(AcademyStorage);

  /**
   * SuperMemo SM-2 Interval Calculation
   * @param item Current vocabulary record
   * @param quality Rating from 0 (complete failure) to 5 (flawless recall)
   */
  processReview(item: VocabularyItem, quality: number): VocabularyItem {
    let { repetitions, interval, easeFactor } = item;

    // Quality check
    const q = Math.max(0, Math.min(5, quality));

    if (q >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Next review date calculation
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    // Calculate confidence score (0 to 100)
    const confidenceScore = Math.min(100, Math.max(0, Math.round((repetitions * 15) + (easeFactor * 10))));
    const masteryStatus = repetitions >= 5 ? 'mastered' : repetitions > 0 ? 'reviewing' : 'learning';

    const updatedItem: VocabularyItem = {
      ...item,
      repetitions,
      interval,
      easeFactor: Number(easeFactor.toFixed(2)),
      confidenceScore,
      nextReviewDate: nextDate.toISOString(),
      lastReviewedDate: new Date().toISOString(),
      masteryStatus
    };

    this.storage.saveVocabularyItem(updatedItem);
    return updatedItem;
  }

  /**
   * Scans arbitrary technical text and identifies potential candidate vocabulary words
   */
  extractVocabularyCandidates(text: string): string[] {
    const commonStopWords = new Set([
      'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which',
      'about', 'into', 'then', 'than', 'some', 'these', 'there', 'their', 'where',
      'after', 'being', 'been', 'when', 'what', 'more', 'other', 'over', 'such'
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\- ]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !commonStopWords.has(w) && !/^\d+$/.test(w));

    return Array.from(new Set(words)).slice(0, 15);
  }
}
