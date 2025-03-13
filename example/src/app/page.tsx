/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { FFC_Controller, ParticipantState } from '@/logics/FFCController';

import {
  FFCLocalAudioTrack,
  FFCLocalVideoTrack
} from 'ffc-sdk-client-javascript';

// export가 필요한 목록
import { FlipFlopCloudApi } from '../../../dist/src/api/ffc-api';
import { FFCPagesDto, FFCVideoRoomDto } from '../../../dist/src/api/types/data';
import {
  FFCVideoRoomType,
  FFCAccessLevel,
  FFCCreatorType
} from '../../../dist/src/api/types/enums';

import { VideoTrackRenderer } from './VideoTrackRenderer';

export default function Home() {
  const [context, setContext] = useState<{
    local: ParticipantState;
    remotes: Record<string, ParticipantState>;
  }>({
    local: {
      camera: {
        enabled: undefined,
        muted: undefined
      },
      microphone: {
        enabled: undefined,
        muted: undefined
      }
    },
    remotes: {}
  });
  const [rooms, setRooms] = useState<FFCPagesDto<FFCVideoRoomDto> | null>();

  const [status, setStatus] = useState<'LOADING' | 'LOADED' | 'DISCONNECTED'>(
    'LOADING'
  );
  const [local, setLocal] = useState<string>('');

  const [rtc, setRtc] = useState<FFC_Controller | null>(null);

  const [url, setUrl] = useState<string>('https://api-sandbox.flipflop.cloud');
  const [token, setToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJudWxsIiwianRpIjoiMnVGQ3dtWWVQYW1aTTltNzU3VkhIN242bzBSIiwiaXNzIjoiRmxpcEZsb3AiLCJjbGFpbXMiOnsiYXBwSWQiOjgsInR5cGUiOiJNRU1CRVIiLCJhcHBVc2VySWQiOiIxIiwibWVtYmVySWQiOjEzOTMsInVzZXJuYW1lIjoidXNlcjEifSwiaWF0IjoxNzQxODM1MTc1LCJleHAiOjE3NDE5MjE1NzV9.uEylgjIlgvUUu2W1pZTO3Jkt8sU2oIfyw1gsaFTwNN8'
  );
  useEffect(() => {
    const rtc = new FFC_Controller(url, token);
    const prepareMediaTrack = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: 'default'
        },
        video: {
          deviceId: 'default'
        }
      });

      const tracks = stream.getAudioTracks();

      if (tracks.length > 0) {
        const mediaTrack = tracks[0];

        rtc.localAudioTrack = new FFCLocalAudioTrack(mediaTrack);
      }

      const videoTracks = stream.getVideoTracks();

      if (videoTracks.length > 0) {
        const mediaTrack = videoTracks[0];

        rtc.localVideoTrack = new FFCLocalVideoTrack(mediaTrack);
      }
    };

    rtc.on('status', (arg) => {
      setStatus(arg);
    });
    rtc.on('local_join', (args) => {
      setLocal(JSON.stringify(args));
    });
    rtc.on('remote_join', (args) => {
      console.log(args);
    });
    rtc.on('remote_leave', (args) => {
      console.log(args.identity);
    });
    rtc.on('context', (args) => {
      console.log(args);
      setContext({ ...args });
    });
    prepareMediaTrack().then(() => {
      setRtc(rtc);
    });
  }, [url, token]);

  const setListVideoRooms = useCallback(() => {
    if (rtc) {
      // d

      try {
        rtc.api.listVideoRooms().then((data) => {
          setRooms(data);
        });
      } catch (error) {
        // noop
        console.log(error);
      }
    }
  }, [rtc]);

  useEffect(() => {
    setListVideoRooms();
  }, [rtc]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '16px',
        flexDirection: 'column'
      }}
    >
      <label>url</label>
      <input value={url} onChange={(e) => setUrl(e.target.value)} />
      <label>token</label>
      <input value={token} onChange={(e) => setToken(e.target.value)} />
      <h1>{status}</h1>

      {context.local ? (
        <div style={{ width: '200px', height: '200px' }}>
          <VideoTrackRenderer track={rtc?.localVideoTrack} />
          {local}
        </div>
      ) : null}

      {Object.keys(context.remotes).map((d) => {
        return (
          <div key={d} style={{ width: '100px', height: '100px' }}>
            {rtc?.remotes[d].camera?.track ? (
              <VideoTrackRenderer track={rtc?.remotes[d].camera?.track} />
            ) : null}
          </div>
        );
      })}

      <ul>
        {rooms?.content.map((d) => {
          return (
            <button
              key={d.id}
              onClick={async () => {
                const test = await rtc?.api.me();
                if (test?.appUserId) {
                  const data = await rtc?.api.issueVideoRoomWebRtcToken(
                    d.id,
                    test?.appUserId
                  );

                  if (data) {
                    await rtc!.connect(
                      data?.webRtcServerUrl,
                      data?.webRtcToken,
                      context
                    );
                  }
                }
              }}
            >
              {d.id}
            </button>
          );
        })}
      </ul>

      {rtc ? (
        <button
          onClick={async () => {
            /*

      */
            await rtc.api.createVideoRoom({
              type: 'VIDEO_CONFERENCE' as any
            });
            await setListVideoRooms();
          }}
        >
          Create
        </button>
      ) : null}

      {status === 'LOADED' ? (
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={async () => {
              if (rtc) {
                // rtc.localVideoTrack = await createLocalVideoTrack();
                // rtc.localAudioTrack = await createLocalAudioTrack();

                // new FFCLocalVideoTrack()

                await rtc?.publishVideo({
                  id: 'default',
                  enabled: true
                });

                // await rtc?.publishAudio({
                //   id: 'default',
                //   enabled: true
                // })
              }
            }}
          >
            local video publish
          </button>

          <button
            onClick={async () => {
              if (rtc) {
                // rtc.localVideoTrack = await createLocalVideoTrack();
                // rtc.localAudioTrack = await createLocalAudioTrack();

                // new FFCLocalVideoTrack()

                await rtc?.publishAudio({
                  id: 'default',
                  enabled: true
                });

                // await rtc?.publishAudio({
                //   id: 'default',
                //   enabled: true
                // })
              }
            }}
          >
            local audio publish
          </button>
          <button
            onClick={async () => {
              await rtc?.disconnect();
            }}
          >
            disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
