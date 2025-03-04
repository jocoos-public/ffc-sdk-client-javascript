import type { AudioReceiverStats, AudioSenderStats, VideoReceiverStats, VideoSenderStats } from "livekit-client";

export interface FFCAudioSenderStats extends AudioSenderStats {}

export interface FFCVideoSenderStats extends VideoSenderStats {}

export interface FFCAudioReceiverStats extends AudioReceiverStats {}

export interface FFCVideoReceiverStats extends VideoReceiverStats {}
