export interface AppFitConfigurationOptions {
  appVersion?: string;
}

export class AppFitConfiguration {
  constructor(
    public readonly apiKey: string,
    public readonly options: AppFitConfigurationOptions,
  ) {}
}
