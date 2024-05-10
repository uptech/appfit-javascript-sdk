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
import { randomUUID } from 'node:crypto';

export class AppFit {
  private readonly configuration: AppFitServerConfiguration;
  private readonly appFitCore: IAppFitCore;

  constructor(configuration: AppFitServerConfiguration) {
    this.configuration = configuration;
    const eventDigester = new EventDigester(
      new AppFitApiClient(configuration.apiKey),
      new InMemoryEventCache(),
    );

    this.appFitCore = new AppFitCore(eventDigester, undefined, 'node', () =>
      randomUUID(),
    );
  }

  /**
   * Tracks an event with the provided event name and properties.
   * This is used to track events in the AppFit dashboard.
   *
   * @param {string} eventName A unique name for an event to track
   * @param {Record<string, string>} payload Extra data to be sent with the event
   * @param {EventUserIdentifier} user A unique identifier for the user
   * */
  async trackEvent(
    eventName: string,
    payload: Record<string, string>,
    user: EventUserIdentifier,
  ) {
    return this.appFitCore.track(eventName, payload, user);
  }

  /**
   * Tracks an event with the provided AppFitEvent
   * This is used to track events in the AppFit dashboard.
   *
   * @param {AppFitEvent} event The event with name and properties
   * @param {EventUserIdentifier} user A unique identifier for the user
   * */
  async track(event: AppFitEvent, user: EventUserIdentifier) {
    return this.appFitCore.trackAppFitEvent(event, user);
  }
}
