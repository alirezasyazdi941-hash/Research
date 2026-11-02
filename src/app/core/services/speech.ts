import { Injectable, signal } from '@angular/core';

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: Record<number, Record<number, { transcript: string }>> & { length: number };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AcademySpeech {
  readonly isSpeaking = signal<boolean>(false);
  readonly isRecording = signal<boolean>(false);
  readonly isListeningSTT = signal<boolean>(false);
  readonly speechRate = signal<number>(1.0); // 0.75, 1.0, 1.25
  readonly lastTranscript = signal<string>('');
  readonly recordedAudioUrl = signal<string | null>(null);

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private speechRecognition: SpeechRecognitionLike | null = null;

  constructor() {
    this.initSpeechRecognition();
  }

  // --- Text-to-Speech (Synthesis) ---

  speak(text: string, rateMultiplier?: number): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rateMultiplier || this.speechRate();
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('English')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => this.isSpeaking.set(true);
      utterance.onend = () => {
        this.isSpeaking.set(false);
        resolve();
      };
      utterance.onerror = (e) => {
        console.warn('TTS Error:', e);
        this.isSpeaking.set(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking.set(false);
    }
  }

  setRate(rate: number): void {
    this.speechRate.set(rate);
  }

  // --- Audio Recording via MediaRecorder ---

  async startRecording(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      console.warn('getUserMedia not supported in this environment.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        if (this.recordedAudioUrl()) {
          URL.revokeObjectURL(this.recordedAudioUrl()!);
        }
        const url = URL.createObjectURL(blob);
        this.recordedAudioUrl.set(url);
        this.isRecording.set(false);

        // Stop all tracks to release microphone hardware
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
      return true;
    } catch (err) {
      console.error('Failed to access microphone for recording:', err);
      this.isRecording.set(false);
      return false;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording.set(false);
  }

  clearRecordedAudio(): void {
    if (this.recordedAudioUrl()) {
      URL.revokeObjectURL(this.recordedAudioUrl()!);
      this.recordedAudioUrl.set(null);
    }
  }

  // --- Browser Speech-to-Text Recognition ---

  private initSpeechRecognition(): void {
    if (typeof window === 'undefined') return;

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      this.speechRecognition = new SpeechRec();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        this.lastTranscript.set(transcript);
      };

      this.speechRecognition.onerror = (event: { error: string }) => {
        console.warn('Speech recognition event warning:', event.error);
        this.isListeningSTT.set(false);
      };

      this.speechRecognition.onend = () => {
        this.isListeningSTT.set(false);
      };
    }
  }

  startSTT(): boolean {
    if (!this.speechRecognition) {
      return false;
    }
    try {
      this.lastTranscript.set('');
      this.speechRecognition.start();
      this.isListeningSTT.set(true);
      return true;
    } catch (err) {
      console.warn('STT start error:', err);
      return false;
    }
  }

  stopSTT(): void {
    if (this.speechRecognition && this.isListeningSTT()) {
      try {
        this.speechRecognition.stop();
      } catch {
        // Ignored
      }
      this.isListeningSTT.set(false);
    }
  }

  isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }
}
