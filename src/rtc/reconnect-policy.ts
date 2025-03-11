import { DefaultReconnectPolicy, type ReconnectContext, type ReconnectPolicy } from "livekit-client";

export interface FFCReconnectPolicy extends ReconnectPolicy{
  /** Called after disconnect was detected
   *
   * @returns {number | null} Amount of time in milliseconds to delay the next reconnect attempt, `null` signals to stop retrying.
   */
  nextRetryDelayInMs(context: FFCReconnectContext): number | null;
}

export interface FFCReconnectContext extends ReconnectContext {}

export class FFCDefaultReconnectPolicy implements FFCReconnectPolicy {
  protected _reconnectPolicy: ReconnectPolicy;

  constructor(retryDelays?: number[]) {
    this._reconnectPolicy = new DefaultReconnectPolicy(retryDelays);
  }

  nextRetryDelayInMs(context: FFCReconnectContext): number | null {
    return this._reconnectPolicy.nextRetryDelayInMs(context);
  }
}
