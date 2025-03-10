import type { Track, TrackProcessor, AudioProcessorOptions, VideoProcessorOptions } from "livekit-client";
import { cloneDeep, isSafari, sleep } from "../ffc-utils";
import type { FFCAudioCaptureOptions, FFCCreateLocalTracksOptions, FFCScreenShareCaptureOptions, FFCVideoCaptureOptions, FFCVideoCodec } from "./ffc-track-options";
import type { FFCTrackPublication } from "./ffc-track-publication";
import { FFCTrackSource, type FFCAudioTrack } from "./ffc-track-types";
import { FFCTrackPublishedResponse } from "../ffc-protocol";

export function mergeDefaultOptions(
  options?: FFCCreateLocalTracksOptions,
  audioDefaults?: FFCAudioCaptureOptions,
  videoDefaults?: FFCVideoCaptureOptions,
): FFCCreateLocalTracksOptions {
  const { optionsWithoutProcessor, /*audioProcessor, videoProcessor*/ } = extractProcessorsFromOptions(
    options ?? {},
  );
  const clonedOptions: FFCCreateLocalTracksOptions = cloneDeep(optionsWithoutProcessor) ?? {};
  if (clonedOptions.audio === true) clonedOptions.audio = {};
  if (clonedOptions.video === true) clonedOptions.video = {};

  // use defaults
  if (clonedOptions.audio) {
    mergeObjectWithoutOverwriting(
      clonedOptions.audio as Record<string, unknown>,
      audioDefaults as Record<string, unknown>,
    );
    clonedOptions.audio.deviceId ??= 'default';
    /*
    if (audioProcessor) {
      clonedOptions.audio.processor = audioProcessor;
    }
    */
  }
  if (clonedOptions.video) {
    mergeObjectWithoutOverwriting(
      clonedOptions.video as Record<string, unknown>,
      videoDefaults as Record<string, unknown>,
    );
    clonedOptions.video.deviceId ??= 'default';
    /*
    if (videoProcessor) {
      clonedOptions.video.processor = videoProcessor;
    }
    */
  }
  return clonedOptions;
}

function mergeObjectWithoutOverwriting(
  mainObject: Record<string, unknown>,
  objectToMerge: Record<string, unknown>,
): Record<string, unknown> {
  Object.keys(objectToMerge).forEach((key) => {
    if (mainObject[key] === undefined) mainObject[key] = objectToMerge[key];
  });
  return mainObject;
}

export function constraintsForOptions(options: FFCCreateLocalTracksOptions): MediaStreamConstraints {
  const constraints: MediaStreamConstraints = {};

  if (options.video) {
    // default video options
    if (typeof options.video === 'object') {
      const videoOptions: MediaTrackConstraints = {};
      const target = videoOptions as Record<string, unknown>;
      const source = options.video as Record<string, unknown>;
      Object.keys(source).forEach((key) => {
        switch (key) {
          case 'resolution':
            // flatten VideoResolution fields
            mergeObjectWithoutOverwriting(target, source.resolution as Record<string, unknown>);
            break;
          default:
            target[key] = source[key];
        }
      });
      constraints.video = videoOptions;
      constraints.video.deviceId ??= 'default';
    } else {
      constraints.video = options.video ? { deviceId: 'default' } : false;
    }
  } else {
    constraints.video = false;
  }

  if (options.audio) {
    if (typeof options.audio === 'object') {
      constraints.audio = options.audio;
      constraints.audio.deviceId ??= 'default';
    } else {
      constraints.audio = { deviceId: 'default' };
    }
  } else {
    constraints.audio = false;
  }
  return constraints;
}
/**
 * This function detects silence on a given [[Track]] instance.
 * Returns true if the track seems to be entirely silent.
 */
export async function detectSilence(track: FFCAudioTrack, timeOffset = 200): Promise<boolean> {
  const ctx = getNewAudioContext();
  if (ctx) {
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));

    source.connect(analyser);
    await sleep(timeOffset);
    analyser.getByteTimeDomainData(dataArray);
    const someNoise = dataArray.some((sample) => sample !== 128 && sample !== 0);
    ctx.close();
    return !someNoise;
  }
  return false;
}

/**
 * @internal
 */
export function getNewAudioContext(): AudioContext | void {
  const AudioContext =
    // @ts-ignore
    typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (AudioContext) {
    return new AudioContext({ latencyHint: 'interactive' });
  }
}

/**
 * @internal
 */
export function kindToSource(kind: MediaDeviceKind) {
  if (kind === 'audioinput') {
    return FFCTrackSource.MICROPHONE;
  } else if (kind === 'videoinput') {
    return FFCTrackSource.CAMERA;
  } else {
    return FFCTrackSource.UNKNOWN;
  }
}

/**
 * @internal
 */
export function sourceToKind(source: FFCTrackSource): MediaDeviceKind | undefined {
  if (source === FFCTrackSource.MICROPHONE) {
    return 'audioinput';
  } else if (source === FFCTrackSource.CAMERA) {
    return 'videoinput';
  } else {
    return undefined;
  }
}

/**
 * @internal
 */
export function screenCaptureToDisplayMediaStreamOptions(
  options: FFCScreenShareCaptureOptions,
): DisplayMediaStreamOptions {
  let videoConstraints: MediaTrackConstraints | boolean = options.video ?? true;
  // treat 0 as uncapped
  if (options.resolution && options.resolution.width > 0 && options.resolution.height > 0) {
    videoConstraints = typeof videoConstraints === 'boolean' ? {} : videoConstraints;
    if (isSafari()) {
      videoConstraints = {
        ...videoConstraints,
        width: { max: options.resolution.width },
        height: { max: options.resolution.height },
        frameRate: options.resolution.frameRate,
      };
    } else {
      videoConstraints = {
        ...videoConstraints,
        width: { ideal: options.resolution.width },
        height: { ideal: options.resolution.height },
        frameRate: options.resolution.frameRate,
      };
    }
  }

  return {
    audio: options.audio ?? false,
    video: videoConstraints,
    // @ts-expect-error support for experimental display media features
    controller: options.controller,
    selfBrowserSurface: options.selfBrowserSurface,
    surfaceSwitching: options.surfaceSwitching,
    systemAudio: options.systemAudio,
    preferCurrentTab: options.preferCurrentTab,
  };
}

export function mimeTypeToVideoCodecString(mimeType: string) {
  return mimeType.split('/')[1].toLowerCase() as FFCVideoCodec;
}

export function getTrackPublicationInfo<T extends FFCTrackPublication>(
  tracks: T[],
): FFCTrackPublishedResponse[] {
  const infos: FFCTrackPublishedResponse[] = [];
  tracks.forEach((track: FFCTrackPublication) => {
    if (track.track !== undefined) {
      infos.push(
        new FFCTrackPublishedResponse({
          cid: track.track.mediaStreamID,
          track: track.trackInfo,
        }),
      );
    }
  });
  return infos;
}

/*
export function getLogContextFromTrack(track: FFCTrack | FFCTrackPublication): Record<string, unknown> {
  if (track instanceof FFCTrackPublication) {
    return {
      trackID: track.trackSid,
      enabled: track.isEnabled,
      muted: track.isMuted,
      trackInfo: {
        mimeType: track.mimeType,
        name: track.trackName,
        encrypted: track.isEncrypted,
        kind: track.kind,
        source: track.source,
        ...(track.track ? getLogContextFromTrack(track.track) : {}),
      },
    };
  } else {
    return {
      trackID: track.sid,
      source: track.source,
      muted: track.isMuted,
      enabled: track.mediaStreamTrack.enabled,
      kind: track.kind,
      streamID: track.mediaStreamID,
      streamTrackID: track.mediaStreamTrack.id,
    };
    
  }
}
*/

export function supportsSynchronizationSources(): boolean {
  return typeof RTCRtpReceiver !== 'undefined' && 'getSynchronizationSources' in RTCRtpReceiver;
}

export function diffAttributes(
  oldValues: Record<string, string> | undefined,
  newValues: Record<string, string> | undefined,
) {
  if (oldValues === undefined) {
    oldValues = {};
  }
  if (newValues === undefined) {
    newValues = {};
  }
  const allKeys = [...Object.keys(newValues), ...Object.keys(oldValues)];
  const diff: Record<string, string> = {};

  for (const key of allKeys) {
    if (oldValues[key] !== newValues[key]) {
      diff[key] = newValues[key] ?? '';
    }
  }

  return diff;
}

/** @internal */
export function extractProcessorsFromOptions(options: FFCCreateLocalTracksOptions) {
  const newOptions = { ...options };
  let audioProcessor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> | undefined;
  let videoProcessor: TrackProcessor<Track.Kind.Video, VideoProcessorOptions> | undefined;

  /*
  if (typeof newOptions.audio === 'object' && newOptions.audio.processor) {
    audioProcessor = newOptions.audio.processor;
    newOptions.audio = { ...newOptions.audio, processor: undefined };
  }
  if (typeof newOptions.video === 'object' && newOptions.video.processor) {
    videoProcessor = newOptions.video.processor;
    newOptions.video = { ...newOptions.video, processor: undefined };
  }
  */

  return { audioProcessor, videoProcessor, optionsWithoutProcessor: newOptions };
}
