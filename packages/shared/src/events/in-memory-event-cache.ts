// a network request. We can re-try these events when internet access
// is restored.
import { IEventCache } from './models/event-cache.interface';
import { AnalyticEvent } from './models/analytic-event';

export class InMemoryEventCache implements IEventCache {
  private cache: Map<string, AnalyticEvent> = new Map<string, AnalyticEvent>();

  /// An array of all cached events
  get entries() {
    return [...this.cache.values()];
  }

  /// Adds the provided [value] to the cache.
  /// This is used to add events to the cache that have not been posted to the network.
  /// This will do a lookup in the cache to find the event that matches the provided [value]
  /// and if it is found, it will remove the old event and add the new one.
  add(event: AnalyticEvent): void {
    if (this.cache.has(event.id)) {
      this.cache.delete(event.id);
    }
    this.cache.set(event.id, event);
  }

  /// Removes the event with the provided [id] from the cache.
  /// This is used to remove events that have been successfully posted to the network.
  /// This will do a lookup in the cache to find the event that matches the provided [id].
  removeById(eventId: string): void {
    this.cache.delete(eventId);
  }

  /// Removes the event with the provided [event] from the cache.
  /// This is used to remove events that have been successfully posted to the network.
  /// This will do a lookup in the cache to find the event that matches the provided [event].
  remove(event: AnalyticEvent): void {
    this.cache.delete(event.id);
  }

  /// Clears the cache.
  /// This will remove all of the local cached events.
  clear(): void {
    this.cache.clear();
  }
}
