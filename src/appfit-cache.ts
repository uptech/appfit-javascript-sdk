enum AppFitCacheKey {
  USER_ID = 'APPFIT_userId',
  ANONYMOUS = 'APPFIT_anonymousId',
}

class AppfitCache {
  readonly backupCache: Record<string, string | null> = {};

  /// Sets the [userId] in local storage.
  /// If the [userId] is `null`, it will be removed from the cache.
  /// This is used to identify the user in the AppFit dashboard.
  ///
  /// When setting the [userId], the [anonymousId] will be removed.
  setUserId(userId?: string) {
    if (!userId) {
      this.removeCache(AppFitCacheKey.USER_ID);
      this.useAnonymousId();
      return;
    }

    this.setCache(AppFitCacheKey.USER_ID, userId);
  }

  clearCache() {
    this.removeCache(AppFitCacheKey.USER_ID);
    this.removeCache(AppFitCacheKey.ANONYMOUS);
  }

  /// Generates an anonymous id if it does not exist.
  /// This is used to identify the user in the AppFit dashboard.
  /// This checks to see if a `userId` exists, if it does not, it will generate an anonymous id.
  private useAnonymousId() {
    const cachedAnonymousId = this.getCachedAnonymousId();
    if (cachedAnonymousId) {
      return cachedAnonymousId;
    }

    // Since we don't have an anonymousId, we need to generate one
    return this.setAnonymousId();
  }

  private getCachedAnonymousId(): string | null {
    return this.readCache(AppFitCacheKey.ANONYMOUS);
  }

  private setAnonymousId(): string {
    const anonymousId = crypto.randomUUID();
    this.setCache(AppFitCacheKey.ANONYMOUS, anonymousId);
    return anonymousId;
  }

  private setCache(key: string, value: string) {
    if (this.hasLocalStorageExistence()) {
      localStorage.setItem(key, value);
      return;
    }

    this.backupCache[key] = value;
  }

  private readCache(key: string): string | null {
    if (this.hasLocalStorageExistence()) {
      return localStorage.getItem(key);
    }

    return this.backupCache[key] ?? null;
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
