import type { LocalTrackPublication } from "livekit-client";
import type { IFFCLocalTrackPublication } from "./interfaces";
import { FFCTrackPublication } from "./track-publication";
import { wrapTrack } from "../wrapper-track";
import type { FFCLocalTrack } from "./track-local";
import { FFCTrackPublishOptions } from "./options";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCLocalVideoTrack from "./track-local-video";
import { FFCAudioTrackFeature } from "../protocol";

/**
 * The `FFCLocalTrackPublication` class represents a local track publication in the FlipFlopCloud SDK.
 * It extends the `FFCTrackPublication` class and provides additional functionality specific to local tracks.
 */
export default class FFCLocalTrackPublication extends FFCTrackPublication implements IFFCLocalTrackPublication {
    protected _trackPublication: LocalTrackPublication;

  /** @internal */
  constructor(trackPublication: LocalTrackPublication) {
    super(trackPublication);
    this._trackPublication = trackPublication;
  }

  /**
   * Gets the associated local track instance.
   * 
   * @returns The track as an `FFCLocalTrack` instance, or `undefined` if not available.
   */
  get track(): FFCLocalTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCLocalTrack;
    }
  }

  /**
   * Gets the publishing options for the track.
   * 
   * @returns The publishing options as `FFCTrackPublishOptions`, or `undefined` if not available.
   */
  get options(): FFCTrackPublishOptions | undefined {
    return this._trackPublication.options
    ? FFCTrackPublishOptions.fromTrackPublishOptions(this._trackPublication.options)
    : undefined;
  }

  /**
   * Indicates whether the upstream of the track is paused.
   * 
   * @returns `true` if the upstream is paused, otherwise `false`.
   */
  get isUpstreamPaused(): boolean | undefined{
    return this._trackPublication.isUpstreamPaused;
  }

  /**
   * Sets the associated local track instance.
   * 
   * @param track - The track to set as an `FFCLocalTrack` instance, or `undefined` to clear it.
   */
  setTrack(track?: FFCLocalTrack): void {
    this._trackPublication.setTrack(track?.instance);
  }

  /**
   * Indicates whether the track is muted.
   * 
   * @returns `true` if the track is muted, otherwise `false`.
   */
  get isMuted(): boolean {
    return this._trackPublication.isMuted;
  }

  /**
   * Gets the associated local audio track.
   * 
   * @returns The audio track as an `FFCLocalAudioTrack` instance, or `undefined` if not available.
   */
  get audioTrack(): FFCLocalAudioTrack | undefined {
    if (this._trackPublication.audioTrack) {
      return wrapTrack(this._trackPublication.audioTrack) as FFCLocalAudioTrack;
    }
  }

  /**
   * Gets the associated local video track.
   * 
   * @returns The video track as an `FFCLocalVideoTrack` instance, or `undefined` if not available.
   */
  get videoTrack(): FFCLocalVideoTrack | undefined {
    if (this._trackPublication.videoTrack) {
      return wrapTrack(this._trackPublication.videoTrack) as FFCLocalVideoTrack;
    }
  }

  /**
   * Indicates whether the track is local.
   * 
   * @returns `true` because this is a local track publication.
   */
  get isLocal(): boolean {
    return true;
  }

  /**
   * Mutes the track.
   * 
   * @returns A promise that resolves to the muted `FFCLocalTrack` instance, or `undefined` if the track is not available.
   */
  async mute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return wrapTrack(await track.mute()) as FFCLocalTrack;
  }

  /**
   * Unmutes the track.
   * 
   * @returns A promise that resolves to the unmuted `FFCLocalTrack` instance, or `undefined` if the track is not available.
   */
  async unmute(): Promise<FFCLocalTrack | undefined> {
    const track = this._trackPublication?.track;
    if (!track) {
      return undefined;
    }
    return wrapTrack(await track.unmute()) as FFCLocalTrack;
  }

  /**
   * Pauses the upstream of the track.
   * 
   * @returns A promise that resolves when the upstream is paused.
   */
  async pauseUpstream(): Promise<void> {
    return this._trackPublication.track?.pauseUpstream();
  }

  /**
   * Resumes the upstream of the track.
   * 
   * @returns A promise that resolves when the upstream is resumed.
   */
  async resumeUpstream(): Promise<void> {
    return this._trackPublication.track?.resumeUpstream();
  }

  /**
   * Gets the features of the audio track.
   * 
   * @returns An array of `FFCAudioTrackFeature` instances representing the track features.
   */
  getTrackFeatures(): Array<FFCAudioTrackFeature> {
    return this._trackPublication.getTrackFeatures().map((feature) => FFCAudioTrackFeature.fromAudioTrackFeature(feature));
  }
}
