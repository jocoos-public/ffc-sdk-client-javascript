/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   LocalAudioTrack,
//   LocalParticipant,
//   LocalTrackPublication,
//   LocalVideoTrack,
//   ParticipantEvent,
//   RemoteAudioTrack,
//   RemoteParticipant,
//   RemoteTrackPublication,
//   RemoteVideoTrack,
//   Room,
//   RoomEvent,
//   Track,
// } from "livekit-client";

import {
  FFCLocalAudioTrack,
  FFCLocalParticipant,
  FFCLocalTrackPublication,
  FFCLocalVideoTrack,
  FFCParticipantEvent,
  FFCRemoteAudioTrack,
  FFCRemoteParticipant,
  FFCRemoteTrackPublication,
  FFCRemoteVideoTrack,
  FFCRtcVideoRoom,
  FFCRtcVideoRoomEvent,
  FFCTrack,
  FFCTrackKind,
  FFCTrackSource,
} from 'ffc-client-sdk'
import { EventHandler } from "./EventHandler";


export type GetFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type GetFunctionParams<T> = {
  [K in keyof T]: T[K] extends (...args: any) => void
    ? Parameters<T[K]>[0]
    : any;
};

export type ParticipantState = {
  metadata?: any;
  camera: DeviceState;
  microphone: DeviceState;
};

export type ViewContexts = {
  test: any
};

export type TrackRemoteReferenceByVases = {
  participant: FFCRemoteParticipant;
  camera?: {
    track: FFCRemoteVideoTrack;
    publication: FFCRemoteTrackPublication;
  };
  microphone?: {
    track: FFCRemoteAudioTrack;
    publication: FFCRemoteTrackPublication;
  };
};
export type TrackLocalReferenceByVases = {
  participant: FFCLocalParticipant;
  camera?: {
    track: FFCLocalVideoTrack;
    publication: FFCLocalTrackPublication;
  };
  microphone?: {
    track: FFCLocalAudioTrack;
    publication: FFCLocalTrackPublication;
  };
};

export type DeviceState = {
  enabled?: boolean;
  muted?: boolean;
};

// 각 이벤트 타입에 따른 payload 타입 정의
export interface RtcEventPayloads {
  local_join: {
    metadata: any;
  };
  remote_join: {
    metadata: any;
  };
  remote_leave: {
    identity: string;
  };
  local_update: {
    metadata?: any;
    camera: DeviceState;
    microphone: DeviceState;
  };

  remote_update: {
    identity: string;
    metadata?: any;
    camera: DeviceState;
    microphone: DeviceState;
  };
  message: { target: string; action: any };
  status: "LOADING" | "LOADED" | "DISCONNECTED";
}

export class FFC_Controller extends EventHandler<RtcEventPayloads> {
  room?: FFCRtcVideoRoom;
  localVideoTrack?: FFCLocalVideoTrack;
  localAudioTrack?: FFCLocalAudioTrack;
  audioContext?: AudioContext;
  local?: TrackLocalReferenceByVases;
  remotes: Record<string, TrackRemoteReferenceByVases>;
  context?: {
    local: ParticipantState;
    remotes: Record<string, ParticipantState>;
  };

  constructor() {
    super();

    this.remotes = {};
  }

  // only local
  async publishAudio(device: { id: string; enabled: boolean }) {
    if (this.local && this.localAudioTrack) {
      const publication = await this.local.participant.publishTrack(
        this.localAudioTrack,
        {
          source: FFCTrackSource.MICROPHONE,
        }
      );

      if (!device.enabled) {
        publication.mute();
      }
    }
  }

  // only local
  async publishVideo(device: { id: string; enabled: boolean }) {
    if (this.local && this.localVideoTrack) {
      const publication = await this.local.participant.publishTrack(
        this.localVideoTrack,
        {
          source: FFCTrackSource.CAMERA,
        }
      );

      if (!device.enabled) {
        publication.mute();
      }
    }
  }

  addRemoteEventHandler(remote: TrackRemoteReferenceByVases) {
    const id = remote.participant.identity;

    remote.participant.on(
      FFCParticipantEvent.TRACK_SUBSCRIBED,
      (track, publication) => {
        if (track instanceof FFCRemoteAudioTrack) {
          if (track.source === FFCTrackSource.MICROPHONE) {
            remote.microphone!.track = track;
            this.context!.remotes[id].microphone.enabled = true;
          }
        } else if (track instanceof FFCRemoteVideoTrack) {
          if (track.source === FFCTrackSource.CAMERA) {
            remote.camera!.track = track;
            this.context!.remotes[id].camera.enabled = true;
          }
        }
      }
    );

    remote.participant.on(
      FFCParticipantEvent.TRACK_UNSUBSCRIBED,
      (track, publication) => {
        if (track instanceof FFCRemoteAudioTrack) {
          if (track.source === FFCTrackSource.MICROPHONE) {
            remote.microphone!.track = track;
            this.context!.remotes[id].microphone.enabled = false;
          }
        } else if (track instanceof FFCRemoteVideoTrack) {
          if (track.source === FFCTrackSource.CAMERA) {
            remote.camera!.track = track;
            this.context!.remotes[id].camera.enabled = false;
          }
        }
      }
    );

    remote.participant.on(FFCParticipantEvent.TRACK_MUTED, (track) => {
      if (track.source === FFCTrackSource.MICROPHONE) {
        this.context!.remotes[id].microphone.muted = true;
      } else if (track.source === FFCTrackSource.CAMERA) {
        this.context!.remotes[id].camera.muted = true;
      }
    });
    remote.participant.on(FFCParticipantEvent.TRACK_UNMUTED, (track) => {
      if (track.source === FFCTrackSource.MICROPHONE) {
        this.context!.remotes[id].microphone.muted = false;
      } else if (track.source === FFCTrackSource.CAMERA) {
        this.context!.remotes[id].camera.muted = false;
      }
    });

    remote.participant.on(FFCParticipantEvent.TRACK_PUBLISHED, (publication) => {
      if (publication.kind === FFCTrackKind.VIDEO) {
        remote.camera = {
          publication: publication,
          track: publication.videoTrack as FFCRemoteVideoTrack,
        };
        this.context!.remotes[id].camera = {
          enabled: false,
          muted: undefined,
        };
      } else if (publication.kind === FFCTrackKind.AUDIO) {
        remote.microphone = {
          publication: publication,
          track: publication.audioTrack as FFCRemoteAudioTrack,
        };
        this.context!.remotes[id].microphone = {
          enabled: false,
          muted: undefined,
        };
      }
      publication.setSubscribed(true);
    });
    remote.participant.on(FFCParticipantEvent.TRACK_UNPUBLISHED, (publication) => {
      if (publication.kind === FFCTrackKind.VIDEO) {
        remote.camera = undefined;
        this.context!.remotes[id].camera = {
          enabled: undefined,
          muted: undefined,
        };
      } else if (publication.kind === FFCTrackKind.AUDIO) {
        remote.microphone = undefined;
        this.context!.remotes[id].microphone = {
          enabled: undefined,
          muted: undefined,
        };
      }
      publication.setSubscribed(false);
    });
    remote.participant.on(FFCParticipantEvent.CONNECTION_QUALITY_CHANGED, (q) => {
      console.log(q);
    });

    remote.participant.trackPublications.forEach((publication) => {
      // 퍼블리셔가 있나없나!?ㅎ
      if (publication.kind === FFCTrackKind.VIDEO) {
        remote.camera = {
          publication: publication as FFCRemoteTrackPublication,
          track: publication.videoTrack as FFCRemoteVideoTrack,
        };
        this.context!.remotes[id].camera = {
          enabled: publication.isSubscribed,
          muted: publication.isMuted,
        };
      } else if (publication.kind === FFCTrackKind.AUDIO) {
        remote.microphone = {
          publication: publication as FFCRemoteTrackPublication,
          track: publication.audioTrack as FFCRemoteAudioTrack,
        };
        this.context!.remotes[id].microphone = {
          enabled: publication.isSubscribed,
          muted: publication.isMuted,
        };
      }
      publication.setSubscribed(true);
    });
  }
  async disconnect() {
    if (this.room) {
      await this.room.disconnect(true);
    }
  }

  async connect(
    url: string,
    token: string,
    context: {
      local: ParticipantState;
      remotes: Record<string, ParticipantState>;
    },
    micDevice?: {
      id: string;
      enabled: boolean;
    },
    camDevice?: {
      id: string;
      enabled: boolean;
    }
  ) {
    this.context = context;
    this.emit("status", "LOADING");

    this.audioContext = new AudioContext({ sampleRate: 48000 });
    const room = new FFCRtcVideoRoom({
      adaptiveStream: true,
      dynacast: true,

      audioCaptureDefaults: {
        deviceId: micDevice ? micDevice.id : "default",
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
      videoCaptureDefaults: {
        deviceId: camDevice ? camDevice.id : "default",
      },
      webAudioMix: {
        audioContext: this.audioContext,
      },
    });

    this.room = room;

    // const decoder = new TextDecoder();
    // room.addListener(
    //   FFCRtcVideoRoomEvent.DATA_RECEIVED,
    //   (payload, participant, kind, topic) => {
    //     try {
    //       const strData = decoder.decode(payload);
    //       const data = JSON.parse(strData) as {
    //         target: keyof ViewContexts;
    //         // publishData 쪽에서 타입이 정의가 되었기에 일단 여기는 any로 처리
    //         action: {
    //           name: string;
    //           payload: any;
    //         };
    //       };
    //       if (participant?.hasMetadata) {
    //         try {
    //           const metadata = JSON.parse(participant!.metadata as string);
    //           data.action.payload.metadata = metadata;
    //         } catch (error) {
    //           // noop
    //         }
    //       }

    //       this.emit("message", { target: data.target, action: data.action });
    //       // this.emit(data.target, data.action);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // );

    room.addListener(FFCRtcVideoRoomEvent.CONNECTED, async () => {
      this.local = {
        participant: room.localParticipant,
      };

      const metadata = this.local.participant.metadata
        ? (JSON.parse(this.local.participant.metadata) as any)
        : undefined;
      

      this.local.participant.on(
        FFCParticipantEvent.LOCAL_TRACK_PUBLISHED,
        async (publication) => {
          if (this.local) {
            if (publication.kind === FFCTrackKind.VIDEO) {
              this.local.camera = {
                publication: publication,
                track: publication.videoTrack as FFCLocalVideoTrack,
              };
              this.context!.local.camera.enabled = true;
            } else if (publication.kind === FFCTrackKind.AUDIO) {
              this.local.microphone = {
                publication: publication,
                track: publication.audioTrack as FFCLocalAudioTrack,
              };
              this.context!.local.microphone.enabled = true;
              
            }
          }
        }
      );

      this.local.participant.on(
        FFCParticipantEvent.LOCAL_TRACK_UNPUBLISHED,
        (publication) => {
          if (this.local) {
            if (publication.kind === FFCTrackKind.VIDEO) {
              this.local.camera = undefined;
              this.context!.local.camera.enabled = false;
            } else if (publication.kind === FFCTrackKind.AUDIO) {
              this.local.microphone = undefined;
              this.context!.local.microphone.enabled = false;
            }
          }
        }
      );

      this.local.participant.on(FFCParticipantEvent.TRACK_MUTED, (track) => {
        if (track.source === FFCTrackSource.CAMERA) {
          this.context!.local.camera.muted = true;
        } else if (track.source === FFCTrackSource.MICROPHONE) {
          this.context!.local.microphone.muted = true;
        }

        // this.context!.local.camera.muted = true;
      });
      this.local.participant.on(FFCParticipantEvent.TRACK_UNMUTED, (track) => {
        // this.context!.local.camera.muted = false;
        if (track.source === FFCTrackSource.CAMERA) {
          this.context!.local.camera.muted = false;
        } else if (track.source === FFCTrackSource.MICROPHONE) {
          this.context!.local.microphone.muted = false;
        }
      });
      this.context!.local.metadata = metadata;

      this.emit("local_join", {
        metadata: metadata!,
      });

      if (micDevice) {
        await this.publishAudio(micDevice);
      }

      if (camDevice) {
        await this.publishVideo(camDevice);
      }

      room.remoteParticipants.forEach((participant) => {
        this.remotes[participant.identity] = {
          participant: participant,
        };
        const metadata = participant.metadata
          ? (JSON.parse(participant.metadata) as any)
          : undefined;

        this.context!.remotes[participant.identity] = {
          camera: {
            muted: undefined,
            enabled: undefined,
          },
          microphone: {
            muted: undefined,
            enabled: undefined,
          },
          metadata: metadata,
        };

        this.emit("remote_join", {
          metadata: metadata!,
        });

        this.addRemoteEventHandler(this.remotes[participant.identity]);
      });

      room.addListener(FFCRtcVideoRoomEvent.PARTICIPANT_CONNECTED, (participant) => {
        this.remotes[participant.identity] = {
          participant: participant,
        };
        const metadata = participant.metadata
          ? (JSON.parse(participant.metadata) as any)
          : undefined;

        this.context!.remotes[participant.identity] = {
          camera: {
            muted: undefined,
            enabled: undefined,
          },
          microphone: {
            muted: undefined,
            enabled: undefined,
          },
          metadata: metadata,
        };

        this.emit("remote_join", {
          metadata: metadata!,
        });

        this.addRemoteEventHandler(this.remotes[participant.identity]);
      });

      room.on(FFCRtcVideoRoomEvent.PARTICIPANT_DISCONNECTED, (participant) => {
        this.emit("remote_leave", {
          identity: participant.identity,
        });
        this.remotes[participant.identity].participant.removeAllListeners();
        delete this.remotes[participant.identity];

        delete this.context!.remotes[participant.identity];
      });

      this.emit("status", "LOADED");
      // this.context!.setStatus("LOADED");
    });

    room.addListener(FFCRtcVideoRoomEvent.DISCONNECTED, (reason) => {
      this.context!.local = {
        camera: {
          muted: false,
          enabled: false,
        },
        microphone: {
          muted: false,
          enabled: false,
        },
      };
      this.context!.remotes = {};
      this.local = undefined;

      this.remotes = {};

      room.removeAllListeners();
      // this.context!.setStatus("DISCONNECTED");
      this.emit("status", "DISCONNECTED");
    });

    await room.connect(url, token, { autoSubscribe: true });
  }
  // async publishData<
  //   T extends keyof ViewContexts,
  //   V extends ViewContexts[T],
  //   K extends GetFunctionKeys<V>,
  //   P extends GetFunctionParams<V>[K]
  // >(target: T, name: K, payload: P, destinationIdentities?: string[]) {
  //   try {
  //     const encoder = new TextEncoder();
  //     await this.room?.localParticipant.publishData(
  //       encoder.encode(JSON.stringify({ target, action: { name, payload } })),
  //       {
  //         reliable: true,
  //         destinationIdentities: destinationIdentities,
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
