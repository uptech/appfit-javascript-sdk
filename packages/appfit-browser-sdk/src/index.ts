import { appfitInstall } from './browser-install';

export { AppFitBrowserConfiguration } from './models/app-fit-browser-configuration';

export { AppFit } from './appfit';
export type { GlobalAppFit } from './browser-install';

export type { AppFitEvent } from '@uptechworks/appfit-shared';

appfitInstall(window.AppFit.apiKey).catch((reason: any) => {
  console.error('Failed to initialize AppFit');
  console.error(reason);
});
