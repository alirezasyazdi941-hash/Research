import { CefrLevel } from '../models/types';

export interface CurriculumLevel {
  id: string;
  cefr: CefrLevel;
  name: string;
  persianTitle: string;
  description: string;
  persianDescription: string;
  objectives: string[];
  grammarSyllabus: string[];
  vocabularySyllabus: string[];
  listeningSyllabus: string[];
  speakingActivities: string[];
  readingMaterials: string[];
  writingAssignments: string[];
  pronunciationFocus: string[];
  completionCriteria: string[];
  technicalFocus: string[];
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 'lvl_foundation',
    cefr: 'Pre-A1',
    name: 'Foundation Level',
    persianTitle: 'سطح پایه و بنیادین',
    description: 'Establish foundational phonics, core syntax, numbers, engineering nomenclature, and basic sentence structures.',
    persianDescription: 'ایجاد شالوده زبانی، آواشناسی اصولی، ساختارهای پایه فاعلی-فعلی، و الفبای واژگان تخصصی مهندسی.',
    objectives: [
      'Master the International Phonetic Alphabet (IPA) fundamentals',
      'Construct simple declarative, negative, and interrogative sentences in Present Simple',
      'Recognize and pronounce basic hardware, computing, and laboratory terminology',
      'Understand simple spoken instructions and technical prompts'
    ],
    grammarSyllabus: [
      'Subject Pronouns and Verb "to be"',
      'Present Simple for universal facts and algorithmic steps',
      'Basic prepositions of place and time (in, on, at, to)',
      'Singular and plural nouns with regular/irregular technical terms (datum/data)'
    ],
    vocabularySyllabus: [
      'Numbers, metric units, CPU/RAM units (megabytes, gigahertz)',
      'Basic computing components (server, client, network, memory)',
      'High-frequency academic verbs (contain, define, execute, process)'
    ],
    listeningSyllabus: [
      'Slow-speed audio dictations of simple technical commands',
      'Distinguishing vowel length and terminal consonants in isolation'
    ],
    speakingActivities: [
      'Basic personal and professional introductions',
      'Describing the components on a developer workbench'
    ],
    readingMaterials: [
      'Short hardware spec sheets and setup checklists',
      'Single-sentence technical definitions'
    ],
    writingAssignments: [
      'Writing simple 3-line setup logs',
      'Filling structured developer profile forms'
    ],
    pronunciationFocus: [
      'Correcting Persian epenthesis: avoiding vowel addition before "s" clusters (e.g., student not "es-tudent")',
      'The difference between /v/ and /w/'
    ],
    completionCriteria: [
      'Score ≥ 80% on Foundation Diagnostic Assessment',
      'Accurate pronunciation of 50 core engineering terms'
    ],
    technicalFocus: ['Basic IT', 'Computer Hardware', 'Introductory Electronics']
  },
  {
    id: 'lvl_elementary',
    cefr: 'A1',
    name: 'Elementary Level',
    persianTitle: 'سطح مقدماتی',
    description: 'Communicate in simple, routine tasks requiring a direct exchange of technical information.',
    persianDescription: 'توانایی تبادل اطلاعات در وظایف روتین مهندسی، شرح خطاها و نوشتن پیام‌های کوتاه کاری.',
    objectives: [
      'Describe software bugs and system behaviors using Past Simple & Present Continuous',
      'Ask clarifying technical questions during remote meetings',
      'Draft concise Slack/Discord status updates for development teams'
    ],
    grammarSyllabus: [
      'Past Simple: Regular and irregular verbs in debugging contexts',
      'Present Continuous vs Present Simple for transient vs permanent states',
      'Modals of ability and permission (can, could, may)',
      'Basic comparative and superlative adjectives (faster, more efficient, latency)'
    ],
    vocabularySyllabus: [
      'Git workflows: commit, branch, merge, pull request, conflict',
      'Error types: timeout, syntax error, null pointer, exception',
      'Everyday development routines and agile standup phrases'
    ],
    listeningSyllabus: [
      'Simulated developer daily standup audio (60 seconds, 0.85x speed)',
      'Identifying bug reports spoken by non-native and native speakers'
    ],
    speakingActivities: [
      'Giving a 90-second standup report: yesterday, today, blockers',
      'Explaining why a code block failed to compile'
    ],
    readingMaterials: [
      'Simple README.md files and GitHub issue descriptions',
      'Basic documentation for CLI commands'
    ],
    writingAssignments: [
      'Writing an issue ticket with Steps to Reproduce and Expected Behavior',
      'Short email to project maintainer'
    ],
    pronunciationFocus: [
      'Past tense endings: /t/, /d/, and /ɪd/ in verbs like "compiled", "crashed", "tested"',
      'Voiced vs voiceless "th" (/θ/ vs /ð/)'
    ],
    completionCriteria: [
      'Complete 5 audio standup simulations with acceptable fluency',
      'Write a flawless standard GitHub issue report'
    ],
    technicalFocus: ['Version Control', 'Command Line', 'Bug Reporting']
  },
  {
    id: 'lvl_pre_intermediate',
    cefr: 'A2',
    name: 'Pre-Intermediate Level',
    persianTitle: 'سطح پیش‌متوسط',
    description: 'Understand the main points of clear technical input on familiar engineering topics.',
    persianDescription: 'درک موضوعات کلیدی متون فنی، ارائه توضیحات ساختاریافته در مورد جریان کار و الگوریتم‌ها.',
    objectives: [
      'Express technical causality using conditional clauses (if/then triggers)',
      'Summarize code pull requests and engineering decisions',
      'Participate actively in technical sprint retrospectives'
    ],
    grammarSyllabus: [
      'Zero and First Conditionals for code execution and failure modes',
      'Present Perfect Simple for completed deployments with present relevance',
      'Passive voice introduction for scientific reporting',
      'Adverbs of frequency and certainty (typically, rarely, definitely)'
    ],
    vocabularySyllabus: [
      'Database fundamentals: relational, key-value, schema, query, latency',
      'Network protocols: HTTP, WebSockets, payload, encryption, handshake',
      'Transition connectors: furthermore, therefore, consequently, however'
    ],
    listeningSyllabus: [
      'Engineering sprint demos and feature walkthroughs',
      'Sentence-by-sentence dictation of API endpoint descriptions'
    ],
    speakingActivities: [
      'Explaining an algorithm flowchart step by step',
      'Pair-programming simulation dialogue'
    ],
    readingMaterials: [
      'API documentation (REST endpoints, JSON schema specifications)',
      'Technical blog tutorials on Medium or Dev.to'
    ],
    writingAssignments: [
      'Documenting a software module API with parameter descriptions',
      'Writing a 200-word sprint retrospective summary'
    ],
    pronunciationFocus: [
      'Word stress in 3-syllable technical terms (paRAmeter, algoRIthm, conFIGure)',
      'Sentence rhythm and unstressed functional words'
    ],
    completionCriteria: [
      'Score ≥ 75% on technical reading comprehension test',
      'Active retention of 150 B1-targeted engineering terms in SM-2 engine'
    ],
    technicalFocus: ['Data Structures', 'REST APIs', 'Software Lifecycles']
  },
  {
    id: 'lvl_intermediate',
    cefr: 'B1',
    name: 'Intermediate Level',
    persianTitle: 'سطح متوسط',
    description: 'Handle most communication situations arising during international remote work and academic collaboration.',
    persianDescription: 'تسلط بر تبادلات کاری در تیم‌های بین‌المللی ریموت، توانایی بحث پیرامون معماری نرم‌افزار و مطالعه مقالات ساده‌تر.',
    objectives: [
      'Debate trade-offs between architectural approaches (microservices vs monolith)',
      'Comprehend technical talks and conference presentations without subtitles',
      'Write structured technical emails with appropriate professional register'
    ],
    grammarSyllabus: [
      'Second and Third Conditionals for hypothetical scenarios and post-mortems',
      'Passive voice in scientific methodology ("The model was trained on...")',
      'Relative clauses (defining vs non-defining) for precise technical specifications',
      'Modal verbs of deduction (must be, cannot be, might have failed)'
    ],
    vocabularySyllabus: [
      'System design: scalability, throughput, fault tolerance, caching, idempotency',
      'Machine Learning basics: loss function, gradient descent, overfitting, weights',
      'Academic discussion phrases for agreeing, disagreeing, and qualifying claims'
    ],
    listeningSyllabus: [
      'Tech talks (PyCon, GOTO Conferences, TEDx technical topics)',
      'Identifying speaker nuance, hesitation, and stance in audio podcasts'
    ],
    speakingActivities: [
      'Conducting a 5-minute system architecture presentation',
      'Answering challenging technical interview questions (STAR method)'
    ],
    readingMaterials: [
      'Engineering post-mortems from major tech companies (AWS, Cloudflare)',
      'Introductory scientific survey papers and documentation'
    ],
    writingAssignments: [
      'Writing a Post-Mortem Incident Report (Root cause, timeline, mitigation)',
      'Composing an email requesting research dataset access from a professor'
    ],
    pronunciationFocus: [
      'Connected speech: elision, linking (r-linking, consonant-to-vowel)',
      'Intonation patterns in open vs closed questions in technical meetings'
    ],
    completionCriteria: [
      'Deliver a 5-minute recorded technical speech evaluated at B1+ level',
      'Grammar accuracy ≥ 85% in conditional and passive drills'
    ],
    technicalFocus: ['System Architecture', 'Cloud Infrastructure', 'Machine Learning Foundations']
  },
  {
    id: 'lvl_upper_intermediate',
    cefr: 'B2',
    name: 'Upper-Intermediate Level',
    persianTitle: 'سطح فوق‌متوسط',
    description: 'Interact with native speakers with a high degree of fluency and produce clear, detailed academic texts.',
    persianDescription: 'ارتباط روان و پیوسته با متخصصان بین‌المللی، نگارش متون آکادمیک و درک مقالات پژوهشی کنفرانس‌های معتبر.',
    objectives: [
      'Read and critically analyze IEEE, ACM, and NeurIPS research papers',
      'Defend engineering design choices under scrutiny in peer reviews',
      'Employ scientific hedging (e.g., "suggests", "tends to indicate", "purports")'
    ],
    grammarSyllabus: [
      'Nominalization: converting verbs into nouns for dense academic prose',
      'Inversion for emphasis ("Rarely does this architecture achieve...")',
      'Participle clauses for concise scientific descriptions ("Having evaluated the latency...")',
      'Hedging and epistemic modality in research writing'
    ],
    vocabularySyllabus: [
      'Advanced AI/Robotics vocabulary: transformer attention, latency bounds, kinematics, stochasticity',
      'Academic Collocations List (e.g., "conduct empirical validation", "exhibit significant variance")',
      'Rhetorical markers for academic literature reviews'
    ],
    listeningSyllabus: [
      'Fast-paced panel discussions on AI ethics, safety, and quantum computing',
      'Academic defense Q&A sessions with rapid cross-examination'
    ],
    speakingActivities: [
      '3-minute thesis presentation (academic elevator pitch)',
      'Live code review defense against critical counter-arguments'
    ],
    readingMaterials: [
      'Landmark papers: "Attention Is All You Need", "Raft Consensus", "MapReduce"',
      'Patent applications and formal RFC standards'
    ],
    writingAssignments: [
      'Writing an academic abstract adhering to the IMRAD format (250 words)',
      'Writing a formal rebuttal letter to academic conference reviewers'
    ],
    pronunciationFocus: [
      'Contrastive sentence stress to emphasize experimental distinctions',
      'Eliminating residual L1 Persian pitch accent on technical nouns'
    ],
    completionCriteria: [
      'Author a verified 250-word research abstract scoring ≥ 80% on academic rubric',
      'Complete diagnostic re-assessment reaching B2 threshold in all 7 skills'
    ],
    technicalFocus: ['Deep Learning', 'Distributed Algorithms', 'Academic Paper Structure']
  },
  {
    id: 'lvl_advanced',
    cefr: 'C1',
    name: 'Advanced Level',
    persianTitle: 'سطح پیشرفته',
    description: 'Express ideas fluently and spontaneously, using English flexibly for academic, professional, and research purposes.',
    persianDescription: 'تسلط کامل بر نگارش پژوهشی، سخنرانی در کنفرانس‌های بین‌المللی، و تفهیم مفاهیم بسیار پیچیده بدون مکث.',
    objectives: [
      'Deliver conference keynote-grade research presentations',
      'Author full research manuscripts with native-level stylistic nuance',
      'Formulate elegant philosophical and ethical arguments concerning autonomous systems'
    ],
    grammarSyllabus: [
      'Cleft sentences for rhetorical focus ("What the empirical data demonstrates is...")',
      'Subjunctive mood in formal academic resolutions and hypotheses',
      'Complex mixed conditionals in counterfactual scientific modeling',
      'Discourse markers for multi-layered academic debates'
    ],
    vocabularySyllabus: [
      'Epistemic and meta-theoretical lexicon: heuristic, ontological, paradigm, postulate, caveat',
      'High-register academic idioms and Latinate scientific expressions',
      'Nuanced nuance words: viable, feasible, tenable, robust, orthogonal'
    ],
    listeningSyllabus: [
      'Challenging audio with diverse native accents (Scottish, Australian, Indian, Midwest US)',
      'Nuanced scientific debates with sarcasm, skepticism, and high information density'
    ],
    speakingActivities: [
      'Impromptu defense of a research methodology against tough counter-examples',
      'Hosting an international engineering podcast or panel'
    ],
    readingMaterials: [
      'Frontier research papers in nature/science and top-tier conference proceedings',
      'Complex legal and regulatory frameworks for Artificial Intelligence'
    ],
    writingAssignments: [
      'Full Literature Review chapter with thematic synthesis of 10 papers',
      'Grant proposal or venture capital technical executive summary'
    ],
    pronunciationFocus: [
      'Subtle expressive intonation: nuance, irony, cautious endorsement',
      'Mastering cadence and rhetorical pauses in public keynote delivery'
    ],
    completionCriteria: [
      'C1 Assessment pass mark ≥ 85% across all 7 evaluated competencies',
      'Demonstrated mastery of 1,200 advanced academic and research terms'
    ],
    technicalFocus: ['Original Research', 'Frontier AI & Robotics', 'Conference Keynotes']
  },
  {
    id: 'lvl_proficiency',
    cefr: 'C2',
    name: 'Proficiency Mastery',
    persianTitle: 'سطح تسلط بی‌نقص (استادی)',
    description: 'Understand with ease virtually everything heard or read, reconstructing arguments in coherent presentations.',
    persianDescription: 'سطح تسلط زبان‌شناختی در رده محققان طراز اول بین‌المللی، نویسندگان مقالات مرجع و رهبران علمی دنیا.',
    objectives: [
      'Effortless precision in technical, philosophical, and diplomatic English discourse',
      'Flawless stylistic versatility across any technical domain'
    ],
    grammarSyllabus: [
      'Full stylistic command of literary and academic syntax',
      'Mastery of ellipsis, fronting, and absolute constructions'
    ],
    vocabularySyllabus: [
      'Comprehensive command of domain-specialized terminology, archaic roots, and neologisms',
      'Idiomatic fluency indistinguishable from seasoned native academic researchers'
    ],
    listeningSyllabus: ['Any high-density lecture, colloquium, or spontaneous technical colloquy'],
    speakingActivities: ['International keynote speaker address', 'Ph.D. defense committee chairmanship'],
    readingMaterials: ['Foundational treatises, philosophical critiques, landmark historical papers'],
    writingAssignments: ['Comprehensive scientific book chapter or definitive survey monograph'],
    pronunciationFocus: ['Accent neutrality with effortless phonetic clarity and authoritative prosody'],
    completionCriteria: ['Complete Mastery Portfolio certification and zero recurring systematic errors'],
    technicalFocus: ['Pioneering Science', 'Global Thought Leadership', 'Monograph Publishing']
  }
];
