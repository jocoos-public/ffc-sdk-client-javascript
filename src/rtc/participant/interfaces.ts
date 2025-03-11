import type { FFCParticipantKind, FFCParticipantPermission } from "../protocol";
import type { FFCAudioCaptureOptions, FFCCreateLocalTracksOptions, FFCScreenShareCaptureOptions, FFCTrackPublishOptions, FFCVideoCaptureOptions } from "../track/options";
import type { FFCTrack } from "../track/track";
import type { FFCLocalTrack } from "../track/track-local";
import type { FFCTrackPublication } from "../track/track-publication";
import type FFCLocalTrackPublication from "../track/track-publication-local";
import type FFCRemoteTrackPublication from "../track/track-publication-remote";
import type { FFCConnectionQuality, FFCParticipantTrackPermission } from "./types";

export interface IFFCParticipant {
  audioTrackPublications: Map<string, FFCTrackPublication>;
  videoTrackPublications: Map<string, FFCTrackPublication>;
  trackPublications: Map<string, FFCTrackPublication>;
  audioLevel: number;
  isSpeaking: boolean;
  sid: string;
  identity: string;
  name?: string;
  metadata?: string;
  lastSpokeAt?: Date;
  permissions?: FFCParticipantPermission;
  get isEncrypted(): boolean;
  get isAgent(): boolean;
  get kind(): FFCParticipantKind;
  get attributes(): Readonly<Record<string, string>>;
  getTrackPublications(): Array<FFCTrackPublication>;
  getTrackPublication(sid: string): FFCTrackPublication | undefined;
  getTrackPublicationByName(name: string): FFCTrackPublication | undefined;
  get connectionQuality(): FFCConnectionQuality;
  get isCameraEnabled(): boolean;
  get isMicrophoneEnabled(): boolean;
  get isScreenShareEnabled(): boolean;
  get isLocal(): boolean;
  get joinedAt(): Date | undefined;
}

export interface IFFCLocalParticipant extends IFFCParticipant {
  audioTrackPublications: Map<string, FFCLocalTrackPublication>;
  videoTrackPublications: Map<string, FFCLocalTrackPublication>;
  trackPublications: Map<string, FFCLocalTrackPublication>;
  get lastCameraError(): Error | undefined;
  get lastMicrophoneError(): Error | undefined;
  get isE2EEEnabled(): boolean;
  getTrackPublication(source: FFCTrack.Source): FFCLocalTrackPublication | undefined;
  getTrackPublicationByName(name: string): FFCLocalTrackPublication | undefined;
  setMetadata(metadata: string): Promise<void>;
  setName(name: string): Promise<void>;
  setAtributes(attributes: Record<string, string>): Promise<void>;
  setCameraEnabled(enabled: boolean, opts?: FFCVideoCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined>;
  setMicrophoneEnabled(enabled: boolean, opts?: FFCAudioCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined>;
  setScreenShareEnabled(
    enabled: boolean,
    opts?: FFCScreenShareCaptureOptions,
    publishOpt?: FFCTrackPublishOptions,
  ): Promise<FFCLocalTrackPublication | undefined>;
  enableCameraAndMicrophone(): Promise<void>;
  createTracks(opts?: FFCCreateLocalTracksOptions): Promise<Array<FFCLocalTrack>>;
  createScreenTracks(opts?: FFCScreenShareCaptureOptions): Promise<Array<FFCLocalTrack>>;
  publishTrack(track: FFCLocalTrack | MediaStreamTrack, opts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication>;
  get isLocal(): boolean;
  unpublishTrack(track: FFCLocalTrack | MediaStreamTrack, stopOnUnpublish?: boolean): Promise<FFCLocalTrackPublication | undefined>;
  unpublishTracks(tracks: Array<FFCLocalTrack> | Array<MediaStreamTrack>): Promise<Array<FFCLocalTrackPublication>>;
  republishAllTracks(options?: FFCTrackPublishOptions, restartTracks?: boolean): Promise<void>;
  /*
  publishData(data: Uint8Array, options: DataPublishOptions = {}): Promise<void>;
  publishDtmf(code: number, digit: string): Promise<void>;
  sendChatMessage(text: string, options?: SendTextOptions): Promise<ChatMessage>;
  editChatMessage(editText: string, originalMessage: ChatMessage);
  sendText(text: string, options?: SendTextOptions): Promise<TextStreamInfo>;
  streamText(options?: StreamTextOptions): Promise<TextStreamWriter>;
  sendFile(
    file: File,
    options?: {
      mimeType?: string;
      topic?: string;
      destinationIdentities?: Array<string>;
      onProgress?: (progress: number) => void;
    },
  ): Promise<{ id: string }>;
  performRpc({
    destinationIdentity,
    method,
    payload,
    responseTimeout = 10000,
  }: PerformRpcParams): Promise<string>
  registerRpcMethod(method: string, handler: (data: RpcInvocationData) => Promise<string>): void;
  unregisterRpcMethod(method: string): void;
  */
  setTrackSubscriptionPermissions(allParticipantsAllowed: boolean, participantTrackPermissions: Array<FFCParticipantTrackPermission>): void;
}

export interface IFFCRemoteParticipant extends IFFCParticipant {
  audioTrackPublications: Map<string, FFCRemoteTrackPublication>;
  videoTrackPublications: Map<string, FFCRemoteTrackPublication>;
  trackPublications: Map<string, FFCRemoteTrackPublication>;
  getTrackPublication(source: FFCTrack.Source): FFCRemoteTrackPublication | undefined;
  getTrackPublicationByName(name: string): FFCRemoteTrackPublication | undefined;
  setVolume(volume: number, source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio): void;
  getVolume(source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio): number | undefined;
}
