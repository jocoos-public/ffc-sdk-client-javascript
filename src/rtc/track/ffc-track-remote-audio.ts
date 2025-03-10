import { RemoteAudioTrack } from "livekit-client";
import { type FFCAudioReceiverStats } from "../ffc-stats";
import FFCRemoteTrack from "./ffc-track-remote";
import type { FFCTrackKind } from "./ffc-track-types";

export default class FFCRemoteAudioTrack extends FFCRemoteTrack<FFCTrackKind.AUDIO> {
  protected _track: RemoteAudioTrack;

  constructor(track: RemoteAudioTrack) {
    super(track);
    this._track = track;
  }

  setVolume(volume: number): void {
    this._track.setVolume(volume);
  }

  getVolume(): number {
    return this._track.getVolume();
  }

  async setSinkId(deviceId: string): Promise<void> {
    return this._track.setSinkId(deviceId);
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

  detach(): HTMLMediaElement[];
  detach(element: HTMLMediaElement): HTMLMediaElement;
  detach(element?: HTMLMediaElement): HTMLMediaElement | HTMLMediaElement[] {
    if (element) {
      return this._track.detach(element);
    }
    return this._track.detach();
  }

  async getReceiverStats(): Promise<FFCAudioReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}