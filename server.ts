import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';
import { OAuth2Engine } from './backend/oauth.service';
import { RealtimeSyncGateway } from './backend/websocket.gateway';
import crypto from 'crypto';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  
  // Initialize components
  const oauthEngine = new OAuth2Engine();
  const realtimeSync = new RealtimeSyncGateway(server);

  app.use(express.json());

  // Ephemeral memory storage for simplicity (Swap out for Redis / Postgres in production)
  const sessionStore = new Map<string, { verifier: string; state: string }>();

  /**
   * 1. Initialize External Tool Connection Flow (Figma, Slack, etc.)
   */
  app.get('/api/integrations/connect', (req, res) => {
    const { providerUrl, targetScope, tenantId } = req.query;
    
    if (!providerUrl || !tenantId) {
      return res.status(400).json({ error: 'Missing integration targets' });
    }

    const state = crypto.randomUUID();
    const { codeVerifier, codeChallenge } = oauthEngine.generatePKCEPair();

    // Save verifier details securely across redirects
    sessionStore.set(state, { verifier: codeVerifier, state });

    const authUrl = oauthEngine.getAuthorizationUrl(
      String(providerUrl), 
      String(targetScope || 'read'), 
      state, 
      codeChallenge
    );

    return res.redirect(authUrl);
  });

  /**
   * 2. Inbound OAuth 2.1 Callback Handler
   */
  app.get('/api/auth/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
      return res.status(400).json({ error: `User denied connection auth: ${error}` });
    }

    const cachedSession = sessionStore.get(String(state));
    if (!cachedSession) {
      return res.status(403).json({ error: 'OAuth State mismatch or verification session expired' });
    }

    try {
      // Clean cache record immediately
      sessionStore.delete(String(state));

      const tokenEndpoint = 'https://api.figma.com/v1/oauth/token'; // Dynamically configured per provider
      const tokenPayload = await oauthEngine.exchangeCodeForTokens(
        tokenEndpoint, 
        String(code), 
        cachedSession.verifier
      );

      // Persist tokenPayload.access_token securely here...

      return res.status(200).json({ status: 'connected', scope: tokenPayload.scope });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  /**
   * 3. Brand Check Trigger Route (Simulates continuous engine scanning)
   */
  app.post('/api/brand-check/validate', (req, res) => {
    const { brandId, assetType, contentUrl } = req.body;

    if (!brandId) return res.status(400).json({ error: 'Target brand context ID required' });

    // Simulate non-blocking background async analysis thread 
    setTimeout(() => {
      realtimeSync.sendToBrand(brandId, {
        type: 'BRAND_CHECK_UPDATE',
        timestamp: new Date().toISOString(),
        payload: {
          assetType,
          contentUrl,
          complianceScore: 94.2,
          riskScore: 5.8,
          findings: ['Hex match valid (#141413)', 'Soft ambient lighting verified', 'Typography complies with Swiss Sans-Serif rule']
        }
      });
    }, 1200);

    return res.status(202).json({ message: 'Compliance pipeline execution scheduled' });
  });

  // Next.js catch-all routes
  app.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    nextHandler(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("Error starting next app", err);
});
