import { FFCError } from "../ffc-errors";

export enum FFCMediaDeviceFailure {
  // user rejected permissions
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  // device is not available
  NOT_FOUND = 'NOT_FOUND',
  // device is in use. On Windows, only a single tab may get access to a device at a time.
  DEVICE_IN_USE = 'DEVICE_IN_USE',
  OTHER = 'OTHER',
}

export namespace FFCMediaDeviceFailure {
  export function getFailure(error: any): FFCMediaDeviceFailure | undefined {
    if (error && 'name' in error) {
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return FFCMediaDeviceFailure.NOT_FOUND;
      }
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return FFCMediaDeviceFailure.PERMISSION_DENIED;
      }
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return FFCMediaDeviceFailure.DEVICE_IN_USE;
      }
      return FFCMediaDeviceFailure.OTHER;
    }
  }
}

export class FFCRtcTrackError extends FFCError {
  constructor(msg: string) {
    super('RTC_TRACK_ERROR', msg);
  }
}

export class FFCRtcDeviceError extends FFCError {
  constructor(msg: string) {
    super('RTC_DEVICE_ERROR', msg);
  }
}