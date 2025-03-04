import { ConnectionQuality, LocalParticipant, Participant, RemoteParticipant } from "livekit-client";

import { EventEmitter } from "events";
import type TypedEmitter from "typed-emitter";
import { FFCTrack, toTrackSource } from "../track/ffc-track";
import { FFCTrackPublication } from "../track/ffc-track-publication";
import { FFCRemoteTrackPublication } from "../track/ffc-track-publication-remote";
import FFCRemoteTrack from "../track/ffc-track-remote";
import { FFCLocalTrackPublication } from "../track/ffc-track-publication-local";
import { type FFCParticipantPermission, toFFCParticipantPermission } from "../ffc-protocol";
import type { FFCLoggerOptions } from "../ffc-options";
import { FFCParticipantKind, toParticipantKind, toFFCParticipantKind, FFCSubscriptionError } from "../ffc-protocol-enums";
import FFCLocalParticipant from "./ffc-participant-local";
import FFCRemoteParticipant from "./ffc-participant-remote";

export enum FFCConnectionQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  POOR = 'POOR',
  /**
   * Indicates that a participant has temporarily (or permanently) lost connection to LiveKit.
   * For permanent disconnection a `ParticipantDisconnected` event will be emitted after a timeout
   */
  LOST = 'LOST',
  UNKNOWN = 'UNKNOWN',
}

/* @internal */
export function toConnectionQuality(quality: FFCConnectionQuality): ConnectionQuality {
  switch (quality) {
    case FFCConnectionQuality.EXCELLENT:
      return ConnectionQuality.Excellent;
    case FFCConnectionQuality.GOOD:
      return ConnectionQuality.Good;
    case FFCConnectionQuality.POOR:
      return ConnectionQuality.Poor;
    case FFCConnectionQuality.LOST:
      return ConnectionQuality.Lost;
    case FFCConnectionQuality.UNKNOWN:
      return ConnectionQuality.Unknown;
  }
}

/* @internal */
export function toFFCConnectionQuality(): undefined;
/* @internal */
export function toFFCConnectionQuality(quality: ConnectionQuality): FFCConnectionQuality;
/* @internal */
export function toFFCConnectionQuality(quality?: ConnectionQuality): FFCConnectionQuality | undefined {
  switch (quality) {
    case ConnectionQuality.Excellent:
      return FFCConnectionQuality.EXCELLENT;
    case ConnectionQuality.Good:
      return FFCConnectionQuality.GOOD;
    case ConnectionQuality.Poor:
      return FFCConnectionQuality.POOR;
    case ConnectionQuality.Lost:
      return FFCConnectionQuality.LOST;
    case ConnectionQuality.Unknown:
      return FFCConnectionQuality.UNKNOWN;
  }
}

export default class FFCParticipant extends (EventEmitter as new () => TypedEmitter<FFCParticipantEventCallbacks>) {
  protected static _participants: WeakMap<object, FFCParticipant> = new WeakMap();

  protected _participant: Participant;

  /* @internal */
  static wrap(participant: Participant): FFCParticipant {
    const existing = this._participants.get(participant);
    if (existing) {
      return existing;
    }
    if (participant.isLocal) {
      const localParticipant = new FFCLocalParticipant(participant as LocalParticipant);
      this._participants.set(participant, localParticipant);
      return localParticipant;
    }
    const remoteParticipant = new FFCRemoteParticipant(participant as RemoteParticipant);
    this._participants.set(participant, remoteParticipant);
    return remoteParticipant;
  }

  constructor(participant: Participant);
  constructor(sid: string, identity: string, name?: string, metadata?: string, attributes?: Record<string, string>, loggerOptions?: FFCLoggerOptions, kind?: FFCParticipantKind);
  constructor(
    participantOrSid: Participant | string,
    identity?: string,
    name?: string,
    metadata?: string,
    attributes?: Record<string, string>,
    loggerOptions?: FFCLoggerOptions,
    kind: FFCParticipantKind = FFCParticipantKind.STANDARD,
  ) {
    super();
    if (typeof participantOrSid === 'string') {
      if (!identity) {
        throw new Error('identity and kind is required');
      }
      this._participant = new Participant(
        participantOrSid,
        identity,
        name,
        metadata,
        attributes,
        loggerOptions,
        toParticipantKind(kind ?? FFCParticipantKind.STANDARD));
    } else {
      this._participant = participantOrSid;
    }
  }

  get audioTrackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value));
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value));
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.trackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value));
    });
    return ffcMap;
  }

  get audioLevel(): number {
    return this._participant.audioLevel;
  }

  get isSpeaking(): boolean {
    return this._participant.isSpeaking;
  }

  get sid(): string {
    return this._participant.sid;
  }

  get identity(): string {
    return this._participant.identity;
  }

  get name(): string | undefined {
    return this._participant.name;
  }

  get metadata(): string | undefined {
    return this._participant.metadata;
  }

  get lastSpokeAt(): Date | undefined {
    return this._participant.lastSpokeAt;
  }

  get permissions(): FFCParticipantPermission | undefined {
    return this._participant.permissions
      ? toFFCParticipantPermission(this._participant.permissions)
      : undefined;
  }

  get isEncrypted(): boolean {
    return this._participant.isEncrypted;
  }

  get isAgent(): boolean {
    return this._participant.isAgent;
  }

  get kind(): FFCParticipantKind {
    return toFFCParticipantKind(this._participant.kind);
  }

  get attributes(): Readonly<Record<string, string>> {
    return this._participant.attributes;
  }

  getTrackPublications(): Array<FFCTrackPublication> {
    return this._participant.getTrackPublications().map((trackPublication) => FFCTrackPublication.wrap(trackPublication));
  }

  getTrackPublication(source: FFCTrack.Source): FFCTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(toTrackSource(source));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication);
    }
  }

  getTrackPublicationByName(name: string): FFCTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication);
    }
  }

  get connectionQuality(): FFCConnectionQuality {
    return toFFCConnectionQuality(this._participant.connectionQuality);
  }

  get isCameraEnabled(): boolean {
    return this._participant.isCameraEnabled;
  }

  get isMicrophoneEnabled(): boolean {
    return this._participant.isMicrophoneEnabled;
  }

  get isScreenShareEnabled(): boolean {
    return this._participant.isScreenShareEnabled;
  }

  get isLocal(): boolean {
    return false;
  }

  get joinedAt(): Date | undefined {
    return this._participant.joinedAt;
  }
}

export type FFCParticipantEventCallbacks = {
  TRACK_PUBLISHED: /*trackPublished:*/ (publication: FFCRemoteTrackPublication) => void;
  TRACK_SUBSCRIBED: /*trackSubscribed:*/ (track: FFCRemoteTrack, publication: FFCRemoteTrackPublication) => void;
  TRACK_SUBSCRIPTION_FAILED: /*trackSubscriptionFailed:*/ (trackSid: string, reason?: FFCSubscriptionError) => void;
  TRACK_UNPUBLISHED: /*trackUnpublished:*/ (publication: FFCRemoteTrackPublication) => void;
  TRACK_UNSUBSCRIBED: /*trackUnsubscribed:*/ (track: FFCRemoteTrack, publication: FFCRemoteTrackPublication) => void;
  TRACK_MUTED: /*trackMuted:*/ (publication: FFCTrackPublication) => void;
  TRACK_UNMUTED: /*trackUnmuted:*/ (publication: FFCTrackPublication) => void;
  LOCAL_TRACK_PUBLISHED: /*localTrackPublished:*/ (publication: FFCLocalTrackPublication) => void;
  LOCAL_TRACK_UNPUBLISHED: /*localTrackUnpublished:*/ (publication: FFCLocalTrackPublication) => void;
  PARTICIPANT_METADATA_CHANGED: /*participantMetadataChanged:*/ (prevMetadata: string | undefined, participant?: any) => void;
  PARTICIPANT_NAME_CHANGED: /*participantNameChanged:*/ (name: string) => void;
  /*
  dataReceived: (payload: Uint8Array, kind: DataPacket_Kind) => void;
  sipDTMFReceived: (dtmf: SipDTMF) => void;
  transcriptionReceived: (
    transcription: TranscriptionSegment[],
    publication?: TrackPublication,
  ) => void;
  */
  IS_SPEAKING_CHANGED: /*isSpeakingChanged:*/ (speaking: boolean) => void;
  CONNECTION_QUALITY_CHANGED: /*connectionQualityChanged:*/ (connectionQuality: FFCConnectionQuality) => void;
  TRACK_STREAM_STATE_CHANGED: /*trackStreamStateChanged:*/ (
    publication: FFCRemoteTrackPublication,
    streamState: FFCTrack.StreamState,
  ) => void;
  TRACK_SUBSCRIPTION_PERMISSION_CHANGED: /*trackSubscriptionPermissionChanged:*/ (
    publication: FFCRemoteTrackPublication,
    status: FFCTrackPublication.PermissionStatus,
  ) => void;
  MEDIA_DEVICES_ERROR: /*mediaDevicesError:*/ (error: Error) => void;
  AUDIO_STREAM_ACQUIRED: /*audioStreamAcquired:*/ () => void;
  PARTICIPANT_PERMISSIONS_CHANGED: /*participantPermissionsChanged:*/ (prevPermissions?: FFCParticipantPermission) => void;
  TRACK_SUBSCRIPTION_STATUS_CHANGED: /*trackSubscriptionStatusChanged:*/ (
    publication: FFCRemoteTrackPublication,
    status: FFCTrackPublication.SubscriptionStatus,
  ) => void;
  ATTRIBUTES_CHANGED: /*attributesChanged:*/ (changedAttributes: Record<string, string>) => void;
  LOCAL_TRACK_SUBSCRIBED: /*localTrackSubscribed:*/ (trackPublication: FFCLocalTrackPublication) => void;
  //chatMessage: (msg: ChatMessage) => void;
};
