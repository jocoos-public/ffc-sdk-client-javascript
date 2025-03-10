import { LocalAudioTrack, LocalTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack, Track, VideoQuality } from "livekit-client";
import type TypedEventEmitter from "typed-emitter";
import { EventEmitter } from "events";
import type { FFCAudioTrackFeature } from "../ffc-protocol-enums";
import { FFCError } from "../../ffc-errors";
import { createFFCLocalAudioTrackWith, createFFCLocalVideoTrackWith, createFFCRemoteAudioTrackWith, createFFCRemoteVideoTrackWith } from "./ffc-track-create";
import type FFCLocalAudioTrack from "./ffc-track-local-audio";
import type FFCLocalTrack from "./ffc-track-local";
import type FFCLocalVideoTrack from "./ffc-track-local-video";
import type FFCRemoteTrack from "./ffc-track-remote";
import type FFCRemoteAudioTrack from "./ffc-track-remote-audio";
import type FFCRemoteVideoTrack from "./ffc-track-remote-video";
import { FFCTrackKind, FFCTrackSource, FFCTrackStreamState, toFFCTrackKind, toFFCTrackSource, toFFCTrackStreamState, toTrackSource, type FFCTrackSID } from "./ffc-track-types";

export enum FFCVideoQuality {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  // OFF = 'OFF',
}

/* @internal */
export function toVideoQuality(quality: FFCVideoQuality): VideoQuality {
  switch (quality) {
    case FFCVideoQuality.LOW:
      return VideoQuality.LOW;
    case FFCVideoQuality.MEDIUM:
      return VideoQuality.MEDIUM;
    case FFCVideoQuality.HIGH:
      return VideoQuality.HIGH;
    /*
    case FFCVideoQuality.OFF:
      return VideoQuality.OFF;
    */
  }
}

/* @internal */
export function toFFCVideoQuality(): undefined;
/* @internal */
export function toFFCVideoQuality(quality: VideoQuality): FFCVideoQuality;
/* @internal */
export function toFFCVideoQuality(quality?: VideoQuality): FFCVideoQuality | undefined {
  switch (quality) {
    case VideoQuality.LOW:
      return FFCVideoQuality.LOW;
    case VideoQuality.MEDIUM:
      return FFCVideoQuality.MEDIUM;
    case VideoQuality.HIGH:
      return FFCVideoQuality.HIGH;
    /*
    case VideoQuality.OFF:
      return FFCVideoQuality.OFF;
    */
  }
}

export abstract class FFCTrack<
  TrackKind extends FFCTrackKind = FFCTrackKind
> extends (EventEmitter as new() => TypedEventEmitter<FFCTrackEventCallbacks>) {

  protected static _tracks: WeakMap<object, FFCTrack> = new WeakMap();

  /* @internal */
  static wrap(track: Track): FFCTrack {
    const existing = this._tracks.get(track);
    if (existing) {
      return existing;
    }
    if (track instanceof LocalTrack) {
      if (track.kind == Track.Kind.Audio) {
        const localAudioTrack = createFFCLocalAudioTrackWith(track as LocalAudioTrack);
        this._tracks.set(track, localAudioTrack);
        return localAudioTrack;
      } else if (track.kind == Track.Kind.Video) {
        const localVideoTrack = createFFCLocalVideoTrackWith(track as LocalVideoTrack);
        this._tracks.set(track, localVideoTrack);
        return localVideoTrack;
      }
      // TODO: What to do with other track kind
    }
    if (track.kind == Track.Kind.Audio) {
      const remoteAudioTrack = createFFCRemoteAudioTrackWith(track as RemoteAudioTrack);
      this._tracks.set(track, remoteAudioTrack);
      return remoteAudioTrack;
    } else if (track.kind == Track.Kind.Video) {
      const remoteVideoTrack = createFFCRemoteVideoTrackWith(track as RemoteVideoTrack);
      this._tracks.set(track, remoteVideoTrack);
      return remoteVideoTrack;
    }
    // TODO: What to do with other track kind
    throw new FFCError('RTC_UNKNOWN_TRACK_KIND', 'cannot handle unknown track type')
  }

  protected _track: Track;
  
  /* @internal */
  protected constructor(track: Track) {
    super()
    this._track = track;
  }

  /* @internal */
  get instance(): Track {
    return this._track;
  }

  /* @internal */
  get mediaStream(): MediaStream | undefined {
    return this._track.mediaStream;
  }

  /* @internal */
  set mediaStream(stream: MediaStream) {
    this._track.mediaStream = stream;
  }

  /* @internal */
  get rtpTimestamp(): number | undefined {
    return this._track.rtpTimestamp;
  }

  get kind(): TrackKind {
    return toFFCTrackKind(this._track.kind) as TrackKind;
  }
  
  get attachedElements(): HTMLMediaElement[] {
    return this._track.attachedElements;
  }

  get isMuted(): boolean {
    return this._track.isMuted;
  }

  get source(): FFCTrackSource {
    return toFFCTrackSource(this._track.source);
  }

  set source(source: FFCTrackSource) {
    this._track.source = toTrackSource(source);
  }

  get sid(): FFCTrackSID | undefined {
    return this._track.sid;
  }

  get streamState(): FFCTrackStreamState {
    return toFFCTrackStreamState(this._track.streamState);
  }

  get currentBitrate(): number {
    return this._track.currentBitrate;
  }

  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  get mediaStreamID(): string {
    return this._track.mediaStreamID;
  }

  abstract get isLocal(): boolean;

  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement {
    if (element) {
      return this._track.attach(element);
    } else {
      return this._track.attach();
    }
  }

  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
    if (element) {
      return this._track.detach(element);
    }
    return this._track.detach();
  }

  stop(): void {
    this._track.stop();
  }
}



export type FFCTrackEventCallbacks = {
  MESSAGE: /*message:*/ () => void;
  MUTED: /*muted:*/ (track?: any) => void;
  UNMUTED: /*unmuted:*/ (track?: any) => void;
  RESTARTED: /*restarted:*/ (track?: any) => void;
  ENDED: /*ended:*/ (track?: any) => void;
  UPDATE_SETTINGS: /*updateSettings:*/ () => void;
  UPDATE_SUBSCRIPTION: /*updateSubscription:*/ () => void;
  AUDIO_PLAYBACK_STARTED: /*audioPlaybackStarted:*/ () => void;
  AUDIO_PLAYBACK_FAILED: /*audioPlaybackFailed:*/ (error?: Error) => void;
  AUDIO_SILENCE_DETECTED: /*audioSilenceDetected:*/ () => void;
  VIDIBILITY_CHANGED: /*visibilityChanged:*/ (visible: boolean, track?: any) => void;
  VIDEO_DIMENSIONS_CHANGED: /*videoDimensionsChanged:*/ (dimensions: Track.Dimensions, track?: any) => void;
  VIDEO_PLAYBACK_STARTED: /*videoPlaybackStarted:*/ () => void;
  VIDEO_PLAYBACK_FAILED: /*videoPlaybackFailed:*/ (error?: Error) => void;
  ELEMENT_ATTACHED: /*elementAttached:*/ (element: HTMLMediaElement) => void;
  ELEMENT_DETACHED: /*elementDetached:*/ (element: HTMLMediaElement) => void;
  UPSTREAM_PAUSED: /*upstreamPaused:*/ (track: any) => void;
  UPSTREAM_RESUMED: /*upstreamResumed:*/ (track: any) => void;
  //TRACK_PROCESSOR_UPDATE: /*trackProcessorUpdate:*/ (processor?: TrackProcessor<Track.Kind, any>) => void;
  AUDIO_TRACK_FEATURE_UPDATE: /*audioTrackFeatureUpdate:*/ (track: any, feature: FFCAudioTrackFeature, enabled: boolean) => void;
  TIME_SYNC_UPDATE: /*timeSyncUpdate:*/ (update: { timestamp: number; rtpTimestamp: number }) => void;
};

export function isAudioTrack(
  track: FFCTrack | undefined,
): track is FFCLocalAudioTrack | FFCRemoteAudioTrack {
  return !!track && track.kind == FFCTrackKind.AUDIO;
}

export function isVideoTrack(
  track: FFCTrack | undefined,
): track is FFCLocalVideoTrack | FFCRemoteVideoTrack {
  return !!track && track.kind == FFCTrackKind.VIDEO;
}

export function isLocalTrack(track: FFCTrack | MediaStreamTrack | undefined): track is FFCLocalTrack {
  return !!track && !(track instanceof MediaStreamTrack) && track.isLocal;
}

export function isLocalVideoTrack(
  track: FFCTrack | MediaStreamTrack | undefined,
): track is FFCLocalVideoTrack {
  return isLocalTrack(track) && isVideoTrack(track);
}

export function isLocalAudioTrack(
  track: FFCTrack | MediaStreamTrack | undefined,
): track is FFCLocalAudioTrack {
  return isLocalTrack(track) && isAudioTrack(track);
}

export function isRemoteTrack(track: FFCTrack | undefined): track is FFCRemoteTrack {
  return !!track && !track.isLocal;
}