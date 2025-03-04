import { VideoPreset, type AudioCaptureOptions, type AudioOutputOptions, type AudioPreset, type BackupVideoCodec, type CreateLocalTracksOptions, type ScalabilityMode, type ScreenShareCaptureOptions, type TrackPublishDefaults, type TrackPublishOptions, type VideoCaptureOptions, type VideoCodec, type VideoEncoding, type VideoPresetOptions, type VideoResolution } from "livekit-client";
import { type FFCTrack, toFFCTrackSource, toTrackSource } from "./ffc-track";

export interface FFCTrackPublishDefaults {
  /**
   * encoding parameters for camera track
   */
  videoEncoding?: FFCVideoEncoding;

  /**
   * Multi-codec Simulcast
   * VP9 and AV1 are not supported by all browser clients. When backupCodec is
   * set, when an incompatible client attempts to subscribe to the track, LiveKit
   * will automatically publish a secondary track encoded with the backup codec.
   *
   * You could customize specific encoding parameters of the backup track by
   * explicitly setting codec and encoding fields.
   *
   * Defaults to `true`
   */
  backupCodec?: true | false | { codec: FFCBackupVideoCodec; encoding?: FFCVideoEncoding };

  /**
   * encoding parameters for screen share track
   */
  screenShareEncoding?: FFCVideoEncoding;

  /**
   * codec, defaults to vp8; for svc codecs, auto enable vp8
   * as backup. (TBD)
   */
  videoCodec?: FFCVideoCodec;

  /**
   * which audio preset should be used for publishing (audio) tracks
   * defaults to [[AudioPresets.music]]
   */
  audioPreset?: FFCAudioPreset;

  /**
   * dtx (Discontinuous Transmission of audio), enabled by default for mono tracks.
   */
  dtx?: boolean;

  /**
   * red (Redundant Audio Data), enabled by default for mono tracks.
   */
  red?: boolean;

  /**
   * publish track in stereo mode (or set to false to disable). defaults determined by capture channel count.
   */
  forceStereo?: boolean;

  /**
   * use simulcast, defaults to true.
   * When using simulcast, LiveKit will publish up to three versions of the stream
   * at various resolutions.
   */
  simulcast?: boolean;

  /**
   * scalability mode for svc codecs, defaults to 'L3T3_KEY'.
   * for svc codecs, simulcast is disabled.
   */
  scalabilityMode?: FFCScalabilityMode;

  /**
   * degradation preference
   */
  degradationPreference?: RTCDegradationPreference;

  /**
   * Up to two additional simulcast layers to publish in addition to the original
   * Track.
   * When left blank, it defaults to h180, h360.
   * If a SVC codec is used (VP9 or AV1), this field has no effect.
   *
   * To publish three total layers, you would specify:
   * {
   *   videoEncoding: {...}, // encoding of the primary layer
   *   videoSimulcastLayers: [
   *     VideoPresets.h540,
   *     VideoPresets.h216,
   *   ],
   * }
   */
  videoSimulcastLayers?: Array<FFCVideoPreset>;

  /**
   * custom video simulcast layers for screen tracks
   * Note: the layers need to be ordered from lowest to highest quality
   */
  screenShareSimulcastLayers?: Array<FFCVideoPreset>;

  /**
   * For local tracks, stop the underlying MediaStreamTrack when the track is muted (or paused)
   * on some platforms, this option is necessary to disable the microphone recording indicator.
   * Note: when this is enabled, and BT devices are connected, they will transition between
   * profiles (e.g. HFP to A2DP) and there will be an audible difference in playback.
   *
   * defaults to false
   */
  stopMicTrackOnMute?: boolean;
}

/* @internal */
export function toBackupCodec(backupCodec: true | false | { codec: FFCBackupVideoCodec; encoding?: FFCVideoEncoding } | undefined): true | false | { codec: BackupVideoCodec; encoding?: VideoEncoding } | undefined {
  if (backupCodec === undefined) {
    return undefined;
  }
  if (typeof backupCodec === 'boolean') {
    return backupCodec;
  }
  return {
    codec: toVideoCodec(backupCodec.codec),
    encoding: backupCodec.encoding as VideoEncoding,
  };
}

/* @internal */
export function toTrackPublishDefaults(options: FFCTrackPublishDefaults): TrackPublishDefaults{
  return {
    videoEncoding: options.videoEncoding,
    backupCodec: toBackupCodec(options.backupCodec),
    screenShareEncoding: options.screenShareEncoding,
    videoCodec: options.videoCodec ? toVideoCodec(options.videoCodec) : undefined,
    audioPreset: options.audioPreset,
    dtx: options.dtx,
    red: options.red,
    forceStereo: options.forceStereo,
    simulcast: options.simulcast,
    scalabilityMode: toScalabilityMode(options.scalabilityMode),
    degradationPreference: options.degradationPreference,
    videoSimulcastLayers: options.videoSimulcastLayers?.map((preset) => preset.instance),
    screenShareSimulcastLayers: options.screenShareSimulcastLayers,
    stopMicTrackOnMute: options.stopMicTrackOnMute,
  }
}

export enum FFCVideoCodec {
  VP8 = 'VP8',
  H264 = 'H264',
  VP9 = 'VP9',
  AV1 = 'AV1',
}
export function toVideoCodec(): undefined;
export function toVideoCodec(codec: FFCVideoCodec.VP8 | FFCVideoCodec.H264): 'vp8' | 'h264';
export function toVideoCodec(codec: FFCVideoCodec): VideoCodec;
export function toVideoCodec(codec?: FFCVideoCodec | undefined): VideoCodec | undefined{
  if (!codec) {
    return;
  }
  switch (codec) {
    case FFCVideoCodec.VP8:
      return 'vp8';
    case FFCVideoCodec.H264:
      return 'h264';
    case FFCVideoCodec.VP9:
      return 'vp9';
    case FFCVideoCodec.AV1:
      return 'av1';
  }
}

export function toFFCVideoCodec(codec: VideoCodec): FFCVideoCodec {
  switch (codec) {
    case 'vp8':
      return FFCVideoCodec.VP8;
    case 'h264':
      return FFCVideoCodec.H264;
    case 'vp9':
      return FFCVideoCodec.VP9;
    case 'av1':
      return FFCVideoCodec.AV1;
  }
}

export const FFCVideoCodecs = [
  FFCVideoCodec.VP8,
  FFCVideoCodec.H264,
  FFCVideoCodec.VP9,
  FFCVideoCodec.AV1
] as const;

export enum FFCVideoFacingMode {
  USER = 'USER',
  ENVIRONMENT = 'ENVIRONMENT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/* @internal */
export function toVideoFacingMode(mode?: FFCVideoFacingMode): 'user' | 'environment' | 'left' | 'right' | undefined {
  switch (mode) {
    case FFCVideoFacingMode.USER:
      return 'user';
    case FFCVideoFacingMode.ENVIRONMENT:
      return 'environment';
    case FFCVideoFacingMode.LEFT:
      return 'left';
    case FFCVideoFacingMode.RIGHT:
      return 'right';
    case undefined:
      return;
  }
}

/* @internal */
export function toFFCVideoFacingMode(mode?: 'user' | 'environment' | 'left' | 'right'): FFCVideoFacingMode | undefined{
  switch (mode) {
    case 'user':
      return FFCVideoFacingMode.USER;
    case 'environment':
      return FFCVideoFacingMode.ENVIRONMENT;
    case 'left':
      return FFCVideoFacingMode.LEFT;
    case 'right':
      return FFCVideoFacingMode.RIGHT;
    case undefined:
      return;
  }
}

export interface FFCCreateLocalTracksOptions {
  /**
   * audio track options, true to create with defaults. false if audio shouldn't be created
   * default true
   */
  audio?: boolean | FFCAudioCaptureOptions;

  /**
   * video track options, true to create with defaults. false if video shouldn't be created
   * default true
   */
  video?: boolean | FFCVideoCaptureOptions;
}

/* @internal */
export function toCreateLocalTracksOptions(opts?: FFCCreateLocalTracksOptions): CreateLocalTracksOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    audio: opts.audio,
    video: typeof opts.video === 'boolean'
      ? opts.video
      : opts.video
        ? toVideoCaptureOptions(opts.video)
        : undefined,
  };
}

export interface FFCScreenShareCaptureOptions {
  /**
   * true to capture audio shared. browser support for audio capturing in
   * screenshare is limited: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#browser_compatibility
   */
  audio?: boolean | FFCAudioCaptureOptions;

  /**
   * only allows for 'true' and chrome allows for additional options to be passed in
   * https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#displaySurface
   */
  video?: true | { displaySurface?: 'window' | 'browser' | 'monitor' };

  /**
   * capture resolution, defaults to 1080 for all browsers other than Safari
   * On Safari 17, default resolution is not capped, due to a bug, specifying
   * any resolution at all would lead to a low-resolution capture.
   * https://bugs.webkit.org/show_bug.cgi?id=263015
   */
  resolution?: FFCVideoResolution;

  /** a CaptureController object instance containing methods that can be used to further manipulate the capture session if included. */
  //controller?: unknown; // TODO replace type with CaptureController once it lands in TypeScript

  /** specifies whether the browser should allow the user to select the current tab for capture */
  selfBrowserSurface?: 'include' | 'exclude';

  /** specifies whether the browser should display a control to allow the user to dynamically switch the shared tab during screen-sharing. */
  surfaceSwitching?: 'include' | 'exclude';

  /** specifies whether the browser should include the system audio among the possible audio sources offered to the user */
  systemAudio?: 'include' | 'exclude';

  /** specify the type of content, see: https://www.w3.org/TR/mst-content-hint/#video-content-hints */
  contentHint?: 'detail' | 'text' | 'motion';

  /**
   * Experimental option to control whether the audio playing in a tab will continue to be played out of a user's
   * local speakers when the tab is captured.
   */
  suppressLocalAudioPlayback?: boolean;

  /**
   * Experimental option to instruct the browser to offer the current tab as the most prominent capture source
   * @experimental
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#prefercurrenttab
   */
  preferCurrentTab?: boolean;
}

/* @internal */
export function toScreenShareCaptureOptions(opts?: FFCScreenShareCaptureOptions): ScreenShareCaptureOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    audio: opts.audio,
    video: opts.video,
    resolution: opts.resolution,
    selfBrowserSurface: opts.selfBrowserSurface,
    surfaceSwitching: opts.surfaceSwitching,
    systemAudio: opts.systemAudio,
    contentHint: opts.contentHint,
    suppressLocalAudioPlayback: opts.suppressLocalAudioPlayback,
    preferCurrentTab: opts.preferCurrentTab,
  };
}

export interface FFCVideoResolution extends VideoResolution {}

export interface FFCVideoCaptureOptions {
  /**
   * A ConstrainDOMString object specifying a device ID or an array of device
   * IDs which are acceptable and/or required.
   */
  deviceId?: ConstrainDOMString;

  /**
   * a facing or an array of facings which are acceptable and/or required.
   */
  facingMode?: FFCVideoFacingMode;

  resolution?: FFCVideoResolution;
}

/* @internal */
export function toVideoCaptureOptions(opts?: FFCVideoCaptureOptions): VideoCaptureOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    deviceId: opts.deviceId,
    facingMode: toVideoFacingMode(opts.facingMode),
    resolution: opts.resolution,
  };
}

/* @internal */
export function toFFCVideoCaptureOptions(opts?: VideoCaptureOptions): FFCVideoCaptureOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    deviceId: opts.deviceId,
    facingMode: toFFCVideoFacingMode(opts.facingMode),
    resolution: opts.resolution,
  };
}

export interface FFCAudioCaptureOptions extends Omit<AudioCaptureOptions, 'processor'> {}

/* @internal */
export function toAudioCaptureOptions(opts?: FFCAudioCaptureOptions): AudioCaptureOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    autoGainControl: opts.autoGainControl,
    channelCount: opts.channelCount,
    deviceId: opts.deviceId,
    echoCancellation: opts.echoCancellation,
    latency: opts.latency,
    noiseSuppression: opts.noiseSuppression,
    voiceIsolation: opts.voiceIsolation,
    sampleRate: opts.sampleRate,
    sampleSize: opts.sampleSize,
    //processor: opts.processor,
  };
}

export interface FFCAudioOutputOptions extends AudioOutputOptions {}
export interface FFCTrackPublishOptions {
  name?: string;
  source?: FFCTrack.Source;
  stream?: string;
}

/* @internal */
export function toTrackPublishOptions(opts?: FFCTrackPublishOptions): TrackPublishOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    name: opts.name,
    source: opts.source ? toTrackSource(opts.source) : undefined,
    stream: opts.stream,
  };
}

/* @internal */
export function toFFCTrackPublishOptions(opts?: TrackPublishOptions): FFCTrackPublishOptions | undefined {
  if (!opts) {
    return;
  }
  return {
    name: opts.name,
    source: opts.source ? toFFCTrackSource(opts.source) : undefined,
    stream: opts.stream,
  };
}

export interface FFCVideoEncoding extends VideoEncoding {}

export interface FFCVideoPresetOptions extends VideoPresetOptions {}

export class FFCVideoPreset {
  private _videoPreset: VideoPreset;

  constructor(videoPresetOptions: FFCVideoPresetOptions);
  constructor(
    width: number,
    height: number,
    maxBitrate: number,
    maxFramerate?: number,
    priority?: RTCPriorityType,
  );
  constructor(
    widthOrOptions: number | FFCVideoPresetOptions,
    height?: number,
    maxBitrate?: number,
    maxFramerate?: number,
    priority?: RTCPriorityType,
  ) {
    if (typeof widthOrOptions === 'object') {
      this._videoPreset = new VideoPreset(widthOrOptions);
    } else if (height !== undefined && maxBitrate !== undefined) {
      this._videoPreset = new VideoPreset(widthOrOptions, height, maxBitrate, maxFramerate, priority);
    } else {
      throw new TypeError('Unsupported options: provide at least width, height and maxBitrate');
    }
  }

  /* @internal */
  get instance(): VideoPreset {
    return this._videoPreset;
  }
  
  get encoding(): FFCVideoEncoding {
    return this._videoPreset.encoding;
  };

  get width(): number {
    return this._videoPreset.width;
  };

  get height(): number {
    return this._videoPreset.height;
  };

  get aspectRatio(): number | undefined {
    return this._videoPreset.aspectRatio;
  };

  get resolution(): FFCVideoResolution {
    return {
      width: this.width,
      height: this.height,
      frameRate: this.encoding.maxFramerate,
      aspectRatio: this.aspectRatio,
    };
  }
}

export interface FFCAudioPreset extends AudioPreset {}

const backupCodecs = [FFCVideoCodec.VP8, FFCVideoCodec.H264] as const;

export type FFCBackupVideoCodec = (typeof backupCodecs)[number];

export function isBackupCodec(codec: string): codec is FFCBackupVideoCodec {
  return !!backupCodecs.find((backup) => backup === codec);
}

/**
 * scalability modes for svc.
 */
export enum FFCScalabilityMode {
  L1T1 = 'L1T1',
  L1T2 = 'L1T2',
  L1T3 = 'L1T3',
  L2T1 = 'L2T1',
  L2T1h = 'L2T1h',
  L2T1_KEY = 'L2T1_KEY',
  L2T2 = 'L2T2',
  L2T2h = 'L2T2h',
  L2T2_KEY = 'L2T2_KEY',
  L2T3 = 'L2T3',
  L2T3h = 'L2T3h',
  L2T3_KEY = 'L2T3_KEY',
  L3T1 = 'L3T1',
  L3T1h = 'L3T1h',
  L3T1_KEY = 'L3T1_KEY',
  L3T2 = 'L3T2',
  L3T2h = 'L3T2h',
  L3T2_KEY = 'L3T2_KEY',
  L3T3 = 'L3T3',
  L3T3h = 'L3T3h',
  L3T3_KEY = 'L3T3_KEY',
}

/* @internal */
export function toScalabilityMode(mode: FFCScalabilityMode | undefined): ScalabilityMode | undefined {
  return mode;
}

export interface FFCAudioPreset extends AudioPreset {}

export namespace FFCAudioPresets {
  export const telephone: FFCAudioPreset = {
    maxBitrate: 12_000,
  };
  export const speech: FFCAudioPreset = {
    maxBitrate: 24_000,
  };
  export const music: FFCAudioPreset = {
    maxBitrate: 48_000,
  };
  export const musicStereo: FFCAudioPreset = {
    maxBitrate: 64_000,
  };
  export const musicHighQuality: FFCAudioPreset = {
    maxBitrate: 96_000,
  };
  export const musicHighQualityStereo: FFCAudioPreset = {
    maxBitrate: 128_000,
  };
}

/**
 * Sane presets for video resolution/encoding
 */
export const FFCVideoPresets = {
  h90: new FFCVideoPreset(160, 90, 90_000, 20),
  h180: new FFCVideoPreset(320, 180, 160_000, 20),
  h216: new FFCVideoPreset(384, 216, 180_000, 20),
  h360: new FFCVideoPreset(640, 360, 450_000, 20),
  h540: new FFCVideoPreset(960, 540, 800_000, 25),
  h720: new FFCVideoPreset(1280, 720, 1_700_000, 30),
  h1080: new FFCVideoPreset(1920, 1080, 3_000_000, 30),
  h1440: new FFCVideoPreset(2560, 1440, 5_000_000, 30),
  h2160: new FFCVideoPreset(3840, 2160, 8_000_000, 30),
} as const;

/**
 * Four by three presets
 */
export const FFCVideoPresets43 = {
  h120: new FFCVideoPreset(160, 120, 70_000, 20),
  h180: new FFCVideoPreset(240, 180, 125_000, 20),
  h240: new FFCVideoPreset(320, 240, 140_000, 20),
  h360: new FFCVideoPreset(480, 360, 330_000, 20),
  h480: new FFCVideoPreset(640, 480, 500_000, 20),
  h540: new FFCVideoPreset(720, 540, 600_000, 25),
  h720: new FFCVideoPreset(960, 720, 1_300_000, 30),
  h1080: new FFCVideoPreset(1440, 1080, 2_300_000, 30),
  h1440: new FFCVideoPreset(1920, 1440, 3_800_000, 30),
} as const;

export const FFCScreenSharePresets = {
  h360fps3: new FFCVideoPreset(640, 360, 200_000, 3, 'medium'),
  h360fps15: new FFCVideoPreset(640, 360, 400_000, 15, 'medium'),
  h720fps5: new FFCVideoPreset(1280, 720, 800_000, 5, 'medium'),
  h720fps15: new FFCVideoPreset(1280, 720, 1_500_000, 15, 'medium'),
  h720fps30: new FFCVideoPreset(1280, 720, 2_000_000, 30, 'medium'),
  h1080fps15: new FFCVideoPreset(1920, 1080, 2_500_000, 15, 'medium'),
  h1080fps30: new FFCVideoPreset(1920, 1080, 5_000_000, 30, 'medium'),
  // original resolution, without resizing
  original: new FFCVideoPreset(0, 0, 7_000_000, 30, 'medium'),
} as const;
