import { Mutex as FFCMutex } from '@livekit/mutex';
import { compareVersions, getBrowser, getEmptyAudioStreamTrack, getEmptyVideoStreamTrack, isBrowserSupported, supportsAdaptiveStream, supportsAV1, supportsDynacast, supportsVP9 } from 'livekit-client';
import { type FFCParticipantPermission } from './rtc/ffc-protocol';
import FFCRtcVideoRoom, { FFCConnectionState } from './rtc/ffc-rtc-video-room';
import type { FFCRtcVideoRoomEventCallbacks } from './rtc/ffc-rtc-video-room';
import type { FFCAudioReceiverStats, FFCAudioSenderStats, FFCVideoReceiverStats, FFCVideoSenderStats } from './rtc/ffc-stats';
import FFCParticipant, { FFCConnectionQuality, type FFCParticipantEventCallbacks } from './rtc/participant/ffc-participant';
import FFCLocalParticipant from './rtc/participant/ffc-participant-local';
import FFCRemoteParticipant from './rtc/participant/ffc-participant-remote';
import type { FFCParticipantTrackPermission } from './rtc/participant/ffc-participant-track-permission';
import FFCLocalTrack from './rtc/track/ffc-track-local';
import FFCLocalAudioTrack from './rtc/track/ffc-track-local-audio';
import FFCLocalVideoTrack from './rtc/track/ffc-track-local-video';
import { FFCTrackPublication } from './rtc/track/ffc-track-publication';
import { FFCLocalTrackPublication } from './rtc/track/ffc-track-publication-local';
import { FFCRemoteTrackPublication } from './rtc/track/ffc-track-publication-remote';
import FFCRemoteTrack from './rtc/track/ffc-track-remote';
import FFCRemoteAudioTrack from './rtc/track/ffc-track-remote-audio';
import FFCRemoteVideoTrack, { type FFCElementInfo } from './rtc/track/ffc-track-remote-video';
import { createAudioAnalyser, isLocalParticipant, isRemoteParticipant, type FFCAudioAnalyserOptions } from './rtc/ffc-utils';
import { getLogger, LoggerNames, LogLevel, setLogExtension, setLogLevel } from './ffc-logger';
import { FFCRtcVideoRoomEvent } from './rtc/ffc-events';
import type FFCDefaultReconnectPolicy from './rtc/ffc-reconnect-policy';
import type FFCCriticalTimers from './rtc/ffc-timers';
import { FFCDisconnectReason, FFCParticipantKind, FFCSubscriptionError } from './rtc/ffc-protocol-enums';
import { isAudioTrack, isLocalTrack, isRemoteTrack, isVideoTrack } from './rtc/track/ffc-track';

export * from "./ffc";
export * from './rtc/ffc-events';
export * from './rtc/ffc-options';
export * from './rtc/ffc-rtc-errors';
export * from './rtc/track/ffc-track';
export * from './rtc/track/ffc-track-options';
export * from './rtc/track/ffc-track-types';
export * from './rtc/track/ffc-track-options';
export * from './rtc/track/ffc-track-create';
export {
  FFCConnectionQuality,
  FFCConnectionState,
  //DataPacket_Kind,
  FFCDisconnectReason,
  FFCLocalAudioTrack,
  FFCLocalParticipant,
  FFCLocalTrack,
  FFCLocalTrackPublication,
  FFCLocalVideoTrack,
  LogLevel,
  LoggerNames,
  FFCParticipant,
  FFCRemoteAudioTrack,
  FFCRemoteParticipant,
  FFCParticipantKind,
  FFCRemoteTrack,
  FFCRemoteTrackPublication,
  FFCRemoteVideoTrack,
  FFCRtcVideoRoom,
  FFCSubscriptionError,
  FFCTrackPublication,
  compareVersions,
  createAudioAnalyser,
  getBrowser,
  getEmptyAudioStreamTrack,
  getEmptyVideoStreamTrack,
  getLogger,
  isBrowserSupported,
  setLogExtension,
  setLogLevel,
  supportsAV1,
  supportsAdaptiveStream,
  supportsDynacast,
  supportsVP9,
  isAudioTrack,
  isLocalTrack,
  isRemoteTrack,
  isVideoTrack,
  isLocalParticipant,
  isRemoteParticipant,
  FFCRtcVideoRoomEvent,
  FFCMutex,
};
export { facingModeFromDeviceLabel, facingModeFromLocalTrack } from './rtc/track/ffc-facing-mode';
export type { FFCFacingMode } from './rtc/track/ffc-facing-mode';
export type {
  FFCAudioAnalyserOptions,
  FFCCriticalTimers,
  FFCElementInfo,
  FFCParticipantTrackPermission,
  FFCAudioReceiverStats,
  FFCAudioSenderStats,
  FFCVideoReceiverStats,
  FFCVideoSenderStats,
  FFCRtcVideoRoomEventCallbacks,
  FFCParticipantEventCallbacks,
  FFCParticipantPermission,
  FFCDefaultReconnectPolicy,
};
