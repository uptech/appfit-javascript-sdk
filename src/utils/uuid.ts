export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export function generateUuid(): UUID {
  return crypto.randomUUID();
}
