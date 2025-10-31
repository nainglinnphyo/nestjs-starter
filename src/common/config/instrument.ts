import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: 'https://68106999e7dea0f53c9c7315eddbae40@o4510283003658240.ingest.us.sentry.io/4510283006476288',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
});
