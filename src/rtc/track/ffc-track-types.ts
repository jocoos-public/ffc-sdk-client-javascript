import type { AdaptiveStreamSettings, ReplaceTrackOptions } from 'livekit-client';
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
