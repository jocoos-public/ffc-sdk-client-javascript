import type { RemoteParticipant } from "livekit-client";
import type { IFFCRemoteParticipant } from "./interfaces";
import FFCParticipant from "./participant";
import { wrapTrackPublication } from "../wrapper-track-publication";
import type FFCRemoteTrackPublication from "../track/track-publication-remote";
import { FFCTrack } from "../track/track";

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

  get audioTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.trackPublications.forEach((value, key) => {
      ffcMap.set(key, wrapTrackPublication(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  getTrackPublication(source: FFCTrack.Source): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(FFCTrack.toTrackSource(source));
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  getTrackPublicationByName(name: string): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return wrapTrackPublication(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  setVolume(volume: number, source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio = FFCTrack.Source.Microphone): void {
    this._participant.setVolume(volume, FFCTrack.toTrackSource(source));
  }

  getVolume(source: FFCTrack.Source.Microphone | FFCTrack.Source.ScreenShareAudio = FFCTrack.Source.Microphone): number | undefined {
    return this._participant.getVolume(FFCTrack.toTrackSource(source));
  }
}