import { EventEmitter } from "events";
import type TypedEventEmitter from "typed-emitter";
import type { IFFCParticipant } from "./interfaces";
import { type FFCSubscriptionError, FFCParticipantKind, FFCParticipantPermission } from "../protocol";
import { FFCTrack } from "../track/track";
import type { FFCTrackPublication } from "../track/track-publication";
import type FFCLocalTrackPublication from "../track/track-publication-local";
import type FFCRemoteTrackPublication from "../track/track-publication-remote";
import type FFCRemoteTrack from "../track/track-remote";
import { FFCConnectionQuality } from "./types";
import type { Participant } from "livekit-client";
import { wrapTrackPublication } from "../wrapper-track-publication";

export default class FFCParticipant
  extends (EventEmitter as new () => TypedEventEmitter<FFCParticipantEventCallbacks>)
  implements IFFCParticipant {
  protected _participant: Participant;

  /** @internal */
  constructor(participant: Participant) {
    super();
    this._participant = participant;
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
  TRACK_SUBSCRIPTION_STATUS_CHANGED: (
    publication: FFCRemoteTrackPublication,
    status: FFCTrackPublication.SubscriptionStatus,
  ) => void;
  MEDIA_DEVICES_ERROR: (error: Error) => void;
  AUDIO_STREAM_ACQUIRED: () => void;
  PARTICIPANT_PERMISSIONS_CHANGED: (prevPermissions?: FFCParticipantPermission) => void;
  ATTRIBUTES_CHANGED: (changedAttributes: Record<string, string>) => void;
  LOCAL_TRACK_SUBSCRIBED: (trackPublication: FFCLocalTrackPublication) => void;
  //chatMessage: (msg: ChatMessage) => void;
};
