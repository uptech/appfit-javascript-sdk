import { AnalyticEvent } from '../../events/models/analytic-event';

/** @internal */
interface MetricEventDtoSystemProperties {
  appVersion?: string;
  ipAddress?: string;
  location?: {
    city?: string;
    region?: string;
    countryCode?: string;
    postalCode?: string;
    continent?: string;
    latitude?: number;
    longitude?: number;
  };
  os?: {
    name?: string;
    version?: string;
  };
  device?: {
    id?: string;
    advertisingId?: string;
    manufacturer?: string;
    model?: string;
  };
  browser?: {
    userAgent?: string;
    name?: string;
    version?: string;
  };
}

/** @internal */
interface MetricEventDtoPayload {
  readonly sourceEventId: string;
  readonly eventName: string;
  readonly origin?: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: MetricEventDtoSystemProperties;
}

/** @internal */
export interface MetricEventDto {
  readonly eventSource: 'appfit'; // this is always 'appfit' for our sdks
  readonly occurredAt: string;
  readonly version: '2'; // the current version of the payload
  readonly payload: MetricEventDtoPayload;
}

/** @internal */
export function analyticEventToMetricEventDto(
  event: AnalyticEvent,
): MetricEventDto {
  return {
    eventSource: 'appfit',
    version: '2',
    occurredAt: event.occurredAt,
    payload: {
      sourceEventId: event.id,
      eventName: event.eventName,
      origin: event.origin,
      userId: event.userId,
      anonymousId: event.anonymousId,
      properties: event.properties,
      systemProperties: event.systemProperties,
    },
  };
}
