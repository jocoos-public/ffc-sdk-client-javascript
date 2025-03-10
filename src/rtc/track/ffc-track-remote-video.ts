import { type ElementInfo, RemoteVideoTrack } from "livekit-client";
import FFCRemoteTrack from "./ffc-track-remote";
import { type FFCVideoReceiverStats } from "../ffc-stats";
import type { FFCTrackKind } from "./ffc-track-types";

export default class FFCRemoteVideoTrack extends FFCRemoteTrack<FFCTrackKind.VIDEO> {
  protected _track: RemoteVideoTrack;
  
  constructor(track: RemoteVideoTrack) {
    super(track);
    this._track = track;
  }

  get isAdaptiveStream(): boolean {
    return this._track.isAdaptiveStream;
  }

  get mediaStreamTrack(): MediaStreamTrack {
    return this._track.mediaStreamTrack;
  }

  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement {
    if (element) {
      return this._track.attach(element);
    } else {
      return this._track.attach();
    }
  }

  observeElementInfo(info: FFCElementInfo): void {
    this._track.observeElementInfo(info);
  }

  stopObservingElementInfo(info: FFCElementInfo): void {
    this._track.stopObservingElementInfo(info);
  }

  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
    if (element) {
      return this._track.detach(element);
    }
    return this._track.detach();
  }

  async getReceiverStats(): Promise<FFCVideoReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}

export interface FFCElementInfo extends ElementInfo {}