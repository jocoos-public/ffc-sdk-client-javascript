import { LocalTrackPublication, RemoteTrackPublication, type TrackPublication } from "livekit-client";
import type { FFCTrackPublication } from "./track/track-publication";
import FFCLocalTrackPublication from "./track/track-publication-local";
import FFCRemoteTrackPublication from "./track/track-publication-remote";

const wrappedTrackPublications: WeakMap<object, FFCTrackPublication> = new WeakMap();

export function wrapTrackPublication(publication: TrackPublication): FFCTrackPublication {
  const existing = wrappedTrackPublications.get(publication);
  if (existing) {
    return existing;
  }
  if (publication instanceof LocalTrackPublication) {
    const localTrackPublication = new FFCLocalTrackPublication(publication as LocalTrackPublication);
    wrappedTrackPublications.set(publication, localTrackPublication);
    return localTrackPublication;
  }
  const remoteTrackPublication = new FFCRemoteTrackPublication(publication as RemoteTrackPublication);
  wrappedTrackPublications.set(publication, remoteTrackPublication);
  return remoteTrackPublication;
}