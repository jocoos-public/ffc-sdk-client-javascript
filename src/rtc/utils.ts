import { compareVersions, getBrowser, type AudioAnalyserOptions, type LiveKitReactNativeInfo } from "livekit-client";
import type FFCParticipant from "./participant/participant";
import type FFCLocalParticipant from "./participant/participant-local";
import type FFCRemoteParticipant from "./participant/participant-remote";
import { FFCTrack } from "./track/track";
import type { FFCLocalTrack } from "./track/track-local";
import type FFCLocalAudioTrack from "./track/track-local-audio";
import type FFCLocalVideoTrack from "./track/track-local-video";
import type FFCRemoteTrack from "./track/track-remote";
import type FFCRemoteAudioTrack from "./track/track-remote-audio";
import type FFCRemoteVideoTrack from "./track/track-remote-video";
import { getNewAudioContext } from "./track/utils";
import FFCCriticalTimers from "./timers";

export async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => FFCCriticalTimers.setTimeout(resolve, duration));
}

export function isSVCCodec(codec?: string): boolean {
  return codec === 'av1' || codec === 'vp9';
}

export type FFCAudioAnalyserOptions = AudioAnalyserOptions;

/**
 * Creates and returns an analyser web audio node that is attached to the provided track.
 * Additionally returns a convenience method `calculateVolume` to perform instant volume readings on that track.
 * Call the returned `cleanup` function to close the audioContext that has been created for the instance of this helper
 */
export function createAudioAnalyser(
  track: FFCLocalAudioTrack | FFCRemoteAudioTrack,
  options?: FFCAudioAnalyserOptions,
) {
  const opts = {
    cloneTrack: false,
    fftSize: 2048,
    smoothingTimeConstant: 0.8,
    minDecibels: -100,
    maxDecibels: -80,
    ...options,
  };
  const audioContext = getNewAudioContext();

  if (!audioContext) {
    throw new Error('Audio Context not supported on this browser');
  }
  const streamTrack = opts.cloneTrack ? track.mediaStreamTrack.clone() : track.mediaStreamTrack;
  const mediaStreamSource = audioContext.createMediaStreamSource(new MediaStream([streamTrack]));
  const analyser = audioContext.createAnalyser();
  analyser.minDecibels = opts.minDecibels;
  analyser.maxDecibels = opts.maxDecibels;
  analyser.fftSize = opts.fftSize;
  analyser.smoothingTimeConstant = opts.smoothingTimeConstant;

  mediaStreamSource.connect(analyser);
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  /**
   * Calculates the current volume of the track in the range from 0 to 1
   */
  const calculateVolume = () => {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (const amplitude of dataArray) {
      sum += Math.pow(amplitude / 255, 2);
    }
    const volume = Math.sqrt(sum / dataArray.length);
    return volume;
  };

  const cleanup = async () => {
    await audioContext.close();
    if (opts.cloneTrack) {
      streamTrack.stop();
    }
  };

  return { calculateVolume, analyser, cleanup };
}

export function isFireFox(): boolean {
  return getBrowser()?.name === 'Firefox';
}

export function isChromiumBased(): boolean {
  return getBrowser()?.name === 'Chrome';
}

export function isSafari(): boolean {
  return getBrowser()?.name === 'Safari';
}

export function isSafari17(): boolean {
  const b = getBrowser();
  return b?.name === 'Safari' && b.version.startsWith('17.');
}

export function isMobile(): boolean {
  if (!isWeb()) return false;

  return (
    // @ts-expect-error `userAgentData` is not yet part of typescript
    navigator.userAgentData?.mobile ??
    /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent)
  );
}

export function isE2EESimulcastSupported() {
  const browser = getBrowser();
  const supportedSafariVersion = '17.2'; // see https://bugs.webkit.org/show_bug.cgi?id=257803
  if (browser) {
    if (browser.name !== 'Safari' && browser.os !== 'iOS') {
      return true;
    } else if (
      browser.os === 'iOS' &&
      browser.osVersion &&
      compareVersions(supportedSafariVersion, browser.osVersion) >= 0
    ) {
      return true;
    } else if (
      browser.name === 'Safari' &&
      compareVersions(supportedSafariVersion, browser.version) >= 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export function isWeb(): boolean {
  return typeof document !== 'undefined';
}

export function isReactNative(): boolean {
  // navigator.product is deprecated on browsers, but will be set appropriately for react-native.
  return navigator.product == 'ReactNative';
}

function getLKReactNativeInfo(): LiveKitReactNativeInfo | undefined {
  // global defined only for ReactNative.
  // @ts-ignore
  if (global && global.LiveKitReactNativeGlobal) {
    // @ts-ignore
    return global.LiveKitReactNativeGlobal as LiveKitReactNativeInfo;
  }

  return undefined;
}

export function getReactNativeOs(): string | undefined {
  if (!isReactNative()) {
    return undefined;
  }

  let info = getLKReactNativeInfo();
  if (info) {
    return info.platform;
  }

  return undefined;
}

/**
 * 
 *
 * 
 * 
 * 
 * 
 * 
 */
export function cloneDeep<T>(value: T) {
  if (typeof value === 'undefined') {
    return;
  }

  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  } else {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}

export function isLocalParticipant(p: FFCParticipant): p is FFCLocalParticipant {
  return p.isLocal;
}

export function isRemoteParticipant(p: FFCParticipant): p is FFCRemoteParticipant {
  return !p.isLocal;
}

export function isLocalTrack(track: FFCTrack | MediaStreamTrack | undefined): track is FFCLocalTrack {
  return !!track && !(track instanceof MediaStreamTrack) && track.isLocal;
}

export function isAudioTrack(
  track: FFCTrack | undefined,
): track is FFCLocalAudioTrack | FFCRemoteAudioTrack {
  return !!track && track.kind == FFCTrack.Kind.Audio;
}

export function isVideoTrack(
  track: FFCTrack | undefined,
): track is FFCLocalVideoTrack | FFCRemoteVideoTrack {
  return !!track && track.kind == FFCTrack.Kind.Video;
}

export function isLocalVideoTrack(
  track: FFCTrack | MediaStreamTrack | undefined,
): track is FFCLocalVideoTrack {
  return isLocalTrack(track) && isVideoTrack(track);
}

export function isLocalAudioTrack(
  track: FFCTrack | MediaStreamTrack | undefined,
): track is FFCLocalAudioTrack {
  return isLocalTrack(track) && isAudioTrack(track);
}

export function isRemoteTrack(track: FFCTrack | undefined): track is FFCRemoteTrack {
  return !!track && !track.isLocal;
}

export function unwrapConstraint(constraint: ConstrainDOMString): string;
export function unwrapConstraint(constraint: ConstrainULong): number;
export function unwrapConstraint(constraint: ConstrainDOMString | ConstrainULong): string | number {
  if (typeof constraint === 'string' || typeof constraint === 'number') {
    return constraint;
  }

  if (Array.isArray(constraint)) {
    return constraint[0];
  }
  if (constraint.exact) {
    if (Array.isArray(constraint.exact)) {
      return constraint.exact[0];
    }
    return constraint.exact;
  }
  if (constraint.ideal) {
    if (Array.isArray(constraint.ideal)) {
      return constraint.ideal[0];
    }
    return constraint.ideal;
  }
  throw Error('could not unwrap constraint');
}