import type { LocalTrackPublication } from "livekit-client";
import type { IFFCLocalTrackPublication } from "./interfaces";
import { FFCTrackPublication } from "./track-publication";
import { wrapTrack } from "../wrapper-track";
import type { FFCLocalTrack } from "./track-local";
import { FFCTrackPublishOptions } from "./options";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCLocalVideoTrack from "./track-local-video";
import { FFCAudioTrackFeature } from "../protocol";

export default class FFCLocalTrackPublication extends FFCTrackPublication implements IFFCLocalTrackPublication {
  protected _trackPublication: LocalTrackPublication;

  /** @internal */
  constructor(trackPublication: LocalTrackPublication) {
    super(trackPublication);
    this._trackPublication = trackPublication;
  }

  get track(): FFCLocalTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCLocalTrack;
    }
  }

  get options(): FFCTrackPublishOptions | undefined {
    return this._trackPublication.options
    ? FFCTrackPublishOptions.fromTrackPublishOptions(this._trackPublication.options)
    : undefined;
  }

  get isUpstreamPaused(): boolean | undefined{
    return this._trackPublication.isUpstreamPaused;
  }

  setTrack(track?: FFCLocalTrack): void {
    this._trackPublication.setTrack(track?.instance);
  }

  get isMuted(): boolean {
    return this._trackPublication.isMuted;
  }

  get audioTrack(): FFCLocalAudioTrack | undefined {
    if (this._trackPublication.audioTrack) {
      return wrapTrack(this._trackPublication.audioTrack) as FFCLocalAudioTrack;
    }
  }

  get videoTrack(): FFCLocalVideoTrack | undefined {
    if (this._trackPublication.videoTrack) {
      return wrapTrack(this._trackPublication.videoTrack) as FFCLocalVideoTrack;
    }
  }

  get isLocal(): boolean {
    return true;
  }

  async mute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return wrapTrack(await track.mute()) as FFCLocalTrack;
  }

  async unmute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return wrapTrack(await track.unmute()) as FFCLocalTrack;
  }

  async pauseUpstream(): Promise<void> {
    return this._trackPublication.track?.pauseUpstream();
  }

  async resumeUpstream(): Promise<void> {
    return this._trackPublication.track?.resumeUpstream();
  }

  getTrackFeatures(): Array<FFCAudioTrackFeature> {
    return this._trackPublication.getTrackFeatures().map((feature) => FFCAudioTrackFeature.fromAudioTrackFeature(feature));
  }
}
