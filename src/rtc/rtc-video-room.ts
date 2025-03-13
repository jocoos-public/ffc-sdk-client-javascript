import { EventEmitter } from "events";
import { ConnectionQuality, ConnectionState, DisconnectReason, LocalParticipant, LocalTrackPublication, Participant, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, SubscriptionError, Track, TrackPublication } from "livekit-client";
import type TypedEventEmitter from "typed-emitter";
import { FFCDisconnectReason, FFCMetricsBatch, FFCParticipantPermission, FFCSubscriptionError } from "./protocol";
import { wrapParticipant } from "./wrapper-participant";
import type FFCRemoteParticipant from "./participant/participant-remote";
import type FFCRemoteTrackPublication from "./track/track-publication-remote";
import { wrapTrackPublication } from "./wrapper-track-publication";
import type FFCRemoteTrack from "./track/track-remote";
import { wrapTrack } from "./wrapper-track";
import type { ParticipantPermission, MetricsBatch } from "@livekit/protocol";
import type RTCEngine from "livekit-client/dist/src/room/RTCEngine";
import type FFCParticipant from "./participant/participant";
import type FFCLocalParticipant from "./participant/participant-local";
import { FFCConnectionQuality } from "./participant/types";
import { FFCTrack } from "./track/track";
import { FFCTrackPublication } from "./track/track-publication";
import type FFCLocalTrackPublication from "./track/track-publication-local";
import { FFCRtcVideoRoomOptions, type FFCInternalRtcVideoRoomOptions, type FFCRtcVideoRoomConnectOptions } from "./options";
import { wrapRtcVideoRoom } from "./wrapper-rtc-video-room";

export enum FFCConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  SIGNAL_RECONNECTING = 'SIGNAL_RECONNECTING',
}

/** @internal */
export namespace FFCConnectionState {
  /** @internal */
  export function fromConnectionState(state: ConnectionState): FFCConnectionState {
    switch (state) {
      case ConnectionState.Disconnected:
        return FFCConnectionState.DISCONNECTED;
      case ConnectionState.Connecting:
        return FFCConnectionState.CONNECTING;
      case ConnectionState.Connected:
        return FFCConnectionState.CONNECTED;
      case ConnectionState.Reconnecting:
        return FFCConnectionState.RECONNECTING;
      case ConnectionState.SignalReconnecting:
        return FFCConnectionState.SIGNAL_RECONNECTING;

    }
  }

  /** @internal */
  export function toConnectionState(state: FFCConnectionState): ConnectionState {
    switch (state) {
      case FFCConnectionState.DISCONNECTED:
        return ConnectionState.Disconnected;
      case FFCConnectionState.CONNECTING:
        return ConnectionState.Connecting;
      case FFCConnectionState.CONNECTED:
        return ConnectionState.Connected;
      case FFCConnectionState.RECONNECTING:
        return ConnectionState.Reconnecting;
      case FFCConnectionState.SIGNAL_RECONNECTING:
        return ConnectionState.SignalReconnecting;
    }
  }
}

export default class FFCRtcVideoRoom extends (EventEmitter as new () => TypedEventEmitter<FFCRtcVideoRoomEventCallbacks>) {
  private _room: Room;

  private _handleConnected = () => {
    this.emit('CONNECTED');
  };

  private _handleReconnecting = () => {
    this.emit('RECONNECTING');
  };

  private _handleSignalReconnecting = () => {
    this.emit('SIGNAL_RECONNECTING');
  };

  private _handleReconnected = () => {
    this.emit('RECONNECTED');
  };

  private _handleDisconnected = (reason: DisconnectReason | undefined) => {
    this.emit('DISCONNECTED', FFCDisconnectReason.fromDisconnectReason(reason));
  };

  private _handleConnectionStateChanged = (state: ConnectionState) => {
    this.emit('CONNECTION_STATE_CHANGED', FFCConnectionState.fromConnectionState(state));
  };

  private _handleMediaDevicesChanged = () => {
    this.emit('MEDIA_DEVICES_CHANGED');
  };

  private _handleParticipantConnected = (participant: Participant) => {
    this.emit('PARTICIPANT_CONNECTED', wrapParticipant(participant) as FFCRemoteParticipant);
  };

  private _handleParticipantDisconnected = (participant: Participant) => {
    this.emit('PARTICIPANT_DISCONNECTED', wrapParticipant(participant) as FFCRemoteParticipant);
  };

  private _handleTrackPublished = (publication: RemoteTrackPublication, participant: Participant) => {
    this.emit(
      'TRACK_PUBLISHED',
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      wrapParticipant(participant) as FFCRemoteParticipant
    );
  };

  private _handleTrackSubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => {
    this.emit(
      'TRACK_SUBSCRIBED',
      wrapTrack(track) as FFCRemoteTrack,
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      wrapParticipant(participant) as FFCRemoteParticipant,
    );
  }

  private _handleTrackSubscriptionFailed = (
    trackSid: string,
    participant: RemoteParticipant,
    reason?: SubscriptionError,
  ) => {
    this.emit(
      'TRACK_SUBSCRIPTION_FAILED',
      trackSid,
      wrapParticipant(participant) as FFCRemoteParticipant,
      reason ? FFCSubscriptionError.fromSubscriptionError(reason) : undefined,
    );
  }

  private _handleTrackUnpublished = (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    this.emit(
      'TRACK_UNPUBLISHED',
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      wrapParticipant(participant) as FFCRemoteParticipant
    );
  }

  private _handleTrackUnsubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => {
    this.emit(
      'TRACK_UNSUBSCRIBED',
      wrapTrack(track) as FFCRemoteTrack,
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      wrapParticipant(participant) as FFCRemoteParticipant
    );
  }

  private _handleTrackMuted = (publication: TrackPublication, participant: Participant) => {
    this.emit(
      'TRACK_MUTED',
      wrapTrackPublication(publication),
      wrapParticipant(participant)
    );
  }

  private _handleTrackUnmuted = (publication: TrackPublication, participant: Participant) => {
    this.emit(
      'TRACK_UNMUTED',
      wrapTrackPublication(publication),
      wrapParticipant(participant)
    );
  }

  private _handleLocalTrackPublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    this.emit(
      'LOCAL_TRACK_PUBLISHED',
      wrapTrackPublication(publication) as FFCLocalTrackPublication,
      wrapParticipant(participant) as FFCLocalParticipant
    );
  }

  private _handleLocalTrackUnpublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    this.emit(
      'LOCAL_TRACK_UNPUBLISHED',
      wrapTrackPublication(publication) as FFCLocalTrackPublication,
      wrapParticipant(participant) as FFCLocalParticipant
    );
  }

  private _handleLocalAudioSilenceDetected = (publication: LocalTrackPublication) => {
    this.emit('LOCAL_AUDIO_SILENCE_DETECTED', publication);
  }

  private _handleParticipantMetadataChanged = (
    metadata: string | undefined,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    this.emit('PARTICIPANT_METADATA_CHANGED', metadata, wrapParticipant(participant) as FFCParticipant);
  }

  private _handleParticipantNameChanged = (name: string, participant: RemoteParticipant | LocalParticipant) => {
    if (participant.isLocal) {
      this.emit(
        'PARTICIPANT_NAME_CHANGED',
        name,
        wrapParticipant(participant) as FFCLocalParticipant
      );
    } else {
      this.emit(
        'PARTICIPANT_NAME_CHANGED',
        name,
        wrapParticipant(participant) as FFCRemoteParticipant
      );
    }
  }

  private _handleParticipantPermissionsChanged = (
    prevPermissions: ParticipantPermission | undefined,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    if (participant.isLocal) {
      this.emit(
        'PARTICIPANT_PERMISSIONS_CHANGED',
        prevPermissions ? FFCParticipantPermission.fromParticipantPermission(prevPermissions) : undefined,
        wrapParticipant(participant) as FFCLocalParticipant,
      );
    } else {
      this.emit(
        'PARTICIPANT_PERMISSIONS_CHANGED',
        prevPermissions ? FFCParticipantPermission.fromParticipantPermission(prevPermissions) : undefined,
        wrapParticipant(participant) as FFCRemoteParticipant,
      );
    }
  }

  private _handleParticipantAttributesChanged = (
    changedAttributes: Record<string, string>,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    if (participant.isLocal) {
      this.emit(
        'PARTICIPANT_ATTRIBUTES_CHANGED',
        changedAttributes,
        wrapParticipant(participant) as FFCLocalParticipant
      );
    } else {
      this.emit(
        'PARTICIPANT_ATTRIBUTES_CHANGED',
        changedAttributes,
        wrapParticipant(participant) as FFCRemoteParticipant
      );
    }
  }

  private _handleActiveSpeakersChanged = (speakers: Array<Participant>) => {
    this.emit(
      'ACTIVE_SPEAKERS_CHANGED',
      speakers.map((participant) => wrapParticipant(participant))
    );
  }

  private _handleRoomMetadataChanged = (metadata: string) => {
    this.emit('ROOM_METADATA_CHANGED', metadata);
  }

  private _handleConnectionQualityChanged = (quality: ConnectionQuality, participant: Participant) => {
    this.emit(
      'CONNECTION_QUALITY_CHANGED',
      FFCConnectionQuality.fromConnectionQuality(quality),
      wrapParticipant(participant)
    );
  }

  private _handleMediaDevicesError = (error: Error) => {
    this.emit('MEDIA_DEVICES_ERROR', error);
  }

  private _handleTrackStreamStateChanged = (
    publication: RemoteTrackPublication,
    streamState: Track.StreamState,
    participant: RemoteParticipant,
  ) => {
    this.emit(
      'TRACK_STREAM_STATE_CHANGED',
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      FFCTrack.fromTrackStreamState(streamState),
      wrapParticipant(participant) as FFCRemoteParticipant,
    );
  }

  private _handleTrackSubscriptionPermissionChanged = (
    publication: RemoteTrackPublication,
    status: TrackPublication.PermissionStatus,
    participant: RemoteParticipant,
  ) => {
    this.emit(
      'TRACK_SUBSCRIPTION_PERMISSION_CHANGED',
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      FFCTrackPublication.fromPermissionStatus(status),
      wrapParticipant(participant) as FFCRemoteParticipant,
    );
  }

  private _handleTrackSubscriptionStatusChanged = (
    publication: RemoteTrackPublication,
    status: TrackPublication.SubscriptionStatus,
    participant: RemoteParticipant,
  ) => {
    this.emit(
      'TRACK_SUBSCRIPTION_STATUS_CHANGED',
      wrapTrackPublication(publication) as FFCRemoteTrackPublication,
      FFCTrackPublication.fromSubscriptionStatus(status),
      wrapParticipant(participant) as FFCRemoteParticipant,
    );
  }

  private _handleAudioPlaybackChanged = (playing: boolean) => {
    this.emit('AUDIO_PLAYBACK_STATUS_CHANGED', playing);
  }

  private _handleVideoPlaybackChanged = (playing: boolean) => {
    this.emit('VIDEO_PLAYBACK_STATUS_CHANGED', playing);
  }

  private _handleSignalConnected = () => {
    this.emit('SIGNAL_CONNECTED');
  }

  private _handleRecordingStatusChanged = (recording: boolean) => this.emit('RECORDING_STATUS_CHANGED', recording);

  private _handleActiveDeviceChanged = (kind: MediaDeviceKind, deviceId: string) => {
    this.emit('ACTIVE_DEVICE_CHANGED', kind, deviceId);
  }

  private _handleLocalTrackSubscribed = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    this.emit(
      'LOCAL_TRACK_SUBSCRIBED',
      wrapTrackPublication(publication) as FFCLocalTrackPublication,
      wrapParticipant(participant) as FFCLocalParticipant
    );
  }

  private _handleMetricsReceived = (metrics: MetricsBatch, participant?: Participant) => {
    this.emit(
      'METRICS_RECEIVED',
      new FFCMetricsBatch(metrics),
      participant ? wrapParticipant(participant) : undefined,
    );
  }

  //constructor(room: Room);
  constructor(opts?: FFCRtcVideoRoomOptions) {
  //constructor(opts?: FFCRtcVideoRoomOptions | Room) {
    super();
    if (opts instanceof Room) {
      this._room = opts;
    } else {
      this._room = new Room(opts ? FFCRtcVideoRoomOptions.toRoomOptions(opts) : undefined);
      wrapRtcVideoRoom(this._room, this);

    }
    this._room
      .on('connected', this._handleConnected)
      .on('reconnecting', this._handleReconnecting)
      .on('signalReconnecting', this._handleSignalReconnecting)
      .on('reconnected', this._handleReconnected)
      .on('disconnected', this._handleDisconnected)
      .on('connectionStateChanged', this._handleConnectionStateChanged)
      .on('mediaDevicesChanged', this._handleMediaDevicesChanged)
      .on('participantConnected', this._handleParticipantConnected)
      .on('participantDisconnected', this._handleParticipantDisconnected)
      .on('trackPublished', this._handleTrackPublished)
      .on('trackSubscribed', this._handleTrackSubscribed)
      .on('trackSubscriptionFailed', this._handleTrackSubscriptionFailed)
      .on('trackUnpublished', this._handleTrackUnpublished)
      .on('trackUnsubscribed', this._handleTrackUnsubscribed)
      .on('trackMuted', this._handleTrackMuted)
      .on('trackUnmuted', this._handleTrackUnmuted)
      .on('localTrackPublished', this._handleLocalTrackPublished)
      .on('localTrackUnpublished', this._handleLocalTrackUnpublished)
      .on('localAudioSilenceDetected', this._handleLocalAudioSilenceDetected)
      .on('participantMetadataChanged', this._handleParticipantMetadataChanged)
      .on('participantNameChanged', this._handleParticipantNameChanged)
      .on('participantPermissionsChanged', this._handleParticipantPermissionsChanged)
      .on('participantAttributesChanged', this._handleParticipantAttributesChanged)
      .on('activeSpeakersChanged', this._handleActiveSpeakersChanged)
      .on('roomMetadataChanged', this._handleRoomMetadataChanged)
      .on('connectionQualityChanged', this._handleConnectionQualityChanged)
      .on('mediaDevicesError', this._handleMediaDevicesError)
      .on('trackStreamStateChanged', this._handleTrackStreamStateChanged)
      .on('trackSubscriptionPermissionChanged', this._handleTrackSubscriptionPermissionChanged)
      .on('trackSubscriptionStatusChanged', this._handleTrackSubscriptionStatusChanged)
      .on('audioPlaybackChanged', this._handleAudioPlaybackChanged)
      .on('videoPlaybackChanged', this._handleVideoPlaybackChanged)
      .on('signalConnected', this._handleSignalConnected)
      .on('recordingStatusChanged', this._handleRecordingStatusChanged)
      .on('activeDeviceChanged', this._handleActiveDeviceChanged)
      .on('localTrackSubscribed', this._handleLocalTrackSubscribed)
      .on('metricsReceived', this._handleMetricsReceived);
    /*
      
      .on('connected', () => this.emit('CONNECTED'))
      .on('reconnecting', () => this.emit('RECONNECTING'))
      .on('signalReconnecting', () => this.emit('SIGNAL_RECONNECTING'))
      .on('reconnected', () => this.emit('RECONNECTED'))
      .on('disconnected', (reason: FFCDisconnectReason | undefined) => this.emit('DISCONNECTED', reason))
      .on('connectionStateChanged', (state: ConnectionState) => this.emit('CONNECTION_STATE_CHANGED', toFFCConnectionQuality(state)))
      .on('mediaDevicesChanged', () => this.emit('MEDIA_DEVICES_CHANGED'))
      .on('participantConnected', (participant) => this.emit('PARTICIPANT_CONNECTED', wrapParticipant(participant) as FFCRemoteParticipant))
      .on('participantDisconnected', (participant) => this.emit('PARTICIPANT_DISCONNECTED', wrapParticipant(participant) as FFCRemoteParticipant))
      .on('trackPublished', (publication, participant) => this.emit('TRACK_PUBLISHED', publication, wrapParticipant(participant) as FFCRemoteParticipant))
      .on('trackSubscribed', (track, publication, participant) => this.emit('TRACK_SUBSCRIBED', track, publication, wrapParticipant(participant) as FFCRemoteParticipant))
      .on('trackSubscriptionFailed', (trackSid, participant, reason) => this.emit('TRACK_SUBSCRIPTION_FAILED', trackSid, wrapParticipant(participant) as FFCRemoteParticipant, reason))
      .on('trackUnpublished', (publication, participant) => this.emit('TRACK_UNPUBLISHED', publication, wrapParticipant(participant) as FFCRemoteParticipant))
      .on('trackUnsubscribed', (track, publication, participant) => this.emit('TRACK_UNSUBSCRIBED', track, publication, wrapParticipant(participant) as FFCRemoteParticipant))
      .on('trackMuted', (publication, participant) => this.emit('TRACK_MUTED', publication, wrapParticipant(participant) as FFCParticipant))
      .on('trackUnmuted', (publication, participant) => this.emit('TRACK_UNMUTED', publication, wrapParticipant(participant) as FFCParticipant))
      .on('localTrackPublished', (publication, participant) => this.emit('LOCAL_TRACK_PUBLISHED', publication, wrapParticipant(participant) as FFCLocalParticipant))
      .on('localTrackUnpublished', (publication, participant) => this.emit('LOCAL_TRACK_UNPUBLISHED', publication, wrapParticipant(participant) as FFCLocalParticipant))
      .on('localAudioSilenceDetected', (publication) => this.emit('LOCAL_AUDIO_SILENCE_DETECTED', publication))
      .on('participantMetadataChanged', (metadata, participant) => this.emit('PARTICIPANT_METADATA_CHANGED', metadata, wrapParticipant(participant) as FFCParticipant))
      .on('participantNameChanged', (name, participant) => this.emit('PARTICIPANT_NAME_CHANGED', name, wrapParticipant(participant) as FFCParticipant))
      .on('participantPermissionChanged', (prevPermissions, participant) => this.emit('PARTICIPANT_PERMISSION_CHANGED', prevPermissions, wrapParticipant(participant) as FFCParticipant))
      .on('participantAttributesChanged', (changedAttributes, participant) => this.emit('PARTICIPANT_ATTRIBUTES_CHANGED', changedAttributes, wrapParticipant(participant) as FFCParticipant))
      .on('activeSpeakersChanged', (speakers) => this.emit('ACTIVE_SPEAKERS_CHANGED', speakers.map((participant) => wrapParticipant(participant))))
      .on('roomMetadataChanged', (metadata) => this.emit('ROOM_METADATA_CHANGED', metadata))
      .on('connectionQualityChanged', (quality, participant) => this.emit('CONNECTION_QUALITY_CHANGED', quality, wrapParticipant(participant)))
      .on('mediaDevicesError', (error) => this.emit('MEDIA_DEVICES_ERROR', error))
      .on('trackStreamStateChanged', (publication, streamState, participant) => this.emit('TRACK_STREAM_STATE_CHANGED', publication, streamState, wrapParticipant(participant)))
      .on('trackSubscriptionPermissionChanged', (publication, status, participant) => this.emit('TRACK_SUBSCRIPTION_PERMISSION_CHANGED', publication, status, wrapParticipant(participant)))
      .on('trackSubscriptionStatusChanged', (publication, status, participant) => this.emit('TRACK_SUBSCRIPTION_STATUS_CHANGED', publication, status, wrapParticipant(participant)))
      .on('audioPlaybackChanged', (playing) => this.emit('AUDIO_PLAYBACK_CHANGED', playing))
      .on('videoPlaybackChanged', (playing) => this.emit('VIDEO_PLAYBACK_CHANGED', playing))
      .on('signalConnected', () => this.emit('SIGNAL_CONNECTED'))
      .on('recordingStatusChanged', (recording) => this.emit('RECORDING_STATUS_CHANGED', recording))
      .on('activeDeviceChanged', (kind, deviceId) => this.emit('ACTIVE_DEVICE_CHANGED', kind, deviceId))
      .on('localTrackSubscribed', (publication, participant) => this.emit('LOCAL_TRACK_SUBSCRIBED', publication, wrapParticipant(participant) as FFCLocalParticipant))
      .on('metricsReceived', (metrics, participant) => this.emit('METRICS_RECEIVED', metrics, wrapParticipant(participant))); 
      */
  }

  /** @internal */
  get instance(): Room {
    return this._room;
  }

  get state(): FFCConnectionState {
    return FFCConnectionState.fromConnectionState(this._room.state);
  }

  get remoteParticipants(): Map<string, FFCRemoteParticipant> {
    const ffcMap = new Map<string, FFCRemoteParticipant>();
    this._room.remoteParticipants.forEach((value, key) => {
      ffcMap.set(key, wrapParticipant(value) as FFCRemoteParticipant);
    });
    return ffcMap;
  }

  get activeSpeakers(): Array<FFCParticipant> {
    return this._room.activeSpeakers.map((participant) => wrapParticipant(participant));
  }

  get localParticipant(): FFCLocalParticipant {
    return wrapParticipant(this._room.localParticipant) as FFCLocalParticipant;
  }

  get engine(): RTCEngine {
    return this._room.engine;
  }

  get isE2EEEnabled(): boolean {
    return false;
  }

  get options(): FFCInternalRtcVideoRoomOptions {
    return FFCRtcVideoRoomOptions.fromRoomOptions(this._room.options) as FFCInternalRtcVideoRoomOptions;
  }

  /*
  get serverInfo(): FFCServerInfo | undefined {
    return this._room.serverInfo;
  }
  */

  get isRecording(): boolean {
    return this._room.isRecording;
  }

  get name(): string {
    return this._room.name;
  }

  get metadata(): string | undefined {
    return this._room.metadata;
  }

  get numParticipants(): number {
    return this._room.numParticipants;
  }

  get numPublishers(): number {
    return this._room.numPublishers;
  }

  get canPlaybackAudio(): boolean {
    return this._room.canPlaybackAudio;
  }

  get canPlaybackVideo(): boolean {
    return this._room.canPlaybackVideo;
  }

  async getSid(): Promise<string> {
    return this._room.getSid();
  }

  static getLocalDevices(kind?: MediaDeviceKind, requestPermissions: boolean = true): Promise<MediaDeviceInfo[]> {
    return Room.getLocalDevices(kind, requestPermissions);
  }

  getActiveDevice(kind: MediaDeviceKind): string | undefined {
    return this._room.getActiveDevice(kind);
  }

  async switchActiveDevice(kind: MediaDeviceKind, deviceId: string, exact: boolean = false): Promise<boolean> {
    return this._room.switchActiveDevice(kind, deviceId, exact);
  }

  //static cleanupRegistry

  async prepareConnection(url: string, token?: string): Promise<void> {
    await this._room.prepareConnection(url, token);
  }

  async connect(url: string, token: string, opts?: FFCRtcVideoRoomConnectOptions): Promise<void> {
    await this._room.connect(url, token, opts);
  }

  async disconnect(stopTracks: boolean = true) {
    return this._room.disconnect(stopTracks);
  }

  getParticipantByIdentity(idenity: string): FFCParticipant | undefined {
    const participant = this._room.getParticipantByIdentity(idenity);
    if (participant) {
      return wrapParticipant(participant);
    }
  }

  startAudio() {
    return this._room.startAudio();
  }

  startVideo() {
    return this._room.startVideo();
  }

  /*
  registerTextStreamHandler(topic: string, callback: TextStreamHandler) {
    throw new Error('Method not implemented.');
  }

  unregisterTextStreamHandler(topic: string) {
    throw new Error('Method not implemented.');
  }

  registerByteStreamHandler(topic: string, callback: ByteStreamHandler) {
    throw new Error('Method not implemented.');
  }

  unregisterByteStreamHandler(topic: string) {
    throw new Error('Method not implemented.');
  }

  registerRpcMethod(method: string, handler: (data: RpcInvocationData) => Promise<string>) {
    throw new Error('Method not implemented.');
  }

  unregisterRpcMethod(method: string) {
    throw new Error('Method not implemented.');
  }

  async setE2EEEnabled(enabled: boolean) {
    throw new Error('Method not implemented.');
  }

  async simulateScenario(scenario: SimulationScenario, arg?: any) {
    throw new Error('Method not implemented.');
  }
  */
}

export type FFCRtcVideoRoomEventCallbacks = {
  CONNECTED: /*connected:*/ () => void;
  RECONNECTING: /*reconnecting:*/ () => void;
  SIGNAL_RECONNECTING: /*signalReconnecting:*/ () => void;
  RECONNECTED: /*reconnected:*/ () => void;
  DISCONNECTED: /*disconnected:*/ (reason: FFCDisconnectReason | undefined) => void;
  CONNECTION_STATE_CHANGED: /*connectionStateChanged:*/ (state: FFCConnectionState) => void;
  MEDIA_DEVICES_CHANGED: /*mediaDevicesChanged:*/ () => void;
  PARTICIPANT_CONNECTED: /*participantConnected:*/ (participant: FFCRemoteParticipant) => void;
  PARTICIPANT_DISCONNECTED: /*participantDisconnected:*/ (participant: FFCRemoteParticipant) => void;
  TRACK_PUBLISHED: /*trackPublished:*/ (publication: FFCRemoteTrackPublication, participant: FFCRemoteParticipant) => void;
  TRACK_SUBSCRIBED: /*trackSubscribed:*/ (
    track: FFCRemoteTrack,
    publication: FFCRemoteTrackPublication,
    participant: FFCRemoteParticipant,
  ) => void;
  TRACK_SUBSCRIPTION_FAILED: /*trackSubscriptionFailed:*/ (
    trackSid: string,
    participant: FFCRemoteParticipant,
    reason?: string,
  ) => void;
  TRACK_UNPUBLISHED: /*trackUnpublished:*/ (publication: FFCRemoteTrackPublication, participant: FFCRemoteParticipant) => void;
  TRACK_UNSUBSCRIBED: /*trackUnsubscribed:*/ (
    track: FFCRemoteTrack,
    publication: FFCRemoteTrackPublication,
    participant: FFCRemoteParticipant,
  ) => void;
  TRACK_MUTED: /*trackMuted:*/ (publication: FFCTrackPublication, participant: FFCParticipant) => void;
  TRACK_UNMUTED: /*trackUnmuted:*/ (publication: FFCTrackPublication, participant: FFCParticipant) => void;
  LOCAL_TRACK_PUBLISHED: /*localTrackPublished:*/ (publication: FFCLocalTrackPublication, participant: FFCLocalParticipant) => void;
  LOCAL_TRACK_UNPUBLISHED: /*localTrackUnpublished:*/ (
    publication: FFCLocalTrackPublication,
    participant: FFCLocalParticipant,
  ) => void;
  LOCAL_AUDIO_SILENCE_DETECTED: /*localAudioSilenceDetected:*/ (publication: LocalTrackPublication) => void;
  ACTIVE_SPEAKERS_CHANGED: /*activeSpeakersChanged:*/ (speakers: Array<FFCParticipant>) => void;
  PARTICIPANT_METADATA_CHANGED: /*participantMetadataChanged:*/ (metadata: string | undefined, participant: FFCParticipant) => void;
  PARTICIPANT_NAME_CHANGED: /*participantNameChanged:*/ (name: string, participant: FFCLocalParticipant | FFCRemoteParticipant) => void;
  PARTICIPANT_ATTRIBUTES_CHANGED: /*participantAttributesChanged:*/ (
    changedAttributes: Record<string, string>,
    participant: FFCLocalParticipant | FFCRemoteParticipant,
  ) => void;

  ROOM_METADATA_CHANGED: /*roomMetadataChanged:*/ (metadata: string) => void;
  /*
  ataReceived: (
    payload: Uint8Array,
    participant?: RemoteParticipant,
    kind?: DataPacket_Kind,
    topic?: string,
  ) => void;
  sipDTMFReceived: (dtmf: SipDTMF, participant?: RemoteParticipant) => void;
  transcriptionReceived: (
    transcription: TranscriptionSegment[],
    participant?: Participant,
    publication?: TrackPublication,
  ) => void;
  */
  CONNECTION_QUALITY_CHANGED: /*connectionQualityChanged:*/ (quality: FFCConnectionQuality, participant: FFCParticipant) => void;
  TRACK_STREAM_STATE_CHANGED: /*trackStreamStateChanged:*/ (publication: FFCRemoteTrackPublication, streamState: FFCTrack.StreamState, participant: FFCRemoteParticipant) => void;
  TRACK_SUBSCRIPTION_PERMISSION_CHANGED: /*trackSubscriptionPermissionChanged:*/ (publication: FFCRemoteTrackPublication, status: FFCTrackPublication.PermissionStatus, participant: FFCRemoteParticipant) => void;
  TRACK_SUBSCRIPTION_STATUS_CHANGED: /*trackSubscriptionStatusChanged:*/ (publication: FFCRemoteTrackPublication, status: FFCTrackPublication.SubscriptionStatus, participant: FFCRemoteParticipant) => void;
  AUDIO_PLAYBACK_STATUS_CHANGED: /*audioPlaybackChanged:*/ (playing: boolean) => void;
  VIDEO_PLAYBACK_STATUS_CHANGED: /*videoPlaybackChanged:*/ (playing: boolean) => void;
  MEDIA_DEVICES_ERROR: /*mediaDevicesError:*/ (error: Error) => void;
  PARTICIPANT_PERMISSIONS_CHANGED: /*participantPermissionsChanged:*/ (prevPermissions: FFCParticipantPermission | undefined, participant: FFCLocalParticipant | FFCRemoteParticipant) => void;
  SIGNAL_CONNECTED: /*signalConnected:*/ () => void;
  RECORDING_STATUS_CHANGED: /*recordingStatusChanged:*/ (recording: boolean) => void;
  PARTICIPANT_ENCRYPTION_STATUS_CHANGED: (encrypted: boolean, participant?: FFCParticipant) => void;
  ENCRYPTION_ERROR: (error: Error) => void;
  /*
  dcBufferStatusChanged: (isLow: boolean, kind: DataPacket_Kind) => void;
  */
  ACTIVE_DEVICE_CHANGED: /*activeDeviceChanged:*/ (kind: MediaDeviceKind, deviceId: string) => void;
  /*
  chatMessage: (message: ChatMessage, participant?: RemoteParticipant | LocalParticipant) => void;
  */
  LOCAL_TRACK_SUBSCRIBED: /*localTrackSubscribed:*/(publication: FFCLocalTrackPublication, participant: FFCLocalParticipant) => void;
  METRICS_RECEIVED: /*metricsRecieved:*/ (metrics: FFCMetricsBatch, participant?: FFCParticipant) => void;
};
