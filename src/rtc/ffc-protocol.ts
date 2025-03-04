import { EventMetric, MetricSample, MetricsBatch, ParticipantPermission, ParticipantTracks, ServerInfo, TimeSeriesMetric, TrackInfo, TrackSource, UpdateSubscription, UpdateTrackSettings, VideoQuality } from "@livekit/protocol";
import { Track } from "livekit-client";
import { FFCTrack, FFCVideoQuality, toFFCTrackSource } from "./track/ffc-track";


export interface FFCServerInfo extends Partial<ServerInfo> {}

export interface FFCUpdateTrackSettings {
  trackSids: Array<string>;
  disabled: boolean;
  quality: FFCVideoQuality;
  width: number;
  height: number;
  fps: number;
  priority: number;
}

/* @internal */
export function toFFCUpdateTrackSettings(settings: UpdateTrackSettings): FFCUpdateTrackSettings {
  return {
    trackSids: settings.trackSids,
    disabled: settings.disabled,
    quality: ((quality: VideoQuality) => {
      switch(quality) {
        case VideoQuality.LOW:
          return FFCVideoQuality.LOW;
        case VideoQuality.MEDIUM:
          return FFCVideoQuality.MEDIUM;
        case VideoQuality.HIGH:
          return FFCVideoQuality.HIGH;
        case VideoQuality.OFF:
          return FFCVideoQuality.LOW;
      }
    })(settings.quality),
    width: settings.width,
    height: settings.height,
    fps: settings.fps,
    priority: settings.priority,
  }
}

export interface FFCParticipantTracks {
  participantSid: string;
  trackSids: Array<string>;
}

/* @internal */
export function toFFCParticipantTracks(participantTracks: ParticipantTracks): FFCParticipantTracks {
  return {
    participantSid: participantTracks.participantSid,
    trackSids: participantTracks.trackSids,
  }
}

export interface FFCUpdateSubscription {
  trackSids: Array<string>;
  subscribe: boolean;
  participantTracks: Array<FFCParticipantTracks>;
}

/* @internal */
export function toFFCUpdateSubscription(subscription: UpdateSubscription): FFCUpdateSubscription {
  return {
    trackSids: subscription.trackSids,
    subscribe: subscription.subscribe,
    participantTracks: subscription.participantTracks.map(toFFCParticipantTracks),
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

/* @internal */
export function toFFCParticipantPermission(): undefined;
/* @internal */
export function toFFCParticipantPermission(permission: ParticipantPermission): FFCParticipantPermission;
/* @internal */
export function toFFCParticipantPermission(permission?: ParticipantPermission): FFCParticipantPermission | undefined {
  if (!permission) {
    return;
  }
  return {
    canSubscribe: permission.canSubscribe,
    canPublish: permission.canPublish,
    canPublishSources: permission.canPublishSources.map((source) => {
      switch(source) {
        case TrackSource.UNKNOWN:
          return toFFCTrackSource(Track.Source.Unknown);
        case TrackSource.CAMERA:
          return toFFCTrackSource(Track.Source.Camera);
        case TrackSource.MICROPHONE:
          return toFFCTrackSource(Track.Source.Microphone);
        case TrackSource.SCREEN_SHARE:
          return toFFCTrackSource(Track.Source.ScreenShare);
        case TrackSource.SCREEN_SHARE_AUDIO:
          return toFFCTrackSource(Track.Source.ScreenShareAudio);
      }
    }),
    hidden: permission.hidden,
    canUpdateMetadata: permission.canUpdateMetadata,
    canSubscribeMetrics: permission.canSubscribeMetrics,
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

export type FFCTrackInfo = TrackInfo;

export class FFCTrackPublishedResponse {
  cid: string;
  track?: FFCTrackInfo;

  constructor(data: Partial<FFCTrackPublishedResponse>) {
    this.cid = data.cid!;
    this.track = data.track;
  }
} 