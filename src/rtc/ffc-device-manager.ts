import log from '../logger';
import { isSafari } from './ffc-utils';

const defaultId = 'default';

export default class FFCDeviceManager {
  private static instance?: FFCDeviceManager;

  static mediaDeviceKinds: MediaDeviceKind[] = ['audioinput', 'audiooutput', 'videoinput'];

  static getInstance(): FFCDeviceManager {
    if (this.instance === undefined) {
      this.instance = new FFCDeviceManager();
    }
    return this.instance;
  }

  static userMediaPromiseMap: Map<MediaDeviceKind, Promise<MediaStream>> = new Map();

  private _previousDevices: MediaDeviceInfo[] = [];

  get previousDevices() {
    return this._previousDevices;
  }

  async getDevices(
    kind?: MediaDeviceKind,
    requestPermissions: boolean = true,
  ): Promise<MediaDeviceInfo[]> {
    if (FFCDeviceManager.userMediaPromiseMap?.size > 0) {
      log.debug('awaiting getUserMedia promise');
      try {
        if (kind) {
          await FFCDeviceManager.userMediaPromiseMap.get(kind);
        } else {
          await Promise.all(FFCDeviceManager.userMediaPromiseMap.values());
        }
      } catch (e: any) {
        log.warn('error waiting for media permissons');
      }
    }
    let devices = await navigator.mediaDevices.enumerateDevices();

    if (
      requestPermissions &&
      // for safari we need to skip this check, as otherwise it will re-acquire user media and fail on iOS https://bugs.webkit.org/show_bug.cgi?id=179363
      !(isSafari() && this.hasDeviceInUse(kind))
    ) {
      const isDummyDeviceOrEmpty =
        devices.filter((d) => d.kind === kind).length === 0 ||
        devices.some((device) => {
          const noLabel = device.label === '';
          const isRelevant = kind ? device.kind === kind : true;
          return noLabel && isRelevant;
        });

      if (isDummyDeviceOrEmpty) {
        const permissionsToAcquire = {
          video: kind !== 'audioinput' && kind !== 'audiooutput',
          audio: kind !== 'videoinput' && { deviceId: 'default' },
        };
        const stream = await navigator.mediaDevices.getUserMedia(permissionsToAcquire);
        devices = await navigator.mediaDevices.enumerateDevices();
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }
    this._previousDevices = devices;

    if (kind) {
      devices = devices.filter((device) => device.kind === kind);
    }
    return devices;
  }

  async normalizeDeviceId(
    kind: MediaDeviceKind,
    deviceId?: string,
    groupId?: string,
  ): Promise<string | undefined> {
    if (deviceId !== defaultId) {
      return deviceId;
    }

    // resolve actual device id if it's 'default': Chrome returns it when no
    // device has been chosen
    const devices = await this.getDevices(kind);

    const defaultDevice = devices.find((d) => d.deviceId === defaultId);

    if (!defaultDevice) {
      log.warn('could not reliably determine default device');
      return undefined;
    }

    const device = devices.find(
      (d) => d.deviceId !== defaultId && d.groupId === (groupId ?? defaultDevice.groupId),
    );

    if (!device) {
      log.warn('could not reliably determine default device');
      return undefined;
    }

    return device?.deviceId;
  }

  private hasDeviceInUse(kind?: MediaDeviceKind): boolean {
    return kind
      ? FFCDeviceManager.userMediaPromiseMap.has(kind)
      : FFCDeviceManager.userMediaPromiseMap.size > 0;
  }
}
