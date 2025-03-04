import { getBrowser, type AudioAnalyserOptions } from "livekit-client";
import FFCParticipant from "./participant/ffc-participant";
import FFCLocalParticipant from "./participant/ffc-participant-local";
import FFCRemoteParticipant from "./participant/ffc-participant-remote";
import FFCLocalAudioTrack from "./track/ffc-track-local-audio";
import FFCRemoteAudioTrack from "./track/ffc-track-remote-audio";
import FFCCriticalTimers from "./ffc-timers";

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

export async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => FFCCriticalTimers.setTimeout(resolve, duration));
}

export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.');
  const parts2 = v2.split('.');
  const k = Math.min(parts1.length, parts2.length);
  for (let i = 0; i < k; ++i) {
    const p1 = parseInt(parts1[i], 10);
    const p2 = parseInt(parts2[i], 10);
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
    if (i === k - 1 && p1 === p2) return 0;
  }
  if (v1 === '' && v2 !== '') {
    return -1;
  } else if (v2 === '') {
    return 1;
  }
  return parts1.length == parts2.length ? 0 : parts1.length < parts2.length ? -1 : 1;
}

/** @internal */
export function supportsTransceiver() {
  return 'addTransceiver' in RTCPeerConnection.prototype;
}

/** @internal */
export function supportsAddTrack() {
  return 'addTrack' in RTCPeerConnection.prototype;
}

export function supportsAdaptiveStream() {
  return typeof ResizeObserver !== undefined && typeof IntersectionObserver !== undefined;
}

export function supportsDynacast() {
  return supportsTransceiver();
}

export function supportsAV1(): boolean {
  if (!('getCapabilities' in RTCRtpSender)) {
    return false;
  }
  if (isSafari()) {
    // Safari 17 on iPhone14 reports AV1 capability, but does not actually support it
    return false;
  }
  const capabilities = RTCRtpSender.getCapabilities('video');
  let hasAV1 = false;
  if (capabilities) {
    for (const codec of capabilities.codecs) {
      if (codec.mimeType === 'video/AV1') {
        hasAV1 = true;
        break;
      }
    }
  }
  return hasAV1;
}

export function supportsVP9(): boolean {
  if (!('getCapabilities' in RTCRtpSender)) {
    return false;
  }
  if (isFireFox()) {
    // technically speaking FireFox supports VP9, but SVC publishing is broken
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1633876
    return false;
  }
  if (isSafari()) {
    const browser = getBrowser();
    if (browser?.version && compareVersions(browser.version, '16') < 0) {
      // Safari 16 and below does not support VP9
      return false;
    }
  }
  const capabilities = RTCRtpSender.getCapabilities('video');
  let hasVP9 = false;
  if (capabilities) {
    for (const codec of capabilities.codecs) {
      if (codec.mimeType === 'video/VP9') {
        hasVP9 = true;
        break;
      }
    }
  }
  return hasVP9;
}

export function isSVCCodec(codec?: string): boolean {
  return codec === 'av1' || codec === 'vp9';
}

export function supportsSetSinkId(elm?: HTMLMediaElement): boolean {
  if (!document) {
    return false;
  }
  if (!elm) {
    elm = document.createElement('audio');
  }
  return 'setSinkId' in elm;
}

export function isWeb(): boolean {
  return typeof document !== 'undefined';
}

export function isBrowserSupported() {
  if (typeof RTCPeerConnection === 'undefined') {
    return false;
  }
  return supportsTransceiver() || supportsAddTrack();
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

export function isLocalParticipant(p: FFCParticipant): p is FFCLocalParticipant {
  return p.isLocal;
}

export function isRemoteParticipant(p: FFCParticipant): p is FFCRemoteParticipant {
  return !p.isLocal;
}


export type FFCAudioAnalyserOptions = AudioAnalyserOptions;

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