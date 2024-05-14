import {
  AppFitApiClient,
  AppFitCore,
  AppFitEvent,
  BrowserUserCache,
  EventDigester,
  IAppFitCore,
  InMemoryEventCache,
} from '@uptechworks/appfit-shared';
import { AppFitBrowserConfiguration } from '@uptechworks/appfit-browser-sdk';

export class AppFit {
  private readonly configuration: AppFitBrowserConfiguration;
  private readonly appFitCore: IAppFitCore;

  constructor(
    configuration: AppFitBrowserConfiguration,
    origin: string = 'website',
  ) {
    this.configuration = configuration;

    const eventDigester = new EventDigester(
      new AppFitApiClient(configuration.apiKey),
      new InMemoryEventCache(),
    );

    this.appFitCore = new AppFitCore(
      eventDigester,
      new BrowserUserCache(),
      origin,
    );
  }

  /// Tracks an event with the provided [eventName] and [properties].
  ///
  /// This is used to track events in the AppFit dashboard.
  async trackEvent(eventName: string, payload: Record<string, string>) {
    return this.appFitCore.track(eventName, payload);
  }

  /// Tracks an event with the provided [event].
  ///
  /// This is used to track events in the AppFit dashboard.
  async track(event: AppFitEvent) {
    return this.appFitCore.trackAppFitEvent(event);
  }

  /// Identifies the user with the provided [userId].
  ///
  /// This is used to identify the user in the AppFit dashboard.
  /// If the [userId] is `undefined`, the user will be un-identified,
  /// resulting in the user being anonymous.
  async identifyUser(userId?: string) {
    this.appFitCore.identify(userId);
  }
}
