import * as https from 'https';

export const HTTPS_AGENT_OPTIONS = {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
};
