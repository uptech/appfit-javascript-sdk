import { AppFitEvent } from '../../events/models/appfit-event';

/** @internal */
interface MetricEventDtoPayload {
  readonly eventId: string;
  readonly name: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: Record<string, string>;
}

/** @internal */
export interface MetricEventDto {
  readonly occurredAt: string;
  readonly payload: MetricEventDtoPayload;
  readonly eventSource: 'appfit'; // this is always 'appfit' for our sdks
}

/** @internal */
export function appfitEventToMetricEventDto(
  appfitEvent: AppFitEvent,
  userId?: string,
  anonymousId?: string,
): MetricEventDto {
  return {
    occurredAt: appfitEvent.occurredAt,
    payload: {
      eventId: appfitEvent.id,
      name: appfitEvent.name,
      userId,
      anonymousId,
      properties: appfitEvent.properties,
      // systemProperties,
    },
    eventSource: 'appfit',
  };
}
