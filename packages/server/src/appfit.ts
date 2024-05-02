import {
  AppFitApiClient,
  AppFitCore,
  AppFitEvent,
  EventDigester,
  EventUserIdentifier,
  IAppFitCore,
  InMemoryEventCache,
} from '@uptechworks/appfit-shared';
import { AppFitServerConfiguration } from './models/app-fit-server-configuration';

export class AppFit {
  private readonly configuration: AppFitServerConfiguration;
  private readonly appFitCore: IAppFitCore;

  constructor(configuration: AppFitServerConfiguration) {
    this.configuration = configuration;
    const eventDigester = new EventDigester(
      new AppFitApiClient(configuration.apiKey),
      new InMemoryEventCache(),
    );

    this.appFitCore = new AppFitCore(eventDigester);
  }

  /// Tracks an event with the provided [eventName] and [properties].
  ///
  /// This is used to track events in the AppFit dashboard.
  async trackEvent(
    eventName: string,
    payload: Record<string, string>,
    user: EventUserIdentifier,
  ) {
    return this.appFitCore.track(eventName, payload, user);
  }

  /// Tracks an event with the provided [event].
  ///
  /// This is used to track events in the AppFit dashboard.
  async track(event: AppFitEvent, user: EventUserIdentifier) {
    return this.appFitCore.trackAppFitEvent(event, user);
  }
}
