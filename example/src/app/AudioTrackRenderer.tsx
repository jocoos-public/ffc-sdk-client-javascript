import { useCallback, useEffect, useRef } from 'react';

export type AudioTrackProps = {
  mediaStream?: MediaStream;
  audioContext?: AudioContext;
};

export const AudioTrackRenderer = ({
  mediaStream,
  audioContext
}: AudioTrackProps) => {
  const ref = useRef<HTMLAudioElement | null>(null);
  const sourceNode = useRef<MediaStreamAudioSourceNode | null>(null);

  const cleanupWebAudio = useCallback(() => {
    if (sourceNode.current) {
      sourceNode.current.disconnect();
    }

    sourceNode.current = null;
  }, []);

  useEffect(() => {
    cleanupWebAudio();

    if (mediaStream && ref.current && audioContext) {
      sourceNode.current = audioContext.createMediaStreamSource(mediaStream);

      sourceNode.current.connect(audioContext.destination);
      ref.current.srcObject = mediaStream;
      ref.current.play();
      audioContext.resume();
    }
  }, [ref.current, audioContext, { ...mediaStream }]);
  return <audio muted={true} ref={ref} />;
};
