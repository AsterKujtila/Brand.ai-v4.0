import crypto from 'crypto';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export class OAuth2Engine {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.OAUTH_CLIENT_ID || '';
    this.clientSecret = process.env.OAUTH_CLIENT_SECRET || '';
    this.redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  }

  // Generate PKCE Code Verifier and Code Challenge
  public generatePKCEPair() {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    
    return { codeVerifier, codeChallenge };
  }

  // Construct authorization URI for connected apps (e.g., Figma, Notion)
  public getAuthorizationUrl(providerUrl: string, scope: string, state: string, challenge: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scope,
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });
    return `${providerUrl}?${params.toString()}`;
  }

  // Exchange Authorization Code for Access & Refresh Tokens
  public async exchangeCodeForTokens(
    tokenUrl: string, 
    code: string, 
    codeVerifier: string
  ): Promise<TokenResponse> {
    try {
      const response = await axios.post<TokenResponse>(tokenUrl, new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`OAuth 2.1 Exchange Failure: ${error.response?.data?.error_description || error.message}`);
    }
  }

  // Refresh expired access tokens smoothly background-side
  public async refreshAccessToken(tokenUrl: string, refreshToken: string): Promise<Partial<TokenResponse>> {
    try {
      const response = await axios.post<TokenResponse>(tokenUrl, new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      }).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Token Refresh Failure: ${error.message}`);
    }
  }
}
