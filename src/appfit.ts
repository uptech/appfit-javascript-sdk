import { AppFitConfiguration } from './models/appfit-configuration';
import { EventDigester } from './events/event-digester';
import { ApiClient } from './networking/api-client';
import { AppFitEvent, createAppFitEvent } from './events/models/appfit-event';

export class AppFit {
  private readonly configuration: AppFitConfiguration;
  private readonly eventDigestor: EventDigester;

  constructor(configuration: AppFitConfiguration) {
    this.configuration = configuration;
    this.eventDigestor = new EventDigester(new ApiClient(configuration.apiKey));
  }

  /// Tracks an event with the provided [eventName] and [properties].
  ///
  /// This is used to track events in the AppFit dashboard.
  async trackEvent(eventName: string, payload: Record<string, string>) {
    const event = createAppFitEvent(eventName, payload);
    return this.track(event);
  }

  /// Tracks an event with the provided [event].
  ///
  /// This is used to track events in the AppFit dashboard.
  async track(event: AppFitEvent) {
    return this.eventDigestor.digest(event);
  }

  /// Identifies the user with the provided [userId].
  ///
  /// This is used to identify the user in the AppFit dashboard.
  /// If the [userId] is `undefined`, the user will be un-identified,
  /// resulting in the user being anonymous.
  identifyUser(userId?: string) {
    this.eventDigestor.identify(userId);
  }
}
