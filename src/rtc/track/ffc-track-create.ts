import { LocalParticipant, LocalTrackPublication, RemoteParticipant, RemoteTrackPublication, type LocalAudioTrack, type LocalVideoTrack, type RemoteAudioTrack, type RemoteVideoTrack } from "livekit-client";
import { audioDefaults, videoDefaults } from "../ffc-defaults";
import FFCDeviceManager from "../ffc-device-manager";
import { FFCRtcDeviceError, FFCRtcTrackError } from "../ffc-rtc-errors";
import { isSafari17 } from "../ffc-utils";
import type FFCLocalTrack from "./ffc-track-local";
import FFCLocalAudioTrack from "./ffc-track-local-audio";
import FFCLocalVideoTrack from "./ffc-track-local-video";
import { FFCScreenSharePresets, type FFCAudioCaptureOptions, type FFCCreateLocalTracksOptions, type FFCScreenShareCaptureOptions, type FFCVideoCaptureOptions } from "./ffc-track-options";
import { constraintsForOptions, mergeDefaultOptions, screenCaptureToDisplayMediaStreamOptions } from "./ffc-track-utils";
import FFCRemoteAudioTrack from "./ffc-track-remote-audio";
import FFCRemoteVideoTrack from "./ffc-track-remote-video";
import { FFCLocalTrackPublication } from "./ffc-track-publication-local";
import { FFCRemoteTrackPublication } from "./ffc-track-publication-remote";
import FFCLocalParticipant from "../participant/ffc-participant-local";
import FFCRemoteParticipant from "../participant/ffc-participant-remote";
import { FFCTrackKind, FFCTrackSource } from "./ffc-track-types";
import type { FFCLoggerOptions } from "../../ffc-logger";

/**
 * Creates a local video and audio track at the same time. When acquiring both
 * audio and video tracks together, it'll display a single permission prompt to
 * the user instead of two separate ones.
 * @param options
 */
export async function createLocalTracks(
  options?: FFCCreateLocalTracksOptions,
): Promise<Array<FFCLocalTrack>> {
  // set default options to true
  options ??= {};
  options.audio ??= { deviceId: 'default' };
  options.video ??= { deviceId: 'default' };

  //const { audioProcessor, videoProcessor } = extractProcessorsFromOptions(options);
  const opts = mergeDefaultOptions(options, audioDefaults, videoDefaults);
  const constraints = constraintsForOptions(opts);

  // Keep a reference to the promise on FFCDeviceManager and await it in getLocalDevices()
  // works around iOS Safari Bug https://bugs.webkit.org/show_bug.cgi?id=179363
  const mediaPromise = navigator.mediaDevices.getUserMedia(constraints);

  if (options.audio) {
    FFCDeviceManager.userMediaPromiseMap.set('audioinput', mediaPromise);
    mediaPromise.catch(() => FFCDeviceManager.userMediaPromiseMap.delete('audioinput'));
  }
  if (options.video) {
    FFCDeviceManager.userMediaPromiseMap.set('videoinput', mediaPromise);
    mediaPromise.catch(() => FFCDeviceManager.userMediaPromiseMap.delete('videoinput'));
  }

  const stream = await mediaPromise;
  return Promise.all(
    stream.getTracks().map(async (mediaStreamTrack) => {
      const isAudio = mediaStreamTrack.kind === 'audio';
      let trackOptions = isAudio ? opts!.audio : opts!.video;
      if (typeof trackOptions === 'boolean' || !trackOptions) {
        trackOptions = {};
      }
      let trackConstraints: MediaTrackConstraints | undefined;
      const conOrBool = isAudio ? constraints.audio : constraints.video;
      if (typeof conOrBool !== 'boolean') {
        trackConstraints = conOrBool;
      }

      // update the constraints with the device id the user gave permissions to in the permission prompt
      // otherwise each track restart (e.g. mute - unmute) will try to initialize the device again -> causing additional permission prompts
      if (trackConstraints) {
        trackConstraints.deviceId = mediaStreamTrack.getSettings().deviceId;
      } else {
        trackConstraints = { deviceId: mediaStreamTrack.getSettings().deviceId };
      }

      const track = mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints);
      if (track.kind === FFCTrackKind.VIDEO) {
        track.source = FFCTrackSource.CAMERA;
      } else if (track.kind === FFCTrackKind.AUDIO) {
        track.source = FFCTrackSource.MICROPHONE;
      }
      track.mediaStream = stream;
      /*
      if (track instanceof FFCLocalAudioTrack && audioProcessor) {
        await track.setProcessor(audioProcessor);
      } else if (track instanceof FFCLocalVideoTrack && videoProcessor) {
        await track.setProcessor(videoProcessor);
      }
      */

      return track;
    }),
  );
}

/**
 * Creates a [[FFCLocalVideoTrack]] with getUserMedia()
 * @param options
 */
export async function createLocalVideoTrack(
  options?: FFCVideoCaptureOptions,
): Promise<FFCLocalVideoTrack> {
  const tracks = await createLocalTracks({
    audio: false,
    video: options,
  });
  return <FFCLocalVideoTrack>tracks[0];
}

export async function createLocalAudioTrack(
  options?: FFCAudioCaptureOptions,
): Promise<FFCLocalAudioTrack> {
  const tracks = await createLocalTracks({
    audio: options,
    video: false,
  });
  return <FFCLocalAudioTrack>tracks[0];
}

/**
 * Creates a screen capture tracks with getDisplayMedia().
 * A FFCLocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a FFCLocalAudioTrack is also created.
 */
export async function createLocalScreenTracks(
  options?: FFCScreenShareCaptureOptions,
): Promise<Array<FFCLocalTrack>> {
  if (options === undefined) {
    options = {};
  }
  if (options.resolution === undefined && !isSafari17()) {
    options.resolution = FFCScreenSharePresets.h1080fps30.resolution;
  }

  if (navigator.mediaDevices.getDisplayMedia === undefined) {
    throw new FFCRtcDeviceError('getDisplayMedia not supported');
  }

  const constraints = screenCaptureToDisplayMediaStreamOptions(options);
  const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);

  const tracks = stream.getVideoTracks();
  if (tracks.length === 0) {
    throw new FFCRtcTrackError('no video track found');
  }
  const screenVideo = new FFCLocalVideoTrack(tracks[0], undefined, false);
  screenVideo.source = FFCTrackSource.SCREEN_SHARE;
  const localTracks: Array<FFCLocalTrack> = [screenVideo];
  if (stream.getAudioTracks().length > 0) {
    const screenAudio = new FFCLocalAudioTrack(stream.getAudioTracks()[0], undefined, false);
    screenAudio.source = FFCTrackSource.SCREEN_SHARE_AUDIO;
    localTracks.push(screenAudio);
  }
  return localTracks;
}

/** @internal */
export function mediaTrackToLocalTrack(
  mediaStreamTrack: MediaStreamTrack,
  constraints?: MediaTrackConstraints,
  loggerOptions?: FFCLoggerOptions,
): FFCLocalVideoTrack | FFCLocalAudioTrack {
  switch (mediaStreamTrack.kind) {
    case 'audio':
      return new FFCLocalAudioTrack(mediaStreamTrack, constraints, false, undefined, loggerOptions);
    case 'video':
      return new FFCLocalVideoTrack(mediaStreamTrack, constraints, false, loggerOptions);
    default:
      throw new FFCRtcTrackError(`unsupported track type: ${mediaStreamTrack.kind}`);
  }
}

/* @internal */
export function createFFCLocalAudioTrackWith(track: LocalAudioTrack): FFCLocalAudioTrack {
  return new FFCLocalAudioTrack(track);
}

/* @internal */
export function createFFCLocalVideoTrackWith(track: LocalVideoTrack): FFCLocalVideoTrack {
  return new FFCLocalVideoTrack(track);
}

/* @internal */
export function createFFCRemoteAudioTrackWith(track: RemoteAudioTrack): FFCRemoteAudioTrack {
  return new FFCRemoteAudioTrack(track);
}

/* @internal */
export function createFFCRemoteVideoTrackWith(track: RemoteVideoTrack): FFCRemoteVideoTrack {
  return new FFCRemoteVideoTrack(track);
}

/* @internal */
export function createFFCLocalTrackPublicationWith(publication: LocalTrackPublication): FFCLocalTrackPublication {
  return new FFCLocalTrackPublication(publication);
}

/* @internal */
export function createFFCRemoteTrackPublicationWith(publication: RemoteTrackPublication): FFCRemoteTrackPublication {
  return new FFCRemoteTrackPublication(publication);
}

/* @internal */
export function createFFCLocalParticipantWith(participant: LocalParticipant): FFCLocalParticipant {
  return new FFCLocalParticipant(participant);
}

/* @internal */
export function createFFCRemoteParticipantWith(participant: RemoteParticipant): FFCRemoteParticipant {
  return new FFCRemoteParticipant(participant);
}