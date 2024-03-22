import { EventCache, IEventCache } from './event-cache';
import { AppFitEvent } from './models/appfit-event';
import { appfitEventToMetricEventDto } from '../networking/models/metric-event-dto';
import { ApiClient } from '../networking/api-client';
import { IUserCache, UserCache } from './user-cache';

export class EventDigester {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly eventCache: IEventCache = new EventCache(),
    private readonly userCache: IUserCache = new UserCache(),
  ) {
    this.userCache.setAnonymousId();
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
