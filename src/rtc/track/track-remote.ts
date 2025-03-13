import type { RemoteTrack } from "livekit-client";
import type { IFFCRemoteTrack } from "./interfaces";
import { FFCTrack } from "./track";


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

  get isLocal(): boolean {
    return false;
  }

  start(): void {
    this._track.start();
  }

  stop(): void {
    this._track.stop();
  }

  getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
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
