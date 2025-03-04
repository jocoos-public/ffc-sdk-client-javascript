import { AudioTrackFeature } from "@livekit/protocol";
import { DisconnectReason, ParticipantKind, SubscriptionError } from "livekit-client";

export enum FFCDisconnectReason {
  UNKNOWN_REASON = 'UNKNOWN_REASON',
  CLIENT_INITIATED = 'CLIENT_INITIATED',
  DUPLICATE_IDENTITY = 'DUPLICATE_IDENTITY',
  SERVER_SHUTDOWN = 'SERVER_SHUTDOWN',
  PARTICIPANT_REMOVED = 'PARTICIPANT_REMOVED',
  ROOM_DELETED = 'ROOM_DELETED',
  STATE_MISMATCH = 'STATE_MISMATCH',
  JOIN_FAILURE = 'JOIN_FAILURE',
  MIGRATION = 'MIGRATION',
  SIGNAL_CLOSE = 'SIGNAL_CLOSE',
  ROOM_CLOSED = 'ROOM_CLOSED',
  USER_UNAVAILABLE = 'USER_UNAVAILABLE',
  USER_REJECTED = 'USER_REJECTED',
  SIP_TRUNK_FAILURE = 'SIP_TRUNK_FAILURE',
}

/* @internal */
export function toFFCDisconnectReason(reason: DisconnectReason | undefined): FFCDisconnectReason | undefined {
  if (reason === undefined) {
    return;
  }
  switch (reason) {
    case DisconnectReason.UNKNOWN_REASON:
      return FFCDisconnectReason.UNKNOWN_REASON;
    case DisconnectReason.CLIENT_INITIATED:
      return FFCDisconnectReason.CLIENT_INITIATED;
    case DisconnectReason.DUPLICATE_IDENTITY:
      return FFCDisconnectReason.DUPLICATE_IDENTITY;
    case DisconnectReason.SERVER_SHUTDOWN:
      return FFCDisconnectReason.SERVER_SHUTDOWN;
    case DisconnectReason.PARTICIPANT_REMOVED:
      return FFCDisconnectReason.PARTICIPANT_REMOVED;
    case DisconnectReason.ROOM_DELETED:
      return FFCDisconnectReason.ROOM_DELETED;
    case DisconnectReason.STATE_MISMATCH:
      return FFCDisconnectReason.STATE_MISMATCH;
    case DisconnectReason.JOIN_FAILURE:
      return FFCDisconnectReason.JOIN_FAILURE;
    case DisconnectReason.MIGRATION:
      return FFCDisconnectReason.MIGRATION;
    case DisconnectReason.SIGNAL_CLOSE:
      return FFCDisconnectReason.SIGNAL_CLOSE;
    case DisconnectReason.ROOM_CLOSED:
      return FFCDisconnectReason.ROOM_CLOSED;
    case DisconnectReason.USER_UNAVAILABLE:
      return FFCDisconnectReason.USER_UNAVAILABLE;
    case DisconnectReason.USER_REJECTED:
      return FFCDisconnectReason.USER_REJECTED;
    case DisconnectReason.SIP_TRUNK_FAILURE:
      return FFCDisconnectReason.SIP_TRUNK_FAILURE;
  }
}

/* @internal */
export function toDisconnectReason(reason: FFCDisconnectReason): DisconnectReason {
  switch (reason) {
    case FFCDisconnectReason.UNKNOWN_REASON:
      return DisconnectReason.UNKNOWN_REASON;
    case FFCDisconnectReason.CLIENT_INITIATED:
      return DisconnectReason.CLIENT_INITIATED;
    case FFCDisconnectReason.DUPLICATE_IDENTITY:
      return DisconnectReason.DUPLICATE_IDENTITY;
    case FFCDisconnectReason.SERVER_SHUTDOWN:
      return DisconnectReason.SERVER_SHUTDOWN;
    case FFCDisconnectReason.PARTICIPANT_REMOVED:
      return DisconnectReason.PARTICIPANT_REMOVED;
    case FFCDisconnectReason.ROOM_DELETED:
      return DisconnectReason.ROOM_DELETED;
    case FFCDisconnectReason.STATE_MISMATCH:
      return DisconnectReason.STATE_MISMATCH;
    case FFCDisconnectReason.JOIN_FAILURE:
      return DisconnectReason.JOIN_FAILURE;
    case FFCDisconnectReason.MIGRATION:
      return DisconnectReason.MIGRATION;
    case FFCDisconnectReason.SIGNAL_CLOSE:
      return DisconnectReason.SIGNAL_CLOSE;
    case FFCDisconnectReason.ROOM_CLOSED:
      return DisconnectReason.ROOM_CLOSED;
    case FFCDisconnectReason.USER_UNAVAILABLE:
      return DisconnectReason.USER_UNAVAILABLE;
    case FFCDisconnectReason.USER_REJECTED:
      return DisconnectReason.USER_REJECTED;
    case FFCDisconnectReason.SIP_TRUNK_FAILURE:
      return DisconnectReason.SIP_TRUNK_FAILURE;
  }
}

export enum FFCAudioTrackFeature {
  STEREO = 'STEREO',
  NO_DTX = 'NO_DTX',
  AUTO_GAIN_CONTROL = 'AUTO_GAIN_CONTROL',
  ECHO_CANCELLATION = 'ECHO_CANCELLATION',
  NOISE_SUPPRESSION = 'NOISE_SUPPRESSION',
  ENHANCED_NOISE_CANCELATION = 'ENHANCED_NOISE_CANCELATION',
}

/* @internal */
export function toAudioTrackFeature(feature: FFCAudioTrackFeature): AudioTrackFeature {
  switch (feature) {
    case FFCAudioTrackFeature.STEREO:
      return AudioTrackFeature.TF_STEREO;
    case FFCAudioTrackFeature.NO_DTX:
      return AudioTrackFeature.TF_NO_DTX;
    case FFCAudioTrackFeature.AUTO_GAIN_CONTROL:
      return AudioTrackFeature.TF_AUTO_GAIN_CONTROL;
    case FFCAudioTrackFeature.ECHO_CANCELLATION:
      return AudioTrackFeature.TF_ECHO_CANCELLATION;
    case FFCAudioTrackFeature.NOISE_SUPPRESSION:
      return AudioTrackFeature.TF_NOISE_SUPPRESSION;
    case FFCAudioTrackFeature.ENHANCED_NOISE_CANCELATION:
      return AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION;
  }
}

/* @internal */
export function toFFCAudioTrackFeature(feature: AudioTrackFeature): FFCAudioTrackFeature {
  switch (feature) {
    case AudioTrackFeature.TF_STEREO:
      return FFCAudioTrackFeature.STEREO;
    case AudioTrackFeature.TF_NO_DTX:
      return FFCAudioTrackFeature.NO_DTX;
    case AudioTrackFeature.TF_AUTO_GAIN_CONTROL:
      return FFCAudioTrackFeature.AUTO_GAIN_CONTROL;
    case AudioTrackFeature.TF_ECHO_CANCELLATION:
      return FFCAudioTrackFeature.ECHO_CANCELLATION;
    case AudioTrackFeature.TF_NOISE_SUPPRESSION:
      return FFCAudioTrackFeature.NOISE_SUPPRESSION;
    case AudioTrackFeature.TF_ENHANCED_NOISE_CANCELLATION:
      return FFCAudioTrackFeature.ENHANCED_NOISE_CANCELATION;
  }
}

export enum FFCParticipantKind {
  STANDARD = 'STANDARD',
  INGRESS = 'INGRESS',
  EGRESS = 'EGRESS',
  SIP = 'SIP',
  AGENT = 'AGENT',
}

/* @internal */
export function toParticipantKind(): undefined;
/* @internal */
export function toParticipantKind(kind: FFCParticipantKind): ParticipantKind;
/* @internal */
export function toParticipantKind(kind?: FFCParticipantKind): ParticipantKind | undefined {
  switch (kind) {
    case FFCParticipantKind.STANDARD:
      return ParticipantKind.STANDARD;
    case FFCParticipantKind.INGRESS:
      return ParticipantKind.INGRESS;
    case FFCParticipantKind.EGRESS:
      return ParticipantKind.EGRESS
    case FFCParticipantKind.SIP:
      return ParticipantKind.SIP;
    case FFCParticipantKind.AGENT:
      return ParticipantKind.AGENT;
  }
}

/* @internal */
export function toFFCParticipantKind(): undefined;
/* @internal */
export function toFFCParticipantKind(kind: ParticipantKind): FFCParticipantKind;
/* @internal */
export function toFFCParticipantKind(kind?: ParticipantKind): FFCParticipantKind | undefined {
  switch (kind) {
    case ParticipantKind.STANDARD:
      return FFCParticipantKind.STANDARD;
    case ParticipantKind.INGRESS:
      return FFCParticipantKind.INGRESS;
    case ParticipantKind.EGRESS:
      return FFCParticipantKind.EGRESS;
    case ParticipantKind.SIP:
      return FFCParticipantKind.SIP;
    case ParticipantKind.AGENT:
      return FFCParticipantKind.AGENT;
  }
}

export enum FFCSubscriptionError {
  UNKNOWN = 'UNKNOWN',
  CODEC_UNSUPPORTED = 'CODEC_UNSUPPORTED',
  TRACK_NOTFOUND = 'TRACK_NOTFOUND',
}

/* @internal */
export function toFFCSubscriptionError(error: SubscriptionError): FFCSubscriptionError {
  switch (error) {
    case SubscriptionError.SE_UNKNOWN:
      return FFCSubscriptionError.UNKNOWN;
    case SubscriptionError.SE_CODEC_UNSUPPORTED:
      return FFCSubscriptionError.CODEC_UNSUPPORTED;
    case SubscriptionError.SE_TRACK_NOTFOUND:
      return FFCSubscriptionError.TRACK_NOTFOUND;
  }
}
