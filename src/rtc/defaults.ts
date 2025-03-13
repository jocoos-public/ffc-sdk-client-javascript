import type { FFCInternalRtcVideoRoomConnectOptions, FFCInternalRtcVideoRoomOptions } from "./options";
import { FFCDefaultReconnectPolicy } from "./reconnect-policy";
import { FFCAudioCaptureOptions, FFCAudioPresets, FFCScreenSharePresets, FFCVideoCaptureOptions, FFCVideoPresets, type FFCTrackPublishDefaults } from "./track/options";

export const DEFAULT_VIDEO_CODEC = 'vp8';

export const PUBLISH_DEFAULTS: FFCTrackPublishDefaults = {
  audioPreset: FFCAudioPresets.music,
  dtx: true,
  red: true,
  forceStereo: false,
  simulcast: true,
  screenShareEncoding: FFCScreenSharePresets.h1080fps15.encoding,
  stopMicTrackOnMute: false,
  videoCodec: DEFAULT_VIDEO_CODEC,
  backupCodec: true,
} as const;

export const AUDIO_DEFAULTS: FFCAudioCaptureOptions = {
  deviceId: 'default',
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  voiceIsolation: true,
};

export const VIDEO_DEFAULTS: FFCVideoCaptureOptions = {
  deviceId: 'default',
  resolution: FFCVideoPresets.h720.resolution,
};

export const RTC_VIDEO_ROOM_OPTION_DEFAULTS: FFCInternalRtcVideoRoomOptions = {
  adaptiveStream: false,
  dynacast: false,
  stopLocalTrackOnUnpublish: true,
  reconnectPolicy: new FFCDefaultReconnectPolicy(),
  disconnectOnPageLeave: true,
  webAudioMix: false,
} as const;

export const RTC_VIDEO_ROOM_CONNECT_OPTION_DEFAULTS: FFCInternalRtcVideoRoomConnectOptions = {
  autoSubscribe: true,
  maxRetries: 1,
  peerConnectionTimeout: 15_000,
  websocketTimeout: 15_000,
} as const;
