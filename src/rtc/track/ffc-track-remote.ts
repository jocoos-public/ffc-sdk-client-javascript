import { RemoteTrack } from "livekit-client";
import { FFCTrack } from "./ffc-track";

export default abstract class FFCRemoteTrack<
  FFCTrackKind extends FFCTrack.Kind = FFCTrack.Kind
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