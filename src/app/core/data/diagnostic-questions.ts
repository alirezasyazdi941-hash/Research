import { LanguageSkill, CefrLevel } from '../models/types';

export interface DiagnosticQuestion {
  id: string;
  skill: LanguageSkill;
  level: CefrLevel;
  title: string;
  instructions: string;
  persianInstructions: string;
  content: string; // The stimulus, audio text, or reading passage
  audioScript?: string; // For listening skill synthesis
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  persianExplanation: string;
  type: 'multiple_choice' | 'free_writing' | 'speech_recording' | 'ipa_selection';
  rubricCriteria?: {
    criteriaName: string;
    description: string;
    weight: number;
  }[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // --- 1. READING ---
  {
    id: 'diag_read_1',
    skill: 'reading',
    level: 'B1',
    title: 'Distributed System Resiliency',
    instructions: 'Read the technical passage and select the correct logical inference.',
    persianInstructions: 'متن فنی زیر در مورد سیستم‌های توزیع‌شده را بخوانید و گزینه استنباطی صحیح را انتخاب کنید.',
    content: `In distributed databases, network partitions are an inevitable physical reality rather than an anomaly. According to the CAP theorem, a system subjected to an unexpected partition must choose between consistency—ensuring that every replica reflects the most up-to-date state—and availability, which guarantees that every operational node returns a non-error response, even if stale. Modern architectures mitigate this dichotomy through eventual consistency models and tunable quorum consensus, acknowledging that strict serialization incurs prohibitive latency over wide-area networks.`,
    question: 'According to the passage, why do modern distributed architectures embrace eventual consistency?',
    options: [
      'Because network partitions never occur in modern cloud provider backbones.',
      'Because enforcing strict consistency over wide-area networks results in unacceptable latency.',
      'Because operational nodes cannot return error responses under high load.',
      'Because the CAP theorem has been proven mathematically invalid in microservices.'
    ],
    correctAnswer: 'Because enforcing strict consistency over wide-area networks results in unacceptable latency.',
    explanation: 'The passage explicitly states that architectures adopt eventual consistency because "strict serialization incurs prohibitive latency over wide-area networks".',
    persianExplanation: 'متن صراحتاً بیان می‌کند که «سریال‌سازی سخت‌گیرانه (strict serialization) تاخیر زمانی غیرقابل قبولی (prohibitive latency) در شبکه‌های گسترده تحمیل می‌کند»، بنابراین سیستم‌ها به سمت مدل ثبات نهایی گرایش پیدا می‌کنند.',
    type: 'multiple_choice'
  },
  {
    id: 'diag_read_2',
    skill: 'reading',
    level: 'C1',
    title: 'Transformer Attention Mechanics',
    instructions: 'Analyze the deep learning excerpt for subtle technical causality.',
    persianInstructions: 'پاراگراف تخصصی زیر در حوزه ترنسفورمرها را تحلیل کنید و هدف اصلی مکانیسم توجه چندسر را بیابید.',
    content: `Unlike recurrent neural networks, which process sequential tokens in a strictly temporal lockstep, multi-head self-attention computes pairwise compatibility scores across all positions simultaneously. By projecting queries, keys, and values into multiple lower-dimensional representation subspaces, the model is not forced to average out orthogonal semantic relationships. Consequently, one attention head can capture syntactic dependencies between distant predicates, while another isolates coreference clusters, substantially mitigating the vanishing gradient phenomena that plagued earlier sequence transducers.`,
    question: 'What is the primary architectural advantage of projecting representations into multiple subspaces rather than a single head?',
    options: [
      'It forces all semantic features to average out into a single uniform vector.',
      'It allows the network to jointly attend to different types of semantic relations across distinct positions without collapsing them.',
      'It restores sequential recurrent computation to guarantee temporal order.',
      'It eliminates the need for computing queries and keys.'
    ],
    correctAnswer: 'It allows the network to jointly attend to different types of semantic relations across distinct positions without collapsing them.',
    explanation: 'The author notes that multiple subspaces prevent the model from having to "average out orthogonal semantic relationships", allowing distinct heads to track syntax versus coreference.',
    persianExplanation: 'نویسنده توضیح می‌دهد که ایجاد زیرفضاهای چندگانه مانع از حل شدن و میانگین‌گیری روابط معنایی متعامد می‌شود و امکان می‌دهد هر سر توجه (attention head) یک رابطه مجزا (مانند نحو یا ارجاع ضمیر) را بدون تداخل ردیابی کند.',
    type: 'multiple_choice'
  },

  // --- 2. LISTENING ---
  {
    id: 'diag_list_1',
    skill: 'listening',
    level: 'B1',
    title: 'Engineering Sprint Post-Mortem',
    instructions: 'Listen to the audio briefing regarding a production incident and identify the root cause.',
    persianInstructions: 'به پیام صوتی بررسی حادثه سرور گوش فرا دهید و علت ریشه‌ای قطعی را مشخص کنید.',
    content: 'Listen carefully to the audio prompt. You can replay the speech up to 3 times.',
    audioScript: `Team, during our database failover at 03:00 UTC, the primary replica stopped responding not because of disk corruption as initially suspected, but due to an unhandled deadlock in our connection pooling middleware. When automated retries flooded the secondary nodes, the connection buffer overflowed. We need to implement exponential backoff with jitter immediately.`,
    question: 'What was the actual root cause of the system failure?',
    options: [
      'Physical disk corruption on the storage array.',
      'An unhandled deadlock in the connection pooling middleware.',
      'A cyberattack targeting the database credentials.',
      'A hardware outage in the secondary data center.'
    ],
    correctAnswer: 'An unhandled deadlock in the connection pooling middleware.',
    explanation: 'The speaker clarifies that the crash occurred "not because of disk corruption... but due to an unhandled deadlock in our connection pooling middleware".',
    persianExplanation: 'گوینده صراحتا تاکید می‌کند علت قطعی خرابی دیسک نبوده، بلکه «یک بن‌بست (deadlock) مهارنشده در میان‌افزار مدیریت اتصالات» بوده است.',
    type: 'multiple_choice'
  },
  {
    id: 'diag_list_2',
    skill: 'listening',
    level: 'B2',
    title: 'Research Methodology Discussion',
    instructions: 'Listen to the audio recording of an academic advisor giving feedback on an experimental setup.',
    persianInstructions: 'به توصیه استاد راهنما در مورد متدولوژی آزمایش هوش مصنوعی گوش داده و توصیه پیشنهادی او را بیابید.',
    content: 'Listen to the academic recommendation.',
    audioScript: `While your reinforcement learning agent shows commendable convergence speed on the synthetic benchmark, I am skeptical about its real-world generalizability. Before we submit to the IEEE conference, you must run a five-fold cross-validation on the noisy robotic sensor dataset and report the standard deviation across all trials.`,
    question: 'What mandatory step does the advisor require prior to conference submission?',
    options: [
      'Stop using reinforcement learning altogether.',
      'Conduct five-fold cross-validation on noisy robotic sensor data and report the standard deviation.',
      'Publish only the synthetic convergence charts without noise.',
      'Submit the paper immediately to meet the deadline.'
    ],
    correctAnswer: 'Conduct five-fold cross-validation on noisy robotic sensor data and report the standard deviation.',
    explanation: 'The advisor states: "Before we submit to the IEEE conference, you must run a five-fold cross-validation on the noisy robotic sensor dataset and report the standard deviation".',
    persianExplanation: 'استاد راهنما الزام می‌کند که قبل از ارسال به IEEE، اعتبارسنجی متقاطع ۵ گانه (five-fold cross-validation) روی داده‌های نویزی حسگر رباتیک انجام شده و انحراف معیار گزارش شود.',
    type: 'multiple_choice'
  },

  // --- 3. WRITING ---
  {
    id: 'diag_write_1',
    skill: 'writing',
    level: 'B2',
    title: 'Academic Abstract & Problem Statement',
    instructions: 'Write a concise technical paragraph (60 to 120 words) explaining a challenge in machine learning or software scalability. Ensure appropriate academic tone, proper connectors (however, consequently), and scientific hedging (suggests, tends to).',
    persianInstructions: 'یک پاراگراف آکادمیک و فنی (بین ۶۰ تا ۱۲۰ کلمه) بنویسید که یک چالش در یادگیری ماشین یا مقیاس‌پذیری نرم‌افزار را شرح دهد. حتما از لحن علمی، واژگان متصل‌کننده، و احتیاط آکادمیک (hedging) استفاده کنید.',
    content: 'Prompt: Describe how high GPU memory consumption limits the deployment of large language models on edge devices, and propose a general direction for solving it (such as 4-bit quantization or knowledge distillation).',
    question: 'Compose your academic paragraph below:',
    explanation: 'Your writing is evaluated on grammatical precision, academic lexical density, appropriate hedging, coherence, and absence of Persian L1 calques.',
    persianExplanation: 'نوشته شما بر اساس دقت گرامری، تراکم واژگان آکادمیک، کاربرد عبارات محافظه‌کارانه علمی (مانند suggests)، عدم جمع بستن کلماتی مثل research، و ساختار جملات ارزیابی می‌شود.',
    type: 'free_writing',
    rubricCriteria: [
      { criteriaName: 'Grammatical Accuracy & Sentence Variety', description: 'Zero agreement errors; effective use of complex sentences and passive forms.', weight: 30 },
      { criteriaName: 'Academic Lexicon & Hedging', description: 'Accurate technical vocabulary; use of cautious verbs instead of dogmatic claims.', weight: 30 },
      { criteriaName: 'Coherence & Logical Flow', description: 'Clear problem-to-solution transition using cohesive discourse markers.', weight: 20 },
      { criteriaName: 'Task Relevance & Word Count', description: 'Between 60 and 120 words addressing edge computing constraints.', weight: 20 }
    ]
  },

  // --- 4. SPEAKING ---
  {
    id: 'diag_speak_1',
    skill: 'speaking',
    level: 'B1',
    title: 'Technical Standup & Oral Explanation',
    instructions: 'Record yourself explaining an engineering problem you recently solved or an algorithm you find fascinating (60 seconds). Speak clearly into your microphone.',
    persianInstructions: 'صدای خود را به مدت ۶۰ ثانیه در حال توضیح یک چالش فنی یا الگوریتمی که به آن علاقه‌مندید ضبط کنید. شمرده و با اعتماد به نفس صحبت کنید.',
    content: 'Prompt: "Explain how a hash map achieves constant time O(1) lookups, and what happens when two keys hash to the same bucket (collision)."',
    question: 'Press Start Recording and deliver your spoken explanation in English:',
    explanation: 'Evaluates oral fluency, pronunciation of technical terms, pace, grammatical consistency in spontaneous speech, and avoidance of vowel-epenthesis before consonant clusters.',
    persianExplanation: 'این بخش روان بودن کلام، تلفظ اصطلاحات تخصصی، حفظ ریتم، و پرهیز از افزودن صدای اضافه به ابتدای کلماتی مثل struct یا stack را می‌سنجد.',
    type: 'speech_recording'
  },

  // --- 5. GRAMMAR ---
  {
    id: 'diag_gram_1',
    skill: 'grammar',
    level: 'B2',
    title: 'Scientific Passive & Agent Attribution',
    instructions: 'Choose the grammatically and stylistically most appropriate sentence for an IEEE publication.',
    persianInstructions: 'صحیح‌ترین و مناسب‌ترین جمله را از نظر سبک نگارش علمی مقالات IEEE انتخاب کنید.',
    content: 'Context: Reporting empirical results in the methodology section.',
    question: 'Which sentence best exemplifies academic English standards?',
    options: [
      'In our research, we have did 500 benchmarks on the cluster.',
      'The benchmarks were conducted across 500 distributed nodes, with latency recorded every millisecond.',
      'We was observing that the cluster has got faster after caching.',
      'All of the benchmarks was done by our team in last week.'
    ],
    correctAnswer: 'The benchmarks were conducted across 500 distributed nodes, with latency recorded every millisecond.',
    explanation: 'Academic engineering papers prioritize the action and data through the passive voice ("The benchmarks were conducted...") accompanied by an absolute clause ("with latency recorded every millisecond").',
    persianExplanation: 'در مقالات علمی، ساختار مجهول رسمی (The benchmarks were conducted...) همراه با بند قیدی مطلق، مناسب‌ترین و رایج‌ترین فرمت نگارش برای حفظ لحن بی‌طرفانه است.',
    type: 'multiple_choice'
  },
  {
    id: 'diag_gram_2',
    skill: 'grammar',
    level: 'B1',
    title: 'Conditionals in Fault Handling',
    instructions: 'Select the correct conditional structure expressing a past hypothetical failure.',
    persianInstructions: 'ساختار شرطی نوع سوم مربوط به یک سناریوی فرضی در گذشته را انتخاب کنید.',
    content: 'Context: Debating what would have happened during the deployment.',
    question: 'If the primary database ______ the health check signal, the load balancer ______ traffic to the standby cluster.',
    options: [
      'had dropped / would have rerouted',
      'drops / would reroute',
      'has dropped / reroutes',
      'would drop / had rerouted'
    ],
    correctAnswer: 'had dropped / would have rerouted',
    explanation: 'A hypothetical condition in the past requires the Third Conditional: If + past perfect (had dropped), would have + past participle (would have rerouted).',
    persianExplanation: 'برای بیان یک شرط غیرواقعی در گذشته، از شرطی نوع سوم استفاده می‌شود: Had + P.P در بند شرط و Would have + P.P در بند اصلی.',
    type: 'multiple_choice'
  },

  // --- 6. VOCABULARY ---
  {
    id: 'diag_voc_1',
    skill: 'vocabulary',
    level: 'B2',
    title: 'Academic Collocations in AI',
    instructions: 'Select the verb that forms a natural, standard academic collocation.',
    persianInstructions: 'فعلی را انتخاب کنید که یک ترکیب همنشین (Collocation) طبیعی و رایج دانشگاهی با عبارت داده‌شده تشکیل دهد.',
    content: 'Sentence: "Future investigations should ______ empirical validation to verify whether the algorithm generalizes to unstructured point clouds."',
    question: 'Which verb naturally collocates with "empirical validation"?',
    options: [
      'make',
      'conduct',
      'act',
      'build'
    ],
    correctAnswer: 'conduct',
    explanation: 'In academic English, one "conducts validation", "conducts research", or "carries out an investigation". "Make validation" is a direct calque from Persian (اعتبارسنجی کردن) and is unnatural.',
    persianExplanation: 'در انگلیسی آکادمیک ترکیب طبیعی "conduct validation" است. کاربرد "make validation" یک ترجمه کلمه‌به‌کلمه از فارسی («اعتبارسنجی کردن») و کاملاً نادرست است.',
    type: 'multiple_choice'
  },
  {
    id: 'diag_voc_2',
    skill: 'vocabulary',
    level: 'C1',
    title: 'System Design Terminology',
    instructions: 'Choose the word that precisely describes an operation that produces identical results regardless of repeated invocations.',
    persianInstructions: 'واژه‌ای را انتخاب کنید که عملیاتی با ویژگی «تکرار بدون اثر جانبی اضافه» را بیان می‌کند.',
    content: 'Definition: "An API endpoint is deemed ______ if invoking it once or multiple consecutive times produces the identical side-effect on the datastore."',
    question: 'Select the exact technical term:',
    options: [
      'stochastic',
      'idempotent',
      'mutable',
      'ephemeral'
    ],
    correctAnswer: 'idempotent',
    explanation: '"Idempotent" is the exact term in software architecture and mathematics for operations where f(f(x)) = f(x).',
    persianExplanation: 'کلمه "idempotent" اصطلاح دقیق مهندسی نرم‌افزار برای عملیاتی است که تکرار مجدد آن تغییری در وضعیت نهایی ایجاد نمی‌کند.',
    type: 'multiple_choice'
  },

  // --- 7. PRONUNCIATION ---
  {
    id: 'diag_pron_1',
    skill: 'pronunciation',
    level: 'A2',
    title: 'Phonetic Discernment: /v/ vs /w/',
    instructions: 'Identify the phonetic difference in articulation between /v/ and /w/.',
    persianInstructions: 'تفاوت فیزیولوژیکی و آوایی تولید صدای /v/ و /w/ را مشخص کنید.',
    content: 'Persian speakers frequently substitute /v/ for /w/ because Modern Persian lacks the bilabial /w/ phoneme.',
    question: 'How is the English /w/ sound in "weight" correctly articulated compared to /v/ in "vector"?',
    options: [
      'For /w/, both lips are rounded tightly without the teeth touching the lip; for /v/, the upper teeth press against the lower lip.',
      'For /w/, the tongue touches the hard palate; for /v/, air is released through the nose.',
      'There is no phonetic difference; both are interchangeable in standard English.',
      'For /w/, the vocal cords do not vibrate, whereas /v/ is always unvoiced.'
    ],
    correctAnswer: 'For /w/, both lips are rounded tightly without the teeth touching the lip; for /v/, the upper teeth press against the lower lip.',
    explanation: 'The /w/ phoneme is a voiced labiovelar approximant (requiring lip rounding), whereas /v/ is a voiced labiodental fricative (upper incisors on lower lip).',
    persianExplanation: 'صدای /w/ با گرد کردن کامل هر دو لب (شبیه سوت) بدون تماس دندان تولید می‌شود؛ در حالی که برای /v/ دندان‌های پیشین بالا روی لبه لب پایین قرار می‌گیرند.',
    type: 'multiple_choice'
  },
  {
    id: 'diag_pron_2',
    skill: 'pronunciation',
    level: 'B1',
    title: 'Lexical Stress in Multisyllabic Words',
    instructions: 'Identify which syllable carries the primary stress in the noun "parameter".',
    persianInstructions: 'مشخص کنید در واژه تخصصی "parameter" (پارامتر) استرس اصلی روی کدام بخش (سیلاب) قرار دارد.',
    content: 'Correct lexical stress is vital for acoustic intelligibility in engineering meetings.',
    question: 'Where is primary stress placed in "parameter"?',
    options: [
      'First syllable: PA-ra-me-ter',
      'Second syllable: pa-RA-me-ter',
      'Third syllable: pa-ra-ME-ter',
      'Fourth syllable: pa-ra-me-TER'
    ],
    correctAnswer: 'Second syllable: pa-RA-me-ter',
    explanation: 'In standard English, the noun parameter is stressed on the second syllable: /pəˈræm.ɪ.tər/. Pronouncing it with first-syllable stress is a common mispronunciation.',
    persianExplanation: 'در انگلیسی استاندارد، واژه parameter روی سیلاب دوم تکیه دارد: /pəˈræm.ɪ.tər/ (پَ-رَ-می-تر). تلفظ آن با تکیه روی سیلاب اول ناشی از تاثیر تلفظ فرانسوی یا فارسی است.',
    type: 'multiple_choice'
  }
];
