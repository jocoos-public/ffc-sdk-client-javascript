import type { ReconnectContext } from "livekit-client";

const maxRetryDelay = 7000;

const DEFAULT_RETRY_DELAYS_IN_MS = [
  0,
  300,
  2 * 2 * 300,
  3 * 3 * 300,
  4 * 4 * 300,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
  maxRetryDelay,
];

export interface FFCReconnectPolicy {
  /** Called after disconnect was detected
   *
   * @returns {number | null} Amount of time in milliseconds to delay the next reconnect attempt, `null` signals to stop retrying.
   */
  nextRetryDelayInMs(context: FFCReconnectContext): number | null;
}

export interface FFCReconnectContext extends ReconnectContext {}

class FFCDefaultReconnectPolicy implements FFCReconnectPolicy {
  private readonly _retryDelays: number[];

  constructor(retryDelays?: number[]) {
    this._retryDelays = retryDelays !== undefined ? [...retryDelays] : DEFAULT_RETRY_DELAYS_IN_MS;
  }

  public nextRetryDelayInMs(context: ReconnectContext): number | null {
    if (context.retryCount >= this._retryDelays.length) return null;

    const retryDelay = this._retryDelays[context.retryCount];
    if (context.retryCount <= 1) return retryDelay;

    return retryDelay + Math.random() * 1_000;
  }
}

export default FFCDefaultReconnectPolicy;
