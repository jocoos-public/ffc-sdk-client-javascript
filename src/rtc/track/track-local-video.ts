import { LocalVideoTrack } from "livekit-client";
import type { IFFCLocalVideoTrack } from "./interfaces";
import { FFCLocalTrack } from "./track-local";
import type { FFCVideoSenderStats } from "../stats";
import { FFCVideoCaptureOptions, type FFCVideoCodec } from "./options";
import { FFCVideoTrackProcessor } from "./processor/types";
import type { FFCTrack } from "./track";
import type { FFCLoggerOptions } from "../types";
import { FFCVideoQuality } from "./types";

export interface FFCSimulcastTrackInfo {
  codec: FFCVideoCodec;
  mediaStreamTrack: MediaStreamTrack;
  sender?: RTCRtpSender;
  encodings?: Array<RTCRtpEncodingParameters>;
}

/**
 * The `FFCLocalVideoTrack` class represents a local video track in the FlipFlopCloud SDK.
 * It extends the `FFCLocalTrack` class and provides additional functionality specific to local video tracks.
 */
export default class FFCLocalVideoTrack extends FFCLocalTrack<FFCTrack.Kind.Video> implements IFFCLocalVideoTrack {
    protected _track: LocalVideoTrack;

  /** @internal */
  constructor(track: LocalVideoTrack);
  /**
   * Creates an instance of `FFCLocalVideoTrack`.
   * 
   * @param mediaTrack - A `MediaStreamTrack` instance.
   * @param constraints - (Optional) Media constraints for the track.
   * @param userProvidedTrack - (Optional) Whether the track is user-provided.
   * @param loggerOptions - (Optional) Logger options for the track.
   */
  constructor(mediaTrack: MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack?: boolean, loggerOptions?: FFCLoggerOptions);
  constructor(trackOrMediaTrack: LocalVideoTrack | MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack = true, loggerOptions?: FFCLoggerOptions) {
    let track: LocalVideoTrack;
    if (trackOrMediaTrack instanceof LocalVideoTrack) {
      track = trackOrMediaTrack;
    } else {
      track = new LocalVideoTrack(trackOrMediaTrack, constraints, userProvidedTrack, loggerOptions);
    }
    super(track);
    this._track = track;
  }

  /** @internal */
  get instance(): LocalVideoTrack {
    return this._track;
  }

  /**
   * Gets or sets the RTP sender for the video track.
   */
  get sender(): RTCRtpSender | undefined {
    return this._track.sender;
  }

  set sender(sender: RTCRtpSender | undefined) {
    this._track.sender = sender;
  }

  /**
   * Indicates whether the video track is simulcast.
   * 
   * @returns `true` if the track is simulcast, otherwise `false`.
   */
  get isSimulcast(): boolean {
    return this._track.isSimulcast;
  }

  /**
   * Stops the video track.
   */
  stop(): void {
    this._track.stop();
  }

  /**
   * Pauses the upstream of the video track.
   * 
   * @returns A promise that resolves when the upstream is paused.
   */
  pauseUpstream(): Promise<void> {
    return this._track.pauseUpstream();
  }

  /**
   * Resumes the upstream of the video track.
   * 
   * @returns A promise that resolves when the upstream is resumed.
   */
  resumeUpstream(): Promise<void> {
    return this._track.resumeUpstream();
  }

  /**
   * Mutes the video track.
   * 
   * @returns A promise that resolves to the current `FFCLocalVideoTrack` instance.
   */
  async mute(): Promise<this> {
    await this._track.mute();
    return this;
  }

  /**
   * Unmutes the video track.
   * 
   * @returns A promise that resolves to the current `FFCLocalVideoTrack` instance.
   */
  async unmute(): Promise<this> {
    await this._track.unmute();
    return this;
  }

  /**
   * Retrieves the sender statistics for the video track.
   * 
   * @returns A promise that resolves to an array of `FFCVideoSenderStats`.
   */
  getSenderStats(): Promise<Array<FFCVideoSenderStats>> {
    return this._track.getSenderStats();
  }

  /**
   * Sets the publishing quality for the video track.
   * 
   * @param maxQuality - The maximum video quality to set.
   */
  setPublishingQuality(maxQuality: FFCVideoQuality): void {
    this._track.setPublishingQuality(FFCVideoQuality.toVideoQuality(maxQuality));
  }

  /**
   * Restarts the video track with new capture options.
   * 
   * @param options - (Optional) The video capture options to apply.
   * @returns A promise that resolves when the track is restarted.
   */
  restartTrack(options?: FFCVideoCaptureOptions): Promise<void> {
    return this._track.restartTrack(options
      ? FFCVideoCaptureOptions.toVideoCaptureOptions(options)
      : undefined
    );
  }
  
  /**
   * Sets a processor for the video track.
   * 
   * @param processor - The video track processor to set.
   * @param showProcessedStreamLocally - (Optional) Whether to show the processed stream locally.
   * @returns A promise that resolves when the processor is set.
   */
  setProcessor(processor: FFCVideoTrackProcessor, showProcessedStreamLocally: boolean = true): Promise<void> {
    return this._track.setProcessor(FFCVideoTrackProcessor.toTrackProcessor(processor), showProcessedStreamLocally);
  }
  

  /**
   * Sets the degradation preference for the video track.
   * 
   * @param pref - The degradation preference to set.
   * @returns A promise that resolves when the preference is set.
   */
  setDegradationPreference(pref: RTCDegradationPreference): Promise<void> {
    return this._track.setDegradationPreference(pref);
  }

  /**
   * Adds a simulcast track to the video track.
   * 
   * @param codec - The codec for the simulcast track.
   * @param encodings - (Optional) The encoding parameters for the simulcast track.
   * @returns The simulcast track information as `FFCSimulcastTrackInfo`, or `undefined` if not added.
   */
  addSimulcastTrack(codec: FFCVideoCodec, encodings?: Array<RTCRtpEncodingParameters>): FFCSimulcastTrackInfo | undefined {
    return this._track.addSimulcastTrack(codec, encodings);
  }

  /**
   * Sets the RTP sender for a simulcast track.
   * 
   * @param codec - The codec for the simulcast track.
   * @param sender - The RTP sender to set.
   */
  setSimulcastTrackSender(codec: FFCVideoCodec, sender: RTCRtpSender): void {
    this._track.setSimulcastTrackSender(codec, sender);
  }
}