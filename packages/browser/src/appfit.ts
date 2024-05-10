import {
  AppFitApiClient,
  AppFitCore,
  AppFitEvent,
  BrowserUserCache,
  EventDigester,
  IAppFitCore,
  InMemoryEventCache,
} from '@uptechworks/appfit-shared';
import { AppFitBrowserConfiguration } from './models/app-fit-browser-configuration';

export class AppFit {
  private readonly configuration: AppFitBrowserConfiguration;
  private readonly appFitCore: IAppFitCore;

  constructor(configuration: AppFitBrowserConfiguration) {
    this.configuration = configuration;

    const eventDigester = new EventDigester(
      new AppFitApiClient(configuration.apiKey),
      new InMemoryEventCache(),
    );

    this.appFitCore = new AppFitCore(eventDigester, new BrowserUserCache());
  }

  /**
   * Tracks an event with the provided event name and properties.
   * This is used to track events in the AppFit dashboard.
   *
   * @param {string} eventName A unique name for an event to track
   * @param {Record<string, string>} payload Extra data to be sent with the event
   * */
  async trackEvent(eventName: string, payload: Record<string, string>) {
    return this.appFitCore.track(eventName, payload);
  }

  /**
   * Tracks an event with the provided AppFitEvent
   * This is used to track events in the AppFit dashboard.
   *
   * @param {AppFitEvent} event The event with name and properties
   * */
  async track(event: AppFitEvent) {
    return this.appFitCore.trackAppFitEvent(event);
  }

  /**
   * This is used to identify a user for future events.
   * If the user ID is `undefined`, the user will be un-identified,
   * resulting in the user being anonymous in any following events.
   *
   * @param {string} userId The unique identifier for a user
   * */
  async identifyUser(userId?: string) {
    this.appFitCore.identify(userId);
  }
}
