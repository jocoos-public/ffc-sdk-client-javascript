import type { RemoteVideoTrack } from "livekit-client";
import type { IFFCRemoteVideoTrack } from "./interfaces";
import FFCRemoteTrack from "./track-remote";
import type { FFCElementInfo } from "./types";
import type { FFCVideoReceiverStats } from "../stats";
import type { FFCTrack } from "./track";

export default class FFCRemoteVideoTrack extends FFCRemoteTrack<FFCTrack.Kind.Video> implements IFFCRemoteVideoTrack {
  protected _track: RemoteVideoTrack;

  /** @internal */
  constructor(track: RemoteVideoTrack) {
    super(track);
    this._track = track;
  }

  /** @internal */
  get instance(): RemoteVideoTrack {
    return this._track;
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
    if (element === undefined) {
      return this._track.attach();
    }
    return this._track.attach(element);
  }

  observeElementInfo(elementInfo: FFCElementInfo): void {
    this._track.observeElementInfo(elementInfo);
  }

  stopObservingElementInfo(elementInfo: FFCElementInfo): void {
    this._track.stopObservingElementInfo(elementInfo);
  }

  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
    if (element === undefined) {
      return this._track.detach();
    }
    return this._track.detach(element);
  }

  getReceiverStats(): Promise<FFCVideoReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}