import type { RemoteVideoTrack } from "livekit-client";
import type { IFFCRemoteVideoTrack } from "./interfaces";
import FFCRemoteTrack from "./track-remote";
import type { FFCElementInfo } from "./types";
import type { FFCVideoReceiverStats } from "../stats";
import type { FFCTrack } from "./track";

/**
 * The `FFCRemoteVideoTrack` class represents a remote video track in the FlipFlopCloud SDK.
 * It extends the `FFCRemoteTrack` class and provides additional functionality specific to remote video tracks.
 */
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

  /**
   * Indicates whether adaptive streaming is enabled for the video track.
   * 
   * @returns `true` if adaptive streaming is enabled, otherwise `false`.
   */
  get isAdaptiveStream(): boolean {
    return this._track.isAdaptiveStream;
  }

  /**
   * Gets the `MediaStreamTrack` associated with the video track.
   * 
   * @returns The `MediaStreamTrack` instance.
   */
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

  /**
   * Observes the specified element information for the video track.
   * 
   * @param elementInfo - The element information to observe as `FFCElementInfo`.
   */
  observeElementInfo(elementInfo: FFCElementInfo): void {
    this._track.observeElementInfo(elementInfo);
  }

  /**
   * Stops observing the specified element information for the video track.
   * 
   * @param elementInfo - The element information to stop observing as `FFCElementInfo`.
   */
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

  /**
   * Retrieves the receiver statistics for the video track.
   * 
   * @returns A promise that resolves to the receiver statistics as `FFCVideoReceiverStats`, or `undefined` if not available.
   */
  getReceiverStats(): Promise<FFCVideoReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}