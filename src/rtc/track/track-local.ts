import type { LocalTrack } from "livekit-client";
import type { IFFCLocalTrack } from "./interfaces";
import type { FFCReplaceTrackOptions } from "./types";
import { FFCTrackProcessor } from "./processor/types";
import { FFCTrack } from "./track";
import type { FFCVideoCodec } from "./options";

export class FFCLocalTrack<TrackKind extends FFCTrack.Kind = FFCTrack.Kind> extends FFCTrack<TrackKind> implements IFFCLocalTrack<TrackKind> {
  protected _track: LocalTrack;

  /** @internal */
  constructor(track: LocalTrack) {
    super(track);
    this._track = track;
  }
  
  /** @internal */
  get instance(): LocalTrack {
    return this._track;
  }

  get codec(): FFCVideoCodec | undefined {
    return this._track.codec;
  }

  get constraints(): MediaTrackConstraints {
    return this._track.constraints;
  }

  get id(): string {
    return this._track.id;
  }

  set source(source: FFCTrack.Source) {
    this._track.source = FFCTrack.toTrackSource(source);
  }

  set mediaStream(mediaStream: MediaStream | undefined) {
    this._track.mediaStream = mediaStream;
  }

  get dimensions(): FFCTrack.Dimensions | undefined {
    return this._track.dimensions;
  }

  get isUpstreamPaused(): boolean {
    return this._track.isUpstreamPaused;
  }

  get isUserProvided(): boolean {
    return this._track.isUserProvided;
  }

  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  get isLocal(): boolean {
    return true;
  }

  getSourceTrackSettings(): MediaTrackSettings {
    return this._track.getSourceTrackSettings();
  }

  waitForDimensions(timeoutMs = 1000): Promise<FFCTrack.Dimensions> {
    return this._track.waitForDimensions(timeoutMs);
  }

  setDeviceId(deviceId: ConstrainDOMString): Promise<boolean> {
    return this._track.setDeviceId(deviceId);
  }

  restartTrack(constraints?: unknown): Promise<void> {
    return this._track.restartTrack(constraints);
  }

  getDeviceId(noramlize: boolean): Promise<string | undefined> {
    return this._track.getDeviceId(noramlize);
  }

  async mute(): Promise<FFCLocalTrack<TrackKind>> {
    await this._track.mute();
    return this;
  }

  async unmute(): Promise<FFCLocalTrack<TrackKind>> {
    await this._track.unmute();
    return this;
  }

  async replaceTrack(track: MediaStreamTrack, options?: FFCReplaceTrackOptions): Promise<FFCLocalTrack<TrackKind>>;
  async replaceTrack(track: MediaStreamTrack, userProvidedTrack?: boolean): Promise<FFCLocalTrack<TrackKind>>;
  async replaceTrack(track: MediaStreamTrack, userProvidedOrOptions: boolean | FFCReplaceTrackOptions | undefined): Promise<FFCLocalTrack<TrackKind>> {
    if (userProvidedOrOptions === undefined) {
      await this._track.replaceTrack(track);
    } if (typeof userProvidedOrOptions === "boolean") {
      await this._track.replaceTrack(track, userProvidedOrOptions);
    } else {
      await this._track.replaceTrack(track, userProvidedOrOptions);
    }
    return this;
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

  getRTCStatsReport(): Promise<RTCStatsReport | undefined> {
    return this._track.getRTCStatsReport();
  }
  
  setProcessor(processor: FFCTrackProcessor<FFCTrack.Kind>, showProcessedStreamLocally: boolean): Promise<void> {
    return this._track.setProcessor(FFCTrackProcessor.toTrackProcessor(processor), showProcessedStreamLocally);
  }

  getProcessor(): FFCTrackProcessor<FFCTrack.Kind> | undefined {
    const trackProcessor = this._track.getProcessor();
    if (trackProcessor) {
      return FFCTrackProcessor.fromTrackProcessor(trackProcessor);
    }
  }

  stopProcessor(): Promise<void> {
    return this._track.stopProcessor();
  }
}
