import type { RemoteTrack } from "livekit-client";
import type { IFFCRemoteTrack } from "./interfaces";
import { FFCTrack } from "./track";

/**
 * The `FFCRemoteTrack` class represents a remote media track in the FlipFlopCloud SDK.
 * It extends the `FFCTrack` class and provides additional functionality specific to remote tracks.
 * 
 * @template TrackKind - The type of the track, which defaults to `FFCTrack.Kind`.
 */
export default class FFCRemoteTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> extends FFCTrack<TrackKind> implements IFFCRemoteTrack<TrackKind> {
    protected _track: RemoteTrack;

  /** @internal */
  constructor(track: RemoteTrack) {
    super(track);
    this._track = track;
  }

  /** @internal */
  get instance(): RemoteTrack {
    return this._track;
  }

  /** @internal */
  get receiver(): RTCRtpReceiver | undefined {
    return this._track.receiver;
  }

  /**
   * Indicates whether the track is local.
   * 
   * @returns `false` because this is a remote track.
   */
  get isLocal(): boolean {
    return false;
  }

  /**
   * Starts the remote track.
   */
  start(): void {
    this._track.start();
  }

  /**
   * Stops the remote track.
   */
  stop(): void {
    this._track.stop();
  }

  /**
   * Retrieves the RTC stats report for the remote track.
   * 
   * @returns A promise that resolves to an `RTCStatsReport`, or `undefined` if not available.
   */
  getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
    return this._track.getRTCStatsReport();
  }

  /**
   * Sets the playout delay for the remote track.
   * 
   * @param delayInSeconds - The delay in seconds to set for playout.
   */
  setPlayoutDelay(delayInSeconds: number): void {
    this._track.setPlayoutDelay(delayInSeconds);
  }

  /**
   * Gets the current playout delay for the remote track.
   * 
   * @returns The playout delay in seconds.
   */
  getPlayoutDelay(): number {
    return this._track.getPlayoutDelay();
  }

  /**
   * Registers a time synchronization update for the remote track.
   */
  registerTimeSyncUpdate(): void {
    this._track.registerTimeSyncUpdate();
  }
}
