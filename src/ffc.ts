import { FlipFlopCloudApi } from './api/ffc-api';
import type { FFCMemberDto, FFCNestedAppDto, FFCNestedMemberDto, FFCPagesDto, FFCRtcVideoRoomTokenDto, FFCVideoRoomDto, FFCVideoRoomPolicyDto } from './api/types/data';
import type { FFCCreateVideoRoomParams, FFCIssueRtcVideoRoomTokenParams, FFCUpdateVideoRoomParams } from './api/types/params';
import type { FFCListVideoRoomsQuery } from './api/types/query';
import { SdkNotInitializedError } from './errors';

export default class FlipFlopCloud {
  private static instance: FlipFlopCloudApi;
  
  static init(baseUrl: string, accessToken: string, refreshToken?: string): void {
    if (FlipFlopCloud.instance) {
      console.warn('FlipFlopCloud instance already initialized');
    }
    FlipFlopCloud.instance = new FlipFlopCloudApi(baseUrl, accessToken, refreshToken);
  }

  static getMe(): Promise<FFCMemberDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.me().then((res) => {
      return toFFCMemberDto(res);
    });
  }

  static createVideoRoom(params: FFCCreateVideoRoomParams): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.createVideoRoom(params).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  static listVideoRooms(query?: FFCListVideoRoomsQuery): Promise<FFCPagesDto<FFCVideoRoomDto>> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.listVideoRooms(query).then((res) => {
      return toFFCPages(res, toFFCVideoRoomDto);
    });
  }

  static getVideoRoom(videoRoomId: number): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.getVideoRoom(videoRoomId).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  static updateVideoRoom(videoRoomId: number, params: FFCUpdateVideoRoomParams): Promise<FFCVideoRoomDto> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.updateVideoRoom(videoRoomId, params).then((res) => {
      return toFFCVideoRoomDto(res);
    });
  }

  static deleteVideoRoom(videoRoomId: number): Promise<void> {
    if (!FlipFlopCloud.instance) {
      throw new SdkNotInitializedError();
    }
    return this.instance.deleteVideoRoom(videoRoomId);
  }

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

function toFFCNestedAppDto(res: any): FFCNestedAppDto {
  return {
    id: res.id,
    name: res.name,
  };
}

function toFFCNestedMemberDto(res: any): FFCNestedMemberDto {
  return {
    id: res.id,
    appUserId: res.appUserId,
    appUserName: res.appUserName,
    appUserProfileImgUrl: res.appUserProfileImgUrl,
  };
}

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

function toFFCVideoRoomPolicyDto(res: any): FFCVideoRoomPolicyDto {
  return {
    hasPassword: res.hasPassword,
    manuallyApproval: res.manuallyApproval,
    canAutoRoomCompositeRecording: res.canAutoRoomCompositeRecording,
    //maxParticipantCount: res.maxParticipantCount,
  };
}

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