import { Track, type AdaptiveStreamSettings, type ElementInfo, type ReplaceTrackOptions } from "livekit-client";
import type FFCRemoteVideoTrack from "./track-remote-video";
import type FFCRemoteAudioTrack from "./track-remote-audio";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCLocalVideoTrack from "./track-local-video";
import type { FFCTrackProcessor } from "./processor/types";
import { VideoQuality } from "livekit-client";
import { VideoQuality as VQ } from '@livekit/protocol';

export type FFCAudioTrack = FFCRemoteAudioTrack | FFCLocalAudioTrack;
export type FFCVideoTrack = FFCRemoteVideoTrack | FFCLocalVideoTrack;

export enum FFCVideoQuality {
  LOW = VideoQuality.LOW,
  MEDIUM = VideoQuality.MEDIUM,
  HIGH = VideoQuality.HIGH,
  //OFF = VideoQuality.OFF,
}

export namespace FFCVideoQuality {
  export function fromVideoQuality(quality: VideoQuality): FFCVideoQuality;
  export function fromVideoQuality(quality: VQ): FFCVideoQuality
  export function fromVideoQuality(quality: VideoQuality | VQ): FFCVideoQuality {
    switch (quality) {
      case VQ.LOW:
      case VideoQuality.LOW:
        return FFCVideoQuality.LOW;
      case VQ.MEDIUM:
      case VideoQuality.MEDIUM:
        return FFCVideoQuality.MEDIUM;
      case VQ.HIGH:
      case VideoQuality.HIGH:
        return FFCVideoQuality.HIGH;
      case VQ.OFF:
        return FFCVideoQuality.LOW;
    }
  }

  export function toVideoQuality(quality: FFCVideoQuality): VideoQuality{
    switch (quality) {
      case FFCVideoQuality.LOW:
        return VideoQuality.LOW;
      case FFCVideoQuality.MEDIUM:
        return VideoQuality.MEDIUM;
      case FFCVideoQuality.HIGH:
        return VideoQuality.HIGH;
      // case FFCVideoQuality.LOW:
      //   return VideoQuality.LOW;
    }
  }
}

export type FFCTrackEventCallbacks = {
  message: () => void;
  muted: (track?: any) => void;
  unmuted: (track?: any) => void;
  restarted: (track?: any) => void;
  ended: (track?: any) => void;
  updateSettings: () => void;
  updateSubscription: () => void;
  audioPlaybackStarted: () => void;
  audioPlaybackFailed: (error?: Error) => void;
  audioSilenceDetected: () => void;
  visibilityChanged: (visible: boolean, track?: any) => void;
  videoDimensionsChanged: (dimensions: Track.Dimensions, track?: any) => void;
  videoPlaybackStarted: () => void;
  videoPlaybackFailed: (error?: Error) => void;
  elementAttached: (element: HTMLMediaElement) => void;
  elementDetached: (element: HTMLMediaElement) => void;
  upstreamPaused: (track: any) => void;
  upstreamResumed: (track: any) => void;
  trackProcessorUpdate: (processor?: FFCTrackProcessor<Track.Kind>) => void;
  //audioTrackFeatureUpdate: (track: any, feature: AudioTrackFeature, enabled: boolean) => void;
  timeSyncUpdate: (update: { timestamp: number; rtpTimestamp: number }) => void;
};

export interface FFCElementInfo extends ElementInfo {}

export type FFCAdaptiveStreamSettings = AdaptiveStreamSettings;

export interface FFCReplaceTrackOptions extends ReplaceTrackOptions {}