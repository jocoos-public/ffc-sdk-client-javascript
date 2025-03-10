import { LocalParticipant, LocalTrack, LocalTrackPublication } from "livekit-client";
import { FFCLocalTrackPublication } from "../track/ffc-track-publication-local";
import FFCParticipant from "./ffc-participant";
import { FFCTrackPublication } from "../track/ffc-track-publication";
import { type FFCCreateLocalTracksOptions, type FFCScreenShareCaptureOptions, type FFCTrackPublishOptions, type FFCVideoCaptureOptions, toCreateLocalTracksOptions, toTrackPublishOptions, toVideoCaptureOptions } from "../track/ffc-track-options";
import FFCLocalTrack from "../track/ffc-track-local";
import type { FFCParticipantTrackPermission } from "./ffc-participant-track-permission";
import { toTrackSource, type FFCTrackSource } from "../track/ffc-track-types";
import { FFCTrack } from "../track/ffc-track";

export default class FFCLocalParticipant extends FFCParticipant {
  protected _participant: LocalParticipant;

  constructor(participant: LocalParticipant) {
    super(participant);
    this._participant = participant;
  }

  get audioTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCLocalTrackPublication> {
    const ffcMap = new Map<string, FFCLocalTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCLocalTrackPublication);
    });
    return ffcMap;
  }

  get lastCameraError(): Error | undefined {
    return this._participant.lastCameraError;
  }

  get lastMicrophoneError(): Error | undefined {
    return this._participant.lastMicrophoneError;
  }

  getTrackPublication(source: FFCTrackSource): FFCLocalTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(toTrackSource(source));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  getTrackPublicationByName(name: string): FFCTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async setMetadata(metadata: string): Promise<void> {
    return this._participant.setMetadata(metadata);
  }

  async setName(name: string): Promise<void> {
    return this._participant.setName(name);
  }

  async setAttributes(attributes: Record<string, any>): Promise<void> {
    return this._participant.setAttributes(attributes);
  }

  async setCameraEnabled(enable: boolean, opts?: FFCVideoCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setCameraEnabled(enable, toVideoCaptureOptions(opts), toTrackPublishOptions(publishOpts));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async setMicrophoneEnabled(enable: boolean, opts?: FFCVideoCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setMicrophoneEnabled(enable, opts, toTrackPublishOptions(publishOpts));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async setScreenShareEnabled(enable: boolean, opts?: FFCVideoCaptureOptions, publishOpts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication | undefined> {
    const trackPublication = await this._participant.setScreenShareEnabled(enable, opts, toTrackPublishOptions(publishOpts));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async enableCameraAndMicrophone(): Promise<void> {
    return this._participant.enableCameraAndMicrophone();
  }

  async createTracks(opts?: FFCCreateLocalTracksOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createTracks(toCreateLocalTracksOptions(opts));
    return tracks.map((track) => FFCTrack.wrap(track) as FFCLocalTrack);
  }

  async createScreenTracks(opts?: FFCScreenShareCaptureOptions): Promise<Array<FFCLocalTrack>> {
    const tracks = await this._participant.createScreenTracks(opts);
    return tracks.map((track) => FFCTrack.wrap(track) as FFCLocalTrack);
  }

  async publishTrack(track: FFCLocalTrack | MediaStreamTrack, opts?: FFCTrackPublishOptions): Promise<FFCLocalTrackPublication> {
    let trackPublication: LocalTrackPublication;
    if (track instanceof FFCLocalTrack) {
      trackPublication = await this._participant.publishTrack(track.instance as LocalTrack, toTrackPublishOptions(opts));
    } else {
      trackPublication = await this._participant.publishTrack(track, toTrackPublishOptions(opts));
    }
    return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
  }

  async unpublishTrack(track: FFCLocalTrack | MediaStreamTrack, stopOnUnpublish?: boolean): Promise<FFCLocalTrackPublication | undefined> {
    let trackPublication: LocalTrackPublication | undefined = undefined;
    if (track instanceof FFCLocalTrack) {
      trackPublication = await this._participant.unpublishTrack(track.instance as LocalTrack, stopOnUnpublish);
    } else {
      trackPublication = await this._participant.unpublishTrack(track, stopOnUnpublish);
    }
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication;
    }
  }

  async unpublishTracks(tracks: Array<FFCLocalTrack> | Array<MediaStreamTrack>): Promise<Array<FFCLocalTrackPublication>> {
    if (tracks.length === 0) {
      return [];
    }
    if (tracks[0] instanceof MediaStreamTrack) {
      return (await this._participant.unpublishTracks(tracks as Array<MediaStreamTrack>)).map((trackPublication) => FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication);
    } else {
      return (await this._participant.unpublishTracks((tracks as Array<FFCLocalTrack>).map((track: FFCLocalTrack) => track.instance))).map((trackPublication) => FFCTrackPublication.wrap(trackPublication) as FFCLocalTrackPublication);
    }
  }

  async republishAllTracks(opts?: FFCTrackPublishOptions, restartTracks: boolean = true): Promise<void> {
    return this._participant.republishAllTracks(toTrackPublishOptions(opts), restartTracks);
  }

  override get isLocal(): boolean {
    return true;
  }

  setTrackSubscriptionPermissions(allParticipantsAllowed: boolean, participantTrackPermissions: Array<FFCParticipantTrackPermission>): void {
    return this._participant.setTrackSubscriptionPermissions(allParticipantsAllowed, participantTrackPermissions);
  }
}
