import { AudioTrackFeature, Encryption_Type, EventMetric, MetricSample, MetricsBatch, ParticipantPermission, ParticipantTracks, SimulcastCodecInfo, SubscriptionError, TimedVersion, TimeSeriesMetric, TrackInfo, TrackPublishedResponse, TrackSource, TrackType, VideoLayer, type UpdateSubscription, type UpdateTrackSettings } from "@livekit/protocol";
import { FFCVideoQuality } from "./track/types";
import { FFCTrack } from "./track/track";
import { DisconnectReason, ParticipantKind } from "livekit-client";
import { FFCBackupCodecPolicy } from "./track/options";

export enum FFCDisconnectReason {
  UNKNOWN_REASON = 'UNKNOWN_REASON',
  CLIENT_INITIATED = 'CLIENT_INITIATED',
  DUPLICATE_IDENTITY = 'DUPLICATE_IDENTITY',
  SERVER_SHUTDOWN = 'SERVER_SHUTDOWN',
  PARTICIPANT_REMOVED = 'PARTICIPANT_REMOVED',
  ROOM_DELETED = 'ROOM_DELETED',
  STATE_MISMATCH = 'STATE_MISMATCH',
  JOIN_FAILURE = 'JOIN_FAILURE',
  MIGRATION = 'MIGRATION',
  SIGNAL_CLOSE = 'SIGNAL_CLOSE',
  ROOM_CLOSED = 'ROOM_CLOSED',
  USER_UNAVAILABLE = 'USER_UNAVAILABLE',
  USER_REJECTED = 'USER_REJECTED',
  SIP_TRUNK_FAILURE = 'SIP_TRUNK_FAILURE',
}

/** @internal  */
export namespace FFCDisconnectReason {
  export function fromDisconnectReason(reason: DisconnectReason | undefined): FFCDisconnectReason | undefined {
    if (reason === undefined) {
      return;
    }
    switch (reason) {
      case DisconnectReason.UNKNOWN_REASON:
        return FFCDisconnectReason.UNKNOWN_REASON;
      case DisconnectReason.CLIENT_INITIATED:
        return FFCDisconnectReason.CLIENT_INITIATED;
      case DisconnectReason.DUPLICATE_IDENTITY:
        return FFCDisconnectReason.DUPLICATE_IDENTITY;
      case DisconnectReason.SERVER_SHUTDOWN:
        return FFCDisconnectReason.SERVER_SHUTDOWN;
      case DisconnectReason.PARTICIPANT_REMOVED:
        return FFCDisconnectReason.PARTICIPANT_REMOVED;
      case DisconnectReason.ROOM_DELETED:
        return FFCDisconnectReason.ROOM_DELETED;
      case DisconnectReason.STATE_MISMATCH:
        return FFCDisconnectReason.STATE_MISMATCH;
      case DisconnectReason.JOIN_FAILURE:
        return FFCDisconnectReason.JOIN_FAILURE;
      case DisconnectReason.MIGRATION:
        return FFCDisconnectReason.MIGRATION;
      case DisconnectReason.SIGNAL_CLOSE:
        return FFCDisconnectReason.SIGNAL_CLOSE;
      case DisconnectReason.ROOM_CLOSED:
        return FFCDisconnectReason.ROOM_CLOSED;
      case DisconnectReason.USER_UNAVAILABLE:
        return FFCDisconnectReason.USER_UNAVAILABLE;
      case DisconnectReason.USER_REJECTED:
        return FFCDisconnectReason.USER_REJECTED;
      case DisconnectReason.SIP_TRUNK_FAILURE:
        return FFCDisconnectReason.SIP_TRUNK_FAILURE;
    }
  }

  /** @internal */
  export function toDisconnectReason(reason: FFCDisconnectReason): DisconnectReason {
    switch (reason) {
      case FFCDisconnectReason.UNKNOWN_REASON:
        return DisconnectReason.UNKNOWN_REASON;
      case FFCDisconnectReason.CLIENT_INITIATED:
        return DisconnectReason.CLIENT_INITIATED;
      case FFCDisconnectReason.DUPLICATE_IDENTITY:
        return DisconnectReason.DUPLICATE_IDENTITY;
      case FFCDisconnectReason.SERVER_SHUTDOWN:
        return DisconnectReason.SERVER_SHUTDOWN;
      case FFCDisconnectReason.PARTICIPANT_REMOVED:
        return DisconnectReason.PARTICIPANT_REMOVED;
      case FFCDisconnectReason.ROOM_DELETED:
        return DisconnectReason.ROOM_DELETED;
      case FFCDisconnectReason.STATE_MISMATCH:
        return DisconnectReason.STATE_MISMATCH;
      case FFCDisconnectReason.JOIN_FAILURE:
        return DisconnectReason.JOIN_FAILURE;
      case FFCDisconnectReason.MIGRATION:
        return DisconnectReason.MIGRATION;
      case FFCDisconnectReason.SIGNAL_CLOSE:
        return DisconnectReason.SIGNAL_CLOSE;
      case FFCDisconnectReason.ROOM_CLOSED:
        return DisconnectReason.ROOM_CLOSED;
      case FFCDisconnectReason.USER_UNAVAILABLE:
        return DisconnectReason.USER_UNAVAILABLE;
      case FFCDisconnectReason.USER_REJECTED:
        return DisconnectReason.USER_REJECTED;
      case FFCDisconnectReason.SIP_TRUNK_FAILURE:
        return DisconnectReason.SIP_TRUNK_FAILURE;
    }
  }
}

export enum FFCParticipantKind {
  STANDARD = 'STANDARD',
  INGRESS = 'INGRESS',
  EGRESS = 'EGRESS',
  SIP = 'SIP',
  AGENT = 'AGENT',
}

/** @internal */
export namespace FFCParticipantKind {
  /** @internal */
  export function fromParticipantKind(kind: ParticipantKind): FFCParticipantKind {
    switch (kind) {
      case ParticipantKind.STANDARD:
        return FFCParticipantKind.STANDARD;
      case ParticipantKind.INGRESS:
        return FFCParticipantKind.INGRESS;
      case ParticipantKind.EGRESS:
        return FFCParticipantKind.EGRESS;
      case ParticipantKind.SIP:
        return FFCParticipantKind.SIP;
      case ParticipantKind.AGENT:
        return FFCParticipantKind.AGENT;
    }
  }
  
  /* @internal */
  export function toParticipantKind(kind: FFCParticipantKind): ParticipantKind {
    switch (kind) {
      case FFCParticipantKind.STANDARD:
        return ParticipantKind.STANDARD;
      case FFCParticipantKind.INGRESS:
        return ParticipantKind.INGRESS;
      case FFCParticipantKind.EGRESS:
        return ParticipantKind.EGRESS
      case FFCParticipantKind.SIP:
        return ParticipantKind.SIP;
      case FFCParticipantKind.AGENT:
        return ParticipantKind.AGENT;
    }
  }
}

export interface FFCParticipantTracks {
  participantSid: string;
  trackSids: Array<string>;
}

/** @internal */
export namespace FFCParticipantTracks {
  /** @internal */
  export function fromParticipantTracks(participantTracks: ParticipantTracks): FFCParticipantTracks {
    return {
      participantSid: participantTracks.participantSid,
      trackSids: participantTracks.trackSids,
    }
  }
}

export enum FFCSubscriptionError {
  UNKNOWN = 'UNKNOWN',
  CODEC_UNSUPPORTED = 'CODEC_UNSUPPORTED',
  TRACK_NOTFOUND = 'TRACK_NOTFOUND',
}

export namespace FFCSubscriptionError {
  export function fromSubscriptionError(error: SubscriptionError): FFCSubscriptionError {
    switch (error) {
      case SubscriptionError.SE_UNKNOWN:
        return FFCSubscriptionError.UNKNOWN;
      case SubscriptionError.SE_CODEC_UNSUPPORTED:
        return FFCSubscriptionError.CODEC_UNSUPPORTED;
      case SubscriptionError.SE_TRACK_NOTFOUND:
        return FFCSubscriptionError.TRACK_NOTFOUND;
    }
  }
}

export interface FFCUpdateTrackSettings {
  trackSids: Array<string>;
  disabled: boolean;
  quality: FFCVideoQuality;
  width: number;
  height: number;
  fps: number;
  priority: number;
}

/** @internal */
export namespace FFCUpdateTrackSettings {
  /** @internal */
  export function fromUpdateTrackSettings(settings: UpdateTrackSettings): FFCUpdateTrackSettings {
    return {
      trackSids: settings.trackSids,
      disabled: settings.disabled,
      quality: FFCVideoQuality.fromVideoQuality(settings.quality),
      width: settings.width,
      height: settings.height,
      fps: settings.fps,
      priority: settings.priority,
    }
  }
}

export interface FFCUpdateSubscription {
  trackSids: Array<string>;
  subscribe: boolean;
  participantTracks: Array<FFCParticipantTracks>;
}

/** @internal */
export namespace FFCUpdateSubscription {
  /* @internal */
  export function fromUpdateSubscription(subscription: UpdateSubscription): FFCUpdateSubscription {
    return {
      trackSids: subscription.trackSids,
      subscribe: subscription.subscribe,
      participantTracks: subscription.participantTracks.map((track) => FFCParticipantTracks.fromParticipantTracks(track)),
    }
  }
}

export enum FFCAudioTrackFeature {
  STEREO = 'STEREO',
  NO_DTX = 'NO_DTX',
  AUTO_GAIN_CONTROL = 'AUTO_GAIN_CONTROL',
  ECHO_CANCELLATION = 'ECHO_CANCELLATION',
  NOISE_SUPPRESSION = 'NOISE_SUPPRESSION',
  ENHANCED_NOISE_CANCELATION = 'ENHANCED_NOISE_CANCELATION',
}

export namespace FFCAudioTrackFeature {
  /* @internal */
  export function fromAudioTrackFeature(feature: AudioTrackFeature): FFCAudioTrackFeature {
    switch (feature) {
      case AudioTrackFeature.TF_STEREO:
        return FFCAudioTrackFeature.STEREO;
      case AudioTrackFeature.TF_NO_DTX:
        return FFCAudioTrackFeature.NO_DTX;
      case AudioTrackFeature.TF_AUTO_GAIN_CONTROL:
        return FFCAudioTrackFeature.AUTO_GAIN_CONTROL;
      case AudioTrackFeature.TF_ECHO_CANCELLATION:
        return FFCAudioTrackFeature.ECHO_CANCELLATION;
      case AudioTrackFeature.TF_NOISE_SUPPRESSION:
        return FFCAudioTrackFeature.NOISE_SUPPRESSION;
      case AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION:
        return FFCAudioTrackFeature.ENHANCED_NOISE_CANCELATION;
    }
  }

  /* @internal */
  export function toAudioTrackFeature(feature: FFCAudioTrackFeature): AudioTrackFeature {
    switch (feature) {
      case FFCAudioTrackFeature.STEREO:
        return AudioTrackFeature.TF_STEREO;
      case FFCAudioTrackFeature.NO_DTX:
        return AudioTrackFeature.TF_NO_DTX;
      case FFCAudioTrackFeature.AUTO_GAIN_CONTROL:
        return AudioTrackFeature.TF_AUTO_GAIN_CONTROL;
      case FFCAudioTrackFeature.ECHO_CANCELLATION:
        return AudioTrackFeature.TF_ECHO_CANCELLATION;
      case FFCAudioTrackFeature.NOISE_SUPPRESSION:
        return AudioTrackFeature.TF_NOISE_SUPPRESSION;
      case FFCAudioTrackFeature.ENHANCED_NOISE_CANCELATION:
        return AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION;
    }
  }
}

export interface FFCParticipantPermission {
  canSubscribe: boolean;
  canPublish: boolean;
  canPublishSources: Array<FFCTrack.Source>;
  hidden: boolean;
  canUpdateMetadata: boolean;
  canSubscribeMetrics: boolean;
}

/** @internal */
export namespace FFCParticipantPermission {
  /** @internal */
  export function fromParticipantPermission(permission: ParticipantPermission): FFCParticipantPermission {
    return {
      canSubscribe: permission.canSubscribe,
      canPublish: permission.canPublish,
      canPublishSources: permission.canPublishSources.map((source) => FFCTrack.fromTrackSource(source)),
      hidden: permission.hidden,
      canUpdateMetadata: permission.canUpdateMetadata,
      canSubscribeMetrics: permission.canSubscribeMetrics,
    }
  }
}

export class FFCMetricsBatch {
  private _metricsBatch: MetricsBatch;

  private _normalizedTimestamp: FFCTimestamp | undefined;

  private _timeSeries: Array<FFCTimeSeriesMetric> | undefined;

  private _events: Array<FFCEventMetric> | undefined;

  /* @internal */
  constructor(metricsBatch: MetricsBatch) {
    this._metricsBatch = metricsBatch;
    if (this._metricsBatch.normalizedTimestamp) {
      const { seconds, nanos } = this._metricsBatch.normalizedTimestamp;
      this._normalizedTimestamp = new FFCTimestamp(seconds, nanos);
    }
  }
  
  get timestampMs(): bigint {
    return this._metricsBatch.timestampMs;
  }
  
  get normalizedTimestamp(): FFCTimestamp | undefined {
    return this._normalizedTimestamp;
  }

  get strData(): Array<string> {
    return this._metricsBatch.strData;
  }

  get timeSeries(): Array<FFCTimeSeriesMetric> {
    if (!this._timeSeries) {
      this._timeSeries = this._metricsBatch.timeSeries.map((timeSeries) => new FFCTimeSeriesMetric(timeSeries));
    }
    return this._timeSeries;
  }

  get events(): Array<FFCEventMetric> {
    if (!this._events) {
      this._events = this._metricsBatch.events.map((event) => new FFCEventMetric(event));
    }
    return this._events;
  }
}

export class FFCTimestamp {
  seconds: bigint;

  nanos: number;

  /* @internal */
  constructor(seconds: bigint, nanos: number) {
    this.seconds = seconds;
    this.nanos = nanos;
  }
}
export class FFCTimeSeriesMetric {
  private _timeSeries: TimeSeriesMetric;

  private _samples: Array<FFCMetricSample> | undefined;

  constructor(timeSeries: TimeSeriesMetric) {
    this._timeSeries = timeSeries;
  }

  get label(): number {
    return this._timeSeries.label;
  }

  get participantIdentity(): number {
    return this._timeSeries.participantIdentity;
  }

  get trackSid(): number {
    return this._timeSeries.trackSid;
  }

  get samples(): Array<FFCMetricSample> {
    if (!this._samples) {
      this._samples = this._timeSeries.samples.map((sample) => new FFCMetricSample(sample));
    }
    return this._samples;
  }
}

export class FFCMetricSample {
  private _sample: MetricSample;

  private _normalizedTimestamp?: FFCTimestamp;

  constructor(sample: MetricSample) {
    this._sample = sample;
    if (this._sample.normalizedTimestamp) {
      const { seconds, nanos } = this._sample.normalizedTimestamp;
      this._normalizedTimestamp = new FFCTimestamp(seconds, nanos);
    }
  }

  get timestampMs(): bigint {
    return this._sample.timestampMs;
  }

  get normalizedTimestamp(): FFCTimestamp | undefined {
    return this._normalizedTimestamp;
  }

  get value(): number {
    return this._sample.value;
  }
}

export class FFCEventMetric {
  private _event: EventMetric;

  private _normalizedStartTimestamp?: FFCTimestamp;

  private _normalizedEndTimestamp?: FFCTimestamp;

  constructor(event: EventMetric) {
    this._event = event;
    if (this._event.normalizedStartTimestamp) {
      const { seconds, nanos } = this._event.normalizedStartTimestamp;
      this._normalizedStartTimestamp = new FFCTimestamp(seconds, nanos);
    }
    if (this._event.normalizedEndTimestamp) {
      const { seconds, nanos } = this._event.normalizedEndTimestamp;
      this._normalizedEndTimestamp = new FFCTimestamp(seconds, nanos);
    }
  }

  get label(): number {
    return this._event.label;
  }

  get participantIdentity(): number {
    return this._event.participantIdentity;
  }

  get trackSid(): number {
    return this._event.trackSid;
  }

  get startTimestampMs(): bigint {
    return this._event.startTimestampMs;
  }

  get endTimestampMs(): bigint | undefined {
    return this._event.endTimestampMs;
  }

  get normalizedStartTimestamp(): FFCTimestamp | undefined {
    return this._normalizedStartTimestamp
  }

  get noramlizedEndTimestamp(): FFCTimestamp | undefined {
    return this._normalizedEndTimestamp;
  }
}

export interface FFCVideoLayer {
  quality: FFCVideoQuality;
  width: number;
  height: number;
  bitrate: number;
  ssrc: number;
}

export namespace FFCVideoLayer {
  export function fromVideoLayer(layer: VideoLayer): FFCVideoLayer {
    return {
      quality: FFCVideoQuality.fromVideoQuality(layer.quality),
      width: layer.width,
      height: layer.height,
      bitrate: layer.bitrate,
      ssrc: layer.ssrc,
    }
  }
}

export enum FFCTrackType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  DATA = 'DATA',
}

export namespace FFCTrackType {
  export function fromTrackType(type: TrackType): FFCTrackType {
    switch (type) {
      case TrackType.AUDIO:
        return FFCTrackType.AUDIO;
      case TrackType.VIDEO:
        return FFCTrackType.VIDEO;
      case TrackType.DATA:
        return FFCTrackType.DATA;
    }
  }
}

export enum FFCTrackSource {
  UNKNOWN = 'UNKNOWN',
  CAMERA = 'CAMERA',
  MICROPHONE = 'MICROPHONE',
  SCREEN_SHARE = 'SCREEN_SHARE',
  SCREEN_SHARE_AUDIO = 'SCREEN_SHARE_AUDIO',
}

export namespace FFCTrackSource {
  export function fromTrackSource(source: TrackSource): FFCTrackSource {
    switch (source) {
      case TrackSource.CAMERA:
        return FFCTrackSource.CAMERA;
      case TrackSource.MICROPHONE:
        return FFCTrackSource.MICROPHONE;
      case TrackSource.SCREEN_SHARE:
        return FFCTrackSource.SCREEN_SHARE;
      case TrackSource.SCREEN_SHARE_AUDIO:
        return FFCTrackSource.SCREEN_SHARE_AUDIO;
      default:
        return FFCTrackSource.UNKNOWN;
    }
  }
}

export interface FFCTimedVersion {
  unixMicro: bigint;
  ticks: number;
}

export namespace FFCTimedVersion {
  export function fromTimedVersion(version: TimedVersion): FFCTimedVersion {
    return {
      unixMicro: version.unixMicro,
      ticks: version.ticks,
    }
  }
}

export interface FFCSimulcastCodecInfo {
  mimeType: string;
  mid: string;
  cid: string;
  layers: Array<FFCVideoLayer>;
}

export namespace FFCSimulcastCodecInfo {
  export function fromSimulcastCodecInfo(codecInfo: SimulcastCodecInfo): FFCSimulcastCodecInfo {
    return {
      mimeType: codecInfo.mimeType,
      mid: codecInfo.mid,
      cid: codecInfo.cid,
      layers: codecInfo.layers.map((layer) => FFCVideoLayer.fromVideoLayer(layer)),
    }
  }
}

export enum FFCEncryptionType {
  NONE = 'NONE',
  GCM = 'GCM',
  CUSTOM = 'CUSTOM',
}

export namespace FFCEncryptionType {
  export function fromEncryptionType(encryptionType: Encryption_Type): FFCEncryptionType {
    switch (encryptionType) {
      case Encryption_Type.NONE:
        return FFCEncryptionType.NONE;
      case Encryption_Type.GCM:
        return FFCEncryptionType.GCM;
      case Encryption_Type.CUSTOM:
        return FFCEncryptionType.CUSTOM;
    }
  }
}

export interface FFCTrackInfo {
  sid: string;
  type: FFCTrackType;
  name: string;
  muted: boolean;
  width: number;
  height: number;
  simulcast: boolean;
  disableDtx: boolean;
  source: FFCTrackSource;
  layers: FFCVideoLayer[];
  mimeType: string;
  mid: string;
  codecs: Array<FFCSimulcastCodecInfo>;
  stereo: boolean;
  disableRed: boolean;
  encryption: FFCEncryptionType;
  stream: string;
  version?: FFCTimedVersion;
  audioFeatures: Array<FFCAudioTrackFeature>;
  backupCodecPolicy: FFCBackupCodecPolicy;
}

export namespace FFCTrackInfo {
  export function fromTrackInfo(trackInfo: TrackInfo): FFCTrackInfo {
    return {
      sid: trackInfo.sid,
      type: FFCTrackType.fromTrackType(trackInfo.type),
      name: trackInfo.name,
      muted: trackInfo.muted,
      width: trackInfo.width,
      height: trackInfo.height,
      simulcast: trackInfo.simulcast,
      disableDtx: trackInfo.disableDtx,
      source: FFCTrackSource.fromTrackSource(trackInfo.source),
      layers: trackInfo.layers.map((layer) => FFCVideoLayer.fromVideoLayer(layer)),
      mimeType: trackInfo.mimeType,
      mid: trackInfo.mid,
      codecs: trackInfo.codecs.map((codec) => FFCSimulcastCodecInfo.fromSimulcastCodecInfo(codec)),
      stereo: trackInfo.stereo,
      disableRed: trackInfo.disableRed,
      encryption: FFCEncryptionType.fromEncryptionType(trackInfo.encryption),
      stream: trackInfo.stream,
      version: trackInfo.version,
      audioFeatures: trackInfo.audioFeatures.map((feature) => FFCAudioTrackFeature.fromAudioTrackFeature(feature)),
      backupCodecPolicy: FFCBackupCodecPolicy.fromBackupCodecPolicy(trackInfo.backupCodecPolicy),
    };
  }
}

export interface FFCTrackPublishedResponse {
  cid: string;
  track?: FFCTrackInfo;
}

export namespace FFCTrackPublishedResponse {
  export function fromTrackPublishedResponse(response: TrackPublishedResponse): FFCTrackPublishedResponse {
    return {
      cid: response.cid,
      track: response.track ? FFCTrackInfo.fromTrackInfo(response.track) : undefined,
    }
  }
}