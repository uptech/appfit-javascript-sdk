import { AnalyticEvent } from '../../events/models/analytic-event';

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
export function analyticEventToMetricEventDto(
  event: AnalyticEvent,
): MetricEventDto {
  return {
    occurredAt: event.occurredAt,
    payload: {
      eventId: event.id,
      name: event.name,
      userId: event.userId,
      anonymousId: event.anonymousId,
      properties: event.properties,
      systemProperties: event.systemProperties,
    },
    eventSource: 'appfit',
  };
}
