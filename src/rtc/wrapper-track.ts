import { LocalAudioTrack, LocalTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack, Track } from "livekit-client";
import type { FFCTrack } from "./track/track";
import { FFCError } from "../errors";

const wrappedTracks: WeakMap<object, FFCTrack> = new WeakMap();
let FFCLocalAudioTrack: any;
let FFCLocalVideoTrack: any;
let FFCRemoteAudioTrack: any;
let FFCRemoteVideoTrack: any;
let initialized = false;

export function isFFCTrackModuleInitialized(): boolean {
  return initialized;
}

export async function initFFCTrackModule(): Promise<void> {
  if (initialized) {
    return;
  }
  FFCLocalAudioTrack = (await import('./track/track-local-audio')).default;
  FFCLocalVideoTrack = (await import('./track/track-local-video')).default;
  FFCRemoteAudioTrack = (await import('./track/track-remote-audio')).default;
  FFCRemoteVideoTrack = (await import('./track/track-remote-video')).default;
  initialized = true;
}

/** @internal */
export function wrapTrack(track: Track): FFCTrack {
  if (!initialized) {
    throw new FFCError('RTC_MODULE_INIT_ERROR', 'FFC sub modules not initialized');
  }
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

