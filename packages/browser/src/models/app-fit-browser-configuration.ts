import { AppFitConfigurationOptions } from '@uptechworks/appfit-shared';

export class AppFitBrowserConfiguration {
  constructor(
    public readonly apiKey: string,
    public readonly options: AppFitConfigurationOptions = {},
  ) {}
}
