import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'command-center',
    pathMatch: 'full'
  },
  {
    path: 'command-center',
    loadComponent: () => import('./modules/command-center').then(m => m.CommandCenter)
  },
  {
    path: 'profile',
    loadComponent: () => import('./modules/profile').then(m => m.LearnerProfileComponent)
  },
  {
    path: 'placement-test',
    loadComponent: () => import('./modules/placement-test').then(m => m.PlacementTest)
  },
  {
    path: 'teacher',
    loadComponent: () => import('./modules/personal-teacher').then(m => m.PersonalTeacher)
  },
  {
    path: 'conversation',
    loadComponent: () => import('./modules/conversation-lab').then(m => m.ConversationLab)
  },
  {
    path: 'speaking',
    loadComponent: () => import('./modules/speaking-lab').then(m => m.SpeakingLab)
  },
  {
    path: 'listening',
    loadComponent: () => import('./modules/listening-lab').then(m => m.ListeningLab)
  },
  {
    path: 'pronunciation',
    loadComponent: () => import('./modules/pronunciation-lab').then(m => m.PronunciationLab)
  },
  {
    path: 'reading',
    loadComponent: () => import('./modules/reading-lab').then(m => m.ReadingLab)
  },
  {
    path: 'writing',
    loadComponent: () => import('./modules/writing-lab').then(m => m.WritingLab)
  },
  {
    path: 'grammar',
    loadComponent: () => import('./modules/grammar-intelligence').then(m => m.GrammarIntelligence)
  },
  {
    path: 'vocabulary',
    loadComponent: () => import('./modules/vocabulary-intelligence').then(m => m.VocabularyIntelligence)
  },
  {
    path: 'errors',
    loadComponent: () => import('./modules/error-intelligence').then(m => m.ErrorIntelligence)
  },
  {
    path: 'academic',
    loadComponent: () => import('./modules/academic-english').then(m => m.AcademicEnglish)
  },
  {
    path: 'missions',
    loadComponent: () => import('./modules/daily-missions').then(m => m.DailyMissions)
  },
  {
    path: 'assessment',
    loadComponent: () => import('./modules/assessment-center').then(m => m.AssessmentCenter)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./modules/progress-analytics').then(m => m.ProgressAnalytics)
  },
  {
    path: 'library',
    loadComponent: () => import('./modules/knowledge-library').then(m => m.KnowledgeLibrary)
  },
  {
    path: 'prompt-studio',
    loadComponent: () => import('./modules/prompt-studio').then(m => m.PromptStudio)
  },
  {
    path: 'settings',
    loadComponent: () => import('./modules/backup-settings').then(m => m.BackupSettings)
  },
  {
    path: '**',
    redirectTo: 'command-center'
  }
];
