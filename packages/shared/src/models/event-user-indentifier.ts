interface AnonymousUserIdentifier {
  anonymousId: string;
  userId: undefined;
}

interface UserIdIdentifier {
  anonymousId: undefined;
  userId: string;
}

interface UserIdAndAnonymousIdentifier {
  anonymousId: string;
  userId: string;
}

/** @internal */
export type EventUserIdentifier =
  | AnonymousUserIdentifier
  | UserIdIdentifier
  | UserIdAndAnonymousIdentifier;
