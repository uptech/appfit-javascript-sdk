import {
  AppFitApiClient,
  AppFitEvent,
  EventDigester,
  IEventDigest,
} from '@uptechworks/appfit-shared';
import { EventCache } from './events/event-cache';
import { UserCache } from './events/user-cache';
import { AppFitBrowserConfiguration } from './models/app-fit-browser-configuration';

export class AppFit {
  private readonly configuration: AppFitBrowserConfiguration;
  private readonly eventDigestor: IEventDigest;

  constructor(configuration: AppFitBrowserConfiguration) {
    this.configuration = configuration;
    this.eventDigestor = new EventDigester(
      new AppFitApiClient(configuration.apiKey),
      new EventCache(),
      new UserCache(),
    );

    // This is a unique event that is used specifically to track when the
    // AppFit SDK has been initialized.
    // This is an internal event.
    this.trackEvent('appfit_sdk_initialized', {});
  }

  /// Tracks an event with the provided [eventName] and [properties].
  ///
  /// This is used to track events in the AppFit dashboard.
  async trackEvent(eventName: string, payload: Record<string, string>) {
    return this.eventDigestor.track(eventName, payload);
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

    // This is a unique event that is used specifically to track when the
    // AppFit SDK has been identified a user
    // This is an internal event.
    this.trackEvent('appfit_user_identified', {});
  }
}
