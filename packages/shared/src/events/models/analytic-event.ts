/**
 * Our AppFit internal business model for events
 * */
import { AppFitEvent } from './appfit-event';

/** @internal */
interface AnalyticEventSystemProperties {
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
export interface AnalyticEvent {
  readonly id: string;
  readonly eventName: string;
  readonly origin?: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: AnalyticEventSystemProperties;
  readonly occurredAt: string;
}

/** @internal */
export function createAnalyticEvent(
  id: string,
  eventName: string,
  origin?: string,
  userId?: string,
  anonymousId?: string,
  properties?: Record<string, string>,
  systemProperties?: AnalyticEventSystemProperties,
): AnalyticEvent {
  return {
    id,
    eventName,
    origin,
    userId,
    anonymousId,
    properties,
    systemProperties,
    occurredAt: new Date().toISOString(), // UTC ISO string
  };
}

/** @internal */
export function createAnalyticEventFromAppFitEvent(
  event: AppFitEvent,
  origin?: string,
  userId?: string,
  anonymousId?: string,
  systemProperties?: AnalyticEventSystemProperties,
): AnalyticEvent {
  return {
    id: event.id,
    eventName: event.name,
    origin,
    userId,
    anonymousId,
    properties: event.properties,
    systemProperties,
    occurredAt: new Date().toISOString(), // UTC ISO string
  };
}
