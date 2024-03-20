interface MetricEventDtoPayload {
  readonly eventId: string;
  readonly name: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: Record<string, string>;
}

interface MetricEventDto {
  readonly occurredAt: string;
  readonly payload: MetricEventDtoPayload;
}
