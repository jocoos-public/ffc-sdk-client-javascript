import type { InternalRoomConnectOptions, RoomOptions, WebAudioSettings } from "livekit-client";
import { FFCAudioCaptureOptions, FFCTrackPublishDefaults, FFCVideoCaptureOptions, type FFCAudioOutputOptions } from "./track/options";
import type { FFCAdaptiveStreamSettings } from "./track/types";
import type { FFCReconnectPolicy } from "./reconnect-policy";

/** @internal */
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
    const options: RoomOptions = {};
    if (opts.adaptiveStream !== undefined) {
      options.adaptiveStream = opts.adaptiveStream;
    }
    if (opts.dynacast !== undefined) {
      options.dynacast = opts.dynacast;
    }
    if (opts.audioCaptureDefaults !== undefined) {
      options.audioCaptureDefaults = FFCAudioCaptureOptions.toAudioCaptureOptions(opts.audioCaptureDefaults);
    }
    if (opts.videoCaptureDefaults !== undefined) {
      options.videoCaptureDefaults = FFCVideoCaptureOptions.toVideoCaptureOptions(opts.videoCaptureDefaults);
    }
    if (opts.publishDefaults !== undefined) {
      options.publishDefaults = FFCTrackPublishDefaults.toTrackPublishDefaults(opts.publishDefaults);
    }
    if (opts.audioOutput !== undefined) {
      options.audioOutput = opts.audioOutput;
    }
    if (opts.stopLocalTrackOnUnpublish !== undefined) {
      options.stopLocalTrackOnUnpublish = opts.stopLocalTrackOnUnpublish;
    }
    if (opts.reconnectPolicy !== undefined) {
      options.reconnectPolicy = opts.reconnectPolicy;
    }
    if (opts.disconnectOnPageLeave !== undefined) {
      options.disconnectOnPageLeave = opts.disconnectOnPageLeave;
    }
    if (opts.expSignalLatency !== undefined) {
      options.expSignalLatency = opts.expSignalLatency;
    }
    if (opts.webAudioMix !== undefined) {
      options.webAudioMix = opts.webAudioMix;
    }
    if (opts.loggerName !== undefined) {
      options.loggerName = opts.loggerName;
    } else {
      options.loggerName = 'FFC';
    }
    return options;
    // {
    //   adaptiveStream: opts.adaptiveStream,
    //   dynacast: opts.dynacast,
    //   audioCaptureDefaults: opts.audioCaptureDefaults
    //     ? FFCAudioCaptureOptions.toAudioCaptureOptions(opts.audioCaptureDefaults)
    //     : undefined,
    //   videoCaptureDefaults: opts.videoCaptureDefaults
    //     ? FFCVideoCaptureOptions.toVideoCaptureOptions(opts.videoCaptureDefaults)
    //     : undefined,
    //   publishDefaults: opts.publishDefaults
    //     ? FFCTrackPublishDefaults.toTrackPublishDefaults(opts.publishDefaults)
    //     : undefined,
    //   audioOutput: opts.audioOutput,
    //   stopLocalTrackOnUnpublish: opts.stopLocalTrackOnUnpublish,
    //   reconnectPolicy: opts.reconnectPolicy,
    //   disconnectOnPageLeave: opts.disconnectOnPageLeave,
    //   expSignalLatency: opts.expSignalLatency,
    //   webAudioMix: opts.webAudioMix,
    //   loggerName: opts.loggerName,
    // };
  }
}

/** @internal */
export interface FFCInternalRtcVideoRoomConnectOptions extends InternalRoomConnectOptions {}

export interface FFCRtcVideoRoomConnectOptions extends Partial<FFCInternalRtcVideoRoomConnectOptions> {}