import { FFCAccessLevel, FFCVideoRoomType } from "./enums";

/**
 * Configuration options for initializing the SDK.
 */
export interface FFCSdkOptions {
  /** Enables or disables debug mode. */
  debug: boolean;
}

/**
 * Parameters for creating a new video room.
 */
export interface FFCCreateVideoRoomParams {
  /** The type of video room. Uses {@link FFCVideoRoomType}. */
  type: FFCVideoRoomType;

  /** The title of the video room (optional). */
  title?: string;

  /** The description of the video room (optional). */
  description?: string;

  /** The access level of the video room (optional). Uses {@link FFCAccessLevel}. */
  accessLevel?: FFCAccessLevel;

  scheduledAt?: Date;

  /** A custom type assigned to the video room (optional). */
  customType?: string;

  /** Additional custom data associated with the video room (optional). */
  customData?: any;

  /** The password required to join the video room (optional). */
  password?: string;

  /** Whether manual approval is required for participants to join (optional). */
  manuallyApproval?: boolean;

  /** Whether the room supports automatic composite recording (optional). */
  canAutoRoomCompositeRecording?: boolean;

  // The following property is commented out but can be included if needed:
  // maxParticipantCount?: number;
}

/**
 * Parameters for updating an existing video room.
 */
export interface FFCUpdateVideoRoomParams {
  /** The new title of the video room (optional). */
  title?: string;

  /** The new description of the video room (optional). */
  description?: string;

  /** The updated access level of the video room (optional). Uses {@link FFCAccessLevel}. */
  accessLevel?: FFCAccessLevel;

  /** The updated custom type assigned to the video room (optional). */
  customType?: string;

  /** Updated custom data for the video room (optional). */
  customData?: any;

  /** The updated password for the video room (optional). */
  password?: string;

  /** Whether manual approval is now required for participants to join (optional). */
  manuallyApproval?: boolean;

  /** Whether automatic composite recording is now enabled (optional). */
  canAutoRoomCompositeRecording?: boolean;

  // The following property is commented out but can be included if needed:
  // maxParticipantCount?: number;
}

/**
 * Parameters for issuing an RTC video room token.
 */
export interface FFCIssueRtcVideoRoomTokenParams {
  /** The password required to access the video room. */
  password: string;

  /** Additional custom data included in the token request. */
  customData: any;
}
