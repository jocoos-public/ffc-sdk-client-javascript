import type { InternalRoomConnectOptions, RoomOptions, WebAudioSettings } from "livekit-client";
import { FFCAudioCaptureOptions, FFCTrackPublishDefaults, FFCVideoCaptureOptions, type FFCAudioOutputOptions } from "./track/options";
import type { FFCAdaptiveStreamSettings } from "./track/types";
import type { FFCReconnectPolicy } from "./reconnect-policy";

export interface FFCInternalRtcVideoRoomOptions {
  adaptiveStream: FFCAdaptiveStreamSettings | boolean;
  dynacast: boolean;
  audioCaptureDefaults?: FFCAudioCaptureOptions;
  videoCaptureDefaults?: FFCVideoCaptureOptions;
  publishDefaults?: FFCTrackPublishDefaults;
  audioOutput?: FFCAudioOutputOptions;
  stopLocalTrackOnUnpublish: boolean;
  reconnectPolicy: FFCReconnectPolicy;
  disconnectOnPageLeave: boolean;
  expSignalLatency?: number;
  webAudioMix: boolean | WebAudioSettings;
  //e2ee?: FFCE2EEOptions;
  loggerName?: string;
}

export interface FFCRtcVideoRoomOptions extends Partial<FFCInternalRtcVideoRoomOptions> {}

/** @internal */
export namespace FFCRtcVideoRoomOptions {
  /** @internal */
  export function fromRoomOptions(opts: RoomOptions): FFCRtcVideoRoomOptions {
    return {
      adaptiveStream: opts.adaptiveStream,
      dynacast: opts.dynacast,
      audioCaptureDefaults: opts.audioCaptureDefaults
        ? FFCAudioCaptureOptions.fromAudioCaptureOptions(opts.audioCaptureDefaults)
        : undefined,
      videoCaptureDefaults: opts.videoCaptureDefaults
        ? FFCVideoCaptureOptions.fromVideoCaptureOptions(opts.videoCaptureDefaults)
        : undefined,
      publishDefaults: opts.publishDefaults
        ? FFCTrackPublishDefaults.fromTrackPublishDefaults(opts.publishDefaults)
        : undefined,
      audioOutput: opts.audioOutput,
      stopLocalTrackOnUnpublish: opts.stopLocalTrackOnUnpublish,
      reconnectPolicy: opts.reconnectPolicy,
      disconnectOnPageLeave: opts.disconnectOnPageLeave,
      expSignalLatency: opts.expSignalLatency,
      webAudioMix: opts.webAudioMix,
      loggerName: opts.loggerName,
    };
  }

  /** @internal */
  export function toRoomOptions(opts: FFCRtcVideoRoomOptions): RoomOptions {
    return {
      adaptiveStream: opts.adaptiveStream,
      dynacast: opts.dynacast,
      audioCaptureDefaults: opts.audioCaptureDefaults
        ? FFCAudioCaptureOptions.toAudioCaptureOptions(opts.audioCaptureDefaults)
        : undefined,
      videoCaptureDefaults: opts.videoCaptureDefaults
        ? FFCVideoCaptureOptions.toVideoCaptureOptions(opts.videoCaptureDefaults)
        : undefined,
      publishDefaults: opts.publishDefaults
        ? FFCTrackPublishDefaults.toTrackPublishDefaults(opts.publishDefaults)
        : undefined,
      audioOutput: opts.audioOutput,
      stopLocalTrackOnUnpublish: opts.stopLocalTrackOnUnpublish,
      reconnectPolicy: opts.reconnectPolicy,
      disconnectOnPageLeave: opts.disconnectOnPageLeave,
      expSignalLatency: opts.expSignalLatency,
      webAudioMix: opts.webAudioMix,
      loggerName: opts.loggerName,
    };
  }
}

export interface FFCInternalRtcVideoRoomConnectOptions extends InternalRoomConnectOptions {}

export interface FFCRtcVideoRoomConnectOptions extends Partial<FFCInternalRtcVideoRoomConnectOptions> {}