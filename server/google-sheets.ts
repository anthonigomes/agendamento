import { google } from 'googleapis';

let connectionSettings: any;

// Check if running on Replit or external environment (Render, etc.)
const isReplitEnvironment = process.env.REPLIT_CONNECTORS_HOSTNAME || process.env.REPL_IDENTITY;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleSheetClient() {
  // If running on Replit, use the connector integration
  if (isReplitEnvironment) {
    const accessToken = await getAccessToken();

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    return google.sheets({ version: 'v4', auth: oauth2Client });
  }
  
  // If running on external environment (Render, Vercel, etc.), use service account
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  
  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_CREDENTIALS not found. Please set this environment variable with your Google Service Account JSON credentials.');
  }

  let parsedCredentials;
  try {
    parsedCredentials = JSON.parse(credentials);
  } catch (error) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_CREDENTIALS format. Must be valid JSON.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: parsedCredentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}
