import { AppFit } from './appfit';
import { AppFitBrowserConfiguration } from './models/app-fit-browser-configuration';

export interface GlobalAppFit {
  apiKey?: string;
  client?: AppFit;
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
  window.AppFit.trackEvent = client.trackEvent;
  window.AppFit.identifyUser = client.identifyUser;
}
