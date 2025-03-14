import { FlipFlopCloudApi } from './api/ffc-api';
import type { FFCMemberDto, FFCNestedAppDto, FFCNestedMemberDto, FFCPagesDto, FFCRtcVideoRoomTokenDto, FFCVideoRoomDto, FFCVideoRoomPolicyDto } from './api/types/data';
import type { FFCCreateVideoRoomParams, FFCIssueRtcVideoRoomTokenParams, FFCUpdateVideoRoomParams } from './api/types/params';
import type { FFCListVideoRoomsQuery } from './api/types/query';
import { SdkNotInitializedError } from './errors';

/**
 * The `FlipFlopCloud` class provides a static interface for interacting with the FlipFlopCloud API.
 * It includes methods for initializing the SDK, managing video rooms, and retrieving user information.
 */
export default class FlipFlopCloud {
  private static instance: FlipFlopCloudApi;
  
  /**
   * Initializes the FlipFlopCloud SDK with the provided API base URL and access tokens.
   * 
   * @param baseUrl - The base URL of the FlipFlopCloud API.
   * @param accessToken - The access token for authenticating API requests.
   * @param refreshToken - (Optional) The refresh token for renewing the access token.
   */
  static init(baseUrl: string, accessToken: string, refreshToken?: string): void {
    if (FlipFlopCloud.instance) {
      console.warn('FlipFlopCloud instance already initialized');
    }
    FlipFlopCloud.instance = new FlipFlopCloudApi(baseUrl, accessToken, refreshToken);
  }

  /**
   * Retrieves the current user's information.
   * 
   * @returns A promise that resolves to the current user's details as an {@link FFCMemberDto}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static getMe(): Promise<FFCMemberDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.me().then((res) => {
      return toFFCMemberDto(res);
    });
  }

  /**
   * Creates a new video room with the specified parameters.
   * 
   * @param params - The parameters for creating the video room.
   * @returns A promise that resolves to the created video room details as an {@link FFCVideoRoomDto}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static createVideoRoom(params: FFCCreateVideoRoomParams): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.createVideoRoom(params).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  /**
   * Lists video rooms based on the provided query parameters.
   * 
   * @param query - (Optional) The query parameters for filtering the video rooms.
   * @returns A promise that resolves to a paginated list of video rooms as {@link FFCPagesDto<FFCVideoRoomDto>}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static listVideoRooms(query?: FFCListVideoRoomsQuery): Promise<FFCPagesDto<FFCVideoRoomDto>> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.listVideoRooms(query).then((res) => {
      return toFFCPages(res, toFFCVideoRoomDto);
    });
  }

  /**
   * Retrieves the details of a specific video room by its ID.
   * 
   * @param videoRoomId - The ID of the video room to retrieve.
   * @returns A promise that resolves to the video room details as an {@link FFCVideoRoomDto}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static getVideoRoom(videoRoomId: number): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.getVideoRoom(videoRoomId).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  /**
   * Updates the details of a specific video room by its ID.
   * 
   * @param videoRoomId - The ID of the video room to update.
   * @param params - The parameters for updating the video room.
   * @returns A promise that resolves to the updated video room details as an {@link FFCVideoRoomDto}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static updateVideoRoom(videoRoomId: number, params: FFCUpdateVideoRoomParams): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.updateVideoRoom(videoRoomId, params).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  /**
   * Deletes a specific video room by its ID.
   * 
   * @param videoRoomId - The ID of the video room to delete.
   * @returns A promise that resolves when the video room is successfully deleted.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static deleteVideoRoom(videoRoomId: number): Promise<void> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.deleteVideoRoom(videoRoomId);
  }

  /**
   * Issues a WebRTC token for a specific video room.
   * 
   * @param videoRoomId - The ID of the video room.
   * @param params - (Optional) Additional parameters for issuing the token.
   * @returns A promise that resolves to the WebRTC token details as an {@link FFCRtcVideoRoomTokenDto}.
   * @throws `SdkNotInitializedError` if the SDK has not been initialized.
   */
  static issueRtcVideoRoomToken(videoRoomId: number, params?: FFCIssueRtcVideoRoomTokenParams): Promise<FFCRtcVideoRoomTokenDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.issueRtcVideoRoomToken(videoRoomId, params).then((res) => {
      return {
        webRtcServerUrl: res.webRtcServerUrl,
        webRtcToken: res.webRtcToken,
      }
    });
  }

  /*
  static async enterVideoRoom(videoRoomId: number, appUserId: string, params?: FFCIssueRtcVideoRoomTokenParams): Promise<FFCRtcVideoRoom> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    const { webRtcServerUrl, webRtcToken } = await this.instance.issueVideoRoomWebRtcToken(videoRoomId, appUserId, params);
    const room = new FFCRtcVideoRoom();
    await room.connect(webRtcServerUrl, webRtcToken, {
      autoSubscribe: false,
      dynacast: true,
    });
    return room;
  }
  */
}

/** @internal */
function toFFCNestedAppDto(res: any): FFCNestedAppDto {
  return {
    id: res.id,
    name: res.name,
  };
}

/** @internal */
function toFFCNestedMemberDto(res: any): FFCNestedMemberDto {
  return {
    id: res.id,
    appUserId: res.appUserId,
    appUserName: res.appUserName,
    appUserProfileImgUrl: res.appUserProfileImgUrl,
  };
}

/** @internal */
function toFFCMemberDto(res: any): FFCMemberDto {
  return {
    id: res.id,
    appUserId: res.appUserId,
    appUserName: res.appUserName,
    appUserProfileImgUrl: res.appUserProfileImgUrl,
    app: toFFCNestedAppDto(res.app),
    email: res.email,
    country: res.country,
    lang: res.lang,
    createdAt: res.createdAt,
    lastModifiedAt: res.lastModifiedAt,
  };
}

/** @internal */
function toFFCVideoRoomPolicyDto(res: any): FFCVideoRoomPolicyDto {
  return {
    hasPassword: res.hasPassword,
    manuallyApproval: res.manuallyApproval,
    canAutoRoomCompositeRecording: res.canAutoRoomCompositeRecording,
    //maxParticipantCount: res.maxParticipantCount,
  };
}

/** @internal */
function toFFCVideoRoomDto(res: any): FFCVideoRoomDto {
  return {
    id: res.id,
    videoRoomState: res.videoRoomState,
    type: res.type,
    accessLevel: res.accessLevel,
    app: toFFCNestedAppDto(res.app),
    member: toFFCNestedMemberDto(res.member),
    creatorType: res.creatorType,
    creatorId: res.creatorId,
    title: res.title,
    description: res.description,
    customType: res.customType,
    customData: res.customData,
    policy: toFFCVideoRoomPolicyDto(res.policy),
    createdAt: res.createdAt,
    lastModifiedAt: res.lastModifiedAt,
  };
}

/** @internal */
function toFFCPages<T>(res: FFCPagesDto<any>, converter: Function): FFCPagesDto<T> {
  return {
    content: res.content.map((item) => converter(item)),
    totalPages: res.totalPages,
    totalElements: res.totalElements,
    numberOfElements: res.numberOfElements,
    number: res.number,
    size: res.size,
    first: res.first,
    last: res.last,
    empty: res.empty,
  };
}