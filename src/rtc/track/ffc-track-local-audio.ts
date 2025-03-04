import { LocalAudioTrack } from "livekit-client";
import type { FFCTrack } from "./ffc-track";
import FFCLocalTrack from "./ffc-track-local";
import { type FFCAudioSenderStats } from "../ffc-stats";
import { type FFCAudioCaptureOptions } from "./ffc-track-options";
import type { FFCLoggerOptions } from "../ffc-options";

export default class FFCLocalAudioTrack extends FFCLocalTrack<FFCTrack.Kind.AUDIO> {
  protected _track: LocalAudioTrack;

  constructor(track: LocalAudioTrack);
  constructor(mediaTrack: MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack?: boolean, audioContext?: AudioContext, loggerOptions?: FFCLoggerOptions);
  constructor(trackOrMediaTrack: LocalAudioTrack | MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack = true, audioContext?: AudioContext, loggerOptions?: FFCLoggerOptions) {
    let track: LocalAudioTrack;
    if (trackOrMediaTrack instanceof LocalAudioTrack) {
      track = trackOrMediaTrack;
    } else {
      track = new LocalAudioTrack(trackOrMediaTrack, constraints, userProvidedTrack, audioContext, loggerOptions);
    }
    super(track);
    this._track = track;
  }

  get enhancedNoiseCancellation(): boolean {
    return this._track.enhancedNoiseCancellation;
  }

  async mute(): Promise<typeof this> {
    this._track.mute();
    return this;
  }

  async unmute(): Promise<typeof this> {
    this._track.unmute();
    return this;
  }

  async restartTrack(opts?: FFCAudioCaptureOptions): Promise<void> {
    return this._track.restartTrack(opts);
  }

  setAudioContext(ctx: AudioContext | undefined): void {
    this._track.setAudioContext(ctx);
  }

  async getSenderStats(): Promise<FFCAudioSenderStats | undefined> {
    return this._track.getSenderStats();
  }

  async checkForSilence(): Promise<boolean> {
    return this._track.checkForSilence();
  }
}