/**
 * Defines the access levels for a video room.
 */
export enum FFCAccessLevel {
  /** The video room is publicly accessible. */
  PUBLIC = 'PUBLIC',

  // The following access levels are commented out but can be included if needed:
  // APP = 'APP',
  // MEMBER = 'MEMBER',
  // FOLLOWER = 'FOLLOWER',
  // FRIEND = 'FRIEND',
  // RESTRICTED = 'RESTRICTED',
  // PRIVATE = 'PRIVATE',
}

/**
 * Represents the possible states of a video room.
 */
export enum FFCVideoRoomState {
  /** The video room is scheduled for a future time. */
  SCHEDULED = 'SCHEDULED',

  /** The scheduled video room has been cancelled. */
  CANCELLED = 'CANCELLED',

  /** The video room is currently live. */
  LIVE = 'LIVE',

  /** The video room is live but currently inactive. */
  LIVE_INACTIVE = 'LIVE_INACTIVE',

  /** The video room session has ended. */
  ENDED = 'ENDED',
}

/**
 * Defines the different types of video rooms.
 */
export enum FFCVideoRoomType {
  /** The video room is a broadcast using RTMP (Real-Time Messaging Protocol). */
  BROADCAST_RTMP = 'BROADCAST_RTMP',

  /** The video room is a multi-user video conference. */
  VIDEO_CONFERENCE = 'VIDEO_CONFERENCE',
}

/**
 * Represents the type of creator for a video room.
 */
export enum FFCCreatorType {
  /** The video room was created by a user. */
  USER = "USER",

  /** The video room was created by an application. */
  APP = "APP",

  /** The video room was created by a member. */
  MEMBER = "MEMBER",
}
