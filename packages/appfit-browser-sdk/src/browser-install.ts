import { AppFit } from './appfit';
import { AppFitBrowserConfiguration } from './models/app-fit-browser-configuration';

export interface GlobalAppFit {
  apiKey?: string;
  client?: AppFit;
  cache?: {
    events?: { eventName: string; payload: Record<string, string> }[];
    identity?: string;
  };
  trackEvent(eventName: string, payload: Record<string, string>): Promise<void>;
  identifyUser(userId?: string): void;
}

declare global {
  interface Window {
    AppFit: GlobalAppFit;
  }
}

export async function appfitInstall(apiKey?: string) {
  if (!apiKey) {
    console.error('No API key provided');
    return;
  }

  const config = new AppFitBrowserConfiguration(apiKey);
  const client = new AppFit(config);
  window.AppFit.client = client;
  window.AppFit.trackEvent = client.trackEvent.bind(client);
  window.AppFit.identifyUser = client.identifyUser.bind(client);

  if (window.AppFit.cache?.identity) {
    window.AppFit.identifyUser(window.AppFit.cache.identity);
  }
  if (window.AppFit.cache?.events) {
    window.AppFit.cache.events.forEach((event) => {
      client.trackEvent(event.eventName, event.payload);
    });
  }
  window.AppFit.cache = undefined;
}
