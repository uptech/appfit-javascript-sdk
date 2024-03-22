export interface IUserCache {
  setUserId(userId?: string): void;
  getUserId(): string | undefined;
  clearCache(): void;
  setAnonymousId(): string;
  getAnonymousId(): string | undefined;
}

enum UserCacheKey {
  USER_ID = 'APPFIT_userId',
  ANONYMOUS = 'APPFIT_anonymousId',
}

export class UserCache implements IUserCache {
  private readonly backupCache: Record<string, string | null> = {};

  /// Sets the [userId] in local storage.
  /// If the [userId] is `null`, it will be removed from the cache.
  /// This is used to identify the user in the AppFit dashboard.
  ///
  /// When setting the [userId], the [anonymousId] will be removed.
  setUserId(userId?: string) {
    if (!userId) {
      this.removeCache(UserCacheKey.USER_ID);
      this.setAnonymousId();
      return;
    }

    this.setCache(UserCacheKey.USER_ID, userId);
  }

  getUserId(): string | undefined {
    return this.readCache(UserCacheKey.USER_ID);
  }

  clearCache() {
    this.removeCache(UserCacheKey.USER_ID);
    this.removeCache(UserCacheKey.ANONYMOUS);
  }

  /// Generates an anonymous id if it does not exist.
  /// This is used to identify the user in the AppFit dashboard.
  /// This checks to see if a `userId` exists, if it does not, it will generate an anonymous id.
  setAnonymousId(): string {
    const cachedAnonymousId = this.getAnonymousId();
    if (cachedAnonymousId) {
      return cachedAnonymousId;
    }

    // Since we don't have an anonymousId, we need to generate one
    return this.generateAnonymousId();
  }

  getAnonymousId(): string | undefined {
    return this.readCache(UserCacheKey.ANONYMOUS);
  }

  private generateAnonymousId(): string {
    const anonymousId = crypto.randomUUID();
    this.setCache(UserCacheKey.ANONYMOUS, anonymousId);
    return anonymousId;
  }

  private setCache(key: string, value: string) {
    if (this.hasLocalStorageExistence()) {
      localStorage.setItem(key, value);
      return;
    }

    this.backupCache[key] = value;
  }

  private readCache(key: string): string | undefined {
    if (this.hasLocalStorageExistence()) {
      return localStorage.getItem(key) ?? undefined;
    }

    return this.backupCache[key] ?? undefined;
  }

  private removeCache(key: string) {
    if (this.hasLocalStorageExistence()) {
      return localStorage.removeItem(key);
    }

    this.backupCache[key] = null;
  }

  private hasLocalStorageExistence(): boolean {
    return !!global.localStorage;
  }
}
