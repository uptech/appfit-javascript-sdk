import { AnalyticEvent } from './analytic-event';

/** @internal */
export interface IEventCache {
  entries: AnalyticEvent[];

  add(event: AnalyticEvent): void;
  removeById(eventId: string): void;
  remove(event: AnalyticEvent): void;
  clear(): void;
}
