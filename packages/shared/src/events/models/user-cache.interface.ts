/** @internal */
export interface IUserCache {
  setUserId(userId?: string): void;
  getUserId(): string | undefined;
  clearCache(): void;
  setAnonymousId(): string;
  getAnonymousId(): string | undefined;
  setIpAddress(ipAddress: string, durationMS: number): void;
  getIpAddress(): string | undefined;
}
