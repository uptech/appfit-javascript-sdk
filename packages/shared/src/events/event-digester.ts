import { AppFitEvent, createAppFitEvent } from './models/appfit-event';
import { appfitEventToMetricEventDto } from '../networking/models/metric-event-dto';
import { IApiClient } from '../networking/api-client';
import { generateNewUuid, UUID } from '../utils/uuid';
import { IEventCache } from './models/event-cache.interface';
import { IUserCache } from './models/user-cache.interface';

/** @internal */
export interface IEventDigest {
  track(eventName: string, payload: Record<string, string>): Promise<void>;
  digest(event: AppFitEvent): Promise<void>;
  batchDigest(events: AppFitEvent[]): Promise<boolean>;
  identify(userId?: string): void;
}

/** @internal */
export class EventDigester implements IEventDigest {
  constructor(
    private readonly apiClient: IApiClient,
    private readonly eventCache: IEventCache,
    private readonly userCache: IUserCache,
    private readonly generateUuid: () => UUID = generateNewUuid,
  ) {
    this.userCache.setAnonymousId();
  }

  /**
   * Creates and then digests an event with the provided [eventName] and [properties]
   *
   * @param {string} eventName A unique name for an event to track
   * @param {Record<string, string>} payload An object that can contain additional data to track with event
   * @returns `Promise<void>`
   */
  async track(eventName: string, payload: Record<string, string>) {
    const id = this.generateUuid();
    const event = createAppFitEvent(id, eventName, payload);
    return this.digest(event);
  }

  /// Digests the provided [event].
  ///
  /// This is used to digest the provided [event] and send it to the AppFit dashboard.
  /// Before any event is sent to the AppFit dashboard, it is first added to the cache.
  /// If the event is successfully sent to the AppFit dashboard, it is removed from the cache,
  /// otherwise it will be retried later.
  async digest(event: AppFitEvent) {
    const eventDto = appfitEventToMetricEventDto(
      event,
      this.userCache.getUserId(),
      this.userCache.getAnonymousId(),
    );

    const trackResult = await this.apiClient.track(eventDto);
    if (!trackResult) {
      // cache in case of failure
      this.eventCache.add(event);
      return;
    }
    // make sure successful events aren't cached
    this.eventCache.removeById(event.id);

    // if successful, also attempt to flush any failed events
    if (this.eventCache.entries.length) {
      await this.digestCache();
    }
  }

  /// Digests the provided [events].
  ///
  /// This is used to digest the provided [events] and send it to the AppFit dashboard.
  /// Before any event is sent to the AppFit dashboard, it is first added to the cache.
  /// This DOES NOT CACHE failed events
  async batchDigest(events: AppFitEvent[]): Promise<boolean> {
    const eventDtos = events.map((event) =>
      appfitEventToMetricEventDto(
        event,
        this.userCache.getUserId(),
        this.userCache.getAnonymousId(),
      ),
    );

    return this.apiClient.trackBatch(eventDtos);
  }

  /// Identifies the user with the provided [userId].
  ///
  /// This is used to identify the user in the AppFit dashboard.
  /// When passing in `undefined`, the user will be un-identified,
  /// resulting in the user being anonymous.
  identify(userId?: string) {
    this.userCache.setUserId(userId);
  }

  /// Digests the cache.
  ///
  /// This is used to digest all of the events in the cache that might have failed,
  /// or are pending to be sent to the AppFit dashboard.
  /// If the event is successfully sent to the AppFit dashboard, it is removed from the cache,
  /// otherwise it will be retried later.
  private async digestCache() {
    const result = await this.batchDigest(this.eventCache.entries);
    if (result) {
      // clear cache on success
      this.eventCache.clear();
    }
  }
}
