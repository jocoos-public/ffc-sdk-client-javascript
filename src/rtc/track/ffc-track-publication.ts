import { EventEmitter } from "events";
import type TypedEventEmitter from "typed-emitter";
import { LocalAudioTrack, LocalTrackPublication, LocalVideoTrack, RemoteAudioTrack, RemoteTrackPublication, RemoteVideoTrack, TrackPublication } from "livekit-client";
import type FFCRemoteAudioTrack from "./ffc-track-remote-audio";
import type FFCLocalVideoTrack from "./ffc-track-local-video";
import type FFCRemoteVideoTrack from "./ffc-track-remote-video";
import type FFCRemoteTrack from "./ffc-track-remote";
import type FFCLocalAudioTrack from "./ffc-track-local-audio";
import { type FFCTrackInfo, type FFCUpdateSubscription, type FFCUpdateTrackSettings } from "../ffc-protocol";
import type { FFCSubscriptionError } from "../ffc-protocol-enums";
import { createFFCLocalTrackPublicationWith, createFFCRemoteTrackPublicationWith } from "./ffc-track-create";
import type { FFCLoggerOptions } from "../../ffc-logger";
import { FFCTrackSource, toFFCTrackKind, toFFCTrackSource, toTrackKind, type FFCTrackDimensions, type FFCTrackKind } from "./ffc-track-types";
import { FFCTrack } from "./ffc-track";

export class FFCTrackPublication extends (EventEmitter as new () => TypedEventEmitter<FFCPublicationEventCallbacks>) {
  protected static _trackPublications: WeakMap<object, FFCTrackPublication> = new WeakMap();

  static wrap(publication: TrackPublication): FFCTrackPublication {
    const existing = this._trackPublications.get(publication);
    if (existing) {
      return existing;
    }
    if (publication instanceof LocalTrackPublication) {
      const localTrackPublication = createFFCLocalTrackPublicationWith(publication as LocalTrackPublication);
      this._trackPublications.set(publication, localTrackPublication);
      return localTrackPublication;
    }
    const remoteTrackPublication = createFFCRemoteTrackPublicationWith(publication as RemoteTrackPublication);
    this._trackPublications.set(publication, remoteTrackPublication);
    return remoteTrackPublication;
  }

  protected _trackPublication: TrackPublication;

  /* @internal */
  constructor(publication: TrackPublication);
  constructor(kind: FFCTrackKind, id: string, name: string, loggerOptions?: FFCLoggerOptions);
  constructor(kindOrPublication: FFCTrackKind | TrackPublication, id?: string, name?: string, loggerOptions?: FFCLoggerOptions) {
    let trackPublication: TrackPublication;
    if (kindOrPublication instanceof TrackPublication) {
      trackPublication = kindOrPublication;
    } else {
      trackPublication = new TrackPublication(toTrackKind(kindOrPublication), id as string, name as string, loggerOptions);
    } 
    super();
    this._trackPublication = trackPublication;
  }

  get kind(): FFCTrackKind {
    return toFFCTrackKind(this._trackPublication.kind);
  }

  get trackName(): string {
    return this._trackPublication.trackName;
  }

  get trackSid(): string {
    return this._trackPublication.trackSid;
  }

  /* @internal */
  set trackSid(sid: string) {
    this._trackPublication.trackSid = sid;
  }

  get track(): FFCTrack | undefined {
    if (!this._trackPublication.track) {
      return;
    }
    return FFCTrack.wrap(this._trackPublication.track);
  }

  /* @internal */
  get trackInfo(): FFCTrackInfo | undefined {
    return this._trackPublication.trackInfo as FFCTrackInfo;
  }

  get source(): FFCTrackSource {
    return toFFCTrackSource(this._trackPublication.source);
  }

  get mimeType(): string | undefined {
    return this._trackPublication.mimeType;
  }

  get dimensions(): FFCTrackDimensions | undefined {
    return this._trackPublication.dimensions;
  }
  
  get simulcasted(): boolean | undefined {
    return this._trackPublication.simulcasted;
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

  get isLocal(): boolean | undefined {
    return;
  }

  get audioTrack(): FFCLocalAudioTrack | FFCRemoteAudioTrack | undefined {
    if (this._trackPublication.track instanceof LocalAudioTrack || this._trackPublication.track instanceof RemoteAudioTrack) {
      return FFCTrack.wrap(this._trackPublication.track) as FFCLocalAudioTrack | FFCRemoteAudioTrack;
    }
  }

  get videoTrack(): FFCLocalVideoTrack | FFCRemoteVideoTrack | undefined {
    if (this._trackPublication.track instanceof LocalVideoTrack || this._trackPublication.track instanceof RemoteVideoTrack) {
      return FFCTrack.wrap(this._trackPublication.track) as FFCLocalVideoTrack | FFCRemoteVideoTrack;
    }
  }
}

export namespace FFCTrackPublication {
  export enum SubscriptionStatus {
    DESIRED = 'DESIRED',
    SUBSCRIBED = 'SUBSCRIBED',
    UNSUBSCRIBED = 'UNSUBSCRIBED',
  }

  export enum PermissionStatus {
    ALLOWED = 'ALLOWED',
    NOT_ALLOWED = 'NOT_ALLOWED',
  }
}

/* @internal */
export function toTrackPublicationSubscriptionStatus(status: FFCTrackPublication.SubscriptionStatus): TrackPublication.SubscriptionStatus {
  switch (status) {
    case FFCTrackPublication.SubscriptionStatus.DESIRED:
      return TrackPublication.SubscriptionStatus.Desired;
    case FFCTrackPublication.SubscriptionStatus.SUBSCRIBED:
      return TrackPublication.SubscriptionStatus.Subscribed;
    case FFCTrackPublication.SubscriptionStatus.UNSUBSCRIBED:
      return TrackPublication.SubscriptionStatus.Unsubscribed;
  }
}

/* @internal */
export function toFFCTrackPublicationSubscriptionStatus(status: TrackPublication.SubscriptionStatus): FFCTrackPublication.SubscriptionStatus {
  switch (status) {
    case TrackPublication.SubscriptionStatus.Desired:
      return FFCTrackPublication.SubscriptionStatus.DESIRED;
    case TrackPublication.SubscriptionStatus.Subscribed:
      return FFCTrackPublication.SubscriptionStatus.SUBSCRIBED;
    case TrackPublication.SubscriptionStatus.Unsubscribed:
      return FFCTrackPublication.SubscriptionStatus.UNSUBSCRIBED;
  }
}

/* @internal */
export function toTrackPublicationPermissionStatus(status: FFCTrackPublication.PermissionStatus): TrackPublication.PermissionStatus {
  switch (status) {
    case FFCTrackPublication.PermissionStatus.ALLOWED:
      return TrackPublication.PermissionStatus.Allowed;
    case FFCTrackPublication.PermissionStatus.NOT_ALLOWED:
      return TrackPublication.PermissionStatus.NotAllowed;
  }
}

/* @internal */
export function toFFCTrackPublicationPermissionStatus(status: TrackPublication.PermissionStatus): FFCTrackPublication.PermissionStatus {
  switch (status) {
    case TrackPublication.PermissionStatus.Allowed:
      return FFCTrackPublication.PermissionStatus.ALLOWED;
    case TrackPublication.PermissionStatus.NotAllowed:
      return FFCTrackPublication.PermissionStatus.NOT_ALLOWED;
  }
}

export type FFCPublicationEventCallbacks = {
  MUTED: /*muted:*/ () => void;
  UNMUTED: /*unmuted:*/ () => void;
  ENDED: /*ended:*/ (track?: FFCTrack) => void;
  UPDATE_SETTINGS: /*updateSettings:*/ (settings: FFCUpdateTrackSettings) => void;
  SUBSCRIPTION_PERMISSION_CHANGED: /*subscriptionPermissionChanged:*/ (
    status: TrackPublication.PermissionStatus,
    prevStatus: TrackPublication.PermissionStatus,
  ) => void;
  UPDATE_SUBSCRIPTION: /*updateSubscription:*/ (sub: FFCUpdateSubscription) => void;
  SUBSCRIBED: /*subscribed:*/ (track: FFCRemoteTrack) => void;
  UNSUBSCRIBED: /*unsubscribed:*/ (track: FFCRemoteTrack) => void;
  SUBSCRIPTION_STATUS_CHANGED: /*subscriptionStatusChanged:*/ (
    status: TrackPublication.SubscriptionStatus,
    prevStatus: TrackPublication.SubscriptionStatus,
  ) => void;
  SUBSCRIPTION_FAILED: /*subscriptionFailed:*/ (error: FFCSubscriptionError) => void;
  //TRANSCRIPTION_RECEIVED: /*transcriptionReceived:*/ (transcription: TranscriptionSegment[]) => void;
  TIME_SYNC_UPDATE: /*timeSyncUpdate:*/ (timestamp: number) => void;
};
