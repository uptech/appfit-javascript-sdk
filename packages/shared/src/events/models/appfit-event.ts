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
