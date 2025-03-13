import { ConnectionQuality, type ParticipantTrackPermission } from "livekit-client";

export enum FFCConnectionQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  POOR = 'POOR',
  LOST = 'LOST',
  UNKNOWN = 'UNKNOWN',
}

/** @internal */
export namespace FFCConnectionQuality {
  /** @internal */
  export function fromConnectionQuality(quality: ConnectionQuality): FFCConnectionQuality{
    switch (quality) {
      case ConnectionQuality.Excellent:
        return FFCConnectionQuality.EXCELLENT;
      case ConnectionQuality.Good:
        return FFCConnectionQuality.GOOD;
      case ConnectionQuality.Poor:
        return FFCConnectionQuality.POOR;
      case ConnectionQuality.Lost:
        return FFCConnectionQuality.LOST;
      case ConnectionQuality.Unknown:
        return FFCConnectionQuality.UNKNOWN;
    }
  }

  /* @internal */
  export function toConnectionQuality(quality: FFCConnectionQuality): ConnectionQuality {
    switch (quality) {
      case FFCConnectionQuality.EXCELLENT:
        return ConnectionQuality.Excellent;
      case FFCConnectionQuality.GOOD:
        return ConnectionQuality.Good;
      case FFCConnectionQuality.POOR:
        return ConnectionQuality.Poor;
      case FFCConnectionQuality.LOST:
        return ConnectionQuality.Lost;
      case FFCConnectionQuality.UNKNOWN:
        return ConnectionQuality.Unknown;
    }
  }
}

export interface FFCParticipantTrackPermission extends ParticipantTrackPermission {}
