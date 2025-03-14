import type { LocalTrack } from "livekit-client";
import type { IFFCLocalTrack } from "./interfaces";
import type { FFCReplaceTrackOptions } from "./types";
import { FFCTrackProcessor } from "./processor/types";
import { FFCTrack } from "./track";
import type { FFCVideoCodec } from "./options";

/**
 * The `FFCLocalTrack` class represents a local media track in the FlipFlopCloud SDK.
 * It extends the `FFCTrack` class and provides additional functionality specific to local tracks.
 * 
 * @template TrackKind - The type of the track, which defaults to `FFCTrack.Kind`.
 */
export class FFCLocalTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> extends FFCTrack<TrackKind> implements IFFCLocalTrack<TrackKind> {
    protected _track: LocalTrack;

  /** @internal */
  constructor(track: LocalTrack) {
    super(track);
    this._track = track;
  }
  
  /** @internal */
  get instance(): LocalTrack {
    return this._track;
  }

  /**
   * Gets the codec used by the track.
   * 
   * @returns The codec as an `FFCVideoCodec`, or `undefined` if not set.
   */
  get codec(): FFCVideoCodec | undefined {
    return this._track.codec;
  }

  /**
   * Gets the media constraints applied to the track.
   * 
   * @returns The media constraints as `MediaTrackConstraints`.
   */
  get constraints(): MediaTrackConstraints {
    return this._track.constraints;
  }

  /**
   * Gets the unique identifier of the track.
   * 
   * @returns The track ID as a string.
   */
  get id(): string {
    return this._track.id;
  }

  /**
   * Sets the source of the track (e.g., camera, microphone).
   * 
   * @param source - The source of the track as `FFCTrack.Source`.
   */
  set source(source: FFCTrack.Source) {
    this._track.source = FFCTrack.toTrackSource(source);
  }

  /**
   * Sets the media stream associated with the track.
   * 
   * @param mediaStream - The `MediaStream` instance, or `undefined` to clear it.
   */
  set mediaStream(mediaStream: MediaStream | undefined) {
    this._track.mediaStream = mediaStream;
  }

  /**
   * Gets the dimensions of the track (e.g., width and height).
   * 
   * @returns The dimensions as `FFCTrack.Dimensions`, or `undefined` if not available.
   */
  get dimensions(): FFCTrack.Dimensions | undefined {
    return this._track.dimensions;
  }

  /**
   * Checks if the upstream of the track is paused.
   * 
   * @returns `true` if the upstream is paused, otherwise `false`.
   */
  get isUpstreamPaused(): boolean {
    return this._track.isUpstreamPaused;
  }

  /**
   * Checks if the track was provided by the user.
   * 
   * @returns `true` if the track is user-provided, otherwise `false`.
   */
  get isUserProvided(): boolean {
    return this._track.isUserProvided;
  }

  /**
   * Gets the `MediaStreamTrack` associated with the track.
   * 
   * @returns The `MediaStreamTrack` instance.
   */
  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  /**
   * Indicates whether the track is local.
   * 
   * @returns `true` because this is a local track.
   */
  get isLocal(): boolean {
    return true;
  }

  /**
   * Gets the settings of the source track.
   * 
   * @returns The settings as `MediaTrackSettings`.
   */
  getSourceTrackSettings(): MediaTrackSettings {
    return this._track.getSourceTrackSettings();
  }

  /**
   * Waits for the dimensions of the track to be available.
   * 
   * @param timeoutMs - The timeout in milliseconds (default is 1000ms).
   * @returns A promise that resolves to the dimensions as `FFCTrack.Dimensions`.
   */
  waitForDimensions(timeoutMs = 1000): Promise<FFCTrack.Dimensions> {
    return this._track.waitForDimensions(timeoutMs);
  }

  /**
   * Sets the device ID for the track.
   * 
   * @param deviceId - The device ID to set.
   * @returns A promise that resolves to `true` if the device ID was set successfully, otherwise `false`.
   */
  setDeviceId(deviceId: ConstrainDOMString): Promise<boolean> {
    return this._track.setDeviceId(deviceId);
  }

  /**
   * Restarts the track with new constraints.
   * 
   * @param constraints - The new constraints to apply.
   * @returns A promise that resolves when the track is restarted.
   */
  restartTrack(constraints?: unknown): Promise<void> {
    return this._track.restartTrack(constraints);
  }

  /**
   * Gets the device ID of the track.
   * 
   * @param normalize - Whether to normalize the device ID.
   * @returns A promise that resolves to the device ID as a string, or `undefined` if not available.
   */
  getDeviceId(normalize: boolean): Promise<string | undefined> {
    return this._track.getDeviceId(normalize);
  }

  /**
   * Mutes the track.
   * 
   * @returns A promise that resolves to the current `FFCLocalTrack` instance.
   */
  async mute(): Promise<FFCLocalTrack<TrackKind>> {
    await this._track.mute();
    return this;
  }

  /**
   * Unmutes the track.
   * 
   * @returns A promise that resolves to the current `FFCLocalTrack` instance.
   */
  async unmute(): Promise<FFCLocalTrack<TrackKind>> {
    await this._track.unmute();
    return this;
  }

    async replaceTrack(track: MediaStreamTrack, options?: FFCReplaceTrackOptions): Promise<FFCLocalTrack<TrackKind>>;
  async replaceTrack(track: MediaStreamTrack, userProvidedTrack?: boolean): Promise<FFCLocalTrack<TrackKind>>;
  async replaceTrack(track: MediaStreamTrack, userProvidedOrOptions: boolean | FFCReplaceTrackOptions | undefined): Promise<FFCLocalTrack<TrackKind>> {
    if (userProvidedOrOptions === undefined) {
      await this._track.replaceTrack(track);
    } if (typeof userProvidedOrOptions === "boolean") {
      await this._track.replaceTrack(track, userProvidedOrOptions);
    } else {
      await this._track.replaceTrack(track, userProvidedOrOptions);
    }
    return this;
  }

  /**
   * Stops the track.
   */
  stop(): void {
    this._track.stop();
  }

  /**
   * Pauses the upstream of the track.
   * 
   * @returns A promise that resolves when the upstream is paused.
   */
  pauseUpstream(): Promise<void> {
    return this._track.pauseUpstream();
  }

  /**
   * Resumes the upstream of the track.
   * 
   * @returns A promise that resolves when the upstream is resumed.
   */
  resumeUpstream(): Promise<void> {
    return this._track.resumeUpstream();
  }

  /**
   * Retrieves the RTC stats report for the track.
   * 
   * @returns A promise that resolves to an `RTCStatsReport`, or `undefined` if not available.
   */
  getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
    return this._track.getRTCStatsReport();
  }
  
  /**
   * Sets a processor for the track.
   * 
   * @param processor - The processor to set as an `FFCTrackProcessor`.
   * @param showProcessedStreamLocally - Whether to show the processed stream locally.
   * @returns A promise that resolves when the processor is set.
   */
  setProcessor(processor: FFCTrackProcessor<FFCTrack.Kind>, showProcessedStreamLocally: boolean): Promise<void> {
    return this._track.setProcessor(FFCTrackProcessor.toTrackProcessor(processor), showProcessedStreamLocally);
  }

  /**
   * Gets the processor currently applied to the track.
   * 
   * @returns The processor as an `FFCTrackProcessor`, or `undefined` if no processor is applied.
   */
  getProcessor(): FFCTrackProcessor<FFCTrack.Kind> | undefined {
    const trackProcessor = this._track.getProcessor();
    if (trackProcessor) {
      return FFCTrackProcessor.fromTrackProcessor(trackProcessor);
    }
  }

  /**
   * Stops the processor applied to the track.
   * 
   * @returns A promise that resolves when the processor is stopped.
   */
  stopProcessor(): Promise<void> {
    return this._track.stopProcessor();
  }
}
