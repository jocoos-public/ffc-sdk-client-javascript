import type { RemoteParticipant } from "livekit-client";
import type { IFFCRemoteParticipant } from "./interfaces";
import FFCParticipant from "./participant";
import { wrapTrackPublication } from "../wrapper-track-publication";
import type FFCRemoteTrackPublication from "../track/track-publication-remote";
import { FFCTrack } from "../track/track";

/**
 * The `FFCRemoteParticipant` class represents a remote participant in the FlipFlopCloud SDK.
 * It extends the `FFCParticipant` class and provides additional functionality specific to remote participants.
 */
export default class FFCRemoteParticipant extends FFCParticipant implements IFFCRemoteParticipant {
    protected _participant: RemoteParticipant;

  /** @internal */
  constructor(participant: RemoteParticipant) {
    super(participant);
    this._participant = participant;
  }

  /** @internal */
  get instance(): RemoteParticipant {
    return this._participant;
  }

  /**
   * Gets the audio track publications associated with the remote participant.
   * 
   * @returns A map of track SIDs to {@link FFCRemoteTrackPublication} instances for audio tracks.
   */
  get audioTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets the video track publications associated with the remote participant.
   * 
   * @returns A map of track SIDs to {@link FFCRemoteTrackPublication} instances for video tracks.
   */
  get videoTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets all track publications associated with the remote participant.
   * 
   * @returns A map of track SIDs to {@link FFCRemoteTrackPublication} instances.
   */
  get trackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.trackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets a track publication by its source.
   * 
   * @param source - The source of the track as `FFCTrack.Source`.
   * @returns The track publication as an {@link FFCRemoteTrackPublication} instance, or `undefined` if not found.
   */
  getTrackPublication(source: FFCTrack.Source): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(FFCTrack.toTrackSource(source));
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  /**
   * Gets a track publication by its name.
   * 
   * @param name - The name of the track.
   * @returns The track publication as an {@link FFCRemoteTrackPublication} instance, or `undefined` if not found.
   */
  getTrackPublicationByName(name: string): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  /**
   * Sets the volume for a specific track source.
   * 
   * @param volume - The volume level to set (0.0 to 1.0).
   * @param source - The source of the track (e.g., microphone, screen share audio). Defaults to `FFCTrack.Source.Microphone`.
   */
  setVolume(volume: number, source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio = FFCTrack.Source.Microphone): void {
    this._participant.setVolume(volume, FFCTrack.toTrackSource(source));
  }

  /**
   * Gets the volume level for a specific track source.
   * 
   * @param source - The source of the track (e.g., microphone, screen share audio). Defaults to `FFCTrack.Source.Microphone`.
   * @returns The volume level as a number (0.0 to 1.0), or `undefined` if not available.
   */
  getVolume(source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio = FFCTrack.Source.Microphone): number | undefined {
    return this._participant.getVolume(FFCTrack.toTrackSource(source));
  }
}