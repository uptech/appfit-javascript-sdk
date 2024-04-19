import { AppFitEvent } from './appfit-event';

/** @internal */
export interface IEventCache {
  entries: AppFitEvent[];

  add(event: AppFitEvent): void;
  removeById(eventId: string): void;
  remove(event: AppFitEvent): void;
  clear(): void;
}
