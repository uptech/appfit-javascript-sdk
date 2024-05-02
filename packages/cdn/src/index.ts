import { AppFitBrowserConfiguration } from '@uptechworks/appfit-browser-sdk';
import { AppFit } from './appfit';

interface GlobalAppFit {
  apiKey?: string;
  client?: AppFit;
  origin?: string;
  cache?: {
    events?: { eventName: string; payload: Record<string, string> }[];
    identity?: unknown;
  };
  trackEvent(eventName: string, payload: Record<string, string>): Promise<void>;
  identifyUser(userId?: string): void;
}

declare global {
  interface Window {
    AppFit: GlobalAppFit;
  }
}

(async function appfitInstall(apiKey?: string) {
  if (!apiKey) {
    console.error('No API key provided');
    return;
  }

  if (!window.AppFit) {
    console.warn('See documentation for proper AppFit installation');
    window.AppFit = {
      apiKey,
      trackEvent: async () => {},
      identifyUser: () => {},
    };
  }

  if (window.AppFit.client) {
    console.warn('AppFit client was already installed');
    return;
  }

  const config = new AppFitBrowserConfiguration(apiKey);
  const client = new AppFit(config, window.AppFit.origin);
  window.AppFit.client = client;
  window.AppFit.trackEvent = client.trackEvent.bind(client);
  window.AppFit.identifyUser = client.identifyUser.bind(client);

  if (
    window.AppFit.cache?.identity &&
    typeof window.AppFit.cache.identity === 'string'
  ) {
    window.AppFit.identifyUser(window.AppFit.cache.identity);
  }
  if (
    window.AppFit.cache?.events &&
    Array.isArray(window.AppFit.cache.events)
  ) {
    window.AppFit.cache.events.forEach((event) => {
      client.trackEvent(event.eventName, event.payload);
    });
  }
  window.AppFit.cache = undefined;
})(window.AppFit?.apiKey).catch((reason: unknown) => {
  console.error('Failed to initialize AppFit');
  console.error(reason);
});
