/**
 * Our AppFit internal business model for events
 * */
import { AppFitEvent } from './appfit-event';

/** @internal */
export interface AnalyticEvent {
  readonly id: string;
  readonly name: string;
  readonly userId?: string;
  readonly anonymousId?: string;
  readonly properties?: Record<string, string>;
  readonly systemProperties?: Record<string, string>;
  readonly occurredAt: string;
}

/** @internal */
export function createAnalyticEvent(
  id: string,
  name: string,
  userId?: string,
  anonymousId?: string,
  properties?: Record<string, string>,
  systemProperties?: Record<string, string>,
): AnalyticEvent {
  return {
    id,
    name,
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
  userId?: string,
  anonymousId?: string,
  systemProperties?: Record<string, string>,
): AnalyticEvent {
  return {
    id: event.id,
    name: event.name,
    userId,
    anonymousId,
    properties: event.properties,
    systemProperties,
    occurredAt: new Date().toISOString(), // UTC ISO string
  };
}
