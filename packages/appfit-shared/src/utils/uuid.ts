export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/** @internal */
export function generateNewUuid(): UUID {
  return crypto.randomUUID();
}
