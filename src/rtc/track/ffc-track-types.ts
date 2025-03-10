import { Track, type AdaptiveStreamSettings, type ReplaceTrackOptions } from 'livekit-client';
import type FFCLocalAudioTrack from './ffc-track-local-audio';
import type FFCLocalVideoTrack from './ffc-track-local-video';
import type FFCRemoteAudioTrack from './ffc-track-remote-audio';
import type FFCRemoteVideoTrack from './ffc-track-remote-video';

export type FFCAudioTrack = FFCRemoteAudioTrack | FFCLocalAudioTrack;
export type FFCVideoTrack = FFCRemoteVideoTrack | FFCLocalVideoTrack;

export type FFCAdaptiveStreamSettings = AdaptiveStreamSettings; 
// {
  /**
   * Set a custom pixel density. Defaults to 2 for high density screens (3+) or
   * 1 otherwise.
   * When streaming videos on a ultra high definition screen this setting
   * let's you account for the devicePixelRatio of those screens.
   * Set it to `screen` to use the actual pixel density of the screen
   * Note: this might significantly increase the bandwidth consumed by people
   * streaming on high definition screens.
   */
  // pixelDensity?: number | 'screen';
  /**
   * If true, video gets paused when switching to another tab.
   * Defaults to true.
   */
  // pauseVideoInBackground?: boolean;
// };

export interface FFCReplaceTrackOptions extends ReplaceTrackOptions {}

export enum FFCTrackKind {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  UNKNOWN = 'UNKNOWN',
}
  
export type FFCTrackSID = string;

export enum FFCTrackSource {
  CAMERA = 'CAMERA',
  MICROPHONE = 'MICROPHONE',
  SCREEN_SHARE = 'SCREEN_SHARE',
  SCREEN_SHARE_AUDIO = 'SCREEN_SHARE_AUDIO',
  UNKNOWN = 'UNKNOWN',
}

export enum FFCTrackStreamState {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  UNKNOWN = 'UNKNOWN',
}

export interface FFCTrackDimensions {
  width: number;
  height: number;
}

/* @internal */
export function toFFCTrackKind(kind: Track.Kind): FFCTrackKind {
  switch (kind) {
    case Track.Kind.Audio:
      return FFCTrackKind.AUDIO;
    case Track.Kind.Video:
      return FFCTrackKind.VIDEO;
    case Track.Kind.Unknown:
      return FFCTrackKind.UNKNOWN;
  }
}

/* @internal */
export function toTrackKind(kind: FFCTrackKind): Track.Kind {
  switch (kind) {
    case FFCTrackKind.AUDIO:
      return Track.Kind.Audio;
    case FFCTrackKind.VIDEO:
      return Track.Kind.Video;
    case FFCTrackKind.UNKNOWN:
      return Track.Kind.Unknown;
  }
}

/* @internal */
export function toFFCTrackSource(): undefined;
/* @internal */
export function toFFCTrackSource(source: Track.Source): FFCTrackSource;
/* @internal */
export function toFFCTrackSource(source?: Track.Source): FFCTrackSource | undefined {
  switch (source) {
    case Track.Source.Camera:
      return FFCTrackSource.CAMERA;
    case Track.Source.Microphone:
      return FFCTrackSource.MICROPHONE;
    case Track.Source.ScreenShare:
      return FFCTrackSource.SCREEN_SHARE;
    case Track.Source.ScreenShareAudio:
      return FFCTrackSource.SCREEN_SHARE_AUDIO;
    case Track.Source.Unknown:
      return FFCTrackSource.UNKNOWN;
  }
}

/* @internal */
export function toTrackSource(): undefined;
/* @internal */
export function toTrackSource(source: FFCTrackSource.MICROPHONE | FFCTrackSource.SCREEN_SHARE_AUDIO): Track.Source.Microphone | Track.Source.ScreenShareAudio;
/* @internal */
export function toTrackSource(source: FFCTrackSource): Track.Source;
/* @internal */
export function toTrackSource(source?: FFCTrackSource): Track.Source | undefined {
  switch (source) {
    case FFCTrackSource.CAMERA:
      return Track.Source.Camera;
    case FFCTrackSource.MICROPHONE:
      return Track.Source.Microphone;
    case FFCTrackSource.SCREEN_SHARE:
      return Track.Source.ScreenShare;
    case FFCTrackSource.SCREEN_SHARE_AUDIO:
      return Track.Source.ScreenShareAudio;
    case FFCTrackSource.UNKNOWN:
      return Track.Source.Unknown;
  }
}

/* @internal */
export function toFFCTrackStreamState(state: Track.StreamState): FFCTrackStreamState;
/* @internal */
export function toFFCTrackStreamState(state?: Track.StreamState): FFCTrackStreamState | undefined{
  switch (state) {
    case Track.StreamState.Active:
      return FFCTrackStreamState.ACTIVE;
    case Track.StreamState.Paused:
      return FFCTrackStreamState.PAUSED;
    case Track.StreamState.Unknown:
      return FFCTrackStreamState.UNKNOWN;
  }
}

/* @internal */
export function toTrackStreamState(state: FFCTrackStreamState): Track.StreamState {
  switch (state) {
    case FFCTrackStreamState.ACTIVE:
      return Track.StreamState.Active;
    case FFCTrackStreamState.PAUSED:
      return Track.StreamState.Paused;
    case FFCTrackStreamState.UNKNOWN:
      return Track.StreamState.Unknown;
  }
}
