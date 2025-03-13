import { EventEmitter } from "events";
import { type FFCUpdateTrackSettings, type FFCUpdateSubscription, type FFCSubscriptionError, FFCTrackInfo } from "../protocol";
import type { IFFCTrackPublication } from "./interfaces";
import { FFCTrack } from "./track";
import type FFCRemoteTrack from "./track-remote";
import type TypedEventEmitter from "typed-emitter";
import { TrackPublication } from "livekit-client";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCRemoteAudioTrack from "./track-remote-audio";
import type FFCRemoteVideoTrack from "./track-remote-video";
import type FFCLocalVideoTrack from "./track-local-video";
import { wrapTrack } from "../wrapper-track";

export abstract class FFCTrackPublication extends (EventEmitter as new () => TypedEventEmitter<FFCPublicationEventCallbacks>) implements IFFCTrackPublication {
  protected _trackPublication: TrackPublication;

  /** @internal */
  constructor(trackPublication: TrackPublication) {
    super();
    this._trackPublication = trackPublication;
  }

  /** @internal */
  get instance(): TrackPublication {
    return this._trackPublication;
  }

  get kind(): FFCTrack.Kind {
    return FFCTrack.fromTrackKind(this._trackPublication.kind);
  }

  get trackName(): string {
    return this._trackPublication.trackName;
  }

  /*
  set trackName(name: string) {
    this._trackPublication.trackName = name;
  }
  */

  get trackSid(): FFCTrack.SID {
    return this._trackPublication.trackSid;
  }

  get track(): FFCTrack | undefined{
    if (!this._trackPublication.track) {
      return;
    }
    return wrapTrack(this._trackPublication.track);
  }

  get source(): FFCTrack.Source {
    return FFCTrack.fromTrackSource(this._trackPublication.source);
  }

  get mimeType(): string | undefined{
    return this._trackPublication.mimeType;
  }

  get dimensions(): FFCTrack.Dimensions | undefined{
    return this._trackPublication.dimensions;
  }

  get simulcasted(): boolean | undefined {
    return this._trackPublication.simulcasted;
  }

  get trackInfo(): FFCTrackInfo | undefined {
    const trackInfo = this._trackPublication.trackInfo;
    if (trackInfo) {
      return FFCTrackInfo.fromTrackInfo(trackInfo);
    }
  }

  setTrack(track?: FFCTrack): void {
    this._trackPublication.setTrack(track?.instance);
  }

  get isMuted(): boolean {
    return this._trackPublication.isMuted;
  }

  get isEnabled(): boolean {
    return this._trackPublication.isEnabled;
  }

  get isSubscribed(): boolean {
    return this._trackPublication.isSubscribed;
  }

  get isEncrypted(): boolean {
    return this._trackPublication.isEncrypted;
  }

  abstract get isLocal(): boolean;

  get audioTrack(): FFCLocalAudioTrack | FFCRemoteAudioTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCLocalAudioTrack | FFCRemoteAudioTrack;
    }
  }

  get videoTrack(): FFCLocalVideoTrack | FFCRemoteVideoTrack | undefined {
    if (this._trackPublication.track) {
      return wrapTrack(this._trackPublication.track) as FFCLocalVideoTrack | FFCRemoteVideoTrack;
    }
  }
}

export namespace FFCTrackPublication {
  export enum SubscriptionStatus {
    Desired = 'desired',
    Subscribed = 'subscribed',
    Unsubscribed = 'unsubscribed',
  }

  export enum PermissionStatus {
    Allowed = 'allowed',
    NotAllowed = 'not_allowed',
  }

  /** @internal */
  export function fromSubscriptionStatus(status: TrackPublication.SubscriptionStatus): FFCTrackPublication.SubscriptionStatus {
    switch (status) {
      case TrackPublication.SubscriptionStatus.Desired:
        return FFCTrackPublication.SubscriptionStatus.Desired;
      case TrackPublication.SubscriptionStatus.Subscribed:
        return FFCTrackPublication.SubscriptionStatus.Subscribed;
      case TrackPublication.SubscriptionStatus.Unsubscribed:
        return FFCTrackPublication.SubscriptionStatus.Unsubscribed;
    }
  }

  /** @internal */
  export function toSubscriptionStatus(status: FFCTrackPublication.SubscriptionStatus): TrackPublication.SubscriptionStatus {
    switch (status) {
      case FFCTrackPublication.SubscriptionStatus.Desired:
        return TrackPublication.SubscriptionStatus.Desired;
      case FFCTrackPublication.SubscriptionStatus.Subscribed:
        return TrackPublication.SubscriptionStatus.Subscribed;
      case FFCTrackPublication.SubscriptionStatus.Unsubscribed:
        return TrackPublication.SubscriptionStatus.Unsubscribed;
    }
  }

  /** @internal */
  export function fromPermissionStatus(status: TrackPublication.PermissionStatus): FFCTrackPublication.PermissionStatus {
    switch (status) {
      case TrackPublication.PermissionStatus.Allowed:
        return FFCTrackPublication.PermissionStatus.Allowed;
      case TrackPublication.PermissionStatus.NotAllowed:
        return FFCTrackPublication.PermissionStatus.NotAllowed;
    }
  }

  /** @internal */
  export function toPermissionStatus(status: FFCTrackPublication.PermissionStatus): TrackPublication.PermissionStatus {
    switch (status) {
      case FFCTrackPublication.PermissionStatus.Allowed:
        return TrackPublication.PermissionStatus.Allowed;
      case FFCTrackPublication.PermissionStatus.NotAllowed:
        return TrackPublication.PermissionStatus.NotAllowed;
    }
  }
}

export type FFCPublicationEventCallbacks = {
  muted: () => void;
  unmuted: () => void;
  ended: (track?: FFCTrack) => void;
  updateSettings: (settings: FFCUpdateTrackSettings) => void;
  subscriptionPermissionChanged: (
    status: FFCTrackPublication.PermissionStatus,
    prevStatus: FFCTrackPublication.PermissionStatus,
  ) => void;
  updateSubscription: (sub: FFCUpdateSubscription) => void;
  subscribed: (track: FFCRemoteTrack) => void;
  unsubscribed: (track: FFCRemoteTrack) => void;
  subscriptionStatusChanged: (
    status: FFCTrackPublication.SubscriptionStatus,
    prevStatus: FFCTrackPublication.SubscriptionStatus,
  ) => void;
  subscriptionFailed: (error: FFCSubscriptionError) => void;
  //transcriptionReceived: (transcription: TranscriptionSegment[]) => void;
  timeSyncUpdate: (timestamp: number) => void;
};