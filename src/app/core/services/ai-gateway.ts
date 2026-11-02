import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PromptTemplate } from '../models/types';
import { INITIAL_PROMPT_TEMPLATES } from '../data/initial-data';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademyAiGateway {
  private http = inject(HttpClient);

  readonly hasLiveGemini = signal<boolean>(false);
  readonly checkingStatus = signal<boolean>(false);
  readonly promptTemplates = signal<PromptTemplate[]>(INITIAL_PROMPT_TEMPLATES);

  constructor() {
    this.checkServerAiStatus();
  }

  async checkServerAiStatus(): Promise<boolean> {
    this.checkingStatus.set(true);
    try {
      const res = await firstValueFrom(this.http.get<{ hasGeminiKey: boolean }>('/api/status'));
      this.hasLiveGemini.set(!!res?.hasGeminiKey);
      this.checkingStatus.set(false);
      return !!res?.hasGeminiKey;
    } catch {
      this.hasLiveGemini.set(false);
      this.checkingStatus.set(false);
      return false;
    }
  }

  async executeLiveAi(prompt: string, systemInstruction?: string): Promise<{ text: string; success: boolean; error?: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ text: string; success: boolean; error?: string }>('/api/ai/generate', {
          prompt,
          systemInstruction
        })
      );
      return res;
    } catch (err: unknown) {
      const errorObj = err as { error?: { error?: string }; message?: string };
      const msg = errorObj?.error?.error || errorObj?.message || 'Failed to connect to server AI proxy.';
      return { text: '', success: false, error: msg };
    }
  }

  /**
   * Generates a fully hydrated prompt from template and variables
   */
  hydratePrompt(template: PromptTemplate, variables: Record<string, string>): string {
    let result = template.userPromptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    }
    return result;
  }

  /**
   * Copies text to clipboard and returns success
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
