import type { RemoteTrackPublication, TrackPublication } from "livekit-client";
import { FFCTrackPublication } from "./track-publication";
import { wrapTrack } from "../wrapper-track";
import type FFCRemoteTrack from "./track-remote";
import { FFCVideoQuality } from "./types";
import type { FFCTrack } from "./track";

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
  
  get track(): FFCRemoteTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCRemoteTrack;
    }
  }

  setSubscribed(subscribed: boolean): void {
    this._trackPublication.setSubscribed(subscribed);
  }

  get subscriptionStaus(): TrackPublication.SubscriptionStatus {
    return this._trackPublication.subscriptionStatus;
  }
  
  get permissionStatus(): TrackPublication.PermissionStatus {
    return this._trackPublication.permissionStatus;
  }

  get isSubscribed(): boolean {
    return this._trackPublication.isSubscribed;
  }

  get isDesired(): boolean {
    return this._trackPublication.isDesired;
  }

  get isEnabled(): boolean {
    return this._trackPublication.isEnabled;
  }

  get isLocal(): boolean {
    return false;
  }

  setEnabled(enabled: boolean): void {
    this._trackPublication.setEnabled(enabled);
  }

  setVideoQuality(quality: FFCVideoQuality): void {
    this._trackPublication.setVideoQuality(FFCVideoQuality.toVideoQuality(quality));
  }

  setVideoDimensions(dimensions: FFCTrack.Dimensions): void {
    this._trackPublication.setVideoDimensions(dimensions);
  }

  setVideoFPS(fps: number): void {
    this._trackPublication.setVideoFPS(fps);
  }

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