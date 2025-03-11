import { BackupCodecPolicy, VideoPreset } from "livekit-client";
import type {
  AudioCaptureOptions,
  AudioOutputOptions,
  AudioPreset,
  CreateLocalTracksOptions,
  ScreenShareCaptureOptions,
  TrackPublishDefaults,
  TrackPublishOptions,
  VideoCaptureOptions,
  VideoEncoding,
  VideoPresetOptions,
  VideoResolution
}  from "livekit-client";
import { FFCTrack } from "./track";
import { FFCAudioTrackProcessor, FFCTrackProcessor } from "./processor/types";

export interface FFCTrackPublishDefaults {
  videoEncoding?: FFCVideoEncoding;
  backupCodec?: true | false | { codec: FFCBackupVideoCodec; encoding?: FFCVideoEncoding };
  backupCodecPolicy?: FFCBackupCodecPolicy;
  screenShareEncoding?: FFCVideoEncoding;
  videoCodec?: FFCVideoCodec;
  audioPreset?: FFCAudioPreset;
  dtx?: boolean;
  red?: boolean;
  forceStereo?: boolean;
  simulcast?: boolean;
  scalabilityMode?: FFCScalabilityMode;
  degradationPreference?: RTCDegradationPreference;
  videoSimulcastLayers?: Array<FFCVideoPreset>;
  screenShareSimulcastLayers?: Array<FFCVideoPreset>;
  stopMicTrackOnMute?: boolean;
}

/** @internal */
export namespace FFCTrackPublishDefaults {
  export function fromTrackPublishDefaults(opts: TrackPublishDefaults): FFCTrackPublishDefaults {
    return {
      videoEncoding: opts.videoEncoding,
      backupCodec: opts.backupCodec,
      backupCodecPolicy: opts.backupCodecPolicy
        ? FFCBackupCodecPolicy.fromBackupCodecPolicy(opts.backupCodecPolicy)
        : undefined,
      screenShareEncoding: opts.screenShareEncoding,
      videoCodec: opts.videoCodec,
      audioPreset: opts.audioPreset,
      dtx: opts.dtx,
      red: opts.red,
      forceStereo: opts.forceStereo,
      simulcast: opts.simulcast,
      scalabilityMode: opts.scalabilityMode,
      degradationPreference: opts.degradationPreference,
      videoSimulcastLayers: opts.videoSimulcastLayers?.map((preset) => FFCVideoPreset.fromVideoPreset(preset)),
      screenShareSimulcastLayers: opts.screenShareSimulcastLayers?.map((preset) => FFCVideoPreset.fromVideoPreset(preset)),
      stopMicTrackOnMute: opts.stopMicTrackOnMute,
    };
  }

  /** @internal */
  export function toTrackPublishDefaults(opts: FFCTrackPublishDefaults): TrackPublishDefaults {
    return {
      videoEncoding: opts.videoEncoding,
      backupCodec: opts.backupCodec,
      backupCodecPolicy: opts.backupCodecPolicy
        ? FFCBackupCodecPolicy.toBackupCodecPolicy(opts.backupCodecPolicy)
        : undefined,
      screenShareEncoding: opts.screenShareEncoding,
      videoCodec: opts.videoCodec,
      audioPreset: opts.audioPreset,
      dtx: opts.dtx,
      red: opts.red,
      forceStereo: opts.forceStereo,
      simulcast: opts.simulcast,
      scalabilityMode: opts.scalabilityMode,
      degradationPreference: opts.degradationPreference,
      videoSimulcastLayers: opts.videoSimulcastLayers?.map((preset) => FFCVideoPreset.toVideoPreset(preset)),
      screenShareSimulcastLayers: opts.screenShareSimulcastLayers?.map((preset) => FFCVideoPreset.toVideoPreset(preset)),
      stopMicTrackOnMute: opts.stopMicTrackOnMute,
    };
  }
}

export interface FFCTrackPublishOptions extends FFCTrackPublishDefaults {
  name?: string;
  source?: FFCTrack.Source;
  stream?: string;
}

/** @internal */
export namespace FFCTrackPublishOptions {
  /** @internal */
  export function fromTrackPublishOptions(opts: TrackPublishOptions): FFCTrackPublishOptions {
    return {
      ...FFCTrackPublishDefaults.fromTrackPublishDefaults(opts),
      name: opts.name,
      source: opts.source ? FFCTrack.fromTrackSource(opts.source) : undefined,
      stream: opts.stream,
    };
  }

  /** @internal */
  export function toTrackPublishOptions(opts: FFCTrackPublishOptions): TrackPublishOptions {
    return {
      ...FFCTrackPublishDefaults.toTrackPublishDefaults(opts),
      name: opts.name,
      source: opts.source ? FFCTrack.toTrackSource(opts.source) : undefined,
      stream: opts.stream,
    };
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

/** @internal */
export namespace FFCCreateLocalTracksOptions {
  /** @internal */
  export function toCreateLocalTracksOptions(opts: FFCCreateLocalTracksOptions): CreateLocalTracksOptions {
    return {
      audio: typeof opts.audio === 'boolean'
        ? opts.audio
        : opts.audio
          ? FFCAudioCaptureOptions.toAudioCaptureOptions(opts.audio)
          : undefined,
      video: typeof opts.video === 'boolean'
        ? opts.video
        : opts.video
          ? FFCVideoCaptureOptions.toVideoCaptureOptions(opts.video)
          : undefined,
    };
  }
}

export interface FFCVideoCaptureOptions {
  /**
   * A ConstrainDOMString object specifying a device ID or an array of device
   * IDs which are acceptable and/or required.
   */
  deviceId?: ConstrainDOMString;

  /**
   * a facing or an array of facings which are acceptable and/or required.
   */
  facingMode?: FFCFacingMode;

  resolution?: FFCVideoResolution;
  processor?: FFCTrackProcessor<FFCTrack.Kind.Video>;
}

/** @internal */
export namespace FFCVideoCaptureOptions {
  /** @internal */
  export function fromVideoCaptureOptions(opts: VideoCaptureOptions): FFCVideoCaptureOptions {
    return {
      deviceId: opts.deviceId,
      facingMode: opts.facingMode,
      resolution: opts.resolution,
      processor: opts.processor ? FFCTrackProcessor.fromTrackProcessor(opts.processor) : undefined,
    };
  }

  /** @internal */
  export function toVideoCaptureOptions(opts: FFCVideoCaptureOptions): VideoCaptureOptions {
    return {
      deviceId: opts.deviceId,
      facingMode: opts.facingMode,
      resolution: opts.resolution,
      processor: opts.processor ? FFCTrackProcessor.toTrackProcessor(opts.processor) : undefined,
    };
  }
}

export interface FFCScreenShareCaptureOptions {
  audio?: boolean | FFCAudioCaptureOptions;
  video?: true | { displaySurface?: 'window' | 'browser' | 'monitor' };
  resolution?: FFCVideoResolution;
  controller?: unknown; // TODO replace type with CaptureController once it lands in TypeScript
  selfBrowserSurface?: 'include' | 'exclude';
  surfaceSwitching?: 'include' | 'exclude';
  systemAudio?: 'include' | 'exclude';
  contentHint?: 'detail' | 'text' | 'motion';
  suppressLocalAudioPlayback?: boolean;
  preferCurrentTab?: boolean;
}

/** @internal */
export namespace FFCScreenShareCaptureOptions {
  /** @internal */
  export function fromScreenShareCaptureOptions(opts: ScreenShareCaptureOptions): FFCScreenShareCaptureOptions {
    return {
      audio: typeof (opts.audio) === 'boolean'
        ? opts.audio
        : opts.audio
          ? FFCAudioCaptureOptions.fromAudioCaptureOptions(opts.audio)
          : undefined,
      video: opts.video,
      resolution: opts.resolution,
      controller: opts.controller,
      selfBrowserSurface: opts.selfBrowserSurface,
      surfaceSwitching: opts.surfaceSwitching,
      systemAudio: opts.systemAudio,
      contentHint: opts.contentHint,
      suppressLocalAudioPlayback: opts.suppressLocalAudioPlayback,
      preferCurrentTab: opts.preferCurrentTab,
    };
  }

  /** @internal */
  export function toScreenShareCaptureOptions(opts: FFCScreenShareCaptureOptions): ScreenShareCaptureOptions {
    return {
      audio: typeof (opts.audio) === 'boolean'
        ? opts.audio
        : opts.audio
          ? FFCAudioCaptureOptions.toAudioCaptureOptions(opts.audio)
          : undefined,
      video: opts.video,
      resolution: opts.resolution,
      controller: opts.controller,
      selfBrowserSurface: opts.selfBrowserSurface,
      surfaceSwitching: opts.surfaceSwitching,
      systemAudio: opts.systemAudio,
      contentHint: opts.contentHint,
      suppressLocalAudioPlayback: opts.suppressLocalAudioPlayback,
      preferCurrentTab: opts.preferCurrentTab,
    };
  }
}

export interface FFCAudioCaptureOptions {
  autoGainControl?: ConstrainBoolean;
  channelCount?: ConstrainULong;
  deviceId?: ConstrainDOMString;
  echoCancellation?: ConstrainBoolean;
  latency?: ConstrainDouble;
  noiseSuppression?: ConstrainBoolean;
  voiceIsolation?: ConstrainBoolean;
  sampleRate?: ConstrainULong;
  sampleSize?: ConstrainULong;
  processor?: FFCAudioTrackProcessor;
}

/** @internal */
export namespace FFCAudioCaptureOptions {
  /** @internal */
  export function fromAudioCaptureOptions(opts: AudioCaptureOptions): FFCAudioCaptureOptions {
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
      processor: opts.processor
        ? FFCAudioTrackProcessor.fromTrackProcessor(opts.processor)
        : undefined,
    };
  }

  /* @internal */
  export function toAudioCaptureOptions(opts: FFCAudioCaptureOptions): AudioCaptureOptions {
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
      processor: opts.processor
        ? FFCAudioTrackProcessor.toTrackProcessor(opts.processor)
        : undefined,
    };
  }
}

export interface FFCAudioOutputOptions extends AudioOutputOptions { }

export interface FFCVideoResolution extends VideoResolution { }

export interface FFCVideoEncoding extends VideoEncoding { }

export interface FFCVideoPresetOptions extends VideoPresetOptions { }

export class FFCVideoPreset {
  private _videoPreset: VideoPreset;

  constructor(videoPreset: VideoPreset);
  constructor(videoPresetOptions: FFCVideoPresetOptions);
  constructor(
    width: number,
    height: number,
    maxBitrate: number,
    maxFramerate?: number,
    priority?: RTCPriorityType,
  );
  constructor(
    widthOrOptionsOrInstance: number | FFCVideoPresetOptions | VideoPreset,
    height?: number,
    maxBitrate?: number,
    maxFramerate?: number,
    priority?: RTCPriorityType,
  ) {
    if (widthOrOptionsOrInstance instanceof VideoPreset) {
      this._videoPreset = widthOrOptionsOrInstance;
    } else if (typeof widthOrOptionsOrInstance === 'object') {
      this._videoPreset = new VideoPreset(widthOrOptionsOrInstance);
    } else if (height !== undefined && maxBitrate !== undefined) {
      this._videoPreset = new VideoPreset(widthOrOptionsOrInstance, height, maxBitrate, maxFramerate, priority);
    } else {
      throw new TypeError('Unsupported options: provide at least width, height and maxBitrate');
    }
  }

  /** @internal */
  static fromVideoPreset(videoPreset: VideoPreset): FFCVideoPreset {
    return new FFCVideoPreset(videoPreset);
  }

  /** @internal */
  static toVideoPreset(videoPreset: FFCVideoPreset): VideoPreset {
    return videoPreset.instance;
  }

  /** @internal */
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

export interface FFCAudioPreset extends AudioPreset { }

export const FFCBackupCodecs = ['vp8', 'h264'] as const;

export const FFCVideoCodecs = ['vp8', 'h264', 'vp9', 'av1'] as const;

export type FFCVideoCodec = (typeof FFCVideoCodecs)[number];

export type FFCBackupVideoCodec = (typeof FFCBackupCodecs)[number];

export function isBackupCodec(codec: string): codec is FFCBackupVideoCodec {
  return !!FFCBackupCodecs.find((backup) => backup === codec);
}

export enum FFCBackupCodecPolicy {
  REGRESSION = 'REGRESSION',
  SIMULCAST = 'SIMULCAST',
}

/** @internal */
export namespace FFCBackupCodecPolicy {
  /** @internal */
  export function fromBackupCodecPolicy(policy: BackupCodecPolicy): FFCBackupCodecPolicy {
    switch (policy) {
      case BackupCodecPolicy.REGRESSION:
        return FFCBackupCodecPolicy.REGRESSION;
      case BackupCodecPolicy.SIMULCAST:
        return FFCBackupCodecPolicy.SIMULCAST;
    }
  }

  /** @internal */
  export function toBackupCodecPolicy(policy: FFCBackupCodecPolicy): BackupCodecPolicy {
    switch (policy) {
      case FFCBackupCodecPolicy.REGRESSION:
        return BackupCodecPolicy.REGRESSION;
      case FFCBackupCodecPolicy.SIMULCAST:
        return BackupCodecPolicy.SIMULCAST;
    }
  }
}

export type FFCScalabilityMode =
  | 'L1T1'
  | 'L1T2'
  | 'L1T3'
  | 'L2T1'
  | 'L2T1h'
  | 'L2T1_KEY'
  | 'L2T2'
  | 'L2T2h'
  | 'L2T2_KEY'
  | 'L2T3'
  | 'L2T3h'
  | 'L2T3_KEY'
  | 'L3T1'
  | 'L3T1h'
  | 'L3T1_KEY'
  | 'L3T2'
  | 'L3T2h'
  | 'L3T2_KEY'
  | 'L3T3'
  | 'L3T3h'
  | 'L3T3_KEY';

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

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
export type FFCFacingMode = NonNullable<VideoCaptureOptions['facingMode']>;



