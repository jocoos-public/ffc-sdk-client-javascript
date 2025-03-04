import { FFCAccessLevel, FFCVideoRoomState, FFCVideoRoomType } from "./enums";

/**
 * Represents a generic query object for fetching paginated results.
 */
export interface FFCQuery {
  /**
   * The page number for pagination (1-based index).
   * If not provided, defaults to the first page.
   */
  page?: number;

  /**
   * The number of items per page.
   * Determines the maximum number of results per query.
   */
  pageSize?: number;
}

/**
 * Enumeration for sorting members by application user ID.
 */
export enum FFCMembersSortOption {
  /** Sort by creation date in ascending order */
  CREATED_AT_ASC = 'CREATED_AT_ASC',  

  /** Sort by creation date in descending order */
  CREATED_AT_DESC = 'CREATED_AT_DESC',  
  
  /** Sort by last modified date in ascending order */
  LAST_MODIFIED_AT_ASC = 'LAST_MODIFIED_AT_ASC',
  
  /** Sort by last modified date in descending order */
  LAST_MODIFIED_AT_DESC = 'LAST_MODIFIED_AT_DESC',

  /** Sort by application user ID in ascending order */
  APP_USER_ID_ASC = 'APP_USER_ID_ASC',

  /** Sort by application user ID in descending order */
  APP_USER_ID_DESC = 'APP_USER_ID_DESC',
}

/**
 * Represents a query object for fetching a list of members with optional filters.
 * Extends {@link FFCQuery} to include additional filtering options.
 */
export interface FFCListMembersQuery extends FFCQuery {
  /**
   * Filter results by application user ID.
   * If provided, the query will return only members matching this ID.
   */
  appUserId?: string;

  /**
   * Filter results by application user name.
   * If provided, the query will return only members matching this name.
   */
  appUserName?: string;

  /**
   * Sorting criteria for the query.
   */
  sortBy?: FFCMembersSortOption;
}

export enum FFCVideoRoomsSortOption {
  /** Sort by creation date in ascending order */
  CREATED_AT_ASC = 'CREATED_AT_ASC',  

  /** Sort by creation date in descending order */
  CREATED_AT_DESC = 'CREATED_AT_DESC',  
  
  /** Sort by last modified date in ascending order */
  LAST_MODIFIED_AT_ASC = 'LAST_MODIFIED_AT_ASC',
  
  /** Sort by last modified date in descending order */
  LAST_MODIFIED_AT_DESC = 'LAST_MODIFIED_AT_DESC',
}

/**
 * Represents a query object for fetching a list of video rooms with optional filters.
 * Extends {@link FFCQuery} to include additional filtering options.
 */
export interface FFCListVideoRoomsQuery extends FFCQuery {
  /**
   * Filter results by application user ID.
   * If provided, the query will return only video rooms associated with this user.
   */
  appUserId?: string;

  /**
   * Keyword used for searching video rooms by name or other relevant fields.
   * If provided, only rooms matching the keyword will be returned.
   */
  keyword?: string;

  /**
   * The state of the video room.
   * Defines whether the room is active, inactive, or in another state.
   * Uses {@link FFCVideoRoomState}.
   */
  videoRoomState?: FFCVideoRoomState;

  /**
   * The type of video room.
   * Specifies whether the room is a one-on-one call, a group call, etc.
   * Uses {@link FFCVideoRoomType}.
   */
  type?: FFCVideoRoomType;

  /**
   * The access level of the video room.
   * Determines if the room is public, private, or has restricted access.
   * Uses {@link FFCAccessLevel}.
   */
  accessLevel?: FFCAccessLevel;

  /**
   * Sorting criteria for the query.
   */
  sortBy?: FFCVideoRoomsSortOption;
}
