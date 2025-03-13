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

  get audioTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get lastCameraError(): Error | undefined {
    return this._participant.lastCameraError;
  }

  get lastMicrophoneError(): Error | undefined {
    return this._participant.lastMicrophoneError;
  }

  get isE2EEEnabled(): boolean {
    return this._participant.isE2EEEnabled;
  }

  getTrackPublication(source: FFCTrack.Source): FFCLocalTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(FFCTrack.toTrackSource(source));
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  getTrackPublicationByName(name: string): FFCLocalTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async setMetadata(metadata: string): Promise<void> {
    return this._participant.setMetadata(metadata);
  }

  async setName(name: string): Promise<void> {
    return this._participant.setName(name);
  }

  async setAtributes(attributes: Record<string, any>): Promise<void> {
    return this._participant.setAttributes(attributes);
  }

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

  async enableCameraAndMicrophone(): Promise<void> {
    return this._participant.enableCameraAndMicrophone();
  }

  async createTracks(opts?: FFCCreateLocalTracksOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createTracks(opts ? FFCCreateLocalTracksOptions.toCreateLocalTracksOptions(opts) : undefined);
    return tracks.map((track) => wrapTrack(track) as FFCLocalTrack);
  }

  async createScreenTracks(opts?: FFCScreenShareCaptureOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createScreenTracks(
      opts
      ? FFCScreenShareCaptureOptions.toScreenShareCaptureOptions(opts)
      : undefined,
    );
    return tracks.map((track) => wrapTrack(track) as FFCLocalTrack);
  }

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

  override get isLocal(): boolean {
    return true;
  }

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

  async republishAllTracks(opts?: FFCTrackPublishOptions, restartTracks: boolean = true): Promise<void> {
    return this._participant.republishAllTracks(
      opts
      ? FFCTrackPublishOptions.toTrackPublishOptions(opts)
      : undefined,
      restartTracks);
  }

  setTrackSubscriptionPermissions(allParticipantsAllowed: boolean, participantTrackPermissions: Array<FFCParticipantTrackPermission>): void {
    return this._participant.setTrackSubscriptionPermissions(allParticipantsAllowed, participantTrackPermissions);
  }
}
