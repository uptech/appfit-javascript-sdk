import { AppFitEvent } from '../models/appfit-event';

interface MetricEventDtoPayload {
  readonly eventId: string;
  readonly name: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: Record<string, string>;
}

export interface MetricEventDto {
  readonly occurredAt: string;
  readonly payload: MetricEventDtoPayload;
}

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
  };
}
