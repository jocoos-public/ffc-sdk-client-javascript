import { RemoteTrack } from "livekit-client";
import { FFCTrack } from "./ffc-track";
import type { FFCTrackKind } from "./ffc-track-types";

export default abstract class FFCRemoteTrack<
  TrackKind extends FFCTrackKind = FFCTrackKind
> extends FFCTrack<FFCTrackKind> {
  protected _track: RemoteTrack;

  constructor(track: RemoteTrack) {
    super(track);
    this._track = track;
  }

  get isLocal(): boolean {
    return false;
  }

  start(): void {
    this._track.start();
  }

  stop(): void {
    this._track.stop();
  }

  async getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
    return this._track.getRTCStatsReport();
  }

  setPlayoutDelay(delayInSeconds: number): void {
    this._track.setPlayoutDelay(delayInSeconds);
  }

  getPlayoutDelay(): number {
    return this._track.getPlayoutDelay();
  }

  registerTimeSyncUpdate(): void {
    this._track.registerTimeSyncUpdate();
  }
}