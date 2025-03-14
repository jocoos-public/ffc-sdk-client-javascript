import type { AudioReceiverStats, AudioSenderStats, VideoReceiverStats, VideoSenderStats } from "livekit-client";

export interface FFCAudioSenderStats extends AudioSenderStats {
  /** number of packets sent */
  packetsSent?: number;

  /** number of bytes sent */
  bytesSent?: number;

  /** jitter as perceived by remote */
  jitter?: number;

  /** packets reported lost by remote */
  packetsLost?: number;

  /** RTT reported by remote */
  roundTripTime?: number;

  /** ID of the outbound stream */
  streamId?: string;

  timestamp: number;

  type: 'audio';
}

export interface FFCVideoSenderStats extends VideoSenderStats {
  /** number of packets sent */
  packetsSent?: number;

  /** number of bytes sent */
  bytesSent?: number;

  /** jitter as perceived by remote */
  jitter?: number;

  /** packets reported lost by remote */
  packetsLost?: number;

  /** RTT reported by remote */
  roundTripTime?: number;

  /** ID of the outbound stream */
  streamId?: string;

  timestamp: number;

  type: 'video';

  firCount: number;

  pliCount: number;

  nackCount: number;

  rid: string;

  frameWidth: number;

  frameHeight: number;

  framesPerSecond: number;

  framesSent: number;

  // bandwidth, cpu, other, none
  qualityLimitationReason?: string;

  qualityLimitationDurations?: Record<string, number>;

  qualityLimitationResolutionChanges?: number;

  retransmittedPacketsSent?: number;

  targetBitrate: number;
}

export interface FFCAudioReceiverStats extends AudioReceiverStats {
  jitterBufferDelay?: number;

  /** packets reported lost by remote */
  packetsLost?: number;

  /** number of packets sent */
  packetsReceived?: number;

  bytesReceived?: number;

  streamId?: string;

  jitter?: number;

  timestamp: number;

  type: 'audio';

  concealedSamples?: number;

  concealmentEvents?: number;

  silentConcealedSamples?: number;

  silentConcealmentEvents?: number;

  totalAudioEnergy?: number;

  totalSamplesDuration?: number;
}

export interface FFCVideoReceiverStats extends VideoReceiverStats {
  jitterBufferDelay?: number;

  /** packets reported lost by remote */
  packetsLost?: number;

  /** number of packets sent */
  packetsReceived?: number;

  bytesReceived?: number;

  streamId?: string;

  jitter?: number;

  timestamp: number;

  type: 'video';

  framesDecoded: number;

  framesDropped: number;

  framesReceived: number;

  frameWidth?: number;

  frameHeight?: number;

  firCount?: number;

  pliCount?: number;

  nackCount?: number;

  decoderImplementation?: string;

  mimeType?: string;
 }