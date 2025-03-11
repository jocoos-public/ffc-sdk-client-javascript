import { MediaDeviceFailure } from "livekit-client";

export class FFCError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class FFCCliCredentialsError extends FFCError {
  constructor(msg: string) {
    super('FFC_CLI_CREDENTIALS_ERROR', msg);
  }
}

export class SdkNotInitializedError extends FFCError {
  constructor() {
    super('SDK_NOT_INITIALIZED', 'sdk not initialized');
  }
}

export class InvalidFFCEnumStringError<T extends Record<string, string>> extends FFCError {
  constructor(type: T, value: string) {
    super('INVALID_FFC_ENUM_STRING', `${type.constructor.name} does not enumerate value: ${value}`);
  }
}

export class FFCDeviceUnsupportedError extends FFCError {
  constructor(msg: string) {
    super('RTC_DEVICE_UNSUPPORTED', msg);
  }
}

export class FFCTrackInvalidError extends FFCError {
  constructor(msg: string) {
    super('RTC_TRACK_INVALID', msg);
  }
}

export enum FFCMediaDeviceFailure {
  // user rejected permissions
  PermissionDenied = 'PermissionDenied',
  // device is not available
  NotFound = 'NotFound',
  // device is in use. On Windows, only a single tab may get access to a device at a time.
  DeviceInUse = 'DeviceInUse',
  Other = 'Other',
}

export namespace FFCMediaDeviceFailure {
  export function getFailure(error: any): FFCMediaDeviceFailure | undefined {
    if (error && 'name' in error) {
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return FFCMediaDeviceFailure.NotFound;
      }
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return FFCMediaDeviceFailure.PermissionDenied;
      }
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return FFCMediaDeviceFailure.DeviceInUse;
      }
      return FFCMediaDeviceFailure.Other;
    }
  }

  export function fromMediaDeviceFailure(failure: MediaDeviceFailure): FFCMediaDeviceFailure {
    switch (failure) {
      case MediaDeviceFailure.PermissionDenied:
        return FFCMediaDeviceFailure.PermissionDenied;
      case MediaDeviceFailure.NotFound:
        return FFCMediaDeviceFailure.NotFound;
      case MediaDeviceFailure.DeviceInUse:
        return FFCMediaDeviceFailure.DeviceInUse;
      case MediaDeviceFailure.Other:
        return FFCMediaDeviceFailure.Other;
    }
  }

  export function toMediaDeviceFailure(failure: FFCMediaDeviceFailure): MediaDeviceFailure {
    switch (failure) {
      case FFCMediaDeviceFailure.PermissionDenied:
        return MediaDeviceFailure.PermissionDenied;
      case FFCMediaDeviceFailure.NotFound:
        return MediaDeviceFailure.NotFound;
      case FFCMediaDeviceFailure.DeviceInUse:
        return MediaDeviceFailure.DeviceInUse;
      case FFCMediaDeviceFailure.Other:
        return MediaDeviceFailure.Other;
    }
  }
}