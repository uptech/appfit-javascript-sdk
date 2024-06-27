import { BrowserUserCache } from './browser-user-cache';

describe('BrowserUserCache', () => {
  let userCache: BrowserUserCache;
  jest.useFakeTimers();

  beforeEach(() => {
    userCache = new BrowserUserCache(
      () => 'mock-anonymous-user-uuid-abc',
      false,
    );
  });

  it('caches user id', () => {
    userCache.setUserId('mock-user-id');
    expect(userCache.getUserId()).toBe('mock-user-id');
  });

  it('clears the user id if none is passed in', () => {
    userCache.setUserId();
    expect(userCache.getUserId()).toBeUndefined();
  });

  it('caches anonymous id', () => {
    userCache.setAnonymousId();
    expect(userCache.getAnonymousId()).toBe('mock-anonymous-user-uuid-abc');
  });

  it('caches ip address', () => {
    userCache.setIpAddress('123.456.789.123', 1000);
    expect(userCache.getIpAddress()).toBe('123.456.789.123');
  });

  it('expires cached ip addresses', () => {
    jest.setSystemTime(1000);
    userCache.setIpAddress('123.456.789.123', 1000);
    jest.setSystemTime(2001);
    expect(userCache.getIpAddress()).toBeUndefined();
  });

  it('returns ip address up to time duration', () => {
    jest.setSystemTime(1000);
    userCache.setIpAddress('123.456.789.123', 1000);
    jest.setSystemTime(2000);
    expect(userCache.getIpAddress()).toBe('123.456.789.123');
  });

  it(`clears all cache on 'clearCache'`, () => {
    userCache.setUserId('mock-user-id');
    userCache.setAnonymousId();
    userCache.setIpAddress('123.456.789.123', 1000);
    userCache.clearCache();

    expect(userCache.getUserId()).toBeUndefined();
    expect(userCache.getAnonymousId()).toBeUndefined();
    expect(userCache.getIpAddress()).toBeUndefined();
  });
});
