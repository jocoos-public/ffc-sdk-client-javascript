import { LocalVideoTrack } from "livekit-client";
import type { IFFCLocalVideoTrack } from "./interfaces";
import { FFCLocalTrack } from "./track-local";
import type { FFCVideoSenderStats } from "../stats";
import { FFCVideoCaptureOptions, type FFCVideoCodec } from "./options";
import { FFCVideoTrackProcessor } from "./processor/types";
import type { FFCTrack } from "./track";
import type { FFCLoggerOptions } from "../types";
import { FFCVideoQuality } from "./types";

export interface FFCSimulcastTrackInfo {
  codec: FFCVideoCodec;
  mediaStreamTrack: MediaStreamTrack;
  sender?: RTCRtpSender;
  encodings?: Array<RTCRtpEncodingParameters>;
}

export default class FFCLocalVideoTrack extends FFCLocalTrack<FFCTrack.Kind.Video> implements IFFCLocalVideoTrack {
  protected _track: LocalVideoTrack;

  /** @internal */
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

  /** @internal */
  get instance(): LocalVideoTrack {
    return this._track;
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

  pauseUpstream(): Promise<void> {
    return this._track.pauseUpstream();
  }

  resumeUpstream(): Promise<void> {
    return this._track.resumeUpstream();
  }

  async mute(): Promise<typeof this> {
    await this._track.mute();
    return this;
  }

  async unmute(): Promise<typeof this> {
    await this._track.unmute();
    return this;
  }

  getSenderStats(): Promise<Array<FFCVideoSenderStats>> {
    return this._track.getSenderStats();
  }

  setPublishingQuality(maxQuality: FFCVideoQuality): void {
    this._track.setPublishingQuality(FFCVideoQuality.toVideoQuality(maxQuality));
  }

  restartTrack(options?: FFCVideoCaptureOptions): Promise<void> {
    return this._track.restartTrack(options
      ? FFCVideoCaptureOptions.toVideoCaptureOptions(options)
      : undefined
    );
  }
  
  setProcessor(processor: FFCVideoTrackProcessor, showProcessedStreamLocally: boolean = true): Promise<void> {
    return this._track.setProcessor(FFCVideoTrackProcessor.toTrackProcessor(processor), showProcessedStreamLocally);
  }
  

  setDegradationPreference(pref: RTCDegradationPreference): Promise<void> {
    return this._track.setDegradationPreference(pref);
  }

  addSimulcastTrack(codec: FFCVideoCodec, encodings?: Array<RTCRtpEncodingParameters>): FFCSimulcastTrackInfo | undefined {
    return this._track.addSimulcastTrack(codec, encodings);
  }

  setSimulcastTrackSender(codec: FFCVideoCodec, sender: RTCRtpSender): void {
    this._track.setSimulcastTrackSender(codec, sender);
  }
}