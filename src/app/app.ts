import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PwaInstall } from './components/pwa-install';
import { AcademyStorage } from './core/services/storage';
import { AcademySpeech } from './core/services/speech';

interface NavItem {
  id: string;
  label: string;
  persianLabel: string;
  route: string;
  icon: string;
  badge?: () => string | number;
}

interface NavSection {
  title: string;
  persianTitle: string;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PwaInstall],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  readonly storage = inject(AcademyStorage);
  readonly speech = inject(AcademySpeech);

  readonly isSidebarOpen = signal<boolean>(false);
  readonly isOnline = signal<boolean>(true);

  private onlineHandler = () => this.isOnline.set(true);
  private offlineHandler = () => this.isOnline.set(false);

  readonly navSections: NavSection[] = [
    {
      title: 'COMMAND & CONTROL',
      persianTitle: 'فرماندهی و پروفایل',
      items: [
        { id: 'm_cmd', label: 'Command Center', persianLabel: 'مرکز فرماندهی', route: '/command-center', icon: 'dashboard' },
        { id: 'm_profile', label: 'My Learning Profile', persianLabel: 'پروفایل یادگیرنده', route: '/profile', icon: 'person' },
        { id: 'm_diag', label: 'Placement Test', persianLabel: 'آزمون تعیین سطح', route: '/placement-test', icon: 'assignment_turned_in' },
        { id: 'm_missions', label: 'Daily Missions', persianLabel: 'ماموریت‌های روزانه', route: '/missions', icon: 'today' },
      ]
    },
    {
      title: 'TEACHING & ORAL LABS',
      persianTitle: 'تدریس و آزمایشگاه‌های گفتاری',
      items: [
        { id: 'm_teacher', label: 'Personal Teacher', persianLabel: 'استاد اختصاصی', route: '/teacher', icon: 'school' },
        { id: 'm_conv', label: 'Conversation Lab', persianLabel: 'آزمایشگاه مکالمه', route: '/conversation', icon: 'forum' },
        { id: 'm_spk', label: 'Speaking Lab', persianLabel: 'آزمایشگاه گفتار', route: '/speaking', icon: 'mic' },
        { id: 'm_list', label: 'Listening Lab', persianLabel: 'آزمایشگاه شنیدار', route: '/listening', icon: 'hearing' },
        { id: 'm_pron', label: 'Pronunciation Lab', persianLabel: 'آزمایشگاه تلفظ', route: '/pronunciation', icon: 'record_voice_over' },
      ]
    },
    {
      title: 'LITERACY & SYNTAX',
      persianTitle: 'نگارش، ریدینگ و گرامر',
      items: [
        { id: 'm_read', label: 'Reading Lab', persianLabel: 'آزمایشگاه خواندن', route: '/reading', icon: 'menu_book' },
        { id: 'm_write', label: 'Writing Lab', persianLabel: 'آزمایشگاه نگارش', route: '/writing', icon: 'edit' },
        { id: 'm_gram', label: 'Grammar Intelligence', persianLabel: 'هوش گرامری', route: '/grammar', icon: 'spellcheck' },
        { id: 'm_acad', label: 'Academic English', persianLabel: 'انگلیسی آکادمیک', route: '/academic', icon: 'science' },
      ]
    },
    {
      title: 'INTELLIGENCE ENGINES',
      persianTitle: 'موتورهای هوشمند',
      items: [
        {
          id: 'm_voc',
          label: 'Vocabulary Intelligence',
          persianLabel: 'هوش واژگان (SM-2)',
          route: '/vocabulary',
          icon: 'alarm',
          badge: () => this.storage.dueWords() > 0 ? `${this.storage.dueWords()} due` : ''
        },
        {
          id: 'm_err',
          label: 'Error Intelligence',
          persianLabel: 'هوش خطاها (L1)',
          route: '/errors',
          icon: 'warning',
          badge: () => this.storage.activeErrorsCount() > 0 ? `${this.storage.activeErrorsCount()}` : ''
        },
        { id: 'm_assess', label: 'Assessment Center', persianLabel: 'مرکز آزمون‌های دوره‌ای', route: '/assessment', icon: 'rule' },
        { id: 'm_analytics', label: 'Progress Analytics', persianLabel: 'تحلیل پیشرفت', route: '/analytics', icon: 'insights' },
      ]
    },
    {
      title: 'SYSTEM & KNOWLEDGE',
      persianTitle: 'سیستم و پایگاه دانش',
      items: [
        { id: 'm_lib', label: 'Knowledge Library', persianLabel: 'پایگاه دانش (راه علیرضا)', route: '/library', icon: 'auto_stories' },
        { id: 'm_prompt', label: 'AI Prompt Studio', persianLabel: 'استودیو پرامپت هوش مصنوعی', route: '/prompt-studio', icon: 'terminal' },
        { id: 'm_set', label: 'Backup & Settings', persianLabel: 'پشتیبان‌گیری و تنظیمات', route: '/settings', icon: 'settings' },
      ]
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isOnline.set(window.navigator.onLine);
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);

      // Register PWA service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.warn('SW registration failed:', err);
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
