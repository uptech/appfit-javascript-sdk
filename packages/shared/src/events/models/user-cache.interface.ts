/** @internal */
export interface IUserCache {
  setUserId(userId?: string): void;
  getUserId(): string | undefined;
  clear(): void;
  setAnonymousId(): string;
  getAnonymousId(): string | undefined;
  setIpAddress(ipAddress: string, durationMS: number): void;
  getIpAddress(): string | undefined;
}
