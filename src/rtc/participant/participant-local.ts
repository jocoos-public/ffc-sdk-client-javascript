import type { LocalParticipant, LocalTrack, LocalTrackPublication } from "livekit-client";
import type { IFFCLocalParticipant } from "./interfaces";
import FFCParticipant from "./participant";
import type FFCLocalTrackPublication from "../track/track-publication-local";
import { wrapTrackPublication } from "../wrapper-track-publication";
import { FFCTrack } from "../track/track";
import { FFCAudioCaptureOptions, FFCCreateLocalTracksOptions, FFCScreenShareCaptureOptions, FFCTrackPublishOptions, FFCVideoCaptureOptions } from "../track/options";
import { FFCLocalTrack } from "../track/track-local";
import { wrapTrack } from "../wrapper-track";
import type { FFCParticipantTrackPermission } from "./types";

/**
 * The `FFCLocalParticipant` class represents a local participant in the FlipFlopCloud SDK.
 * It extends the `FFCParticipant` class and provides additional functionality specific to local participants.
 */
export default class FFCLocalParticipant extends FFCParticipant implements IFFCLocalParticipant {
  protected _participant: LocalParticipant;

  /** @internal */
  constructor(participant: LocalParticipant) {
    super(participant);
    this._participant = participant;
  }

  /** @internal */
  get instance(): LocalParticipant {
    return this._participant;
  }

  /**
   * Gets the audio track publications associated with the local participant.
   * 
   * @returns A map of track SIDs to {@link FFCLocalTrackPublication} instances for audio tracks.
   */
  get audioTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets the video track publications associated with the local participant.
   * 
   * @returns A map of track SIDs to {@link FFCLocalTrackPublication} instances for video tracks.
   */
  get videoTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets all track publications associated with the local participant.
   * 
   * @returns A map of track SIDs to {@link FFCLocalTrackPublication} instances.
   */
  get trackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  /**
   * Gets the last error encountered while accessing the camera.
   * 
   * @returns An `Error` instance, or `undefined` if no error occurred.
   */
  get lastCameraError(): Error | undefined {
    return this._participant.lastCameraError;
  }

  /**
   * Gets the last error encountered while accessing the microphone.
   * 
   * @returns An `Error` instance, or `undefined` if no error occurred.
   */
  get lastMicrophoneError(): Error | undefined {
    return this._participant.lastMicrophoneError;
  }

  /**
   * Indicates whether end-to-end encryption (E2EE) is enabled for the participant.
   * 
   * @returns `true` if E2EE is enabled, otherwise `false`.
   */
  get isE2EEEnabled(): boolean {
    return this._participant.isE2EEEnabled;
  }

  /**
   * Gets a track publication by its source.
   * 
   * @param source - The source of the track as `FFCTrack.Source`.
   * @returns The track publication as an {@link FFCLocalTrackPublication} instance, or `undefined` if not found.
   */
  getTrackPublication(source: FFCTrack.Source): FFCLocalTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(FFCTrack.toTrackSource(source));
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Gets a track publication by its name.
   * 
   * @param name - The name of the track.
   * @returns The track publication as an {@link FFCLocalTrackPublication} instance, or `undefined` if not found.
   */
  getTrackPublicationByName(name: string): FFCLocalTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Sets the metadata for the participant.
   * 
   * @param metadata - The metadata to set as a string.
   * @returns A promise that resolves when the metadata is set.
   */
  async setMetadata(metadata: string): Promise<void> {
    return this._participant.setMetadata(metadata);
  }

  /**
   * Sets the name of the participant.
   * 
   * @param name - The name to set as a string.
   * @returns A promise that resolves when the name is set.
   */
  async setName(name: string): Promise<void> {
    return this._participant.setName(name);
  }

  /**
   * Sets the attributes for the participant.
   * 
   * @param attributes - A record of attributes to set.
   * @returns A promise that resolves when the attributes are set.
   */
  async setAtributes(attributes: Record<string, any>): Promise<void> {
    return this._participant.setAttributes(attributes);
  }

  /**
   * Enables or disables the participant's camera.
   * 
   * @param enable - `true` to enable the camera, `false` to disable it.
   * @param opts - (Optional) Video capture options.
   * @param publishOpts - (Optional) Track publishing options.
   * @returns A promise that resolves to the track publication, or `undefined` if not available.
   */
  async setCameraEnabled(enable: boolean, opts?: FFCVideoCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setCameraEnabled(
      enable,
      opts
      ? FFCVideoCaptureOptions.toVideoCaptureOptions(opts)
      : undefined,
      publishOpts
      ? FFCTrackPublishOptions.toTrackPublishOptions(publishOpts)
      : undefined
    );
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Enables or disables the participant's microphone.
   * 
   * @param enable - `true` to enable the microphone, `false` to disable it.
   * @param opts - (Optional) Audio capture options.
   * @param publishOpts - (Optional) Track publishing options.
   * @returns A promise that resolves to the track publication, or `undefined` if not available.
   */
  async setMicrophoneEnabled(
    enable: boolean,
    opts?: FFCAudioCaptureOptions,
    publishOpts?: FFCTrackPublishOptions
  ): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setMicrophoneEnabled(
      enable,
      opts
      ? FFCAudioCaptureOptions.toAudioCaptureOptions(opts)
      : undefined,
      publishOpts
      ? FFCTrackPublishOptions.toTrackPublishOptions(publishOpts)
      : undefined
    );
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Enables or disables screen sharing for the participant.
   * 
   * @param enable - `true` to enable screen sharing, `false` to disable it.
   * @param opts - (Optional) Screen share capture options.
   * @param publishOpts - (Optional) Track publishing options.
   * @returns A promise that resolves to the track publication, or `undefined` if not available.
   */
  async setScreenShareEnabled(
    enable: boolean,
    opts?: FFCScreenShareCaptureOptions,
    publishOpts?: FFCTrackPublishOptions
  ): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setScreenShareEnabled(
      enable,
      opts
      ? FFCScreenShareCaptureOptions.toScreenShareCaptureOptions(opts)
      : undefined,
      publishOpts
      ? FFCTrackPublishOptions.toTrackPublishOptions(publishOpts)
      : undefined
    );
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Enables both the camera and microphone for the participant.
   * 
   * @returns A promise that resolves when both are enabled.
   */
  async enableCameraAndMicrophone(): Promise<void> {
    return this._participant.enableCameraAndMicrophone();
  }

  /**
   * Creates local tracks for the participant.
   * 
   * @param opts - (Optional) Options for creating local tracks.
   * @returns A promise that resolves to an array of `FFCLocalTrack` instances.
   */
  async createTracks(opts?: FFCCreateLocalTracksOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createTracks(opts ? FFCCreateLocalTracksOptions.toCreateLocalTracksOptions(opts) : undefined);
    return tracks.map((track) => wrapTrack(track) as FFCLocalTrack);
  }

  /**
   * Creates screen sharing tracks for the participant.
   * 
   * @param opts - (Optional) Screen share capture options.
   * @returns A promise that resolves to an array of `FFCLocalTrack` instances.
   */
  async createScreenTracks(opts?: FFCScreenShareCaptureOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createScreenTracks(
      opts
      ? FFCScreenShareCaptureOptions.toScreenShareCaptureOptions(opts)
      : undefined,
    );
    return tracks.map((track) => wrapTrack(track) as FFCLocalTrack);
  }

  /**
   * Publishes a track for the participant.
   * 
   * @param track - The track to publish, either as an `FFCLocalTrack` or a `MediaStreamTrack`.
   * @param opts - (Optional) Track publishing options.
   * @returns A promise that resolves to the track publication.
   */
  async publishTrack(track: FFCLocalTrack | MediaStreamTrack, opts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication> {
    let trackPublication: LocalTrackPublication;
    if (track instanceof FFCLocalTrack) {
      trackPublication = await this._participant.publishTrack(
        track.instance as LocalTrack,
        opts
        ? FFCTrackPublishOptions.toTrackPublishOptions(opts)
        : undefined
      );
    } else {
      trackPublication = await this._participant.publishTrack(
        track,
        opts
        ? FFCTrackPublishOptions.toTrackPublishOptions(opts)
        : undefined
      );
    }
    return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
  }

  /**
   * Indicates whether the participant is local.
   * 
   * @returns `true` because this is a local participant.
   */
  override get isLocal(): boolean {
    return true;
  }

  /**
   * Unpublishes a track for the participant.
   * 
   * @param track - The track to unpublish, either as an `FFCLocalTrack` or a `MediaStreamTrack`.
   * @param stopOnUnpublish - (Optional) Whether to stop the track when it is unpublished.
   * @returns A promise that resolves to the unpublished track publication, or `undefined` if not available.
   */
  async unpublishTrack(track: FFCLocalTrack | MediaStreamTrack, stopOnUnpublish?: boolean): Promise<FFCLocalTrackPublication | undefined> {
    let trackPublication: LocalTrackPublication | undefined = undefined;
    if (track instanceof FFCLocalTrack) {
      trackPublication = await this._participant.unpublishTrack(track.instance as LocalTrack, stopOnUnpublish);
    } else {
      trackPublication = await this._participant.unpublishTrack(track, stopOnUnpublish);
    }
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  /**
   * Unpublishes multiple tracks for the participant.
   * 
   * @param tracks - An array of tracks to unpublish, either as `FFCLocalTrack` or `MediaStreamTrack` instances.
   * @returns A promise that resolves to an array of unpublished track publications.
   */
  async unpublishTracks(tracks: Array<FFCLocalTrack> | Array<MediaStreamTrack>): Promise<Array<FFCLocalTrackPublication>> {
    if (tracks.length === 0) {
      return [];
    }
    if (tracks[0] instanceof MediaStreamTrack) {
      return (await this._participant.unpublishTracks(tracks as Array<MediaStreamTrack>)).map((trackPublication) => wrapTrackPublication(trackPublication) as FFCLocalTrackPublication);
    } else {
      return (await this._participant.unpublishTracks((tracks as Array<FFCLocalTrack>).map((track: FFCLocalTrack) => track.instance))).map((trackPublication) => wrapTrackPublication(trackPublication) as FFCLocalTrackPublication);
    }
  }

  /**
   * Republishes all tracks for the participant.
   * 
   * @param opts - (Optional) Track publishing options.
   * @param restartTracks - (Optional) Whether to restart the tracks before republishing. Defaults to `true`.
   * @returns A promise that resolves when all tracks are republished.
   */
  async republishAllTracks(opts?: FFCTrackPublishOptions, restartTracks: boolean = true): Promise<void> {
    return this._participant.republishAllTracks(
      opts
      ? FFCTrackPublishOptions.toTrackPublishOptions(opts)
      : undefined,
      restartTracks);
  }

  /**
   * Sets track subscription permissions for the participant.
   * 
   * @param allParticipantsAllowed - Whether all participants are allowed to subscribe to the tracks.
   * @param participantTrackPermissions - An array of track permissions for specific participants.
   */
  setTrackSubscriptionPermissions(allParticipantsAllowed: boolean, participantTrackPermissions: Array<FFCParticipantTrackPermission>): void {
    return this._participant.setTrackSubscriptionPermissions(allParticipantsAllowed, participantTrackPermissions);
  }
}
