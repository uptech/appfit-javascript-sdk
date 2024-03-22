import { UUID } from '../../utils/uuid';

export interface AppFitEvent {
  readonly id: string;
  readonly name: string;
  readonly properties?: Record<string, string>;
  readonly occurredAt: string;
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
    occurredAt: new Date().toISOString(), // UTC ISO string
  };
}
