import { EventEmitter } from "events";
import type TypedEventEmitter from "typed-emitter";
import type { IFFCParticipant } from "./interfaces";
import { FFCParticipantKind, FFCParticipantPermission, FFCSubscriptionError } from "../protocol";
import { FFCTrack } from "../track/track";
import { FFCTrackPublication } from "../track/track-publication";
import type FFCLocalTrackPublication from "../track/track-publication-local";
import type FFCRemoteTrackPublication from "../track/track-publication-remote";
import type FFCRemoteTrack from "../track/track-remote";
import { FFCConnectionQuality } from "./types";
import type { ConnectionQuality, LocalTrackPublication, Participant, RemoteTrack, RemoteTrackPublication, SubscriptionError, Track, TrackPublication } from "livekit-client";
import { wrapTrackPublication } from "../wrapper-track-publication";
import { FFCParticipantEvent } from "../events";
import { wrapTrack } from "../wrapper-track";
import type { ParticipantPermission } from "@livekit/protocol";

export default class FFCParticipant
  extends (EventEmitter as new () => TypedEventEmitter<FFCParticipantEventCallbacks>)
  implements IFFCParticipant {
  protected _participant: Participant;

  /** @internal */
  constructor(participant: Participant) {
    super();
    this._participant = participant;
    this._participant.on('trackPublished', (publication: RemoteTrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      this.emit(FFCParticipantEvent.TRACK_PUBLISHED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_PUBLISHED, ffcPublication);
    });
    this._participant.on('trackSubscribed', (track: RemoteTrack, publication: RemoteTrackPublication): void => {
      const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      this.emit(FFCParticipantEvent.TRACK_SUBSCRIBED, ffcTrack, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_SUBSCRIBED, ffcTrack, ffcPublication);
    });
    this._participant.on('trackSubscriptionFailed', (trackSid: string, reason?: SubscriptionError): void => {
      const ffcReason = reason ? FFCSubscriptionError.fromSubscriptionError(reason) : undefined;
      this.emit(FFCParticipantEvent.TRACK_SUBSCRIPTION_FAILED, trackSid, ffcReason);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_SUBSCRIPTION_FAILED, trackSid, ffcReason);
    });
    this._participant.on('trackUnpublished', (publication: RemoteTrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      this.emit(FFCParticipantEvent.TRACK_UNPUBLISHED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_UNPUBLISHED, ffcPublication);
    });
    this._participant.on('trackUnsubscribed', (track: RemoteTrack, publication: RemoteTrackPublication): void => {
      const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      this.emit(FFCParticipantEvent.TRACK_UNSUBSCRIBED, ffcTrack, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_UNSUBSCRIBED, ffcTrack, ffcPublication);
    });
    this._participant.on('trackMuted', (publication: TrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication);
      this.emit(FFCParticipantEvent.TRACK_MUTED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_MUTED, ffcPublication);
    });
    this._participant.on('trackUnmuted', (publication: TrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication);
      this.emit(FFCParticipantEvent.TRACK_UNMUTED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_UNMUTED, ffcPublication);
    });
    this._participant.on('localTrackPublished', (publication: LocalTrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
      this.emit(FFCParticipantEvent.LOCAL_TRACK_PUBLISHED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.LOCAL_TRACK_PUBLISHED, ffcPublication);
    });
    this._participant.on('localTrackUnpublished', (publication: LocalTrackPublication): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
      this.emit(FFCParticipantEvent.LOCAL_TRACK_UNPUBLISHED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.LOCAL_TRACK_UNPUBLISHED, ffcPublication);
    });
    this._participant.on('participantMetadataChanged', (prevMetadata: string | undefined, participant?: any): void => {
      const ffcParticipant = participant ? new FFCParticipant(participant) : undefined;
      this.emit(FFCParticipantEvent.PARTICIPANT_METADATA_CHANGED, prevMetadata, ffcParticipant);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.PARTICIPANT_METADATA_CHANGED, prevMetadata, ffcParticipant);
    });
    this._participant.on('participantNameChanged', (name: string): void => {
      this.emit(FFCParticipantEvent.PARTICIPANT_NAME_CHANGED, name);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.PARTICIPANT_NAME_CHANGED, name);
    });
    /*
    dataReceived: (payload: Uint8Array, kind: DataPacket_Kind) => void;
    sipDTMFReceived: (dtmf: SipDTMF) => void;
    transcriptionReceived: (
      transcription: TranscriptionSegment[],
      publication?: TrackPublication,
    ) => void;
    */
   this._participant.on('isSpeakingChanged', (speaking: boolean): void => {
      this.emit(FFCParticipantEvent.IS_SPEAKING_CHANGED, speaking);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.IS_SPEAKING_CHANGED, speaking);
    });
    this._participant.on('connectionQualityChanged', (connectionQuality: ConnectionQuality): void => {
      const ffcConnectionQuality = FFCConnectionQuality.fromConnectionQuality(connectionQuality);
      this.emit(FFCParticipantEvent.CONNECTION_QUALITY_CHANGED, ffcConnectionQuality);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.CONNECTION_QUALITY_CHANGED, ffcConnectionQuality);
    });
    this._participant.on('trackStreamStateChanged', (publication: RemoteTrackPublication, streamState: Track.StreamState): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      const ffcState = FFCTrack.fromTrackStreamState(streamState);
      this.emit(FFCParticipantEvent.TRACK_STREAM_STATE_CHANGED, ffcPublication, ffcState);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_STREAM_STATE_CHANGED, ffcPublication, ffcState);
    });
    this._participant.on('trackSubscriptionPermissionChanged', (publication: RemoteTrackPublication, status: TrackPublication.PermissionStatus): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      const ffcStatus = FFCTrackPublication.fromPermissionStatus(status);
      this.emit(FFCParticipantEvent.TRACK_SUBSCRIPTION_PERMISSION_CHANGED, ffcPublication, status);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_SUBSCRIPTION_PERMISSION_CHANGED, ffcPublication, ffcStatus);
    });
    this._participant.on('mediaDevicesError', (error: Error): void => {
      this.emit(FFCParticipantEvent.MEDIA_DEVICES_ERROR, error);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.MEDIA_DEVICES_ERROR, error);
    });
    this._participant.on('audioStreamAcquired', (): void => {
      this.emit(FFCParticipantEvent.AUDIO_STREAM_ACQUIRED);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.AUDIO_STREAM_ACQUIRED);
    });
    this._participant.on('participantPermissionsChanged', (prevPermissions?: ParticipantPermission): void => {
      const ffcPermissions = prevPermissions ? FFCParticipantPermission.fromParticipantPermission(prevPermissions) : undefined;
      this.emit(FFCParticipantEvent.PARTICIPANT_PERMISSIONS_CHANGED, ffcPermissions);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.PARTICIPANT_PERMISSIONS_CHANGED, ffcPermissions);
    });
    this._participant.on('trackSubscriptionStatusChanged', (publication: RemoteTrackPublication, status: TrackPublication.SubscriptionStatus): void => {
      const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
      const ffcStatus = FFCTrackPublication.fromSubscriptionStatus(status);
      this.emit(FFCParticipantEvent.TRACK_SUBSCRIPTION_STATUS_CHANGED, ffcPublication, status);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.TRACK_SUBSCRIPTION_STATUS_CHANGED, ffcPublication, ffcStatus);
    });
    this._participant.on('attributesChanged', (changedAttributes: Record<string, string>): void => {
      this.emit(FFCParticipantEvent.ATTRIBUTES_CHANGED, changedAttributes);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.ATTRIBUTES_CHANGED, changedAttributes);
    });
    this._participant.on('localTrackSubscribed', (trackPublication: LocalTrackPublication): void => {
      const ffcPublication = wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
      this.emit(FFCParticipantEvent.LOCAL_TRACK_SUBSCRIBED, ffcPublication);
      console.log('FFCParticipant::', 'emitting', FFCParticipantEvent.LOCAL_TRACK_SUBSCRIBED, ffcPublication);
    });
    //chatMessage: (msg: ChatMessage) => void;
  }

  /** @internal */
  get instance(): Participant {
    return this._participant;
  }

  get audioTrackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value));
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value));
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCTrackPublication> {
    const ffcMap = new Map<string, FFCTrackPublication>();
    this._participant.trackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value));
    });
    return ffcMap;
  }

  get audioLevel(): number {
    return this._participant.audioLevel;
  }

  set audioLevel(level: number) {
    this._participant.audioLevel = level;
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
    if (this._participant.permissions) {
      return FFCParticipantPermission.fromParticipantPermission(this._participant.permissions);
    }
  }

  get isEncrypted(): boolean {
    return this._participant.isEncrypted;
  }

  get isAgent(): boolean {
    return this._participant.isAgent;
  }

  get kind(): FFCParticipantKind {
    return FFCParticipantKind.fromParticipantKind(this._participant.kind);
  }

  get attributes(): Readonly<Record<string, string>> {
    return this._participant.attributes;
  }

  getTrackPublications(): Array<FFCTrackPublication> {
    return this._participant.getTrackPublications().map((trackPublication) => wrapTrackPublication(trackPublication));
  }

  getTrackPublication(source: FFCTrack.Source): FFCTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(FFCTrack.toTrackSource(source));
    if (trackPublication) {
      return wrapTrackPublication(trackPublication);
    }
  }

  getTrackPublicationByName(name: string): FFCTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return wrapTrackPublication(trackPublication);
    }
  }

  get connectionQuality(): FFCConnectionQuality {
    return FFCConnectionQuality.fromConnectionQuality(this._participant.connectionQuality);
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
  TRACK_PUBLISHED: (publication: FFCRemoteTrackPublication) => void;
  TRACK_SUBSCRIBED: (track: FFCRemoteTrack, publication: FFCRemoteTrackPublication) => void;
  TRACK_SUBSCRIPTION_FAILED: (trackSid: string, reason?: FFCSubscriptionError) => void;
  TRACK_UNPUBLISHED: (publication: FFCRemoteTrackPublication) => void;
  TRACK_UNSUBSCRIBED: (track: FFCRemoteTrack, publication: FFCRemoteTrackPublication) => void;
  TRACK_MUTED: (publication: FFCTrackPublication) => void;
  TRACK_UNMUTED: (publication: FFCTrackPublication) => void;
  LOCAL_TRACK_PUBLISHED: (publication: FFCLocalTrackPublication) => void;
  LOCAL_TRACK_UNPUBLISHED: (publication: FFCLocalTrackPublication) => void;
  PARTICIPANT_METADATA_CHANGED: (prevMetadata: string | undefined, participant?: any) => void;
  PARTICIPANT_NAME_CHANGED: (name: string) => void;
  /*
  dataReceived: (payload: Uint8Array, kind: DataPacket_Kind) => void;
  sipDTMFReceived: (dtmf: SipDTMF) => void;
  transcriptionReceived: (
    transcription: TranscriptionSegment[],
    publication?: TrackPublication,
  ) => void;
  */
  IS_SPEAKING_CHANGED: (speaking: boolean) => void;
  CONNECTION_QUALITY_CHANGED: (connectionQuality: FFCConnectionQuality) => void;
  TRACK_STREAM_STATE_CHANGED: (
    publication: FFCRemoteTrackPublication,
    streamState: FFCTrack.StreamState,
  ) => void;
  TRACK_SUBSCRIPTION_PERMISSION_CHANGED: (
    publication: FFCRemoteTrackPublication,
    status: FFCTrackPublication.PermissionStatus,
  ) => void;
  MEDIA_DEVICES_ERROR: (error: Error) => void;
  AUDIO_STREAM_ACQUIRED: () => void;
  PARTICIPANT_PERMISSIONS_CHANGED: (prevPermissions?: FFCParticipantPermission) => void;
  TRACK_SUBSCRIPTION_STATUS_CHANGED: (
    publication: FFCRemoteTrackPublication,
    status: FFCTrackPublication.SubscriptionStatus,
  ) => void;
  ATTRIBUTES_CHANGED: (changedAttributes: Record<string, string>) => void;
  LOCAL_TRACK_SUBSCRIBED: (trackPublication: FFCLocalTrackPublication) => void;
  //chatMessage: (msg: ChatMessage) => void;
};
