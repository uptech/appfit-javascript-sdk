export interface AppFitEvent {
  readonly id: string;
  readonly name: string;
  readonly properties?: Record<string, string>;
  readonly occurredAt: string;
}

export function createAppFitEvent(
  name: string,
  properties?: Record<string, string>,
): AppFitEvent {
  return {
    id: crypto.randomUUID(),
    name,
    properties,
    occurredAt: new Date().toISOString(), // UTC ISO string
  };
}
