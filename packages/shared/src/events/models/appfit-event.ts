import { UUID } from '../../utils/uuid';

/**
 * A trackable event to be ingested by AppFit
 * */
// this is a public interface, not an internal business model
export interface AppFitEvent {
  readonly id: string;
  readonly name: string;
  readonly properties?: Record<string, string>;
}

/**
 * Trackable system properties for AppFit events
 * */
export interface AppFitEventSystemProperties {
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
export function createAppFitEvent(
  id: UUID,
  name: string,
  properties?: Record<string, string>,
): AppFitEvent {
  return {
    id,
    name,
    properties,
  };
}
