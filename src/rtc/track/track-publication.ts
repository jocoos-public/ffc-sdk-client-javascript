import { EventEmitter } from "events";
import { FFCSubscriptionError, FFCTrackInfo, FFCUpdateSubscription, FFCUpdateTrackSettings } from "../protocol";
import type { IFFCTrackPublication } from "./interfaces";
import { FFCTrack } from "./track";
import type FFCRemoteTrack from "./track-remote";
import type TypedEventEmitter from "typed-emitter";
import { RemoteTrack, SubscriptionError, Track, TrackPublication } from "livekit-client";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCRemoteAudioTrack from "./track-remote-audio";
import type FFCRemoteVideoTrack from "./track-remote-video";
import type FFCLocalVideoTrack from "./track-local-video";
import { wrapTrack } from "../wrapper-track";
import { FFCTrackPublicationEvent } from "../events";
import type { UpdateSubscription, UpdateTrackSettings } from "@livekit/protocol";

export abstract class FFCTrackPublication extends (EventEmitter as new () => TypedEventEmitter<FFCPublicationEventCallbacks>) implements IFFCTrackPublication {
  protected _trackPublication: TrackPublication;

  /** @internal */
  constructor(trackPublication: TrackPublication) {
    super();
    this._trackPublication = trackPublication;
    this._trackPublication.on('muted', (): void => {
      this.emit(FFCTrackPublicationEvent.MUTED);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.MUTED);
    });
    this._trackPublication.on('unmuted', (): void => {
      this.emit(FFCTrackPublicationEvent.UNMUTED);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.UNMUTED);
    });
    this._trackPublication.on('ended', (track?: Track): void => {
      const ffcTrack = track ? wrapTrack(track): undefined;
      this.emit(FFCTrackPublicationEvent.ENDED, ffcTrack);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.ENDED, ffcTrack);
    });
    this._trackPublication.on('updateSettings', (settings: UpdateTrackSettings): void => {
      const ffcSettings = FFCUpdateTrackSettings.fromUpdateTrackSettings(settings);
      this.emit(FFCTrackPublicationEvent.UPDATE_SETTINGS, ffcSettings);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.UPDATE_SETTINGS, ffcSettings);
    });
    this._trackPublication.on('subscriptionPermissionChanged', (status: TrackPublication.PermissionStatus, prevStatus: TrackPublication.PermissionStatus): void => {
      const ffcStatus = FFCTrackPublication.fromPermissionStatus(status);
      const ffcPrevStatus = FFCTrackPublication.fromPermissionStatus(prevStatus);
      this.emit(FFCTrackPublicationEvent.SUBSCRIPTION_PERMISSION_CHANGED, ffcStatus, ffcPrevStatus);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.SUBSCRIPTION_PERMISSION_CHANGED, ffcStatus, ffcPrevStatus);
    });
    this._trackPublication.on('updateSubscription', (sub: UpdateSubscription): void => {
      const ffcSub = FFCUpdateSubscription.fromUpdateSubscription(sub);
      this.emit(FFCTrackPublicationEvent.UPDATE_SUBSCRIPTION, ffcSub);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.UPDATE_SUBSCRIPTION, ffcSub);
    });
    this._trackPublication.on('subscribed', (track: RemoteTrack): void => {
      const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
      this.emit(FFCTrackPublicationEvent.SUBSCRIBED, ffcTrack);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.SUBSCRIBED, ffcTrack);
    });
    this._trackPublication.on('unsubscribed', (track: RemoteTrack): void => {
      const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
      this.emit(FFCTrackPublicationEvent.UNSUBSCRIBED, ffcTrack);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.UNSUBSCRIBED, ffcTrack);
    });
    this._trackPublication.on('subscriptionStatusChanged', (status: TrackPublication.SubscriptionStatus, prevStatus: TrackPublication.SubscriptionStatus): void => {
      const ffcStatus = FFCTrackPublication.fromSubscriptionStatus(status);
      const ffcPrevStatus = FFCTrackPublication.fromSubscriptionStatus(prevStatus);
      this.emit(FFCTrackPublicationEvent.SUBSCRIPTION_STATUS_CHANGED, ffcStatus, ffcPrevStatus);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.SUBSCRIPTION_STATUS_CHANGED, ffcStatus, ffcPrevStatus);
    });
    this._trackPublication.on('subscriptionFailed', (error: SubscriptionError): void => {
      const ffcError = FFCSubscriptionError.fromSubscriptionError(error);
      this.emit(FFCTrackPublicationEvent.SUBSCRIPTION_FAILED, ffcError);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.SUBSCRIPTION_FAILED, ffcError);
    });
    //transcriptionReceived: (transcription: TranscriptionSegment[]) => void;
    this._trackPublication.on('timeSyncUpdate', (timestamp: number): void => {
      this.emit(FFCTrackPublicationEvent.TIME_SYNC_UPDATE, timestamp);
      console.log('FFCTrackPublication::', 'emitting', FFCTrackPublicationEvent.TIME_SYNC_UPDATE, timestamp);
    });
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

  /** @internal */
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
  MUTED: () => void;
  UNMUTED: () => void;
  ENDED: (track?: FFCTrack) => void;
  UPDATE_SETTINGS: (settings: FFCUpdateTrackSettings) => void;
  SUBSCRIPTION_PERMISSION_CHANGED: (
    status: FFCTrackPublication.PermissionStatus,
    prevStatus: FFCTrackPublication.PermissionStatus,
  ) => void;
  UPDATE_SUBSCRIPTION: (sub: FFCUpdateSubscription) => void;
  SUBSCRIBED: (track: FFCRemoteTrack) => void;
  UNSUBSCRIBED: (track: FFCRemoteTrack) => void;
  SUBSCRIPTION_STATUS_CHANGED: (
    status: FFCTrackPublication.SubscriptionStatus,
    prevStatus: FFCTrackPublication.SubscriptionStatus,
  ) => void;
  SUBSCRIPTION_FAILED: (error: FFCSubscriptionError) => void;
  //transcriptionReceived: (transcription: TranscriptionSegment[]) => void;
  TIME_SYNC_UPDATE: (timestamp: number) => void;
};