import type { LocalParticipant, Participant, RemoteParticipant } from "livekit-client";
import type FFCParticipant from "./participant/participant";
import FFCLocalParticipant from "./participant/participant-local";
import FFCRemoteParticipant from "./participant/participant-remote";

const wrappedParticipants: WeakMap<object, FFCParticipant> = new WeakMap();

/** @internal */
export function wrapParticipant(participant: Participant): FFCParticipant {
  const existing = wrappedParticipants.get(participant);
  if (existing) {
    return existing;
  }
  if (participant.isLocal) {
    const localParticipant = new FFCLocalParticipant(participant as LocalParticipant);
    wrappedParticipants.set(participant, localParticipant);
    return localParticipant
  }
  const remoteParticipant = new FFCRemoteParticipant(participant as RemoteParticipant);
  wrappedParticipants.set(participant, remoteParticipant);
  return remoteParticipant;
}

