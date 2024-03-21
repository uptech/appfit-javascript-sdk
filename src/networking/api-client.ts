import { MetricEventDto } from './metric-event-dto';

export class ApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl ?? 'https://api.appfit.io';
  }

  /// Tracks an event.
  ///
  /// This will return `true` if the event was successfully tracked, and `false` otherwise.
  public async track(eventDto: MetricEventDto): Promise<boolean> {
    const responsePromise = authenticatedPost(
      `${this.baseUrl}/metric-events`,
      this.apiKey,
      eventDto,
    );

    return responsePromise.then(
      (response) => {
        // return true if response status is in 200s
        return (
          !!response.status && response.status >= 200 && response.status < 300
        );
      },
      () => {
        // didn't receive a response
        // For now, we are just catching the error and returning false.
        // Eventually, we should log the error and handle it better
        return false;
      },
    );
  }

  /// Tracks events in a batch.
  ///
  /// This will return `true` if the events were successfully tracked, and `false` otherwise.
  public async trackBatch(eventDtos: MetricEventDto[]): Promise<boolean> {
    const batchBody = {
      events: eventDtos,
    };
    const responsePromise = authenticatedPost(
      `${this.baseUrl}/metric-events/batch`,
      this.apiKey,
      batchBody,
    );

    return responsePromise.then(
      (response) => {
        // return true if response status is in 200s
        return (
          !!response.status && response.status >= 200 && response.status < 300
        );
      },
      () => {
        // didn't receive a response
        // For now, we are just catching the error and returning false.
        // Eventually, we should log the error and handle it better
        return false;
      },
    );
  }
}
