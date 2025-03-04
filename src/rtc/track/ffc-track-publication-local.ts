import { LocalTrackPublication } from "livekit-client";
import FFCLocalTrack from "./ffc-track-local";
import { FFCTrackPublication } from "./ffc-track-publication";
import FFCLocalAudioTrack from "./ffc-track-local-audio";
import FFCLocalVideoTrack from "./ffc-track-local-video";
import { FFCTrack } from "./ffc-track";
import { type FFCTrackPublishOptions, toFFCTrackPublishOptions } from "./ffc-track-options";
import { FFCAudioTrackFeature, toFFCAudioTrackFeature } from "../ffc-protocol-enums";

export class FFCLocalTrackPublication extends FFCTrackPublication {
  protected _trackPublication: LocalTrackPublication;
  
  constructor(publication: LocalTrackPublication) {
    super(publication);
    this._trackPublication = publication;
  }

  get track(): FFCLocalTrack | undefined {
    const track = this._trackPublication.track;
    if (!track) {
      return undefined;
    }
    return FFCTrack.wrap(track) as FFCLocalTrack;
  }

  get options(): FFCTrackPublishOptions | undefined{
    return toFFCTrackPublishOptions(this._trackPublication.options);
  }

  get isUpstreamPaused(): boolean | undefined {
    return this._trackPublication.track?.isUpstreamPaused;
  }

  get isMuted(): boolean {
    return this._trackPublication.isMuted;
  }

  get audioTrack(): FFCLocalAudioTrack | undefined {
    return super.audioTrack as FFCLocalAudioTrack | undefined;
  }

  get videoTrack(): FFCLocalVideoTrack | undefined {
    return super.videoTrack as FFCLocalVideoTrack | undefined;
  }

  get isLocal(): boolean {
    return true;
  }

  setTrack(track?: FFCTrack) {
    this._trackPublication.setTrack(track?.instance);
  }

  async mute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return FFCTrack.wrap(await track.mute()) as FFCLocalTrack;
  }

  async unmute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return FFCTrack.wrap(await track.unmute()) as FFCLocalTrack;
  }

  async pauseUpstream(): Promise<void> {
    return this._trackPublication.track?.pauseUpstream();
  }

  async resumeUpstream(): Promise<void> {
    return this._trackPublication.track?.resumeUpstream();
  }

  getTrackFeatures(): Array<FFCAudioTrackFeature> {
    return this._trackPublication.getTrackFeatures().map((feature) => toFFCAudioTrackFeature(feature));
  }
}
