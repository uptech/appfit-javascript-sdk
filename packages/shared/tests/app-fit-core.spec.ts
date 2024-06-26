import {
  AppFitCore,
  AppFitEvent,
  BrowserUserCache,
  EventDigester,
  IApiClient,
  IIpAddressClient,
  InMemoryEventCache,
} from '../src';

const mockApiClient: jest.Mocked<IApiClient> = {
  track: jest.fn(),
  trackBatch: jest.fn(),
};
const mockIpAdressClient: jest.Mocked<IIpAddressClient> = {
  getIpAddress: jest.fn().mockReturnValue(Promise.resolve('123.456.789.123')),
};
const eventCache = new InMemoryEventCache();
const userCache = new BrowserUserCache(
  () => 'mock-anonymous-user-uuid-abc',
  false,
);
const eventUUIDGenerator = jest.fn().mockReturnValue('mock-event-uuid-abc-def');
const testDigester = new EventDigester(mockApiClient, eventCache);
const appFitCore = new AppFitCore(
  testDigester,
  userCache,
  mockIpAdressClient,
  'web',
  { browser: { userAgent: 'test-agent' } },
  { appVersion: '1.0.0' },
  eventUUIDGenerator,
);

describe('AppFitCore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userCache.clear();
    eventCache.clear(); // clear failed events
    userCache.setUserId(); // set anonymous id
  });

  describe('with internet', () => {
    it('should call api client track with anonymous id', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(mockApiClient.track).toHaveBeenCalledTimes(1);
      expect(mockApiClient.track.mock.calls[0][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: undefined,
          sourceEventId: 'mock-event-uuid-abc-def',
          eventName: 'fakeEvent',
          origin: 'web',
          properties: {
            myProperty: 'myValue',
          },
          systemProperties: {
            browser: { userAgent: 'test-agent' },
            appVersion: '1.0.0',
          },
        },
        eventSource: 'appfit',
        version: '2',
      });
    });

    it('should call api client track with user id after identification', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      appFitCore.identify('fake-user-id');
      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      // expect internal identification call
      // and event call
      expect(mockApiClient.track).toHaveBeenCalledTimes(2);
      expect(mockApiClient.track.mock.calls[0][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: 'fake-user-id',
          sourceEventId: 'mock-event-uuid-abc-def',
          eventName: 'appfit_user_identified',
          origin: 'web',
          properties: {},
          systemProperties: {
            browser: { userAgent: 'test-agent' },
            appVersion: '1.0.0',
          },
        },
        eventSource: 'appfit',
        version: '2',
      });
      expect(mockApiClient.track.mock.calls[1][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: 'fake-user-id',
          sourceEventId: 'mock-event-uuid-abc-def',
          eventName: 'fakeEvent',
          origin: 'web',
          properties: {
            myProperty: 'myValue',
          },
          systemProperties: {
            browser: { userAgent: 'test-agent' },
            appVersion: '1.0.0',
          },
        },
        eventSource: 'appfit',
        version: '2',
      });
    });

    it('should track AppFitEvents', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      const fakeEvent: AppFitEvent = {
        id: 'pre-made-event-id',
        name: 'pre-made-fakeEvent',
        properties: { myProperty: 'myValue' },
      };
      await appFitCore.trackAppFitEvent(fakeEvent);

      expect(mockApiClient.track).toHaveBeenCalledTimes(1);
      expect(mockApiClient.track.mock.calls[0][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: undefined,
          sourceEventId: 'pre-made-event-id',
          eventName: 'pre-made-fakeEvent',
          origin: 'web',
          properties: {
            myProperty: 'myValue',
          },
          systemProperties: {
            browser: { userAgent: 'test-agent' },
            appVersion: '1.0.0',
          },
        },
        eventSource: 'appfit',
        version: '2',
      });
    });

    it('should NOT cache the event', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(0);
    });

    it('should NOT cache a user ID without identification', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getUserId()).toBe(undefined);
    });

    it('should cache a user ID after identification', async () => {
      mockApiClient.track.mockReturnValueOnce(Promise.resolve(true));

      appFitCore.identify('fake-user-id');
      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getUserId()).toBe('fake-user-id');
    });

    it('should cache an ip address', async () => {
      mockApiClient.track.mockReturnValueOnce(Promise.resolve(true));

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getIpAddress()).toBe('123.456.789.123');
    });

    it('should not cache ip if enableIpTracking option is false', async () => {
      mockApiClient.track.mockReturnValueOnce(Promise.resolve(true));

      const nonTrackingAppFitCore = new AppFitCore(
        testDigester,
        userCache,
        mockIpAdressClient,
        'web',
        { browser: { userAgent: 'test-agent' } },
        { appVersion: '1.0.5', enableIpTracking: false }, // disable tracking
        eventUUIDGenerator,
      );

      await nonTrackingAppFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getIpAddress()).toBeUndefined();
    });

    it('should track even if ip address call fails', async () => {
      mockApiClient.track.mockReturnValueOnce(Promise.resolve(true));
      mockIpAdressClient.getIpAddress.mockReturnValueOnce(Promise.reject());

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(mockApiClient.track).toHaveBeenCalledTimes(1);
    });
  });

  describe('without internet', () => {
    it('should cache a failed call', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);

      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);
      expect(eventCache.entries[0].id).toBe('mock-event-uuid-abc-def');
    });

    it('should batch digest after successful event tracking', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);
      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);

      mockApiClient.track.mockResolvedValueOnce(true);
      mockApiClient.trackBatch.mockResolvedValueOnce(true);
      eventUUIDGenerator.mockReturnValueOnce('mock-event-uuid-abc-def2');
      await appFitCore.track('fakeEvent2', { myProperty: 'myValue2' });

      const mockBatchPayload = mockApiClient.trackBatch.mock.calls[0][0];
      expect(eventCache.entries.length).toBe(0);
      expect(mockApiClient.trackBatch).toHaveBeenCalledTimes(1);
      expect(mockBatchPayload.length).toEqual(1);
      expect(mockBatchPayload[0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: undefined,
          sourceEventId: 'mock-event-uuid-abc-def',
          eventName: 'fakeEvent',
          origin: 'web',
          properties: {
            myProperty: 'myValue',
          },
          systemProperties: {
            browser: { userAgent: 'test-agent' },
            appVersion: '1.0.0',
          },
        },
        eventSource: 'appfit',
        version: '2',
      });
    });

    it('should not clear event cache if batch digest fails', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);
      await appFitCore.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);

      mockApiClient.track.mockResolvedValueOnce(true);
      mockApiClient.trackBatch.mockResolvedValueOnce(false);
      eventUUIDGenerator.mockReturnValueOnce('mock-event-uuid-abc-def2');
      await appFitCore.track('fakeEvent2', { myProperty: 'myValue2' });

      expect(eventCache.entries.length).toBe(1);
      expect(mockApiClient.trackBatch).toHaveBeenCalledTimes(1);
    });
  });
});
