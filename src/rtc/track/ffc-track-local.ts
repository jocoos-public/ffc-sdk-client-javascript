import { LocalTrack } from "livekit-client";
import { FFCTrack } from "./ffc-track";
import { type FFCReplaceTrackOptions } from "./ffc-track-types";

export default abstract class FFCLocalTrack<
  FFCTrackKind extends FFCTrack.Kind = FFCTrack.Kind
> extends FFCTrack<FFCTrackKind> {
  protected _track: LocalTrack;

  constructor(track: LocalTrack) {
    super(track);
    this._track = track;
  }

  /* @internal */
  get instance(): LocalTrack {
    return this._track;
  }

  get constraints(): MediaTrackConstraints {
    return this._track.constraints;
  }

  get id(): string {
    return this._track.id;
  }

  get dimensions(): FFCTrack.Dimensions | undefined {
    return this._track.dimensions;
  }

  get isUpstreamPaused(): boolean {
    return this._track.isUpstreamPaused;
  }

  get isUserProvided(): boolean {
    return this._track.isUserProvided;
  }

  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  get isLocal(): boolean {
    return true;
  }

  async waitForDimensions(timeoutMs: number = 5000): Promise<FFCTrack.Dimensions> {
    return this._track.waitForDimensions(timeoutMs);
  }

  async setDeviceId(deviceId: ConstrainDOMString): Promise<boolean> {
    return this._track.setDeviceId(deviceId);
  }

  async getDeviceId(normalize = true): Promise<string | undefined> {
    return this._track.getDeviceId(normalize);
  }

  abstract restartTrack(constraints?: unknown): Promise<void>;

  async mute(): Promise<FFCLocalTrack<FFCTrackKind>> {
    this._track.mute();
    return this;
  }

  async unmute(): Promise<FFCLocalTrack<FFCTrackKind>> {
    this._track.unmute();
    return this;
  }

  async replaceTrack(track: MediaStreamTrack, options?: FFCReplaceTrackOptions): Promise<typeof this>;
  async replaceTrack(track: MediaStreamTrack, userProvidedTrack?: boolean): Promise<typeof this>;
  async replaceTrack(track: MediaStreamTrack, userProvidedOrOptions: boolean | FFCReplaceTrackOptions | undefined): Promise<typeof this> {
    if (typeof userProvidedOrOptions === 'boolean') {
      this._track.replaceTrack(track, userProvidedOrOptions);
    } else if (userProvidedOrOptions){
      this._track.replaceTrack(track, userProvidedOrOptions);
    } else {
      this._track.replaceTrack(track, userProvidedOrOptions);
    }
    return this;
  }

  stop(): void {
    this._track.stop();
  }

  async pauseUpstream(): Promise<void> {
    this._track.pauseUpstream();
  }

  async resumeUpstream(): Promise<void> {
    this._track.resumeUpstream();
  }

  async getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
    return this._track.getRTCStatsReport();
  }
}