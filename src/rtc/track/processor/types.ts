import type { AudioProcessorOptions, ProcessorOptions, Room, Track, TrackProcessor } from 'livekit-client';
import { FFCTrack } from '../track';
import type FFCRtcVideoRoom from '../../rtc-video-room';
import { wrapRtcVideoRoom } from '../../wrapper-rtc-video-room';

/**
 * @experimental
 */
export type FFCProcessorOptions<T extends FFCTrack.Kind> = {
  kind: T;
  track: MediaStreamTrack;
  element?: HTMLMediaElement;
  audioContext?: AudioContext;
};

/**
 * @experimental
 */
export interface FFCAudioProcessorOptions extends FFCProcessorOptions<FFCTrack.Kind.Audio> {
  audioContext: AudioContext;
}

/**
 * @experimental
 */
export interface FFCVideoProcessorOptions extends FFCProcessorOptions<FFCTrack.Kind.Video>{}

/**
 * @experimental
 */
export interface FFCTrackProcessor<T extends FFCTrack.Kind, U extends FFCProcessorOptions<T> = FFCProcessorOptions<T>> {
  name: string;
  init: (opts: U) => Promise<void>;
  restart: (opts: U) => Promise<void>;
  destroy: () => Promise<void>;
  processedTrack?: MediaStreamTrack;
  onPublish?: (room: FFCRtcVideoRoom) => Promise<void>;
  onUnpublish?: () => Promise<void>;
}

/** @internal */
export namespace FFCTrackProcessor {
  export function fromTrackProcessor<T extends FFCTrack.Kind>(processor: TrackProcessor<FFCTrack.MapToTrackKind<T>>): FFCTrackProcessor<T> {
    return {
      name: processor.name,
      init: async (opts: FFCProcessorOptions<T>) => {
        await processor.init({
          kind: FFCTrack.toTrackKind(opts.kind) as FFCTrack.MapToTrackKind<T>,
          track: opts.track,
          element: opts.element,
          audioContext: opts.kind === FFCTrack.Kind.Audio ? opts.audioContext! : opts.audioContext,
        });
      },
      restart: async (opts: FFCProcessorOptions<T>) => {
        await processor.restart({
          kind: FFCTrack.toTrackKind(opts.kind) as FFCTrack.MapToTrackKind<T>,
          track: opts.track,
          element: opts.element,
          audioContext: opts.kind === FFCTrack.Kind.Audio ? opts.audioContext! : opts.audioContext,
        });
      },
      destroy: async () => {
        await processor.destroy();
      },
      processedTrack: processor.processedTrack,
      onPublish: async (room: FFCRtcVideoRoom) => {
        if (processor.onPublish) {
          await processor.onPublish(room.instance);
        }
      },
      onUnpublish: processor.onUnpublish,
    };
  }

  export function toTrackProcessor<FFCTrackKind extends FFCTrack.Kind>(
    ffcProcessor: FFCTrackProcessor<FFCTrackKind>
  ): TrackProcessor<FFCTrack.MapToTrackKind<FFCTrackKind>> {
    return {
      name: ffcProcessor.name,
      init: async (opts: ProcessorOptions<FFCTrack.MapToTrackKind<FFCTrackKind>>): Promise<void> => {
        await ffcProcessor.init({
          kind: FFCTrack.fromTrackKind(opts.kind) as FFCTrackKind,
          track: opts.track,
          element: opts.element,
          audioContext: opts.audioContext,
        });
      },
      restart: async (opts: ProcessorOptions<FFCTrack.MapToTrackKind<FFCTrackKind>>): Promise<void> => {
        await ffcProcessor.restart({
          kind: FFCTrack.fromTrackKind(opts.kind) as FFCTrackKind,
          track: opts.track,
          element: opts.element,
          audioContext: opts.audioContext,
        });
      },
      destroy: ffcProcessor.destroy,
      processedTrack: ffcProcessor.processedTrack,
      onPublish: async (room: Room): Promise<void> => {
        if (ffcProcessor.onPublish) {
          await ffcProcessor.onPublish(wrapRtcVideoRoom(room));
        }
      },
      onUnpublish: ffcProcessor.onUnpublish,
    };
  }
}

export interface FFCAudioTrackProcessor extends FFCTrackProcessor<FFCTrack.Kind.Audio, FFCAudioProcessorOptions> {}

export namespace FFCAudioTrackProcessor {
  export function fromTrackProcessor(processor: TrackProcessor<Track.Kind.Audio, AudioProcessorOptions>): FFCAudioTrackProcessor {
    return FFCAudioTrackProcessor.fromTrackProcessor(processor);
  }

  export function toTrackProcessor(processor: FFCAudioTrackProcessor): TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
    return FFCAudioTrackProcessor.toTrackProcessor(processor);
  }
}

export interface FFCVideoTrackProcessor extends FFCTrackProcessor<FFCTrack.Kind.Video, FFCVideoProcessorOptions> {}

export namespace FFCVideoTrackProcessor {
  export function fromTrackProcessor(processor: TrackProcessor<FFCTrack.MapToTrackKind<FFCTrack.Kind.Video>>): FFCVideoTrackProcessor {
    return FFCVideoTrackProcessor.fromTrackProcessor(processor);
  }

  export function toTrackProcessor(processor: FFCVideoTrackProcessor): TrackProcessor<FFCTrack.MapToTrackKind<FFCTrack.Kind.Video>> {
    return FFCVideoTrackProcessor.toTrackProcessor(processor);
  }
}