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
import { FFCRtcVideoRoomEvent } from "./events";

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

  //constructor(room: Room);
  constructor(opts?: FFCRtcVideoRoomOptions) {
  //constructor(opts?: FFCRtcVideoRoomOptions | Room) {
    super();
    if (opts instanceof Room) {
      this._room = opts;
    } else {
      console.log('options to set on room', opts);
      this._room = opts
        ? new Room(FFCRtcVideoRoomOptions.toRoomOptions(opts))
        : new Room();
        console.log('options set on room', this._room.options);
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

  private _handleConnected = () => {
    this.emit(FFCRtcVideoRoomEvent.CONNECTED);
    console.log('emitting', FFCRtcVideoRoomEvent.CONNECTED);
  };

  private _handleReconnecting = () => {
    this.emit(FFCRtcVideoRoomEvent.RECONNECTING);
    console.log('emitting', FFCRtcVideoRoomEvent.RECONNECTING);
  };

  private _handleSignalReconnecting = () => {
    this.emit(FFCRtcVideoRoomEvent.SIGNAL_RECONNECTING);
    console.log('emitting', FFCRtcVideoRoomEvent.SIGNAL_RECONNECTING);
  };

  private _handleReconnected = () => {
    this.emit(FFCRtcVideoRoomEvent.RECONNECTED);
    console.log('emitting', FFCRtcVideoRoomEvent.RECONNECTED);
  };

  private _handleDisconnected = (reason: DisconnectReason | undefined) => {
    const ffcReason = reason ? FFCDisconnectReason.fromDisconnectReason(reason) : undefined;
    this.emit(FFCRtcVideoRoomEvent.DISCONNECTED, ffcReason);
    console.log('emitting', FFCRtcVideoRoomEvent.DISCONNECTED, ffcReason);
  };

  private _handleConnectionStateChanged = (state: ConnectionState) => {
    const ffcState = FFCConnectionState.fromConnectionState(state);
    this.emit(FFCRtcVideoRoomEvent.CONNECTION_STATE_CHANGED, ffcState);
    console.log('emitting', FFCRtcVideoRoomEvent.CONNECTION_STATE_CHANGED, ffcState)
  };

  private _handleMediaDevicesChanged = () => {
    this.emit(FFCRtcVideoRoomEvent.MEDIA_DEVICES_CHANGED);
    console.log('emitting', FFCRtcVideoRoomEvent.MEDIA_DEVICES_CHANGED);
  };

  private _handleParticipantConnected = (participant: Participant) => {
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit('PARTICIPANT_CONNECTED', ffcParticipant);
    console.log('emitting', 'PARTICIPANT_CONNECTED', ffcParticipant);
  };

  private _handleParticipantDisconnected = (participant: Participant) => {
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit('PARTICIPANT_DISCONNECTED', ffcParticipant);
    console.log('emitting', 'PARTICIPANT_DISCONNECTED', ffcParticipant);
  };

  private _handleTrackPublished = (publication: RemoteTrackPublication, participant: Participant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit('TRACK_PUBLISHED', ffcPublication, ffcParticipant);
    console.log('emitting', 'TRACK_PUBLISHED', ffcPublication, ffcParticipant);
  };

  private _handleTrackSubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => {
    const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit('TRACK_SUBSCRIBED', ffcTrack, ffcPublication, ffcParticipant);
    console.log('emitting', 'TRACK_SUBSCRIBED', ffcTrack, ffcPublication, ffcParticipant);
  }

  private _handleTrackSubscriptionFailed = (
    trackSid: string,
    participant: RemoteParticipant,
    reason?: SubscriptionError,
  ) => {
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    const ffcReason = reason ? FFCSubscriptionError.fromSubscriptionError(reason) : undefined;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_FAILED,
      trackSid,
      ffcParticipant,
      ffcReason,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_FAILED, trackSid, ffcParticipant, ffcReason);
  }

  private _handleTrackUnpublished = (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_UNPUBLISHED,
      ffcPublication,
      ffcParticipant
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_UNPUBLISHED, ffcPublication, ffcParticipant);
  }

  private _handleTrackUnsubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant,
  ) => {
    const ffcTrack = wrapTrack(track) as FFCRemoteTrack;
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_UNSUBSCRIBED,
      ffcTrack,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_UNSUBSCRIBED, ffcTrack, ffcPublication, ffcParticipant);
  }

  private _handleTrackMuted = (publication: TrackPublication, participant: Participant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCTrackPublication;
    const ffcParticipant = wrapParticipant(participant);
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_MUTED,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_MUTED, ffcPublication, ffcParticipant);
  }

  private _handleTrackUnmuted = (publication: TrackPublication, participant: Participant) => {
    const ffcPublication = wrapTrackPublication(publication);
    const ffcParticipant = wrapParticipant(participant);
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_UNMUTED,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_UNMUTED, ffcPublication, ffcParticipant);
  }

  private _handleLocalTrackPublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.LOCAL_TRACK_PUBLISHED,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.LOCAL_TRACK_PUBLISHED, ffcPublication, ffcParticipant);
  }

  private _handleLocalTrackUnpublished = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.LOCAL_TRACK_UNPUBLISHED,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.LOCAL_TRACK_UNPUBLISHED, ffcPublication, ffcParticipant);
  }

  private _handleLocalAudioSilenceDetected = (publication: LocalTrackPublication) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
    this.emit(FFCRtcVideoRoomEvent.LOCAL_AUDIO_SILENCE_DETECTED, ffcPublication);
    console.log('emitting', FFCRtcVideoRoomEvent.LOCAL_AUDIO_SILENCE_DETECTED, ffcPublication);
  }

  private _handleParticipantMetadataChanged = (
    metadata: string | undefined,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant;
    this.emit(FFCRtcVideoRoomEvent.PARTICIPANT_METADATA_CHANGED, metadata, ffcParticipant);
    console.log('emitting', FFCRtcVideoRoomEvent.PARTICIPANT_METADATA_CHANGED, metadata, ffcParticipant);
  }

  private _handleParticipantNameChanged = (name: string, participant: RemoteParticipant | LocalParticipant) => {
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant | FFCRemoteParticipant;
    this.emit(FFCRtcVideoRoomEvent.PARTICIPANT_NAME_CHANGED, name, ffcParticipant);
    console.log('emitting', FFCRtcVideoRoomEvent.PARTICIPANT_NAME_CHANGED, name, ffcParticipant);
  }

  private _handleParticipantPermissionsChanged = (
    prevPermissions: ParticipantPermission | undefined,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    const ffcPrevPermissions = prevPermissions ? FFCParticipantPermission.fromParticipantPermission(prevPermissions) : undefined;
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant | FFCRemoteParticipant;
    this.emit(FFCRtcVideoRoomEvent.PARTICIPANT_PERMISSIONS_CHANGED, ffcPrevPermissions, ffcParticipant);
    console.log('emitting', FFCRtcVideoRoomEvent.PARTICIPANT_PERMISSIONS_CHANGED, ffcPrevPermissions, ffcParticipant);
  }

  private _handleParticipantAttributesChanged = (
    changedAttributes: Record<string, string>,
    participant: RemoteParticipant | LocalParticipant,
  ) => {
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant | FFCRemoteParticipant;
    this.emit(FFCRtcVideoRoomEvent.PARTICIPANT_ATTRIBUTES_CHANGED, changedAttributes, ffcParticipant);
    console.log('emitting', FFCRtcVideoRoomEvent.PARTICIPANT_ATTRIBUTES_CHANGED, changedAttributes, ffcParticipant);
  }

  private _handleActiveSpeakersChanged = (speakers: Array<Participant>) => {
    const ffcSpeakers = speakers.map((participant) => wrapParticipant(participant));
    this.emit(
      FFCRtcVideoRoomEvent.ACTIVE_SPEAKERS_CHANGED,
      ffcSpeakers,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.ACTIVE_SPEAKERS_CHANGED, ffcSpeakers);
  }

  private _handleRoomMetadataChanged = (metadata: string) => {
    this.emit(FFCRtcVideoRoomEvent.ROOM_METADATA_CHANGED, metadata);
    console.log('emitting', FFCRtcVideoRoomEvent.ROOM_METADATA_CHANGED, metadata);
  }

  private _handleConnectionQualityChanged = (quality: ConnectionQuality, participant: Participant) => {
    const ffcQuality = FFCConnectionQuality.fromConnectionQuality(quality);
    const ffcParticipant = wrapParticipant(participant);
    this.emit(
      FFCRtcVideoRoomEvent.CONNECTION_QUALITY_CHANGED,
      ffcQuality,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.CONNECTION_QUALITY_CHANGED, ffcQuality, ffcParticipant);
  }

  private _handleMediaDevicesError = (error: Error) => {
    this.emit(FFCRtcVideoRoomEvent.MEDIA_DEVICES_ERROR, error);
    console.log('emitting', FFCRtcVideoRoomEvent.MEDIA_DEVICES_ERROR, error);
  }

  private _handleTrackStreamStateChanged = (
    publication: RemoteTrackPublication,
    streamState: Track.StreamState,
    participant: RemoteParticipant,
  ) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcState = FFCTrack.fromTrackStreamState(streamState);
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_STREAM_STATE_CHANGED,
      ffcPublication,
      ffcState,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_STREAM_STATE_CHANGED, ffcPublication, ffcState, ffcParticipant);
  }

  private _handleTrackSubscriptionPermissionChanged = (
    publication: RemoteTrackPublication,
    status: TrackPublication.PermissionStatus,
    participant: RemoteParticipant,
  ) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcStatus = FFCTrackPublication.fromPermissionStatus(status);
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_PERMISSION_CHANGED,
      ffcPublication,
      ffcStatus,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_PERMISSION_CHANGED, ffcPublication, ffcStatus, ffcParticipant);
  }

  private _handleTrackSubscriptionStatusChanged = (
    publication: RemoteTrackPublication,
    status: TrackPublication.SubscriptionStatus,
    participant: RemoteParticipant,
  ) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCRemoteTrackPublication;
    const ffcStatus = FFCTrackPublication.fromSubscriptionStatus(status);
    const ffcParticipant = wrapParticipant(participant) as FFCRemoteParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_STATUS_CHANGED,
      ffcPublication,
      ffcStatus,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.TRACK_SUBSCRIPTION_STATUS_CHANGED, ffcPublication, ffcStatus, ffcParticipant);
  }

  private _handleAudioPlaybackChanged = (playing: boolean) => {
    this.emit(FFCRtcVideoRoomEvent.AUDIO_PLAYBACK_STATUS_CHANGED, playing);
    console.log('emitting', FFCRtcVideoRoomEvent.AUDIO_PLAYBACK_STATUS_CHANGED, playing);
  }

  private _handleVideoPlaybackChanged = (playing: boolean) => {
    this.emit(FFCRtcVideoRoomEvent.VIDEO_PLAYBACK_STATUS_CHANGED, playing);
    console.log('emitting', FFCRtcVideoRoomEvent.VIDEO_PLAYBACK_STATUS_CHANGED, playing);
  }

  private _handleSignalConnected = () => {
    this.emit(FFCRtcVideoRoomEvent.SIGNAL_CONNECTED);
    console.log('emitting', FFCRtcVideoRoomEvent.SIGNAL_CONNECTED);
  }

  private _handleRecordingStatusChanged = (recording: boolean) => {
    this.emit(FFCRtcVideoRoomEvent.RECORDING_STATUS_CHANGED, recording);
    console.log('emitting', FFCRtcVideoRoomEvent.RECORDING_STATUS_CHANGED, recording);
  }

  private _handleActiveDeviceChanged = (kind: MediaDeviceKind, deviceId: string) => {
    this.emit(FFCRtcVideoRoomEvent.ACTIVE_DEVICE_CHANGED, kind, deviceId);
    console.log('emitting', FFCRtcVideoRoomEvent.ACTIVE_DEVICE_CHANGED, kind, deviceId);
  }

  private _handleLocalTrackSubscribed = (publication: LocalTrackPublication, participant: LocalParticipant) => {
    const ffcPublication = wrapTrackPublication(publication) as FFCLocalTrackPublication;
    const ffcParticipant = wrapParticipant(participant) as FFCLocalParticipant;
    this.emit(
      FFCRtcVideoRoomEvent.LOCAL_TRACK_SUBSCRIBED,
      ffcPublication,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.LOCAL_TRACK_SUBSCRIBED, ffcPublication, ffcParticipant);
  }

  private _handleMetricsReceived = (metrics: MetricsBatch, participant?: Participant) => {
    const ffcMetricsBatch = new FFCMetricsBatch(metrics);
    const ffcParticipant = participant ? wrapParticipant(participant) : undefined;
    this.emit(
      FFCRtcVideoRoomEvent.METRICS_RECEIVED,
      ffcMetricsBatch,
      ffcParticipant,
    );
    console.log('emitting', FFCRtcVideoRoomEvent.METRICS_RECEIVED, ffcMetricsBatch, ffcParticipant);
  }
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
  LOCAL_AUDIO_SILENCE_DETECTED: /*localAudioSilenceDetected:*/ (publication: FFCLocalTrackPublication) => void;
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
