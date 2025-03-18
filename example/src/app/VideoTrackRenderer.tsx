import {
  ElementRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  VideoHTMLAttributes
} from 'react';

import { useCombinedRefs } from './useCombinedRefs';

import {
  FFCTrack,
  FFCVideoTrack,
  facingModeFromLocalTrack
} from 'ffc-sdk-client-javascript';

export type VideoTrackProps = VideoHTMLAttributes<HTMLVideoElement> & {
  track?: FFCVideoTrack;
  deviceId?: string;
};

export const VideoTrackRenderer = forwardRef<
  ElementRef<'video'>,
  VideoTrackProps
>((props, ref) => {
  const { track, ...otherProps } = props;
  const videoRef = useRef<ElementRef<'video'> | null>(null);

  const combinedRef = useCombinedRefs(ref, videoRef);

  useEffect(() => {
    if (videoRef.current && track) {
      track.attach(videoRef.current);

      return () => {
        track.detach(videoRef.current!);
      };
    }
  }, [videoRef, videoRef.current, track]);
  const mirror = useMemo(() => {
    return track ? facingModeFromLocalTrack(track?.mediaStreamTrack) : false;
  }, [track]);

  return (
    <video
      ref={combinedRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        ...(!mirror
          ? undefined
          : mirror.facingMode === 'user' &&
              track?.source === FFCTrack.Source.Camera
            ? { transform: 'rotateY(180deg)' }
            : undefined)
      }}
      {...otherProps}
    />
  );
});

VideoTrackRenderer.displayName = 'VideoTrackRenderer';
