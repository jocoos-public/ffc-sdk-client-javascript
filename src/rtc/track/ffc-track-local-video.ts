import { LocalVideoTrack, type VideoCodec } from "livekit-client";
import { FFCTrack, FFCVideoQuality, toVideoQuality } from "./ffc-track";
import FFCLocalTrack from "./ffc-track-local";
import { type FFCVideoCaptureOptions, FFCVideoCodec, toFFCVideoCodec, toVideoCaptureOptions, toVideoCodec } from "./ffc-track-options";

import { type FFCVideoSenderStats } from "../ffc-stats";
import type { FFCLoggerOptions } from "../ffc-options";

export interface SimulcastTrackInfo {
  codec: VideoCodec;
  mediaStreamTrack: MediaStreamTrack;
  sender?: RTCRtpSender;
  encodings?: RTCRtpEncodingParameters[];
}

export interface FFCSimulcastTrackInfo {
  codec: FFCVideoCodec;
  mediaStreamTrack: MediaStreamTrack;
  sender?: RTCRtpSender;
  encodings?: RTCRtpEncodingParameters[];
}


/* @internal */
export function toFFCSimulcastTrackInfo(): undefined;
/* @internal */
export function toFFCSimulcastTrackInfo(info: SimulcastTrackInfo): FFCSimulcastTrackInfo;
/* @internal */
export function toFFCSimulcastTrackInfo(info?: SimulcastTrackInfo): FFCSimulcastTrackInfo  | undefined {
  if (!info) {
    return;
  }
  return {
    codec: toFFCVideoCodec(info.codec),
    mediaStreamTrack: info.mediaStreamTrack,
    sender: info.sender,
    encodings: info.encodings,
  };
}

export default class FFCLocalVideoTrack extends FFCLocalTrack<FFCTrack.Kind.VIDEO> {
  protected _track: LocalVideoTrack;

  constructor(track: LocalVideoTrack);
  constructor(mediaTrack: MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack?: boolean, loggerOptions?: FFCLoggerOptions);
  constructor(trackOrMediaTrack: LocalVideoTrack | MediaStreamTrack, constraints?: MediaTrackConstraints, userProvidedTrack = true, loggerOptions?: FFCLoggerOptions) {
    let track: LocalVideoTrack;
    if (trackOrMediaTrack instanceof LocalVideoTrack) {
      track = trackOrMediaTrack;
    } else {
      track = new LocalVideoTrack(trackOrMediaTrack, constraints, userProvidedTrack, loggerOptions);
    }
    super(track);
    this._track = track;
  }

  get sender(): RTCRtpSender | undefined {
    return this._track.sender;
  }

  set sender(sender: RTCRtpSender | undefined) {
    this._track.sender = sender;
  }

  get isSimulcast(): boolean {
    return this._track.isSimulcast;
  }

  stop(): void {
    this._track.stop();
  }

  async pauseUpstream(): Promise<void> {
    return this._track.pauseUpstream();
  }

  async resumeUpstream(): Promise<void> {
    return this._track.resumeUpstream();
  }

  async mute(): Promise<typeof this> {
    this._track.mute();
    return this;
  }

  async unmute(): Promise<typeof this> {
    this._track.unmute();
    return this;
  }

  async getSenderStats(): Promise<Array<FFCVideoSenderStats>> {
    return this._track.getSenderStats(); // TODO: wrap to FFCVideoSenderStats
  }

  setPublishingQuality(quality: FFCVideoQuality): void {
    this._track.setPublishingQuality(toVideoQuality(quality));
  }

  async restartTrack(opts?: FFCVideoCaptureOptions): Promise<void> {
    return this._track.restartTrack(toVideoCaptureOptions(opts));
  }

  async setDegradationPreference(preference: RTCDegradationPreference): Promise<void> {
    return this._track.setDegradationPreference(preference);
  }

  addSimulcastTrack(codec: FFCVideoCodec, encodings?: Array<RTCRtpEncodingParameters>): FFCSimulcastTrackInfo | undefined {
    const simulcastTrackInfo = this._track.addSimulcastTrack(toVideoCodec(codec), encodings);
    if (simulcastTrackInfo) {
      return toFFCSimulcastTrackInfo(simulcastTrackInfo);
    }
  }

  setSimulcastTrackSender(codec: FFCVideoCodec, sender: RTCRtpSender): void {
    return this._track.setSimulcastTrackSender(toVideoCodec(codec), sender);
  }

  
}
