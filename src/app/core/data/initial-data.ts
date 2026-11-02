import { VocabularyItem, ErrorRecord, KnowledgeDocument, PromptTemplate, LearnerProfile } from '../models/types';

export const INITIAL_LEARNER_PROFILE: LearnerProfile = {
  id: 'learner_ali_primary',
  name: 'Ali (مهندس علیرضا)',
  nativeLanguage: 'fa',
  targetLanguage: 'en',
  learningIntensity: 'intensive',
  dailyStudyMinutes: 30,
  immersionPreference: 'persian_scaffolded',
  interests: [
    'Artificial Intelligence',
    'Computer Engineering',
    'Robotics & Control Systems',
    'Programming & Algorithms',
    'Software Architecture & Scalability',
    'Scientific Research & Publications',
    'International Academic Communication',
    'Remote Engineering & Tech Leadership'
  ],
  diagnosticCompleted: false,
  overallCefr: 'Pre-A1',
  streakDays: 1,
  totalStudyMinutes: 0,
  skillMatrix: {
    reading: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    listening: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    writing: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    speaking: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    grammar: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    vocabulary: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] },
    pronunciation: { level: 'Pre-A1', score: 0, strengths: [], weaknesses: [] }
  }
};

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: 'vocab_1',
    word: 'latency',
    ipa: '/ˈleɪ.tən.si/',
    partOfSpeech: 'noun',
    persianMeaning: 'تاخیر زمانی، مدت زمان انتظار در انتقال داده',
    englishDefinition: 'The delay before a transfer of data begins following an instruction for its transfer.',
    exampleSentence: 'Optimizing the transformer inference pipeline reduced the end-to-end API latency to under 45 milliseconds.',
    contextTopic: 'System Architecture & Networking',
    collocations: ['low latency', 'network latency', 'latency bottleneck', 'reduce latency'],
    synonyms: ['delay', 'lag', 'turnaround time'],
    antonyms: ['instantaneity', 'promptness'],
    commonPersianMistake: 'Don\'t pronounce as "lat-en-cy" with short "a"; the first syllable is an /eɪ/ diphthong (lay-ten-see).',
    cefrLevel: 'B2',
    repetitions: 1,
    interval: 1,
    easeFactor: 2.5,
    confidenceScore: 50,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'reviewing',
    tags: ['Architecture', 'Networking', 'AI']
  },
  {
    id: 'vocab_2',
    word: 'stochastic',
    ipa: '/stəˈkæs.tɪk/',
    partOfSpeech: 'adjective',
    persianMeaning: 'تصادفی، احتمالاتی، وابسته به شانس و متغیر تصادفی',
    englishDefinition: 'Having a random probability distribution or pattern that may be analyzed statistically but may not be predicted precisely.',
    exampleSentence: 'Stochastic Gradient Descent (SGD) introduces noise into the optimization landscape, preventing the neural network from getting trapped in shallow local minima.',
    contextTopic: 'Artificial Intelligence & Math',
    collocations: ['stochastic process', 'stochastic gradient descent', 'stochastic behavior'],
    synonyms: ['probabilistic', 'random', 'aleatory'],
    antonyms: ['deterministic', 'predictable'],
    commonPersianMistake: 'Avoid inserting an initial vowel: say /stə-/ not "es-toh-castic". The "ch" is pronounced /k/, not /tʃ/.',
    cefrLevel: 'C1',
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    confidenceScore: 30,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'learning',
    tags: ['Machine Learning', 'Mathematics']
  },
  {
    id: 'vocab_3',
    word: 'throughput',
    ipa: '/ˈθruː.pʊt/',
    partOfSpeech: 'noun',
    persianMeaning: 'نرخ پردازش داده در واحد زمان، ظرفیت خروجی عملیاتی',
    englishDefinition: 'The amount of material or data that passes through a system or process per unit of time.',
    exampleSentence: 'By decoupling message ingestion with a distributed Kafka queue, our cluster achieved a peak throughput of one million requests per second.',
    contextTopic: 'Distributed Systems',
    collocations: ['high throughput', 'system throughput', 'maximize throughput', 'data throughput'],
    synonyms: ['output rate', 'processing capacity', 'bandwidth'],
    antonyms: ['bottleneck'],
    commonPersianMistake: 'Persian speakers often substitute /s/ or /t/ for the voiceless "th" /θ/. Place the tongue tip gently between teeth.',
    cefrLevel: 'B2',
    repetitions: 1,
    interval: 2,
    easeFactor: 2.6,
    confidenceScore: 65,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'reviewing',
    tags: ['Systems', 'Distributed']
  },
  {
    id: 'vocab_4',
    word: 'ablation study',
    ipa: '/æbˈleɪ.ʃən ˈstʌd.i/',
    partOfSpeech: 'phrase',
    persianMeaning: 'مطالعه حذفی (بررسی تاثیر تک‌تک اجزای یک مدل بر عملکرد نهایی)',
    englishDefinition: 'An experiment in which individual components or features of a machine learning model are systematically removed to evaluate their impact on performance.',
    exampleSentence: 'Our ablation study demonstrates that removing the multi-head self-attention layer degrades translation quality by 4.2 BLEU points.',
    contextTopic: 'Scientific Research & AI',
    collocations: ['conduct an ablation study', 'ablation analysis', 'ablation experiment'],
    synonyms: ['component isolation analysis', 'sensitivity analysis'],
    antonyms: [],
    commonPersianMistake: 'Stress is on the second syllable of ablation: ab-LA-tion.',
    cefrLevel: 'C1',
    repetitions: 2,
    interval: 3,
    easeFactor: 2.5,
    confidenceScore: 70,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'reviewing',
    tags: ['Research', 'AI', 'Methodology']
  },
  {
    id: 'vocab_5',
    word: 'idempotent',
    ipa: '/ˌaɪ.dəmˈpoʊ.tənt/',
    partOfSpeech: 'adjective',
    persianMeaning: 'آیدمپوتنت (عملیاتی که تکرار چندباره آن همان نتیجه یک‌بار اجرا را تولید می‌کند)',
    englishDefinition: 'Denoting an operation which can be applied multiple times without changing the result beyond the initial application.',
    exampleSentence: 'In RESTful architecture, HTTP PUT and DELETE operations must be idempotent to safeguard against duplicate network retries.',
    contextTopic: 'Software Architecture & APIs',
    collocations: ['idempotent operation', 'idempotent API', 'idempotency key'],
    synonyms: ['invariant under repetition'],
    antonyms: ['non-idempotent'],
    commonPersianMistake: 'The initial syllable is /aɪ/ (like "eye"), and primary stress is on "po" (eye-dem-PO-tent).',
    cefrLevel: 'C1',
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    confidenceScore: 25,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'learning',
    tags: ['Architecture', 'APIs']
  },
  {
    id: 'vocab_6',
    word: 'empirically',
    ipa: '/ɪmˈpɪr.ɪ.kli/',
    partOfSpeech: 'adverb',
    persianMeaning: 'به صورت تجربی و مشاهده‌ای (نه صرفا فرضی یا تئوری)',
    englishDefinition: 'By means of observation or experience rather than theory or pure logic.',
    exampleSentence: 'The proposed reinforcement learning policy was empirically validated across thirty distinct simulated robotics benchmarks.',
    contextTopic: 'Academic Research',
    collocations: ['empirically verified', 'empirically validated', 'show empirically'],
    synonyms: ['experimentally', 'pragmatically', 'observationally'],
    antonyms: ['theoretically', 'hypothetically'],
    commonPersianMistake: 'Stress is on the second syllable: em-PIR-i-cally. Do not stress the "em".',
    cefrLevel: 'B2',
    repetitions: 1,
    interval: 1,
    easeFactor: 2.5,
    confidenceScore: 60,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'reviewing',
    tags: ['Academic', 'Research']
  },
  {
    id: 'vocab_7',
    word: 'mitigate',
    ipa: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    persianMeaning: 'کاهش دادن، تعدیل کردن، تخفیف دادن اثر منفی یا خطر',
    englishDefinition: 'Make (something bad) less severe, serious, or painful.',
    exampleSentence: 'To mitigate race conditions during database writes, we introduced distributed locking using Redis Redlock.',
    contextTopic: 'Engineering & Risk',
    collocations: ['mitigate the risk', 'mitigate bottlenecks', 'mitigate errors'],
    synonyms: ['alleviate', 'attenuate', 'diminish', 'curb'],
    antonyms: ['exacerbate', 'aggravate'],
    commonPersianMistake: 'Do not confuse with "alleviate" in medical contexts only; "mitigate" is standard in technical post-mortems.',
    cefrLevel: 'B2',
    repetitions: 2,
    interval: 4,
    easeFactor: 2.7,
    confidenceScore: 80,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'mastered',
    tags: ['Engineering', 'Academic']
  },
  {
    id: 'vocab_8',
    word: 'hedging',
    ipa: '/ˈhedʒ.ɪŋ/',
    partOfSpeech: 'noun',
    persianMeaning: 'احتیاط زبانی در نگارش علمی (پرهیز از ادعای قطعی بدون مدرک با کلماتی نظیر suggests, tends to)',
    englishDefinition: 'The use of cautious language in academic writing to express degrees of certainty or avoid sweeping over-generalizations.',
    exampleSentence: 'Academic peer reviewers expect effective hedging: write "the experimental results suggest" rather than "the results prove unequivocally".',
    contextTopic: 'Academic Writing & Publishing',
    collocations: ['hedging language', 'hedging devices', 'employ hedging'],
    synonyms: ['epistemic qualification', 'cautious discourse'],
    antonyms: ['hyperbole', 'overstatement'],
    commonPersianMistake: 'Iranian students often write absolute statements ("This proves that...") which causes paper rejections; use hedging ("This tends to indicate that...").',
    cefrLevel: 'C1',
    repetitions: 1,
    interval: 2,
    easeFactor: 2.5,
    confidenceScore: 55,
    nextReviewDate: new Date().toISOString(),
    masteryStatus: 'reviewing',
    tags: ['Academic Writing', 'Style']
  }
];

export const INITIAL_ERRORS: ErrorRecord[] = [
  {
    id: 'err_1',
    category: 'l1_interference',
    skill: 'grammar',
    originalText: 'I am agree with this architectural decision.',
    correctedText: 'I agree with this architectural decision.',
    persianExplanation: 'در زبان فارسی می‌گوییم «من موافقم» (با فعل ربطی است/هستم)، به همین دلیل فارسی‌زبانان به اشتباه در انگلیسی "I am agree" می‌نویسند. اما "agree" در انگلیسی خودش یک فعل اصلی (Active Verb) است و هرگز نیازی به "am" ندارد.',
    englishExplanation: 'In English, "agree" is a main verb, not an adjective. You should say "I agree" or "I do not agree", never "I am agree".',
    examples: [
      'Incorrect: We are agree on the deployment timeline.',
      'Correct: We agree on the deployment timeline.',
      'Incorrect: Does everyone is agree with the API schema?',
      'Correct: Does everyone agree with the API schema?'
    ],
    drillQuestion: 'Choose the grammatically correct sentence:',
    drillOptions: [
      'I am completely agree with the reviewer’s comment.',
      'I completely agree with the reviewer’s comment.',
      'I have agree with the reviewer’s comment.',
      'I am in agree with the reviewer’s comment.'
    ],
    drillAnswer: 'I completely agree with the reviewer’s comment.',
    status: 'active',
    occurrences: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'err_2',
    category: 'unnatural_expression',
    skill: 'writing',
    originalText: 'According to my opinion, transformer models are superior.',
    correctedText: 'In my opinion, transformer models are superior. / From my perspective, ...',
    persianExplanation: 'عبارت "According to my opinion" در انگلیسی یک خطای فاحش و گرده‌برداری از فارسی («طبق نظر من») است. در انگلیسی واژه "According to" فقط برای شخص ثالث، منبع خارجی یا مقاله دیگر به کار می‌رود (مثلا: According to Hinton et al.). برای نظر شخصی خودتان همیشه بگویید: "In my opinion" یا "From my perspective" یا "I believe that...".',
    englishExplanation: '"According to" must be used with third-party sources (e.g. "According to the documentation"). Never use it with yourself. Use "In my opinion" or "From my standpoint".',
    examples: [
      'Incorrect: According to my opinion, Python is slower than Go.',
      'Correct: In my opinion, Python is slower than Go.',
      'Correct usage of according to: According to the IEEE benchmark, Go achieves 4x concurrency.'
    ],
    drillQuestion: 'Which sentence correctly expresses personal scientific opinion?',
    drillOptions: [
      'According to my opinion, this loss function will diverge.',
      'According to myself, this loss function will diverge.',
      'In my opinion, this loss function will diverge.',
      'As according to me, this loss function will diverge.'
    ],
    drillAnswer: 'In my opinion, this loss function will diverge.',
    status: 'active',
    occurrences: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'err_3',
    category: 'word_choice',
    skill: 'vocabulary',
    originalText: 'We carried out several researches on deep reinforcement learning.',
    correctedText: 'We carried out several research studies / extensive research on deep reinforcement learning.',
    persianExplanation: 'کلمه "research" در انگلیسی یک اسم غیرقابل شمارش (Uncountable) است و هرگز نباید با "s" جمع بسته شود (researches غلط است!). اگر می‌خواهید به چند مورد اشاره کنید، بگویید "research studies" یا "pieces of research" یا از صفت "extensive research" استفاده کنید.',
    englishExplanation: '"Research" is strictly uncountable in academic English. Do not add an "s". Use "studies", "papers", or "investigations" if you need countable units.',
    examples: [
      'Incorrect: These researches show that CUDA acceleration is vital.',
      'Correct: These studies show that CUDA acceleration is vital.',
      'Correct: This research demonstrates the validity of the hypothesis.'
    ],
    drillQuestion: 'Identify the academically correct sentence:',
    drillOptions: [
      'Dr. Yazdi published three distinct researches this year.',
      'Dr. Yazdi conducted extensive research this year.',
      'Dr. Yazdi collected many researches on autonomous robots.',
      'All the researches were peer-reviewed.'
    ],
    drillAnswer: 'Dr. Yazdi conducted extensive research this year.',
    status: 'active',
    occurrences: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'err_4',
    category: 'pronunciation',
    skill: 'pronunciation',
    originalText: 'Pronouncing /w/ as /v/ (e.g. "word" sounds like "vord", "weight" sounds like "veight")',
    correctedText: 'Round your lips tightly into an "O" shape for /w/, without touching your teeth to your bottom lip.',
    persianExplanation: 'زبان فارسی صدای /w/ (واو انگلیسی) ندارد و به جای آن از /v/ (که در آن دندان‌های بالا روی لب پایین قرار می‌گیرد) استفاده می‌کند. برای تلفظ درست /w/ باید لب‌ها را کاملا گرد کنید (مانند وقتی که سوت می‌زنید) و هیچ تماسی بین دندان و لب نباید رخ دهد.',
    englishExplanation: 'For the English /w/, round your lips without touching your teeth. For /v/, place upper teeth on the inner lower lip.',
    examples: [
      'Minimal pair drill: "vest" /vest/ vs "west" /west/',
      'Minimal pair drill: "vine" /vaɪn/ vs "wine" /waɪn/',
      'Sentence: "We will write well-structured web workers."'
    ],
    drillQuestion: 'In which word must the lips be rounded without teeth touching the lip?',
    drillOptions: ['variable', 'vector', 'weight', 'volatile'],
    drillAnswer: 'weight',
    status: 'active',
    occurrences: 3,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc_rahe_alireza_philosophy',
    title: 'آموزه‌های بنیادین پلتفرم «راه علیرضا» (Rahe Alireza Knowledge Source)',
    source: 'https://alirezasyazdi941-hash.github.io/Rahe_alireza/',
    originalUrl: 'https://alirezasyazdi941-hash.github.io/Rahe_alireza/',
    topic: 'Educational Philosophy & Self-Directed Mastery',
    persianSummary: 'اصول یادگیری عمیق، نظم فولادین، پرهیز از سطحی‌نگری و تبدیل زبان انگلیسی به ابزار تولید علم و ارتباط آکادمیک بین‌المللی.',
    content: `
### اصول آموزشی استخراج‌شده از منبع «راه علیرضا»:
1. **تسلط فعالانه بر زبان علمی**: زبان انگلیسی نباید به عنوان یک درس تئوری دیده شود، بلکه ابزار بی‌واسطه تفکر مهندسی، طراحی معماری سیستم و انتشار مقالات در مرزهای دانش است.
2. **سنجش مداوم و بدون تعارف (Evidence-Based)**: نمره واقعی خود را بدون توهم خودفریبی بپذیرید. تا زمانی که ساختارهای زبان در عمل (Writing & Speaking) بدون اشتباه به کار نروند، پیشرفت واقعی رخ نداده است.
3. **تکرار فاصله‌دار و هوش خطا (Error Intelligence)**: خطاهایی که از ساختار زبان مادری (فارسی) به انگلیسی سرایت می‌کنند باید ثبت، کالبدشکافی و با تمرینات مکرر ریشه‌کن شوند.
4. **شخصی‌سازی حول علایق کاربر**: تمام مثال‌ها، درک مطلب‌ها و اصطلاحات باید مستقیماً با هوش مصنوعی، رباتیک، مهندسی کامپیوتر و پژوهش‌های بین‌المللی گره بخورند.
    `,
    verificationStatus: 'verified_original',
    createdAt: '2026-11-01T00:00:00.000Z',
    tags: ['Philosophy', 'Rahe Alireza', 'Methodology']
  },
  {
    id: 'doc_academic_abstract_guide',
    title: 'IEEE & ACM Research Abstract Standard (IMRAD Architecture)',
    source: 'Academic Writing Lab & Ali English Curriculum',
    topic: 'Academic Publishing & Research Writing',
    persianSummary: 'فرمول طلایی چکیده‌نویسی ۵ بخشی برای مقالات ژورنال و کنفرانس‌های طراز اول بین‌المللی.',
    content: `
### The 5-Sentence Micro-Architecture for Engineering Abstracts:
1. **Background & Motivation (B)**: State the broader problem and why it matters to computer science / AI.
   * *Formula*: "Recent advancements in [Domain] have demonstrated significant potential; however, [Critical Limitation] remains an open challenge."
2. **Problem Statement & Gap (P)**: Pinpoint the exact technical limitation this paper addresses.
   * *Formula*: "Existing paradigms suffer from high latency and prohibitive memory overheads when scaling to [Specific Context]."
3. **Proposed Method / Architecture (M)**: Name and describe your system or algorithm with active academic verbs.
   * *Formula*: "In this work, we propose [SystemName], a lightweight framework that leverages [Novel Mechanism] to achieve [Primary Function]."
4. **Key Experimental Results (R)**: Provide quantitative, empirical findings with exact metrics.
   * *Formula*: "Empirical evaluations on benchmark datasets demonstrate that our method reduces inference latency by 38% while maintaining a 94.2% F1-score."
5. **Significance & Impact (S)**: Conclude with the broader implication for the scientific community.
   * *Formula*: "These results substantiate the feasibility of deploying real-time autonomous perception models on resource-constrained edge devices."
    `,
    verificationStatus: 'verified_original',
    createdAt: '2026-11-01T00:00:00.000Z',
    tags: ['Academic Writing', 'IMRAD', 'Abstracts']
  }
];

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'prompt_academic_abstract_review',
    title: 'Research Abstract Socratic Reviewer',
    persianDescription: 'پرامپت ارزیابی چکیده مقاله علمی با معیارهای داوران کنفرانس‌های IEEE/NeurIPS و ارائه نسخه بازنویسی‌شده با سبک آکادمیک سطح بالا.',
    targetSkill: 'writing',
    aiModelSuggested: 'Universal',
    systemPrompt: `You are an elite academic peer reviewer and English writing coach specialized in Computer Science and Artificial Intelligence. You evaluate technical English submissions with rigorous attention to CEFR C1/C2 standards, concise IMRAD progression, scientific hedging, and lexical density. You speak clear English and offer explanations in Persian where necessary to clarify linguistic nuances for Iranian researchers.`,
    userPromptTemplate: `Please evaluate the following research paper abstract written by an Iranian computer engineering researcher.

Target Conference: [INSERT CONFERENCE, e.g., NeurIPS, IEEE Trans on Robotics, ICSE]
Field: [INSERT TOPIC, e.g., Distributed Transformers, Autonomous Navigation]

Abstract to Review:
"""
[PASTE YOUR DRAFT ABSTRACT HERE]
"""

Please provide:
1. CEFR Level assessment of the writing (Vocabulary, Coherence, Academic Tone).
2. Line-by-line identification of Persian L1 interference, non-standard idioms, or missing hedging.
3. Persian explanation of why specific changes are necessary.
4. A refined, polished high-impact rewrite that sounds native to an IEEE/ACM senior editor.
5. 3 targeted vocabulary upgrades suitable for top-tier publication.`,
    exampleVariables: {
      'CONFERENCE': 'IEEE International Conference on Robotics and Automation (ICRA)',
      'TOPIC': 'Path planning for quadrotors using deep reinforcement learning'
    },
    expectedOutputFormat: 'Structured JSON or Markdown with Rubric Score, Critique, Persian Notes, and Polished Version.'
  },
  {
    id: 'prompt_technical_dialogue_simulator',
    title: 'Software Architecture Debate Partner',
    persianDescription: 'شبیه‌ساز جلسه مباحثه فنی و معماری سیستم به همراه پرسش‌های چالشی و نقد اصطلاحات غیرطبیعی.',
    targetSkill: 'speaking',
    aiModelSuggested: 'Universal',
    systemPrompt: `You are a Principal Software Architect at an international engineering company. You are conducting an interactive technical design review with the user. You challenge trade-offs, ask deep architectural questions, and analyze their English communication for clarity, confidence, and natural engineering idioms.`,
    userPromptTemplate: `I want to simulate an architectural design review meeting. 

System Topic: [INSERT TOPIC, e.g., Designing a low-latency event-driven payment ledger]
My Proposed Approach: [INSERT BRIEF DESIGN, e.g., Event Sourcing with Apache Kafka and PostgreSQL]

Please:
1. Act as the Principal Architect and challenge one specific aspect of my architecture (e.g. data consistency during partitions).
2. Ask me a probing question and wait for my spoken or written response.
3. At the end of each turn, analyze my English reply: point out any unnatural textbook phrases and suggest how a senior Silicon Valley engineer would express it naturally.`,
    exampleVariables: {
      'TOPIC': 'Real-time telemetry streaming for a fleet of autonomous rovers',
      'DESIGN': 'MQTT gateway bridging into a time-series database with edge filtering'
    },
    expectedOutputFormat: 'Interactive turn-by-turn dialogue with architectural critique and English phrasing tips.'
  },
  {
    id: 'prompt_persian_l1_drill_generator',
    title: 'Persian-English L1 Interference Drill Engine',
    persianDescription: 'تولید تمرینات هدفمند برای رفع تداخل زبان مادری (فارسی به انگلیسی) در ساختار جملات، حروف اضافه و افعال.',
    targetSkill: 'grammar',
    aiModelSuggested: 'Universal',
    systemPrompt: `You are a specialist in Contrastive Linguistics focusing on Persian (Farsi) and English syntax. You deeply understand common Persian interference patterns such as:
- Verb "to be" over-use (e.g., "I am agree")
- Inappropriate preposition mapping (e.g., "interested for" instead of "interested in")
- Literal translation of Persian idioms (e.g., "according to my opinion", "open account on someone")
- Misuse of uncountable nouns (e.g., "researches", "softwares")
- Pronunciation transfer (/w/ vs /v/, initial /e/ cluster insertion)`,
    userPromptTemplate: `Generate a targeted 5-question multiple choice and translation drill for an Iranian AI researcher who is struggling with:
Focus Area: [INSERT FOCUS, e.g., Prepositions in Technical Writing / Hedging / Active vs Stative Verbs]

For each question:
1. Provide the question in English.
2. Give 4 plausible options (including the common Persian translation trap).
3. State the correct answer.
4. Explain in Persian why the Persian transfer trap is incorrect and how native English differs.`,
    exampleVariables: {
      'FOCUS': 'Prepositions following technical verbs (investigate, discuss, emphasize, consist)'
    },
    expectedOutputFormat: 'Numbered drill questions with options, answers, and comprehensive Persian linguistic explanations.'
  }
];
