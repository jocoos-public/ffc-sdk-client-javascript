import { LocalAudioTrack } from "livekit-client";
import { FFCLocalTrack } from "./track-local";
import type { IFFCLocalAudioTrack } from "./interfaces";
import type { FFCAudioSenderStats } from "../stats";
import { FFCAudioCaptureOptions } from "./options";
import { FFCAudioTrackProcessor } from "./processor/types";
import type { FFCTrack } from "./track";
import type { FFCLoggerOptions } from "../types";

/**
 * The `FFCLocalAudioTrack` class represents a local audio track in the FlipFlopCloud SDK.
 * It extends the `FFCLocalTrack` class and provides additional functionality specific to local audio tracks.
 */
export default class FFCLocalAudioTrack extends FFCLocalTrack<FFCTrack.Kind.Audio> implements IFFCLocalAudioTrack {
    protected _track: LocalAudioTrack;

  /** @internal */
  constructor(track: LocalAudioTrack);
  /**
   * Creates an instance of `FFCLocalAudioTrack`.
   * 
   * @param mediaTrack - A `MediaStreamTrack` instance.
   * @param constraints - (Optional) Media constraints for the track.
   * @param userProvidedTrack - (Optional) Whether the track is user-provided.
   * @param audioContext - (Optional) The `AudioContext` instance for the track.
   * @param loggerOptions - (Optional) Logger options for the track.
   */
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

  /**
   * Indicates whether enhanced noise cancellation is enabled for the audio track.
   * 
   * @returns `true` if enhanced noise cancellation is enabled, otherwise `false`.
   */
  get enhancedNoiseCancellation(): boolean {
    return this._track.enhancedNoiseCancellation;
  }

  /**
   * Mutes the audio track.
   * 
   * @returns A promise that resolves to the current `FFCLocalAudioTrack` instance.
   */
  async mute(): Promise<this> {
    await this._track.mute();
    return this;
  }

  /**
   * Unmutes the audio track.
   * 
   * @returns A promise that resolves to the current `FFCLocalAudioTrack` instance.
   */
  async unmute(): Promise<this> {
    await this._track.unmute();
    return this;
  }

  /**
   * Restarts the audio track with new capture options.
   * 
   * @param options - (Optional) The audio capture options to apply.
   * @returns A promise that resolves when the track is restarted.
   */
  restartTrack(options?: FFCAudioCaptureOptions): Promise<void> {
    return this._track.restartTrack(options
      ? FFCAudioCaptureOptions.toAudioCaptureOptions(options)
      : undefined
    );
  }

  /**
   * Sets a processor for the audio track.
   * 
   * @param processor - The audio track processor to set.
   * @returns A promise that resolves when the processor is set.
   */
  setProcessor(processor: FFCAudioTrackProcessor): Promise<void> {
    return this._track.setProcessor(FFCAudioTrackProcessor.toTrackProcessor(processor));
  }

  /**
   * Retrieves the sender statistics for the audio track.
   * 
   * @returns A promise that resolves to the sender statistics as `FFCAudioSenderStats`, or `undefined` if not available.
   */
  getSenderStats(): Promise<FFCAudioSenderStats | undefined> {
    return this._track.getSenderStats();
  }

  /**
   * Checks if the audio track is silent.
   * 
   * @returns A promise that resolves to `true` if the track is silent, otherwise `false`.
   */
  checkForSilence(): Promise<boolean> {
    return this._track.checkForSilence();
  }
}