import { RemoteTrackPublication } from "livekit-client";
import { FFCTrackPublication, toFFCTrackPublicationPermissionStatus, toFFCTrackPublicationSubscriptionStatus } from "./ffc-track-publication";
import FFCRemoteTrack from "./ffc-track-remote";
import { FFCTrack, FFCVideoQuality, toFFCVideoQuality, toTrackKind, toVideoQuality } from "./ffc-track";
import type { FFCLoggerOptions } from "../ffc-options";
import type { FFCTrackInfo } from "../ffc-protocol";
import type { TrackInfo } from "@livekit/protocol";

export class FFCRemoteTrackPublication extends FFCTrackPublication {
  protected _trackPublication: RemoteTrackPublication;

  /* @internal */
  constructor(publication: RemoteTrackPublication);
  constructor(kind: FFCTrack.Kind, ti: FFCTrackInfo, autoSubscribe: boolean, loggerOptions?: FFCLoggerOptions);
  constructor(kindOrPublication: FFCTrack.Kind | RemoteTrackPublication, ti?: FFCTrackInfo, autoSubscribe?: boolean, loggerOptions?: FFCLoggerOptions) {
    let trackPublication: RemoteTrackPublication;
    if (kindOrPublication instanceof RemoteTrackPublication) {
      trackPublication = kindOrPublication;
    } else {
      trackPublication = new RemoteTrackPublication(toTrackKind(kindOrPublication), ti as TrackInfo, autoSubscribe, loggerOptions);
    }
    super(trackPublication);
    this._trackPublication = trackPublication;
  }

  get track(): FFCRemoteTrack | undefined {
    const track = this._trackPublication.track;
    if (!track) {
      return undefined;
    }
    return FFCTrack.wrap(track) as FFCRemoteTrack;
    // TODO: What to do for unknown track type?
  }

  get subscriptionStatus(): FFCTrackPublication.SubscriptionStatus {
    return toFFCTrackPublicationSubscriptionStatus(this._trackPublication.subscriptionStatus);
  }

  get permissionStatus(): FFCTrackPublication.PermissionStatus {
    return toFFCTrackPublicationPermissionStatus(this._trackPublication.permissionStatus);
  }

  get isSubscribed(): boolean {
    return this._trackPublication.isSubscribed;
  }

  setSubscribed(subscribe: boolean): void {
    return this._trackPublication.setSubscribed(subscribe);
  }

  get isDesired(): boolean {
    return this._trackPublication.isDesired;
  }

  get isEnabled(): boolean {
    return this._trackPublication.isEnabled;
  }

  setEnabled(enable: boolean): void {
    return this._trackPublication.setEnabled(enable);
  }

  get isLocal(): boolean {
    return false;
  }

  get videoQuality(): FFCVideoQuality | undefined{
    return this._trackPublication.videoQuality ? toFFCVideoQuality(this._trackPublication.videoQuality) : undefined;
  }
  
  setVideoQuality(quality: FFCVideoQuality): void {
    return this._trackPublication.setVideoQuality(toVideoQuality(quality));
  }

  setVideoDimensions(dimensions: FFCTrack.Dimensions): void {
    return this._trackPublication.setVideoDimensions(dimensions);
  }

  setVideoFPS(fps: number): void {
    return this._trackPublication.setVideoFPS(fps);
  }
}