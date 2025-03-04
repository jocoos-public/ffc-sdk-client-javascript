import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  FFCMemberDto, 
  FFCPagesDto, 
  FFCRtcVideoRoomTokenDto, 
  FFCVideoRoomDto 
} from "./types/data";
import type { 
  FFCCreateVideoRoomParams, 
  FFCIssueRtcVideoRoomTokenParams, 
  FFCUpdateVideoRoomParams 
} from "./types/params";
import type { FFCListVideoRoomsQuery } from "./types/query";

export class FlipFlopCloudApi {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  //private readonly refreshToken?: string;
  private readonly axiosInstance: AxiosInstance;

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
  
  issueVideoRoomWebRtcToken(videoRoomId: number, appUserId: string, params?: FFCIssueRtcVideoRoomTokenParams): Promise<FFCRtcVideoRoomTokenDto> {
    return this._request({
      method: 'POST',
      url: `/v2/members/me/video-rooms/${videoRoomId}/members/${appUserId}/web-rtc-tokens`,
      data: params,
    }, 201);
  }
}
