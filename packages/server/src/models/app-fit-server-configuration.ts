export interface AppFitServerConfigurationOptions {
  appVersion?: string;
}

export class AppFitServerConfiguration {
  constructor(
    public readonly apiKey: string,
    public readonly options: AppFitServerConfigurationOptions = {},
  ) {}
}
