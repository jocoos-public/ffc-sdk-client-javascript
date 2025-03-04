import type { FFCInternalRtcVideoRoomConnectOptions, FFCInternalRtcVideoRoomOptions } from "./ffc-options";
import FFCDefaultReconnectPolicy from "./ffc-reconnect-policy";
import { FFCAudioPresets, FFCScreenSharePresets, FFCVideoCodec, FFCVideoPresets, type FFCAudioCaptureOptions, type FFCTrackPublishDefaults, type FFCVideoCaptureOptions } from "./track/ffc-track-options";

export const defaultVideoCodec = FFCVideoCodec.VP8;

export const publishDefaults: FFCTrackPublishDefaults = {
  audioPreset: FFCAudioPresets.music,
  dtx: true,
  red: true,
  forceStereo: false,
  simulcast: true,
  screenShareEncoding: FFCScreenSharePresets.h1080fps15.encoding,
  stopMicTrackOnMute: false,
  videoCodec: defaultVideoCodec,
  backupCodec: true,
} as const;

export const audioDefaults: FFCAudioCaptureOptions = {
  deviceId: 'default',
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true,
  voiceIsolation: true,
};

export const videoDefaults: FFCVideoCaptureOptions = {
  deviceId: 'default',
  resolution: FFCVideoPresets.h720.resolution,
};

export const roomOptionDefaults: FFCInternalRtcVideoRoomOptions = {
  adaptiveStream: false,
  dynacast: false,
  stopLocalTrackOnUnpublish: true,
  reconnectPolicy: new FFCDefaultReconnectPolicy(),
  disconnectOnPageLeave: true,
  webAudioMix: false,
} as const;

export const roomConnectOptionDefaults: FFCInternalRtcVideoRoomConnectOptions = {
  autoSubscribe: true,
  maxRetries: 1,
  peerConnectionTimeout: 15_000,
  websocketTimeout: 15_000,
} as const;
