import { AppFitConfigurationOptions } from '@uptechworks/appfit-shared';

export class AppFitServerConfiguration {
  constructor(
    public readonly apiKey: string,
    public readonly options: AppFitConfigurationOptions = {},
  ) {}
}
