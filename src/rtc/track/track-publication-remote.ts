import type { RemoteTrackPublication, TrackPublication } from "livekit-client";
import { FFCTrackPublication } from "./track-publication";
import { wrapTrack } from "../wrapper-track";
import type FFCRemoteTrack from "./track-remote";
import { FFCVideoQuality } from "./types";
import type { FFCTrack } from "./track";

/**
 * The `FFCRemoteTrackPublication` class represents a remote track publication in the FlipFlopCloud SDK.
 * It extends the `FFCTrackPublication` class and provides additional functionality specific to remote tracks.
 */
export default class FFCRemoteTrackPublication extends FFCTrackPublication {
    protected _trackPublication: RemoteTrackPublication;

  /** @internal */
  constructor(trackPublication: RemoteTrackPublication) {
    super(trackPublication);
    this._trackPublication = trackPublication;
  }

  /** @internal */
  get instance(): RemoteTrackPublication {
    return this._trackPublication;
  }
  
  /**
   * Gets the associated remote track instance.
   * 
   * @returns The track as an `FFCRemoteTrack` instance, or `undefined` if not available.
   */
  get track(): FFCRemoteTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCRemoteTrack;
    }
  }

  /**
   * Sets the subscription status of the track.
   * 
   * @param subscribed - `true` to subscribe to the track, `false` to unsubscribe.
   */
  setSubscribed(subscribed: boolean): void {
    this._trackPublication.setSubscribed(subscribed);
  }

  /**
   * Gets the subscription status of the track.
   * 
   * @returns The subscription status as `TrackPublication.SubscriptionStatus`.
   */
  get subscriptionStaus(): TrackPublication.SubscriptionStatus {
    return this._trackPublication.subscriptionStatus;
  }
  
  /**
   * Gets the permission status of the track.
   * 
   * @returns The permission status as `TrackPublication.PermissionStatus`.
   */
  get permissionStatus(): TrackPublication.PermissionStatus {
    return this._trackPublication.permissionStatus;
  }

  /**
   * Indicates whether the track is currently subscribed.
   * 
   * @returns `true` if the track is subscribed, otherwise `false`.
   */
  get isSubscribed(): boolean {
    return this._trackPublication.isSubscribed;
  }

  /**
   * Indicates whether the track is desired for subscription.
   * 
   * @returns `true` if the track is desired, otherwise `false`.
   */
  get isDesired(): boolean {
    return this._trackPublication.isDesired;
  }

  /**
   * Indicates whether the track is enabled.
   * 
   * @returns `true` if the track is enabled, otherwise `false`.
   */
  get isEnabled(): boolean {
    return this._trackPublication.isEnabled;
  }

  /**
   * Indicates whether the track is local.
   * 
   * @returns `false` because this is a remote track publication.
   */
  get isLocal(): boolean {
    return false;
  }

  /**
   * Enables or disables the track.
   * 
   * @param enabled - `true` to enable the track, `false` to disable it.
   */
  setEnabled(enabled: boolean): void {
    this._trackPublication.setEnabled(enabled);
  }

  /**
   * Sets the video quality for the track.
   * 
   * @param quality - The video quality to set as `FFCVideoQuality`.
   */
  setVideoQuality(quality: FFCVideoQuality): void {
    this._trackPublication.setVideoQuality(FFCVideoQuality.toVideoQuality(quality));
  }

  /**
   * Sets the video dimensions for the track.
   * 
   * @param dimensions - The video dimensions to set as `FFCTrack.Dimensions`.
   */
  setVideoDimensions(dimensions: FFCTrack.Dimensions): void {
    this._trackPublication.setVideoDimensions(dimensions);
  }

  /**
   * Sets the video frame rate (FPS) for the track.
   * 
   * @param fps - The frame rate to set.
   */
  setVideoFPS(fps: number): void {
    this._trackPublication.setVideoFPS(fps);
  }

  /**
   * Gets the video quality of the track.
   * 
   * @returns The video quality as `FFCVideoQuality`, or `undefined` if not available.
   */
  get videoQuality(): FFCVideoQuality | undefined {
    return this._trackPublication.videoQuality
    ? FFCVideoQuality.fromVideoQuality(this._trackPublication.videoQuality)
    : undefined;
  }

  /** @internal */
  setTrack(track?: FFCRemoteTrack): void {
    this._trackPublication.setTrack(track?.instance);
  }
}