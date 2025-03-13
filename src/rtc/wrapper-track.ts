import { LocalAudioTrack, LocalTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack, Track } from "livekit-client";
import type { FFCTrack } from "./track/track";
import FFCLocalAudioTrack from "./track/track-local-audio";
import { FFCError } from "../errors";
import FFCLocalVideoTrack from "./track/track-local-video";
import FFCRemoteAudioTrack from "./track/track-remote-audio";
import FFCRemoteVideoTrack from "./track/track-remote-video";

const wrappedTracks: WeakMap<object, FFCTrack> = new WeakMap();

/** @internal */
export function wrapTrack(track: Track): FFCTrack {
  const existing = wrappedTracks.get(track);
  if (existing) {
    return existing;
  }
  if (track instanceof LocalTrack) {
    if (track.kind == Track.Kind.Audio) {
      const localAudioTrack = new FFCLocalAudioTrack(track as LocalAudioTrack);
      wrappedTracks.set(track, localAudioTrack);
      return localAudioTrack;
    } else if (track.kind == Track.Kind.Video) {
      const localVideoTrack = new FFCLocalVideoTrack(track as LocalVideoTrack);
      wrappedTracks.set(track, localVideoTrack);
      return localVideoTrack;
    }
    // TODO: What to do with other track kind
  }
  if (track.kind == Track.Kind.Audio) {
    const remoteAudioTrack = new FFCRemoteAudioTrack(track as RemoteAudioTrack);
    wrappedTracks.set(track, remoteAudioTrack);
    return remoteAudioTrack;
  } else if (track.kind == Track.Kind.Video) {
    const remoteVideoTrack = new FFCRemoteVideoTrack(track as RemoteVideoTrack);
    wrappedTracks.set(track, remoteVideoTrack);
    return remoteVideoTrack;
  }
  // TODO: What to do with other track kind
  throw new FFCError('RTC_UNKNOWN_TRACK_KIND', 'cannot handle unknown track type')
}

