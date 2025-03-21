import { FFCAccessLevel, FFCChannelMemberState, FFCChannelMemberType, FFCChannelMessageOrigin, FFCChannelState, FFCCreatorType, FFCVideoRoomState, FFCVideoRoomType, type FFCChannelMessageType, type FFCChannelReferenceType } from "./enums";

/**
 * Generic DTO for paginated responses.
 *
 * @template T The type of content items in the pagination result.
 */
export interface FFCPagesDto<T> {
  /** The list of content items on the current page. */
  content: Array<T>;

  /** Total number of pages available. */
  totalPages: number;

  /** Total number of elements across all pages. */
  totalElements: number;

  /** Number of elements on the current page. */
  numberOfElements: number;

  /** The current page number (0-based index). */
  number: number;

  /** The number of items per page. */
  size: number;

  /** Whether this is the first page. */
  first: boolean;

  /** Whether this is the last page. */
  last: boolean;

  /** Whether the content is empty. */
  empty: boolean;
}

/**
 * Represents timestamp information for an entity.
 */
export interface FFCTimestampDto {
  /** The date and time when the entity was created. */
  createdAt: Date;

  /** The date and time when the entity was last modified. */
  lastModifiedAt: Date;
}

/**
 * Represents a nested application DTO.
 */
export interface FFCNestedAppDto {
  /** The unique identifier of the application. */
  id: number;

  /** The name of the application. */
  name: string;
}

/**
 * Represents a nested member DTO with basic user information.
 */
export interface FFCNestedMemberDto {
  /** The unique identifier of the member. */
  id: number;

  /** The application user ID associated with this member. */
  appUserId: string;

  /** The application user’s name (optional). */
  appUserName?: string;

  /** URL of the application user's profile image (optional). */
  appUserProfileImgUrl?: string;
}

/**
 * Represents a detailed member DTO, including timestamps and additional metadata.
 */
export interface FFCMemberDto extends FFCNestedMemberDto, FFCTimestampDto {
  /** Information about the associated application. */
  app: FFCNestedAppDto;

  /** The email address of the member (optional). */
  email?: string;

  /** The country associated with the member (optional). */
  country?: string;

  /** The preferred language of the member (optional). */
  lang?: string;
}

/**
 * Represents the credentials of a member.
 */
export interface FFCMemberCredentialsDto {
  /** The access token used for authentication. */
  accessToken: string;

  /** The refresh token used to obtain a new access token. */
  refreshToken: string;
}

/**
 * Represents policy settings for a video room.
 */
export interface FFCVideoRoomPolicyDto {
  /** Indicates whether the video room has a password set. */
  hasPassword: boolean;

  /** Indicates whether manual approval is required for entry. */
  manuallyApproval: boolean;

  /** Indicates whether the room supports automatic composite recording. */
  canAutoRoomCompositeRecording: boolean;

  /** The maximum number of participants allowed in the room (optional). */
  //maxParticipantCount?: number;
}

/**
 * Represents the details of a video room.
 */
export interface FFCVideoRoomDto extends FFCTimestampDto {
  /** The unique identifier of the video room. */
  id: number;

  /** The current state of the video room. Uses {@link FFCVideoRoomState}. */
  videoRoomState: FFCVideoRoomState;

  /** The type of video room. Uses {@link FFCVideoRoomType}. */
  type: FFCVideoRoomType;

  /** The access level of the video room. Uses {@link FFCAccessLevel}. */
  accessLevel: FFCAccessLevel;

  /** Information about the associated application. */
  app: FFCNestedAppDto;

  /** Information about the member who created the room. */
  member: FFCNestedMemberDto;

  /** The creator's type (e.g., user, system). Uses {@link FFCCreatorType}. */
  creatorType: FFCCreatorType;

  /** The unique identifier of the creator. */
  creatorId: number;

  /** The title of the video room (optional). */
  title?: string;

  /** A description of the video room (optional). */
  description?: string;

  /** A custom type assigned to the video room (optional). */
  customType?: string;

  /** Any additional custom data related to the video room (optional). */
  customData?: any;

  /** The policy settings of the video room. */
  policy: FFCVideoRoomPolicyDto;
}

/**
 * Represents a WebRTC token for accessing a video room.
 */
export interface FFCRtcVideoRoomTokenDto {
  /** The URL of the WebRTC server. */
  webRtcServerUrl: string;

  /** The WebRTC token used for authentication. */
  webRtcToken: string;
}

export interface FFCChannelPolicyDto {
  canMemberSelfJoin: boolean;
  memberAutoLeaveWhenDisconnects: boolean;
  canAutoResume: boolean;
}

export interface FFCChannelStatsDto {
  currentOnlineMemberCount: number;
}

export interface FFCChannelDto {
  id: number;
  channelState: FFCChannelState;
  app: FFCNestedAppDto;
  referenceType: FFCChannelReferenceType;
  referenceId: number;
  lastSessionNo: number;
  name: string;
  description?: string;
  customType?: string;
  customData?: Record<string, any>;
  policy: FFCChannelPolicyDto;
  openedAt?: Date;
  pausedAt?: Date;
  autoPaused: boolean;
  resumedAt?: Date;
  closedAt?: Date;
  stats: FFCChannelStatsDto;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface FFCChannelMemberDataDto {
  appUserId: string;
  appUserName: string;
  appUserProfileImgUrl: string;
  appUserCustomData?: Record<string, any>;
  email?: string;
}

export interface FFCNestedChannelMemberDto {
  type: FFCChannelMemberType;
  appUser: FFCChannelMemberDataDto;
  customType?: string;
  customData?: Record<string, any>;
}

export interface FFCChannelMemberDto {
  id: number;
  channelMemberState: FFCChannelMemberState;
  channelMemberType: FFCChannelMemberType;
  appUser: FFCChannelMemberDataDto;
  customType?: string;
  customData?: Record<string, any>;
  joinedAt: Date;
  rejoinedAt?: Date;
  lastSeenAt?: Date;
  bannedAt?: Date;
  unbannedAt?: Date;
  leavedAt?: Date;
  autoLeaved: boolean; 
}

export interface FFCChannelMessageDto {
  messageId: string;
  sentAt: Date;
  origin: FFCChannelMessageOrigin;
  type: FFCChannelMessageType;
  channelMember: FFCNestedChannelMemberDto;
  sessionNo: number;
  message: string;
  customType?: string;
  customData?: Record<string, any>;
}

