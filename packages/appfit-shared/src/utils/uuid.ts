export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/** @internal */
export function generateUuid(): UUID {
  return crypto.randomUUID();
}
