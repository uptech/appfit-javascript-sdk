import { IUserCache } from './events/models/user-cache.interface';
import { generateNewUuid, UUID } from './utils/uuid';
import { IEventDigest } from './events/event-digester';
import {
  createAnalyticEvent,
  createAnalyticEventFromAppFitEvent,
} from './events/models/analytic-event';
import { EventUserIdentifier } from './models/event-user-indentifier';
import {
  AppFitEvent,
  AppFitEventSystemProperties,
} from './events/models/appfit-event';
import { AppFitConfigurationOptions } from './models/appfit-configuration';
import { IIpAddressClient } from './networking/ip-address-client';

/** @internal */
export interface IAppFitCore {
  track(
    eventName: string,
    payload: Record<string, string>,
    userData?: EventUserIdentifier,
  ): Promise<void>;
  trackAppFitEvent(
    appFitEvent: AppFitEvent,
    userData?: EventUserIdentifier,
  ): Promise<void>;
  identify(userId?: string): void;
}

/** @internal */
export class AppFitCore implements IAppFitCore {
  private readonly options: AppFitConfigurationOptions;

  constructor(
    private readonly eventDigester: IEventDigest,
    private readonly userCache?: IUserCache,
    private readonly ipClient?: IIpAddressClient,
    private readonly origin?: string,
    private readonly systemProperties: AppFitEventSystemProperties = {},
    options: AppFitConfigurationOptions = {},
    private readonly generateUuid: () => UUID = generateNewUuid,
  ) {
    this.userCache?.setAnonymousId();

    // set defaults for some properties
    this.options = {
      enableIpTracking: true,
      ...options,
    };

    // this gets passed in as config option, but we consume it as a
    // system property
    if (this.options.appVersion) {
      this.systemProperties.appVersion = options.appVersion;
    }

    // This is a unique event that is used specifically to track when the
    // AppFit SDK has been initialized.
    // This is an internal event.
    this.track('appfit_sdk_initialized', {});
  }

  /**
   * Creates and then digests an event with the provided [eventName] and [properties]
   *
   * @param {string} eventName A unique name for an event to track
   * @param {Record<string, string>} payload An object that can contain additional data to track with event
   * @param {EventUserIdentifier} userData An object that has optional user identifiers
   * @returns `Promise<void>`
   */
  async track(
    eventName: string,
    payload: Record<string, string>,
    userData?: EventUserIdentifier,
  ) {
    const id = this.generateUuid();
    const userId = userData?.userId ?? this.userCache?.getUserId();
    const anonymousId =
      userData?.anonymousId ?? this.userCache?.getAnonymousId();
    const ipAddress = await this.getIpAddress();

    const event = createAnalyticEvent(
      id,
      eventName,
      this.origin,
      userId,
      anonymousId,
      payload,
      { ...this.systemProperties, ipAddress },
    );
    return this.eventDigester.digest(event);
  }

  /**
   * Creates and then digests an event with the provided [AppFitEvent]
   *
   * @param {AppFitEvent} appFitEvent An AppFitEvent to track
   * @param {EventUserIdentifier} userData An object that has optional user identifiers
   * @returns `Promise<void>`
   */
  async trackAppFitEvent(
    appFitEvent: AppFitEvent,
    userData?: EventUserIdentifier,
  ) {
    const userId = userData?.userId ?? this.userCache?.getUserId();
    const anonymousId =
      userData?.anonymousId ?? this.userCache?.getAnonymousId();
    const ipAddress = await this.getIpAddress();

    const event = createAnalyticEventFromAppFitEvent(
      appFitEvent,
      this.origin,
      userId,
      anonymousId,
      { ...this.systemProperties, ipAddress },
    );
    return this.eventDigester.digest(event);
  }

  /// Identifies the user with the provided [userId].
  ///
  /// This is used to identify the user in the AppFit dashboard.
  /// When passing in `undefined`, the user will be un-identified,
  /// resulting in the user being anonymous.
  identify(userId?: string) {
    if (!this.userCache) {
      return;
    }

    this.userCache.setUserId(userId);

    // This is a unique event that is used specifically to track when the
    // AppFit SDK has been identified a user
    // This is an internal event.
    this.track('appfit_user_identified', {});
  }

  private async getIpAddress(): Promise<string | undefined> {
    if (!this.options.enableIpTracking) {
      return undefined;
    }

    const ipAddress = this.userCache?.getIpAddress();
    if (ipAddress) {
      return ipAddress;
    }

    let fetchedIp: string | undefined;
    try {
      fetchedIp = await this.ipClient?.getIpAddress();
    } catch {
      return undefined;
    }

    if (fetchedIp) {
      this.userCache?.setIpAddress(fetchedIp, 60 * 1000);
    }

    return fetchedIp;
  }
}
