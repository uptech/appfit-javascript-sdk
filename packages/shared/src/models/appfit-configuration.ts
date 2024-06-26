export interface AppFitConfigurationOptions {
  appVersion?: string;
  enableIpTracking?: boolean;
}

export class AppFitConfiguration {
  constructor(
    public readonly apiKey: string,
    public readonly options: AppFitConfigurationOptions,
  ) {}
}
