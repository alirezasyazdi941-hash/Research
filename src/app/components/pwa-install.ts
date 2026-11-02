import { ChangeDetectionStrategy, Component, signal, OnInit, OnDestroy } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Component({
  selector: 'app-pwa-install',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isInstalled()) {
      <!-- Already installed as standalone app -->
    } @else if (isInstallable()) {
      <button
        (click)="install()"
        class="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-900 hover:text-cyan-100 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
        title="Install Ali English as local PWA"
      >
        <span class="mat-icon text-sm">download_for_offline</span>
        <span>INSTALL ACADEMY</span>
      </button>
    } @else if (isIOS()) {
      <button
        (click)="showIOSGuide.set(true)"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900/80 text-slate-300 text-xs font-mono-tech hover:border-slate-500 transition-all"
      >
        <span class="mat-icon text-sm">apple</span>
        <span>INSTALL ON iOS</span>
      </button>

      @if (showIOSGuide()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="w-full max-w-sm rounded-lg bg-[#0a0f1d] border border-cyan-500/40 p-6 text-slate-200 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div class="flex items-center gap-2">
                <span class="mat-icon text-cyan-400">phone_iphone</span>
                <h3 class="font-bold text-sm tracking-wide text-cyan-300">INSTALL ON iOS SAFARI</h3>
              </div>
              <button (click)="showIOSGuide.set(false)" class="text-slate-400 hover:text-white">
                <span class="mat-icon text-lg">close</span>
              </button>
            </div>
            
            <ol class="space-y-3 text-xs text-slate-300 list-decimal list-inside font-sans">
              <li class="leading-relaxed">
                Tap the <strong class="text-white">Share</strong> icon <span class="mat-icon text-xs align-middle">ios_share</span> in the Safari navigation bar.
              </li>
              <li class="leading-relaxed">
                Scroll down and tap <strong class="text-cyan-400">Add to Home Screen</strong> <span class="mat-icon text-xs align-middle">add_box</span>.
              </li>
              <li class="leading-relaxed">
                Launch Ali English anytime directly with full offline persistence and hardware audio access.
              </li>
            </ol>

            <button
              (click)="showIOSGuide.set(false)"
              class="mt-6 w-full py-2 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono-tech text-xs hover:bg-cyan-900 transition-all"
            >
              ACKNOWLEDGE
            </button>
          </div>
        </div>
      }
    }
  `
})
export class PwaInstall implements OnInit, OnDestroy {
  readonly isInstallable = signal<boolean>(false);
  readonly isInstalled = signal<boolean>(false);
  readonly isIOS = signal<boolean>(false);
  readonly showIOSGuide = signal<boolean>(false);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private beforeInstallHandler?: (e: Event) => void;
  private appInstalledHandler?: () => void;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const nav = window.navigator as unknown as { standalone?: boolean };
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
    this.isInstalled.set(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    this.isIOS.set(/iphone|ipad|ipod/.test(ua));

    this.beforeInstallHandler = (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable.set(true);
    };

    this.appInstalledHandler = () => {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
      this.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', this.beforeInstallHandler);
    window.addEventListener('appinstalled', this.appInstalledHandler);
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') return;
    if (this.beforeInstallHandler) {
      window.removeEventListener('beforeinstallprompt', this.beforeInstallHandler);
    }
    if (this.appInstalledHandler) {
      window.removeEventListener('appinstalled', this.appInstalledHandler);
    }
  }

  async install(): Promise<void> {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
    }
    this.deferredPrompt = null;
  }
}
