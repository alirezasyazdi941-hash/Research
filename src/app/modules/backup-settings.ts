import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AcademyStorage } from '../core/services/storage';
import { AcademySpeech } from '../core/services/speech';

@Component({
  selector: 'app-backup-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-[#080d19] border border-cyan-500/40 rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span class="text-xs font-mono-tech uppercase tracking-widest text-cyan-400">
            LOCAL-FIRST PRIVACY, CRYPTO BACKUP & HARDWARE SETTINGS
          </span>
        </div>
        <h1 class="text-2xl font-black text-white">Backup & Academy Settings</h1>
        <p class="text-xs text-slate-300 font-persian mt-1">
          معماری محلی (Local-First) با رمزنگاری پیشرفته Web Crypto API (AES-GCM ۲۵۶ بیتی)؛ بدون نیاز به حساب کاربری ابری و بدون ارسال پنهانی اطلاعات.
        </p>
      </div>

      <!-- Section 1: Web Crypto Encrypted Backup (PBKDF2 + AES-GCM) -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-5">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-lg">lock</span>
            <h2 class="text-base font-bold text-white">1. Encrypted Backup (AES-GCM 256-bit)</h2>
          </div>
          <span class="text-xs font-mono-tech text-emerald-400">HARDWARE SECURED</span>
        </div>

        <p class="text-xs text-slate-400 font-persian leading-relaxed">
          تمامی پروفایل، واژگان SM-2، خطاهای زبانی و اسناد کتابخانه با کلید مشتق‌شده از رمز عبور شما (PBKDF2 با ۱۰۰,۰۰۰ بار تکرار) در مرورگر رمزنگاری می‌شوند:
        </p>

        <div class="space-y-3 font-mono-tech text-xs">
          <div>
            <label for="passphrase-input" class="block text-slate-400 mb-1">ENCRYPTION PASSPHRASE</label>
            <input
              id="passphrase-input"
              type="password"
              [value]="passphrase()"
              (input)="passphrase.set($any($event.target).value)"
              placeholder="Enter strong encryption password..."
              class="w-full sm:w-80 bg-[#050912] border border-slate-800 focus:border-cyan-500 rounded p-2.5 text-white"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              (click)="downloadEncryptedBackup()"
              [disabled]="!passphrase().trim()"
              class="flex items-center gap-1.5 px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <span class="mat-icon text-sm">download</span>
              <span>DOWNLOAD ENCRYPTED BACKUP (.json)</span>
            </button>
          </div>
        </div>

        <!-- Restore Encrypted Backup -->
        <div class="pt-4 border-t border-slate-800 space-y-3 font-mono-tech text-xs">
          <div class="text-slate-300 font-bold uppercase">Restore from Encrypted File</div>
          <input
            type="file"
            accept=".json"
            (change)="onRestoreFileSelected($event)"
            class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono-tech file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700"
          />

          @if (restoreStatus()) {
            <div class="p-3 rounded text-xs"
                 [class.bg-emerald-950]="restoreSuccess()"
                 [class.text-emerald-300]="restoreSuccess()"
                 [class.bg-rose-950]="!restoreSuccess()"
                 [class.text-rose-300]="!restoreSuccess()">
              {{ restoreStatus() }}
            </div>
          }
        </div>
      </div>

      <!-- Section 2: Audio Synthesis & Speech Settings -->
      <div class="bg-[#090e18] border border-slate-800 rounded-lg p-6 space-y-4 font-mono-tech text-xs">
        <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-cyan-400 text-base">settings_voice</span>
            <h2 class="text-base font-bold text-white font-sans">2. Speech & Audio Hardware Calibration</h2>
          </div>
          <span class="text-cyan-400 font-mono-tech">WEB AUDIO API</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <span class="text-slate-400">DEFAULT TTS SPEED RATE</span>
            <div class="flex items-center gap-2 pt-1">
              @for (rate of [0.75, 1.0, 1.25]; track rate) {
                <button
                  (click)="speech.setRate(rate)"
                  [class.bg-cyan-500]="speech.speechRate() === rate"
                  [class.text-slate-950]="speech.speechRate() === rate"
                  [class.font-bold]="speech.speechRate() === rate"
                  [class.bg-slate-900]="speech.speechRate() !== rate"
                  [class.text-slate-300]="speech.speechRate() !== rate"
                  class="px-3 py-1.5 rounded border border-slate-700 text-xs"
                >
                  {{ rate }}x
                </button>
              }
            </div>
          </div>

          <div class="p-4 rounded bg-[#060a12] border border-slate-800 space-y-2">
            <span class="text-slate-400">BROWSER HARDWARE STATUS</span>
            <div class="space-y-1 text-[11px]">
              <div class="flex items-center justify-between">
                <span>SPEECH SYNTHESIS (TTS):</span>
                <span class="text-emerald-400">AVAILABLE</span>
              </div>
              <div class="flex items-center justify-between">
                <span>SPEECH RECOGNITION (STT):</span>
                <span [class.text-emerald-400]="speech.isSTTSupported()" [class.text-amber-400]="!speech.isSTTSupported()">
                  {{ speech.isSTTSupported() ? 'NATIVE BROWSER SUPPORT' : 'UNAVAILABLE (SAFARI FALLBACK)' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Danger Zone / Reset -->
      <div class="bg-[#090e18] border border-rose-950 rounded-lg p-6 space-y-4">
        <div class="border-b border-rose-950/80 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="mat-icon text-rose-500 text-base">delete_forever</span>
            <h2 class="text-base font-bold text-white">3. Reset Academy State & Local Storage</h2>
          </div>
          <span class="text-xs font-mono-tech text-rose-400">FACTORY RESET</span>
        </div>

        <p class="text-xs text-slate-400 font-persian">
          تمام پیشرفت‌های تشخیصی، واژگان و خطاهای ثبت‌شده از مرورگر حذف شده و برنامه به حالت اولیه بازگردانده می‌شود.
        </p>

        @if (!showResetConfirm()) {
          <button
            (click)="showResetConfirm.set(true)"
            class="px-4 py-2 rounded bg-rose-950 border border-rose-800 text-rose-300 text-xs font-mono-tech hover:bg-rose-900 transition"
          >
            RESET ALL LOCAL ACADEMY DATA
          </button>
        } @else {
          <div class="flex items-center gap-3">
            <button
              (click)="confirmReset()"
              class="px-4 py-2 rounded bg-rose-600 text-white font-bold text-xs font-mono-tech uppercase"
            >
              CONFIRM IMMEDIATE FACTORY RESET
            </button>
            <button
              (click)="showResetConfirm.set(false)"
              class="px-3 py-2 rounded bg-slate-800 text-slate-300 text-xs font-mono-tech"
            >
              CANCEL
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class BackupSettings {
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);

  readonly passphrase = signal<string>('');
  readonly restoreStatus = signal<string>('');
  readonly restoreSuccess = signal<boolean>(false);
  readonly showResetConfirm = signal<boolean>(false);

  async downloadEncryptedBackup(): Promise<void> {
    const pw = this.passphrase().trim();
    if (!pw) return;

    try {
      const encryptedJson = await this.storage.exportEncryptedBackup(pw);
      const blob = new Blob([encryptedJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ali-english-backup-encrypted-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    }
  }

  async onRestoreFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const text = await file.text();
    const pw = this.passphrase().trim();

    if (!pw) {
      this.restoreSuccess.set(false);
      this.restoreStatus.set('ERROR: Please enter the passphrase used during backup encryption.');
      return;
    }

    const ok = await this.storage.restoreEncryptedBackup(text, pw);
    if (ok) {
      this.restoreSuccess.set(true);
      this.restoreStatus.set('SUCCESS: Encrypted backup decrypted and restored seamlessly.');
    } else {
      this.restoreSuccess.set(false);
      this.restoreStatus.set('DECRYPTION FAILED: Invalid passphrase or corrupted file header.');
    }
  }

  confirmReset(): void {
    this.storage.resetAllData();
    this.showResetConfirm.set(false);
  }
}
