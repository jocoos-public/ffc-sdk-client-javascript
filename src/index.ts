import { Mutex as FFCMutex } from '@livekit/mutex';

import {
  compareVersions,
  getBrowser,
  isBrowserSupported,
  supportsAdaptiveStream,
  supportsDynacast,
  supportsAV1,
  supportsVP9,
  getEmptyAudioStreamTrack,
  getEmptyVideoStreamTrack,
} from "livekit-client";
import FFCParticipant from "./rtc/participant/participant";
import FFCLocalParticipant from "./rtc/participant/participant-local";
import FFCRemoteParticipant from "./rtc/participant/participant-remote";
import { FFCConnectionQuality } from "./rtc/participant/types";
import type { FFCParticipantTrackPermission } from "./rtc/participant/types";
import { FFCDisconnectReason, FFCParticipantKind, FFCSubscriptionError } from "./rtc/protocol";
import type { FFCReconnectContext, FFCReconnectPolicy } from "./rtc/reconnect-policy";
import { FFCDefaultReconnectPolicy } from './rtc/reconnect-policy';
import FFCRtcVideoRoom, { FFCConnectionState } from "./rtc/rtc-video-room";
import type { FFCAudioReceiverStats, FFCAudioSenderStats, FFCVideoReceiverStats, FFCVideoSenderStats } from "./rtc/stats";
import { FFCLocalTrack } from "./rtc/track/track-local";
import FFCLocalAudioTrack from "./rtc/track/track-local-audio";
import FFCLocalVideoTrack from "./rtc/track/track-local-video";
import { FFCTrackPublication } from "./rtc/track/track-publication";
import FFCLocalTrackPublication from "./rtc/track/track-publication-local";
import FFCRemoteTrackPublication from "./rtc/track/track-publication-remote";
import FFCRemoteTrack from "./rtc/track/track-remote";
import FFCRemoteAudioTrack from "./rtc/track/track-remote-audio";
import FFCRemoteVideoTrack from "./rtc/track/track-remote-video";
import type { FFCElementInfo } from "./rtc/track/types";
import { FFCLogLevel, FFCLoggerNames, getLogger, setLogExtension, setLogLevel } from './logger';

import { type FFCAudioAnalyserOptions, sleep } from './rtc/utils';
import {
  createAudioAnalyser,
  isAudioTrack,
  isLocalParticipant,
  isLocalTrack,
  isRemoteParticipant,
  isRemoteTrack,
  isVideoTrack,
} from './rtc/utils';
import FFCCriticalTimers from './rtc/timers';
import FlipFlopCloud from './ffc';
import { FFCAccessLevel, FFCCreatorType, FFCVideoRoomType } from './api/types/enums';
import type { FFCPagesDto, FFCVideoRoomDto } from './api/types/data';
export * from './rtc/options';
export * from './errors';
export * from './rtc/events';
export * from './rtc/track/track';
export * from './rtc/track/create';
export { facingModeFromDeviceLabel, facingModeFromLocalTrack } from './rtc/track/facing-mode';
export * from './rtc/track/options';
export * from './rtc/track/processor/types';
export * from './rtc/track/types';
export {
  FlipFlopCloud,
  FFCVideoRoomType,
  FFCAccessLevel,
  FFCCreatorType,
  FFCConnectionQuality,
  FFCConnectionState,
  FFCCriticalTimers,
  // FFCDataPacket_Kind,
  FFCDefaultReconnectPolicy,
  FFCDisconnectReason,
  FFCLocalAudioTrack,
  FFCLocalParticipant,
  FFCLocalTrack,
  FFCLocalTrackPublication,
  FFCLocalVideoTrack,
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
  getBrowser,
  isBrowserSupported,
  supportsAdaptiveStream,
  supportsDynacast,
  supportsAV1,
  supportsVP9,
  getEmptyAudioStreamTrack,
  getEmptyVideoStreamTrack,
  FFCMutex,
  createAudioAnalyser,
  isAudioTrack,
  isLocalTrack,
  isRemoteTrack,
  isVideoTrack,
  isLocalParticipant,
  isRemoteParticipant,
  FFCLogLevel,
  FFCLoggerNames,
  getLogger,
  setLogExtension,
  setLogLevel,
  sleep
};

export type {
  FFCPagesDto,
  FFCVideoRoomDto,
  FFCAudioAnalyserOptions,
  FFCElementInfo,
  //FFCLiveKitReactNativeInfo,
  FFCParticipantTrackPermission,
  FFCAudioReceiverStats,
  FFCAudioSenderStats,
  FFCVideoReceiverStats,
  FFCVideoSenderStats,
  FFCReconnectContext,
  FFCReconnectPolicy,
};
