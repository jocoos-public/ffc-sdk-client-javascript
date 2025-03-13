import { LocalAudioTrack } from "livekit-client";
import { FFCLocalTrack } from "./track-local";
import type { IFFCLocalAudioTrack } from "./interfaces";
import type { FFCAudioSenderStats } from "../stats";
import { FFCAudioCaptureOptions } from "./options";
import { FFCAudioTrackProcessor } from "./processor/types";
import type { FFCTrack } from "./track";
import type { FFCLoggerOptions } from "../types";

export default class FFCLocalAudioTrack extends FFCLocalTrack<FFCTrack.Kind.Audio> implements IFFCLocalAudioTrack {
  protected _track: LocalAudioTrack;

  /** @internal */
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

  /** @internal */
  get instance(): LocalAudioTrack {
    return this._track;
  }

  /** @internal */
  get stopOnMute(): boolean {
    return this._track.stopOnMute;
  }

  /** @internal */
  set stopOnMute(value: boolean) {
    this._track.stopOnMute = value;
  }

  get enhancedNoiseCancellation(): boolean {
    return this._track.enhancedNoiseCancellation;
  }

  async mute(): Promise<typeof this> {
    await this._track.mute();
    return this;
  }

  async unmute(): Promise<typeof this> {
    await this._track.unmute();
    return this;
  }

  restartTrack(options?: FFCAudioCaptureOptions): Promise<void> {
    return this._track.restartTrack(options
      ? FFCAudioCaptureOptions.toAudioCaptureOptions(options)
      : undefined
    );
  }

  setProcessor(processor: FFCAudioTrackProcessor): Promise<void> {
    return this._track.setProcessor(FFCAudioTrackProcessor.toTrackProcessor(processor));
  }

  getSenderStats(): Promise<FFCAudioSenderStats | undefined> {
    return this._track.getSenderStats();
  }

  checkForSilence(): Promise<boolean> {
    return this._track.checkForSilence();
  }
}