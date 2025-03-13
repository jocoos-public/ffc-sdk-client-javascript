import type { RemoteAudioTrack } from "livekit-client";
import type { IFFCRemoteAudioTrack } from "./interfaces";
import FFCRemoteTrack from "./track-remote";
import type { FFCAudioReceiverStats } from "../stats";
import type { FFCTrack } from "./track";

export default class FFCRemoteAudioTrack extends FFCRemoteTrack<FFCTrack.Kind.Audio> implements IFFCRemoteAudioTrack {
  protected _track: RemoteAudioTrack;

  /** @internal */
  constructor(track: RemoteAudioTrack) {
    super(track);
    this._track = track;
  }

  /** @internal */
  get instance(): RemoteAudioTrack {
    return this._track;
  }

  setVolume(volume: number): void {
    this._track.setVolume(volume);
  }

  getVolume(): number {
    return this._track.getVolume();
  }

  setSinkId(deviceId: string): Promise<void> {
    return this._track.setSinkId(deviceId);
  }

  attach(): HTMLMediaElement;
  attach(element: HTMLMediaElement): HTMLMediaElement;
  attach(element?: HTMLMediaElement): HTMLMediaElement {
    if (element === undefined) {
      return this._track.attach();
    }
    return this._track.attach(element);
  }

  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
    if (element === undefined) {
      return this._track.detach();
    }
    return this._track.detach(element);
  }

  setAudioContext(audioContext: AudioContext | undefined): void {
    return this._track.setAudioContext(audioContext);
  }

  setWebAudioPlugins(nodes: AudioNode[]): void {
    return this._track.setWebAudioPlugins(nodes);
  }

  getReceiverStats(): Promise<FFCAudioReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}