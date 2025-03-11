import { FFCDeviceUnsupportedError, FFCTrackInvalidError } from '../../errors';
import { AUDIO_DEFAULTS, VIDEO_DEFAULTS } from '../defaults';
import FFCDeviceManager from '../device-manager';
import { mediaTrackToLocalTrack } from '../participant/utils';
import { isAudioTrack, isSafari17, isVideoTrack, unwrapConstraint } from '../utils';
import {
  FFCScreenSharePresets,
  type FFCAudioCaptureOptions,
  type FFCCreateLocalTracksOptions,
  type FFCScreenShareCaptureOptions,
  type FFCVideoCaptureOptions,

} from './options';
import { FFCTrack } from './track';

import type { FFCLocalTrack } from './track-local';
import FFCLocalAudioTrack from './track-local-audio';
import FFCLocalVideoTrack from './track-local-video';
import { constraintsForOptions, extractProcessorsFromOptions, mergeDefaultOptions, screenCaptureToDisplayMediaStreamOptions } from './utils';

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

  const { audioProcessor, videoProcessor } = extractProcessorsFromOptions(options);
  const opts = mergeDefaultOptions(options, AUDIO_DEFAULTS, VIDEO_DEFAULTS);
  const constraints = constraintsForOptions(opts);

  // Keep a reference to the promise on DeviceManager and await it in getLocalDevices()
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
      const newDeviceId = mediaStreamTrack.getSettings().deviceId;
      if (
        trackConstraints?.deviceId &&
        unwrapConstraint(trackConstraints.deviceId) !== newDeviceId
      ) {
        trackConstraints.deviceId = newDeviceId;
      } else if (!trackConstraints) {
        trackConstraints = { deviceId: newDeviceId };
      }

      const track = mediaTrackToLocalTrack(mediaStreamTrack, trackConstraints);
      if (track.kind === FFCTrack.Kind.Video) {
        track.source = FFCTrack.Source.Camera;
      } else if (track.kind === FFCTrack.Kind.Audio) {
        track.source = FFCTrack.Source.Microphone;
      }
      track.mediaStream = stream;

      if (isAudioTrack(track) && audioProcessor) {
        await track.setProcessor(audioProcessor);
      } else if (isVideoTrack(track) && videoProcessor) {
        await track.setProcessor(videoProcessor);
      }

      return track;
    }),
  );
}

/**
 * Creates a [[LocalVideoTrack]] with getUserMedia()
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
 * A LocalVideoTrack is always created and returned.
 * If { audio: true }, and the browser supports audio capture, a LocalAudioTrack is also created.
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
    throw new FFCDeviceUnsupportedError('getDisplayMedia not supported');
  }

  const constraints = screenCaptureToDisplayMediaStreamOptions(options);
  const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);

  const tracks = stream.getVideoTracks();
  if (tracks.length === 0) {
    throw new FFCTrackInvalidError('no video track found');
  }
  const screenVideo = new FFCLocalVideoTrack(tracks[0], undefined, false);
  screenVideo.source = FFCTrack.Source.ScreenShare;
  const localTracks: Array<FFCLocalTrack> = [screenVideo];
  if (stream.getAudioTracks().length > 0) {
    const screenAudio = new FFCLocalAudioTrack(stream.getAudioTracks()[0], undefined, false);
    screenAudio.source = FFCTrack.Source.ScreenShareAudio;
    localTracks.push(screenAudio);
  }
  return localTracks;
}
