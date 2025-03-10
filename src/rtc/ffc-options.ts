import type { AudioOutputOptions, RoomOptions, WebAudioSettings } from "livekit-client";

import type { FFCAdaptiveStreamSettings } from "./track/ffc-track-types";
import { type FFCAudioCaptureOptions, type FFCVideoCaptureOptions, type FFCTrackPublishDefaults, type FFCAudioOutputOptions, toVideoCaptureOptions, toAudioCaptureOptions, toTrackPublishDefaults } from "./track/ffc-track-options";
import type { FFCReconnectPolicy } from "./ffc-reconnect-policy";

export interface FFCWebAudioSettings extends WebAudioSettings {};

/**
 * @internal
 */
export interface FFCInternalRtcVideoRoomOptions {
  /**
   * AdaptiveStream lets LiveKit automatically manage quality of subscribed
   * video tracks to optimize for bandwidth and CPU.
   * When attached video elements are visible, it'll choose an appropriate
   * resolution based on the size of largest video element it's attached to.
   *
   * When none of the video elements are visible, it'll temporarily pause
   * the data flow until they are visible again.
   */
  adaptiveStream: FFCAdaptiveStreamSettings | boolean;

  /**
   * enable Dynacast, off by default. With Dynacast dynamically pauses
   * video layers that are not being consumed by any subscribers, significantly
   * reducing publishing CPU and bandwidth usage.
   *
   * Dynacast will be enabled if SVC codecs (VP9/AV1) are used. Multi-codec simulcast
   * requires dynacast
   */
  dynacast: boolean;

  /**
   * default options to use when capturing user's audio
   */
  audioCaptureDefaults?: FFCAudioCaptureOptions;

  /**
   * default options to use when capturing user's video
   */
  videoCaptureDefaults?: FFCVideoCaptureOptions;

  /**
   * default options to use when publishing tracks
   */
  publishDefaults?: FFCTrackPublishDefaults;

  /**
   * audio output for the room
   */
  audioOutput?: FFCAudioOutputOptions;

  /**
   * should local tracks be stopped when they are unpublished. defaults to true
   * set this to false if you would prefer to clean up unpublished local tracks manually.
   */
  stopLocalTrackOnUnpublish: boolean;

  /**
   * policy to use when attempting to reconnect
   */
  reconnectPolicy: FFCReconnectPolicy;

  /**
   * specifies whether the sdk should automatically disconnect the room
   * on 'pagehide' and 'beforeunload' events
   */
  disconnectOnPageLeave: boolean;

  /**
   * @internal
   * experimental flag, introduce a delay before sending signaling messages
   */
  expSignalLatency?: number;

  /**
   * mix all audio tracks in web audio, helps to tackle some audio auto playback issues
   * allows for passing in your own AudioContext instance, too
   */

  webAudioMix: boolean | FFCWebAudioSettings;

  /**
   * @experimental
   */
  //e2ee?: E2EEOptions;

  //loggerName?: string;
}

/**
 * Options for when creating a new room
 */
export interface FFCRtcVideoRoomOptions extends Partial<Omit<FFCInternalRtcVideoRoomOptions, 'e2ee' | 'loggerName'>> { }

/* @internal */
export function toRoomOptions(options: FFCRtcVideoRoomOptions): RoomOptions {
  return {
    adaptiveStream: options.adaptiveStream,
    dynacast: options.dynacast,
    audioCaptureDefaults: toAudioCaptureOptions(options.audioCaptureDefaults),
    videoCaptureDefaults: toVideoCaptureOptions(options.videoCaptureDefaults),
    publishDefaults: options.publishDefaults ? toTrackPublishDefaults(options.publishDefaults) : undefined,
    audioOutput: options.audioOutput as AudioOutputOptions,
    stopLocalTrackOnUnpublish: options.stopLocalTrackOnUnpublish,
    reconnectPolicy: options.reconnectPolicy,
    disconnectOnPageLeave: options.disconnectOnPageLeave,
    expSignalLatency: options.expSignalLatency,
    webAudioMix: options.webAudioMix,
  };
}

/* @internal */
export function toFFCRtcVideoRoomOptions(options: RoomOptions) {
  return {
    adaptiveStream: options.adaptiveStream,
    dynacast: options.dynacast,
    audioCaptureDefaults: options.audioCaptureDefaults as FFCAudioCaptureOptions,
    videoCaptureDefaults: options.videoCaptureDefaults as FFCVideoCaptureOptions,
    publishDefaults: options.publishDefaults as FFCTrackPublishDefaults,
    audioOutput: options.audioOutput as FFCAudioOutputOptions,
    stopLocalTrackOnUnpublish: options.stopLocalTrackOnUnpublish,
    reconnectPolicy: options.reconnectPolicy as FFCReconnectPolicy,
    disconnectOnPageLeave: options.disconnectOnPageLeave,
    expSignalLatency: options.expSignalLatency,
    webAudioMix: options.webAudioMix,
  };
}

/**
 * @internal
 */
export interface FFCInternalRtcVideoRoomConnectOptions {
  /** autosubscribe to room tracks after joining, defaults to true */
  autoSubscribe: boolean;

  /** amount of time for PeerConnection to be established, defaults to 15s */
  peerConnectionTimeout: number;

  /**
   * use to override any RTCConfiguration options.
   */
  rtcConfig?: RTCConfiguration;

  /** specifies how often an initial join connection is allowed to retry (only applicable if server is not reachable) */
  maxRetries: number;

  /** amount of time for Websocket connection to be established, defaults to 15s */
  websocketTimeout: number;
}

/**
 * Options for Room.connect()
 */
export interface FFCRtcVideoRoomConnectOptions extends Partial<FFCInternalRtcVideoRoomConnectOptions> {}
