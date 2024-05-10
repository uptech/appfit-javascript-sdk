import { IApiClient } from '../networking/api-client';
import { IEventCache } from './models/event-cache.interface';
import { AnalyticEvent } from './models/analytic-event';
import { analyticEventToMetricEventDto } from '../networking/models/metric-event-dto';

/** @internal */
export interface IEventDigest {
  digest(event: AnalyticEvent): Promise<void>;
  batchDigest(events: AnalyticEvent[]): Promise<boolean>;
}

/** @internal */
export class EventDigester implements IEventDigest {
  constructor(
    private readonly apiClient: IApiClient,
    private readonly eventCache: IEventCache,
  ) {}

  /// Digests the provided [event].
  ///
  /// This is used to digest the provided [event] and send it to the AppFit dashboard.
  /// If the event is not successful, it is cached and it will be retried later.
  async digest(event: AnalyticEvent) {
    const eventDto = analyticEventToMetricEventDto(event);

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
  async batchDigest(events: AnalyticEvent[]): Promise<boolean> {
    const eventDtos = events.map((event) =>
      analyticEventToMetricEventDto(event),
    );

    return this.apiClient.trackBatch(eventDtos);
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
