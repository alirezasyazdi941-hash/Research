import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// API: Server status & AI Key availability
app.get('/api/status', (req, res) => {
  const hasGeminiKey = !!process.env['GEMINI_API_KEY'];
  res.json({
    status: 'online',
    appName: 'Ali English — Private AI Language Academy',
    hasGeminiKey,
    timestamp: Date.now()
  });
});

// API: Optional Server-Side Gemini Assistance (Executed only when explicitly requested by user)
app.post('/api/ai/generate', async (req, res) => {
  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please use the AI Prompt Studio to copy prompts to ChatGPT/Claude/Gemini, or provide an API key in secrets.',
      available: false
    });
  }

  const { prompt, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are Ali English Private Academy Coach. Provide precise, constructive pedagogical feedback with Persian explanations where helpful for Iranian computer scientists and AI researchers.',
      }
    });

    const text = response.text || '';
    return res.json({ text, success: true });
  } catch (error: unknown) {
    console.error('Gemini API Error in /api/ai/generate:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate AI response';
    return res.status(500).json({ error: message });
  }
});


/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
