import { type AdaptiveStreamSettings, type ElementInfo, type ReplaceTrackOptions } from "livekit-client";
import type FFCRemoteVideoTrack from "./track-remote-video";
import type FFCRemoteAudioTrack from "./track-remote-audio";
import type FFCLocalAudioTrack from "./track-local-audio";
import type FFCLocalVideoTrack from "./track-local-video";
import { VideoQuality } from "livekit-client";
import { VideoQuality as VQ } from '@livekit/protocol';

export type FFCAudioTrack = FFCRemoteAudioTrack | FFCLocalAudioTrack;
export type FFCVideoTrack = FFCRemoteVideoTrack | FFCLocalVideoTrack;

export enum FFCVideoQuality {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  //OFF = VideoQuality.OFF,
}

/** @internal */
export namespace FFCVideoQuality {
  /** @internal */
  export function fromVideoQuality(quality: VideoQuality): FFCVideoQuality;

  /** @internal */
  export function fromVideoQuality(quality: VQ): FFCVideoQuality

  /** @internal */
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

  /** @internal */
  export function toVideoQuality(quality: FFCVideoQuality): VideoQuality {
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

export interface FFCElementInfo extends ElementInfo { }

export type FFCAdaptiveStreamSettings = AdaptiveStreamSettings;

export interface FFCReplaceTrackOptions extends ReplaceTrackOptions { }