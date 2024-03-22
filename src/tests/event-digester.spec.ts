import { EventDigester } from '../events/event-digester';
import { ApiClient } from '../networking/api-client';
import { UserCache } from '../events/user-cache';
import { EventCache } from '../events/event-cache';

const mockApiClient: jest.Mocked<ApiClient> = {
  track: jest.fn(),
  trackBatch: jest.fn(),
};
const eventCache = new EventCache();
const userCache = new UserCache(() => 'mock-anonymous-user-uuid-abc', false);
const eventUUIDGenerator = jest.fn().mockReturnValue('mock-event-uuid-abc-def');
const testDigester = new EventDigester(
  mockApiClient,
  eventCache,
  userCache,
  eventUUIDGenerator,
);

describe('EventDigester', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userCache.setUserId(); // clear user id
    eventCache.clear(); // clear failed events
  });

  describe('with internet', () => {
    it('should call api client track with anonymous id', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(mockApiClient.track).toHaveBeenCalledTimes(1);
      expect(mockApiClient.track.mock.calls[0][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: undefined,
          eventId: 'mock-event-uuid-abc-def',
          name: 'fakeEvent',
          properties: {
            myProperty: 'myValue',
          },
        },
      });
    });

    it('should call api client track with user id after identification', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      testDigester.identify('fake-user-id');
      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(mockApiClient.track).toHaveBeenCalledTimes(1);
      expect(mockApiClient.track.mock.calls[0][0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: 'fake-user-id',
          eventId: 'mock-event-uuid-abc-def',
          name: 'fakeEvent',
          properties: {
            myProperty: 'myValue',
          },
        },
      });
    });

    it('should NOT cache the event', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(0);
    });

    it('should NOT cache a user ID without identification', async () => {
      mockApiClient.track.mockResolvedValueOnce(true);

      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getUserId()).toBe(undefined);
    });

    it('should cache a user ID after identification', async () => {
      mockApiClient.track.mockReturnValueOnce(Promise.resolve(true));

      testDigester.identify('fake-user-id');
      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(userCache.getUserId()).toBe('fake-user-id');
    });
  });

  describe('without internet', () => {
    it('should cache a failed call', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);

      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);
      expect(eventCache.entries[0].id).toBe('mock-event-uuid-abc-def');
    });

    it('should batch digest after successful event tracking', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);
      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);

      mockApiClient.track.mockResolvedValueOnce(true);
      mockApiClient.trackBatch.mockResolvedValueOnce(true);
      eventUUIDGenerator.mockReturnValueOnce('mock-event-uuid-abc-def2');
      await testDigester.track('fakeEvent2', { myProperty: 'myValue2' });

      const mockBatchPayload = mockApiClient.trackBatch.mock.calls[0][0];
      expect(eventCache.entries.length).toBe(0);
      expect(mockApiClient.trackBatch).toHaveBeenCalledTimes(1);
      expect(mockBatchPayload.length).toEqual(1);
      expect(mockBatchPayload[0]).toMatchObject({
        payload: {
          anonymousId: 'mock-anonymous-user-uuid-abc',
          userId: undefined,
          eventId: 'mock-event-uuid-abc-def',
          name: 'fakeEvent',
          properties: {
            myProperty: 'myValue',
          },
        },
      });
    });

    it('should not clear event cache if batch digest fails', async () => {
      mockApiClient.track.mockResolvedValueOnce(false);
      await testDigester.track('fakeEvent', { myProperty: 'myValue' });

      expect(eventCache.entries.length).toBe(1);

      mockApiClient.track.mockResolvedValueOnce(true);
      mockApiClient.trackBatch.mockResolvedValueOnce(false);
      eventUUIDGenerator.mockReturnValueOnce('mock-event-uuid-abc-def2');
      await testDigester.track('fakeEvent2', { myProperty: 'myValue2' });

      expect(eventCache.entries.length).toBe(1);
      expect(mockApiClient.trackBatch).toHaveBeenCalledTimes(1);
    });
  });
});
