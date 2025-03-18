import { Track } from "livekit-client";
import type { IFFCTrack } from './interfaces';
import { EventEmitter } from "events";
import type TypedEventEmitter from 'typed-emitter';
import { TrackSource } from "@livekit/protocol";
import { wrapTrack } from "../wrapper-track";
import { FFCTrackEvent } from "../events";

/**
 * The `FFCTrack` class is an abstract base class for handling media tracks in the FlipFlopCloud SDK.
 * It extends `EventEmitter` to emit various events related to track state changes.
 * 
 * @template TrackKind - The type of the track, which defaults to `FFCTrack.Kind`.
 */
export abstract class FFCTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind>
  extends (EventEmitter as new () => TypedEventEmitter<FFCTrackEventCallbacks>)
  implements IFFCTrack<TrackKind> {

  protected _track: Track;

  /** @internal */
  constructor(track: Track) {
    super();
    this._track = track;
    this._track.on('message', (): void => {
      this.emit(FFCTrackEvent.MESSAGE);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.MESSAGE);
    });
    this._track.on('muted', (track?: any): void => {
      const ffcTrack = track ? wrapTrack(track) : undefined;
      this.emit('MUTED', ffcTrack);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.MUTED, ffcTrack);
    });
    this._track.on('unmuted', (track?: any): void => {
      const ffcTrack = track ? wrapTrack(track) : undefined;
      this.emit(FFCTrackEvent.UNMUTED, ffcTrack);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.UNMUTED, ffcTrack);
    });
    this._track.on('restarted', (track?: any): void => {
      const ffcTrack = track ? wrapTrack(track) : undefined;
      this.emit(FFCTrackEvent.RESTARTED, ffcTrack);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.RESTARTED, ffcTrack);
    });
    this._track.on('ended', (track?: any): void => {
      const ffcTrack = track ? wrapTrack(track) : undefined;
      this.emit(FFCTrackEvent.ENDED, ffcTrack);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.ENDED, ffcTrack);
    });
    this._track.on('timeSyncUpdate', (update: { timestamp: number; rtpTimestamp: number }): void => {
      this.emit(FFCTrackEvent.TIME_SYNC_UPDATE, update);
      console.log('FFCTrack::', 'emitting', FFCTrackEvent.TIME_SYNC_UPDATE, update);
    });
  }

  /** @internal */
  get instance(): Track {
    return this._track;
  }

  /**
   * Gets the kind of the track (e.g., audio, video).
   * 
   * @returns The track kind as `TrackKind`.
   */
  get kind(): TrackKind {
    return FFCTrack.fromTrackKind(this._track.kind) as TrackKind;
  }

  /**
   * Gets the HTML media elements attached to the track.
   * 
   * @returns An array of `HTMLMediaElement` instances.
   */
  get attachedElements(): Array<HTMLMediaElement> {
    return this._track.attachedElements;
  }

  /**
   * Checks if the track is muted.
   * 
   * @returns `true` if the track is muted, otherwise `false`.
   */
  get isMuted(): boolean {
    return this._track.isMuted;
  }

  /**
   * Gets the source of the track (e.g., camera, microphone).
   * 
   * @returns The track source as `FFCTrack.Source`.
   */
  get source(): FFCTrack.Source {
    return FFCTrack.fromTrackSource(this._track.source);
  }

  /**
   * Gets the streamd id (SID) of the track.
   * 
   * @returns The track SID, or `undefined` if not set.
   */
  get sid(): string | undefined {
    return this._track.sid;
  }

  /** @internal */
  get mediaStream(): MediaStream | undefined {
    return this._track.mediaStream;
  }

  /**
   * Gets the stream state of the track (e.g., active, paused).
   * 
   * @returns The stream state as `FFCTrack.StreamState`.
   */
  get streamState(): FFCTrack.StreamState {
    return FFCTrack.fromTrackStreamState(this._track.streamState);
  }

  /** @internal */
  get rtpTimestamp(): number | undefined {
    return this._track.rtpTimestamp;
  }

  /**
   * Gets the current bitrate of the track.
   * 
   * @returns The current bitrate in bits per second.
   */
  get currentBitrate(): number {
    return this._track.currentBitrate;
  }

  /**
   * Gets the `MediaStreamTrack` associated with the track.
   * 
   * @returns The `MediaStreamTrack` instance.
   */
  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  /**
   * Checks if the track is local.
   * 
   * @abstract
   * @returns `true` if the track is local, otherwise `false`.
   */
  abstract get isLocal(): boolean;

  /** @internal */
  get mediaStreamID(): string {
    return this._track.mediaStreamID;
  }

  /**
   * Creates a new HTMLAudioElement or HTMLVideoElement, attaches to it, and returns it.
   * 
   * @returns The attached `HTMLMediaElement`.
   */
  attach(): HTMLMediaElement;
  /**
   * Attaches track to an existing HTMLAudioElement or HTMLVideoElement
   * 
   * @param element - (Optional) The `HTMLMediaElement` to attach the track to.
   * @returns The attached `HTMLMediaElement`.
   */
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement {
    if (element === undefined) {
      return this._track.attach();
    }
    return this._track.attach(element);
  }

  /**
   * Detaches from all attached elements
   * 
   * @param element - (Optional) The `HTMLMediaElement` to detach the track from.
   * @returns The detached `HTMLMediaElement` or an array of detached elements.
   */
  detach(): HTMLMediaElement[];
  /**
   * Detach from a single element.
   * 
   * @param element - (Optional) The `HTMLMediaElement` to detach the track from.
   * @returns The detached `HTMLMediaElement` or an array of detached elements.
   */
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | Array<HTMLMediaElement> {
    if (element === undefined) {
      return this._track.detach();
    }
    return this._track.detach(element);
  }

  /**
   * Stops the track.
   */
  stop(): void {
    this._track.stop();
  }
}

export namespace FFCTrack {
  /**
   * Enum representing the kinds of tracks (e.g., audio, video).
   */
  export enum Kind {
    Audio = "audio",
    Video = "video",
    Unknown = "unknown",
  }

  /** @internal */
  export type MapToTrackKind<T extends FFCTrack.Kind> =
  T extends FFCTrack.Kind.Audio
  ? Track.Kind.Audio
  : T extends FFCTrack.Kind.Video
  ? Track.Kind.Video
  : Track.Kind.Unknown;

  /** @internal */
  export type MapToFFCTrackKind<T extends Track.Kind> =
  T extends Track.Kind.Audio
  ? FFCTrack.Kind.Audio
  : T extends Track.Kind.Video
  ? FFCTrack.Kind.Video
  : FFCTrack.Kind.Unknown;

  /** @internal */
  export function fromTrackKind(kind: Track.Kind): Kind {
    switch (kind) {
      case Track.Kind.Audio:
        return FFCTrack.Kind.Audio;
      case Track.Kind.Video:
        return FFCTrack.Kind.Video;
      case Track.Kind.Unknown:
        return FFCTrack.Kind.Unknown;
    }
  }

  /** @internal */
  export function fromTrackKindAudio(kind: Track.Kind.Audio): Kind.Audio {
    if (kind !== Track.Kind.Audio) {
      throw new Error(`expected audio track, got ${kind}`);
    }
    return FFCTrack.Kind.Audio;
  }

  /** @internal */
  export function fromTrackKindVideo(kind: Track.Kind.Video): Kind.Video {
    if (kind !== Track.Kind.Video) {
      throw new Error(`expected video track, got ${kind}`);
    }
    return FFCTrack.Kind.Video;
  }

  /** @internal */
  export function toTrackKind(kind: Kind): Track.Kind {
    switch (kind) {
      case FFCTrack.Kind.Audio:
        return Track.Kind.Audio;
      case FFCTrack.Kind.Video:
        return Track.Kind.Video;
      case FFCTrack.Kind.Unknown:
        return Track.Kind.Unknown;
    }
  }

  /** @internal */
  export function toTrackKindAudio(kind: Kind): Track.Kind.Audio {
    if (kind !== FFCTrack.Kind.Audio) {
      throw new Error(`expected audio track, got ${kind}`);
    }
    return Track.Kind.Audio;
  }

  /** @internal */
  export function toTrackKindVideo(kind: Kind): Track.Kind.Video {
    if (kind !== FFCTrack.Kind.Video) {
      throw new Error(`expected video track, got ${kind}`);
    }
    return Track.Kind.Video;
  }

  /**
   * The stream id of the media track
   */
  export type SID = Track.SID;

  /**
   * Enum representing the sources of tracks (e.g., camera, microphone).
   */
  export enum Source {
    Camera = 'camera',
    Microphone = 'microphone',
    ScreenShare = 'screen_share',
    ScreenShareAudio = 'screen_share_audio',
    Unknown = 'unknown',
  }

  /** @internal */
  export function fromTrackSource(source: Track.Source | TrackSource): Source {
    switch (source) {
      case TrackSource.CAMERA:
      case Track.Source.Camera:
        return FFCTrack.Source.Camera;
      case TrackSource.MICROPHONE:
      case Track.Source.Microphone:
        return FFCTrack.Source.Microphone;
      case TrackSource.SCREEN_SHARE:
      case Track.Source.ScreenShare:
        return FFCTrack.Source.ScreenShare;
      case TrackSource.SCREEN_SHARE_AUDIO:
      case Track.Source.ScreenShareAudio:
        return FFCTrack.Source.ScreenShareAudio;
      default:
        return FFCTrack.Source.Unknown;
    }
  }
  /** @internal */
  export function toTrackSource(source: Source.Microphone | Source.ScreenShareAudio): Track.Source.Microphone | Track.Source.ScreenShareAudio;
  /** @internal */
  export function toTrackSource(source: Source): Track.Source;
  /** @internal */
  export function toTrackSource(source: Source): Track.Source {
    switch (source) {
      case FFCTrack.Source.Camera:
        return Track.Source.Camera;
      case FFCTrack.Source.Microphone:
        return Track.Source.Microphone;
      case FFCTrack.Source.ScreenShare:
        return Track.Source.ScreenShare;
      case FFCTrack.Source.ScreenShareAudio:
        return Track.Source.ScreenShareAudio;
      default:
        return Track.Source.Unknown;
    }
  }

  /**
   * Enum representing the stream states of tracks (e.g., active, paused).
   */
  export enum StreamState {
    Active = 'active',
    Paused = 'paused',
    Unknown = 'unknown',
  }

  /** @internal */
  export function fromTrackStreamState(state: Track.StreamState): StreamState {
    switch (state) {
      case Track.StreamState.Active:
        return FFCTrack.StreamState.Active;
      case Track.StreamState.Paused:
        return FFCTrack.StreamState.Paused;
      default:
        return FFCTrack.StreamState.Unknown;
    }
  }

  /** @internal */
  export function toTrackStreamState(state: StreamState): Track.StreamState {
    switch (state) {
      case FFCTrack.StreamState.Active:
        return Track.StreamState.Active;
      case FFCTrack.StreamState.Paused:
        return Track.StreamState.Paused;
      default:
        return Track.StreamState.Unknown;
    }
  }

  /**
   * Interface representing the dimensions of a track.
   */
  export interface Dimensions extends Track.Dimensions {
  /**
   * The width of the media track resolution.
   */
    width: number;

  /**
   * The height of the media track in pixels.
   */
    height: number;
  }
}

export type FFCTrackEventCallbacks = {
  MESSAGE: () => void;
  MUTED: (track?: any) => void;
  UNMUTED: (track?: any) => void;
  RESTARTED: (track?: any) => void;
  ENDED: (track?: any) => void;
  TIME_SYNC_UPDATE: (update: { timestamp: number; rtpTimestamp: number }) => void;
};