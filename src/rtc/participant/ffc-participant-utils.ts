import type { FFCLoggerOptions } from "../ffc-options";
import { FFCRtcTrackError } from "../ffc-rtc-errors";
import FFCLocalAudioTrack from "../track/ffc-track-local-audio";
import FFCLocalVideoTrack from "../track/ffc-track-local-video";

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