import { RemoteParticipant } from "livekit-client";
import FFCParticipant from "./ffc-participant";
import { FFCRemoteTrackPublication } from "../track/ffc-track-publication-remote";
import { FFCTrackPublication } from "../track/ffc-track-publication";
import { FFCTrackSource, toTrackSource } from "../track/ffc-track-types";


export default class FFCRemoteParticipant extends FFCParticipant {
  protected _participant: RemoteParticipant;

  /* @internal */
  constructor(participant: RemoteParticipant) {
    super(participant);
    this._participant = participant;
  }

  get audioTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.audioTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  get videoTrackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.videoTrackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }

  get trackPublications(): Map<string, FFCRemoteTrackPublication> {
    const ffcMap = new Map<string, FFCRemoteTrackPublication>();
    this._participant.trackPublications.forEach((value, key) => {
      ffcMap.set(key, FFCTrackPublication.wrap(value) as FFCRemoteTrackPublication);
    });
    return ffcMap;
  }
  
  /*
  get signalClient(): FFCSignalClient {
    return this._participant.signalClient;
  }
  */

  getTrackPublication(source: FFCTrackSource): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublication(toTrackSource(source));
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  getTrackPublicationByName(name: string): FFCRemoteTrackPublication | undefined {
    const trackPublication = this._participant.getTrackPublicationByName(name);
    if (trackPublication) {
      return FFCTrackPublication.wrap(trackPublication) as FFCRemoteTrackPublication;
    }
  }

  setVolume(volume: number, source: FFCTrackSource.MICROPHONE | FFCTrackSource.SCREEN_SHARE_AUDIO = FFCTrackSource.MICROPHONE): void {
    this._participant.setVolume(volume, toTrackSource(source));
  }

  getVolume(source: FFCTrackSource.MICROPHONE | FFCTrackSource.SCREEN_SHARE_AUDIO = FFCTrackSource.MICROPHONE): number | undefined {
    return this._participant.getVolume(toTrackSource(source));
  }
}