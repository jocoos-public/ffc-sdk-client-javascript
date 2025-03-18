import type { RemoteAudioTrack } from "livekit-client";
import type { IFFCRemoteAudioTrack } from "./interfaces";
import FFCRemoteTrack from "./track-remote";
import type { FFCAudioReceiverStats } from "../stats";
import type { FFCTrack } from "./track";

/**
 * The `FFCRemoteAudioTrack` class represents a remote audio track in the FlipFlopCloud SDK.
 * It extends the `FFCRemoteTrack` class and provides additional functionality specific to remote audio tracks.
 */
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

  /**
   * Sets the volume for the audio track.
   * 
   * @param volume - The volume level to set (0.0 to 1.0).
   */
  setVolume(volume: number): void {
    this._track.setVolume(volume);
  }

  /**
   * Gets the current volume level of the audio track.
   * 
   * @returns The volume level as a number (0.0 to 1.0).
   */
  getVolume(): number {
    return this._track.getVolume();
  }

  /**
   * Sets the sink device for the audio track.
   * 
   * @param deviceId - The ID of the audio output device to use.
   * @returns A promise that resolves when the sink device is set.
   */
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

  /**
   * Sets the audio context for the audio track.
   * 
   * @param audioContext - The `AudioContext` instance to set, or `undefined` to clear it.
   */
  setAudioContext(audioContext: AudioContext | undefined): void {
    return this._track.setAudioContext(audioContext);
  }

  /**
   * Sets the Web Audio API plugins for the audio track.
   * 
   * @param nodes - An array of `AudioNode` instances to set as plugins.
   */
  setWebAudioPlugins(nodes: AudioNode[]): void {
    return this._track.setWebAudioPlugins(nodes);
  }

  /**
   * Retrieves the receiver statistics for the audio track.
   * 
   * @returns A promise that resolves to the receiver statistics as `FFCAudioReceiverStats`, or `undefined` if not available.
   */
  getReceiverStats(): Promise<FFCAudioReceiverStats | undefined> {
    return this._track.getReceiverStats();
  }
}