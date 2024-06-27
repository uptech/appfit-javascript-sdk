/** @internal */
export interface IIpAddressClient {
  getIpAddress(): Promise<string | undefined>;
}

export class IpAddressClient implements IIpAddressClient {
  private readonly url = 'https://api.ipgeolocation.io/getip';

  /// Fetches an IP address.
  ///
  /// This will the address if available
  public async getIpAddress(): Promise<string | undefined> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Couldn't determine ip address`);
    }
    const data = await response.json();
    if (!data) {
      throw new Error(`Unexpected response`);
    }

    return data.ip;
  }
}
