import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  FFCChannelDto,
  FFCChannelMemberDto,
  FFCChannelMessageDto,
  FFCMemberDto, 
  FFCPagesDto, 
  FFCRtcVideoRoomTokenDto, 
  FFCVideoRoomDto 
} from "./types/data";
import type { 
  FFCCreateVideoRoomParams, 
  FFCIssueRtcVideoRoomTokenParams, 
  FFCJoinChannelDto, 
  FFCSendChannelMessageDto, 
  FFCUpdateVideoRoomParams 
} from "./types/params";
import type { FFCListChannelMessagesQuery, FFCListVideoRoomsQuery } from "./types/query";
import { EventSourcePolyfill as EventSource } from 'event-source-polyfill';

export class FlipFlopCloudApi {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  //private readonly refreshToken?: string;
  private readonly axiosInstance: AxiosInstance;
  private eventSource?: EventSource;

  constructor(baseUrl: string, accessToken: string, refreshToken?: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    //this.refreshToken = refreshToken;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  private async _request<T>(config: AxiosRequestConfig, expectStatus: number = 200): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(config);
      console.log('response', response.status, response.data);
      
      if (response.status !== expectStatus) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error.response?.status, error.response?.data || error.message);
      throw new Error(`API request failed: ${error.response?.status} ${error.response?.statusText} ${JSON.stringify(error.response?.data)}`);
    }
  }

  connectToEventSource() {
    const url = `${this.baseUrl}/v2/members/me/event-sources`;
    this.eventSource = new EventSource(url, {
      heartbeatTimeout: 60_000,
      lastEventIdQueryParameterName: 'Last-Event-ID',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    this.eventSource.onopen = () => {
      console.log('EventSource connected');
    }
    this.eventSource.onerror = (error) => {

      console.error('EventSource error:', error);
    };
    this.eventSource.onmessage = (event) => {
      console.log('EventSource message:', event.data);
    };
  }

  me(): Promise<FFCMemberDto> {
    return this._request({
      method: 'GET',
      url: '/v2/members/me',
    });
  }

  createVideoRoom(params: FFCCreateVideoRoomParams): Promise<FFCVideoRoomDto> {
    return this._request({
      method: 'POST',
      url: '/v2/members/me/video-rooms',
      data: params,
    }, 201);
  }
  
  listVideoRooms(query?: FFCListVideoRoomsQuery): Promise<FFCPagesDto<FFCVideoRoomDto>> {
    return this._request({
      method: 'GET',
      url: '/v2/members/me/video-rooms',
      params: query,
    });
  }
  
  getVideoRoom(videoRoomId: number): Promise<FFCVideoRoomDto> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}`,
    });
  }
  
  updateVideoRoom(videoRoomId: number, params: FFCUpdateVideoRoomParams): Promise<FFCVideoRoomDto> {
    return this._request({
      method: 'PATCH',
      url: `/v2/members/me/video-rooms/${videoRoomId}`,
      data: params,
    });
  }
  
  deleteVideoRoom(videoRoomId: number): Promise<void> {
    return this._request({
      method: 'DELETE',
      url: `/v2/members/me/video-rooms/${videoRoomId}`,
    });
  }
  
  issueRtcVideoRoomToken(videoRoomId: number, params?: FFCIssueRtcVideoRoomTokenParams): Promise<FFCRtcVideoRoomTokenDto> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/web-rtc-tokens`,
      data: params,
    }, 201);
  }

  getChannel(videoRoomId: number): Promise<FFCChannelDto> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel`,
    }, 200);
  }

  joinChannel(videoRoomId: number, params?: FFCJoinChannelDto): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/join`,
      data: params,
    }, 204);
  }

  sendChannelMessage(videoRoomId: number, params: FFCSendChannelMessageDto): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/messages`,
      data: params,
    }, 204);
  }
  
  listChannelMessages(videoRoomId: number, query?: FFCListChannelMessagesQuery): Promise<FFCPagesDto<FFCChannelMessageDto>> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/messages`,
      params: query ? {
        messageId: query.messageId,
        direction: query.direction,
        limit: query.limit
      } : undefined,
    }, 200);
  }

  getChannelMessage(videoRoomId: number, messageId: number): Promise<FFCChannelMessageDto> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/messages/${messageId}`,
    }, 200);
  }

  leaveChannel(videoRoomId: number): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/leave`,
    }, 204);
  }

  listChannelMembers(videoRoomId: number): Promise<FFCPagesDto<FFCChannelMemberDto>> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/members`,
    }, 200);
  }

  getChannelMember(videoRoomId: number, appUserId: string): Promise<FFCChannelMemberDto> {
    return this._request({
      method: 'GET',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/members/${appUserId}`,
    }, 200);
  }

  setChannelMemberAsOperator(videoRoomId: number, appUserId: string): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/members/${appUserId}/set-as-operator`,
    }, 204);
  }

  setChannelMemberAsMember(videoRoomId: number, appUserId: string): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/members/${appUserId}/set-as-member`,
    }, 204);
  }

  banChannelMember(videoRoomId: number, appUserId: string): Promise<void> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/channel/members/${appUserId}/ban`,
    }, 204);
  }
}
