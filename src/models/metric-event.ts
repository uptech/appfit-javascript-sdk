interface MetricEvent {
  readonly eventId: string;
  readonly name: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: Record<string, string>;
}
