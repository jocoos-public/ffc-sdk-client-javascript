import type { FFCAudioTrackFeature } from "../protocol";
import type { FFCAudioReceiverStats, FFCAudioSenderStats, FFCVideoReceiverStats, FFCVideoSenderStats } from "../stats";
import type { FFCAudioCaptureOptions, FFCTrackPublishOptions, FFCVideoCaptureOptions, FFCVideoCodec } from "./options";
import type { FFCAudioTrackProcessor, FFCTrackProcessor, FFCVideoTrackProcessor } from "./processor/types";
import { FFCTrack } from "./track";
import type { FFCLocalTrack } from "./track-local";
import type FFCLocalAudioTrack from "./track-local-audio";
import type { FFCSimulcastTrackInfo } from "./track-local-video";
import type FFCLocalVideoTrack from "./track-local-video";
import type { FFCTrackPublication } from "./track-publication";
import type FFCRemoteTrack from "./track-remote";
import type FFCRemoteAudioTrack from "./track-remote-audio";
import type FFCRemoteVideoTrack from "./track-remote-video";
import type { FFCElementInfo, FFCReplaceTrackOptions, FFCVideoQuality } from "./types";


export interface IFFCTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> {
  readonly kind: TrackKind;
  attachedElements: Array<HTMLMediaElement>;
  isMuted: boolean;
  source: FFCTrack.Source;
  sid?: FFCTrack.SID;
  /** @internal */
  mediaStream?: MediaStream;
  streamState: FFCTrack.StreamState;
  /** @internal */
  rtpTimestamp: number | undefined;
  get currentBitrate(): number;
  get mediaStreamTrack(): MediaStreamTrack;
  get isLocal(): boolean;
  /** @internal */
  get mediaStreamID(): string;
  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement;
  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | Array<HTMLMediaElement>;
  stop(): void;
}

export interface IFFCLocalTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> extends IFFCTrack<TrackKind> {
  codec?: FFCVideoCodec;
  get constraints(): MediaTrackConstraints;
  get id(): string;
  set source(source: FFCTrack.Source);
  set mediaStream(mediaStream: MediaStream | undefined);
  get dimensions(): FFCTrack.Dimensions | undefined;
  get isUpstreamPaused(): boolean;
  get isUserProvided(): boolean;
  // get mediaStreamTrack(): MediaStreamTrack; // inherited from IFFCTrack
  // get isLocal(): boolean; // inherited from IFFCTrack
  /** @internal */
  getSourceTrackSettings(): MediaTrackSettings;
  waitForDimensions(timeoutMs: number): Promise<FFCTrack.Dimensions>;
  setDeviceId(deviceId: ConstrainDOMString): Promise<boolean>;
  restartTrack(constraints?: unknown): Promise<void>;
  getDeviceId(noramlize: boolean): Promise<string | undefined>;
  mute(): Promise<IFFCLocalTrack>;
  unmute(): Promise<IFFCLocalTrack>;
  replaceTrack(track: MediaStreamTrack, options?: FFCReplaceTrackOptions): Promise<IFFCLocalTrack>;
  replaceTrack(track: MediaStreamTrack, userProvidedTrack?: boolean): Promise<IFFCLocalTrack>;
  replaceTrack(track: MediaStreamTrack, userProvidedOrOptions: boolean | FFCReplaceTrackOptions | undefined): Promise<IFFCLocalTrack>;
  stop(): void;
  pauseUpstream(): Promise<void>;
  resumeUpstream(): Promise<void>;
  getRTCStatsReport(): Promise<RTCStatsReport | undefined>
  setProcessor(processor: FFCTrackProcessor<FFCTrack.Kind>, showProcessedStreamLocally: boolean): Promise<void>;
  getProcessor(): FFCTrackProcessor<FFCTrack.Kind> | undefined;
  stopProcessor(): Promise<void>
}

export interface IFFCLocalAudioTrack extends IFFCLocalTrack<FFCTrack.Kind.Audio> {
  /** @internal */
  stopOnMute: boolean;
  get enhancedNoiseCancellation(): boolean;
  // mute(): Promise<IFFCLocalAudioTrack>; // inherited from IFFCLocalTrack as long as it returns typeof this
  // unmute(): Promise<IFFCLocalAudioTrack>; // inherited from IFFCLocalTrack as long as it returns typeof this
  restartTrack(options?: FFCAudioCaptureOptions): Promise<void>;
  setProcessor(processor: FFCAudioTrackProcessor): Promise<void>;
  getSenderStats(): Promise<FFCAudioSenderStats | undefined>;
  checkForSilence(): Promise<boolean>;
}

export interface IFFCLocalVideoTrack extends IFFCLocalTrack<FFCTrack.Kind.Video> {
  get sender(): RTCRtpSender | undefined;
  set sender(sender: RTCRtpSender | undefined);
  get isSimulcast(): boolean;
  // stop(): void; // inherited from IFFCLocalTrack
  // pauseUpstream(): Promise<void>; // inherited from IFFCLocalTrack
  // resumeUpstream(): Promise<void>; // inherited from IFFCLocalTrack
  // mute(): Promise<IFFCLocalVideoTrack>; // inherited from IFFCLocalTrack as long as it returns typeof this
  // unmute(): Promise<IFFCLocalVideoTrack>; // inherited from IFFCLocalTrack as long as it returns typeof this
  getSenderStats(): Promise<Array<FFCVideoSenderStats>>;
  setPublishingQuality(maxQuality: FFCVideoQuality): void;
  restartTrack(options?: FFCVideoCaptureOptions): Promise<void>;
  setProcessor(processor: FFCVideoTrackProcessor, showProcessedStreamLocally: boolean): Promise<void>;
  setDegradationPreference(pref: RTCDegradationPreference): Promise<void>;
  addSimulcastTrack(codec: FFCVideoCodec, encodings?: Array<RTCRtpEncodingParameters>): FFCSimulcastTrackInfo | undefined;
  setSimulcastTrackSender(codec: FFCVideoCodec, sender: RTCRtpSender): void;
}

export interface IFFCRemoteTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> extends IFFCTrack<TrackKind> {
  /** @internal */
  receiver: RTCRtpReceiver | undefined;
  //get isLocal(): boolean; // inherited from IFFCTrack
  start(): void;
  stop(): void;
  getRTCStatsReport(): Promise<RTCStatsReport | undefined>;
  setPlayoutDelay(delayInSeconds: number): void;
  getPlayoutDelay(): number;
  registerTimeSyncUpdate(): void;
}

export interface IFFCRemoteAudioTrack extends IFFCRemoteTrack<FFCTrack.Kind.Audio> {
  setVolume(volume: number): void;
  getVolume(): number;
  setSinkId(deviceId: string): Promise<void>;
  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement;
  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[];
  /** @internal */
  setAudioContext(audioContext: AudioContext | undefined): void;
  /** @internal */
  setWebAudioPlugins(nodes: AudioNode[]): void;
  getReceiverStats(): Promise<FFCAudioReceiverStats | undefined>;
}

export interface IFFCRemoteVideoTrack extends IFFCRemoteTrack<FFCTrack.Kind.Video> {
  get isAdaptiveStream(): boolean;
  get mediaStreamTrack(): MediaStreamTrack;
  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement;
  observeElementInfo(elementInfo: FFCElementInfo): void;
  stopObservingElementInfo(elementInfo: FFCElementInfo): void;
  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[];
  getReceiverStats(): Promise<FFCVideoReceiverStats | undefined>
}

export interface IFFCTrackPublication {
  kind: FFCTrack.Kind;
  trackName: string;
  trackSid: FFCTrack.SID;
  track?: FFCTrack;
  source: FFCTrack.Source;
  mimeType?: string;
  dimensions?: FFCTrack.Dimensions;
  simulcasted?: boolean;
  /** @internal */
  //trackInfo?: FFCTrackInfo;
  /** @internal */
  setTrack(track?: FFCTrack): void;
  get isMuted(): boolean;
  get isEnabled(): boolean;
  get isSubscribed(): boolean;
  get isEncrypted(): boolean;
  get isLocal(): boolean;
  get audioTrack(): FFCLocalAudioTrack | FFCRemoteAudioTrack | undefined;
  get videoTrack(): FFCLocalVideoTrack | FFCRemoteVideoTrack | undefined;
}

export interface IFFCLocalTrackPublication extends IFFCTrackPublication {
  track: FFCLocalTrack | undefined;
  options: FFCTrackPublishOptions | undefined;
  get isUpstreamPaused(): boolean | undefined;
  setTrack(track?: FFCTrack): void;
  get isMuted(): boolean;
  get audioTrack(): FFCLocalAudioTrack | undefined;
  get videoTrack(): FFCLocalVideoTrack | undefined;
  get isLocal(): boolean;
  mute(): Promise<IFFCLocalTrack | undefined>;
  unmute(): Promise<IFFCLocalTrack | undefined>;
  pauseUpstream(): Promise<void>;
  resumeUpstream(): Promise<void>;
  getTrackFeatures(): Array<FFCAudioTrackFeature>;
}

export interface IFFCRemoteTrackPublication extends IFFCTrackPublication {
  track: FFCRemoteTrack | undefined;
  setSubscribed(subscribed: boolean): void;
  get subscriptionStatus(): FFCTrackPublication.SubscriptionStatus;
  get permissionStatus(): FFCTrackPublication.PermissionStatus;
  get isSubscribed(): boolean;
  get isDesired(): boolean;
  get isEnabled(): boolean;
  get isLocal(): boolean;
  setEnabled(enabled: boolean): void;
  setVideoQuality(quality: FFCVideoQuality): void;
  setVideoDimensions(dimensions: FFCTrack.Dimensions): void;
  setVideoFPS(fps: number): void;
  get videoQuality(): FFCVideoQuality | undefined;
  /** @internal */
  setTrack(track?: FFCRemoteTrack): void;
}