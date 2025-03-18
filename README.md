# FlipFlop Cloud JavaScript/TypeScript Client SDK

This SDK is for developing frontend for `FlipFlop Cloud` Applications.

## Documentation

The SDK documentation can be found [here](https://jocoos-public.s3.ap-northeast-2.amazonaws.com/docs/ffc-sdk-client-javascript/index.html).

## Installation

### NPM

```shell
npm install @jocoos/ffc-sdk-client-javascript
```

### Yarn

```shell
yarn add @jocoos/ffc-sdk-client-javascript
```

## Usage

### Initialization

The SDK can be targeted to either the sandbox or production environment and assumes its use for a logged in user. Therefore, you must initialize it with the API endpoint of the targeted environment and member access token for your FlipFlop/Vicollo app in `FlipFlop Cloud`.

```typescript
import { FlipFlopCloud } from '@jocoos/ffc-sdk-client-javascript'

// Constant indicating whether the targeted FlipFlop Cloud environment is sandbox or production
const FFC_ENV = 'sandbox'; // or 'produdction'

// Constant for the FlipFlop Cloud API endpoint
const FFC_ENDPOINT_BASE_URL = FFC_ENV === 'sandbox'
  ? 'https://api-sandbox.flipflop.cloud'
  : 'https://api.flipflop.cloud';
// Constant for the user's member access token (must be obtained from your service backed)
const FFC_USER_MEMBER_ACCESS_TOKEN = '[REPLACE_THIS_WITH_ACTUAL_TOKEN_STRING]';

// Iniitialize SDK
FlipFlopCloud.init(FFC_ENDPOINT_BASE_URL, FFC_USER_MEMBER_ACCESS_TOKEN);
```

### Rest API Interface

The following are the signatures of the static methods of [`FlipFlopCloud`](https://jocoos-public.s3.ap-northeast-2.amazonaws.com/docs/ffc-sdk-client-javascript/classes/FlipFlopCloud.html) class that handles Rest API requests.

```typescript
// Get information of myself(the user which the member access token was issued to)
getMe(): Promise<FFCMemberDto>

// Create video room
createVideoRoom(params: FFCCreateVideoRoomParams): Promise<FFCVideoRoomDto>

// List video rooms
listVideoRooms(query?: FFCListVideoRoomsQuery): Promise<FFCPagesDto<FFCVideoRoomDto>>

// Get video room
getVideoRoom(videoRoomId: number): Promise<FFCVideoRoomDto>

// Update video room
updateVideoRoom(videoRoomId: number, params: FFCUpdateVideoRoomParams): Promise<FFCVideoRoomDto>

// Delete video room
deleteVideoRoom(videoRoomId: number): Promise<void>

// Issue token to join video room
issueRtcVideoRoomToken(videoRoomId: number, params?: FFCIssueRtcVideoRoomTokenParams): Promise<FFCRtcVideoRoomTokenDto>
```

### Video Room RTC Operation API

All operations for joining the video room and publising and subscribing streams work with the `FlipFlop Cloud` media server. The  `FFCRtcVideoRoom` class provides the API for the operations.

#### Operation Summary

The operations in the video room via `FFCRtcVideoRoom` can be summerized as the following.

##### **Participant**

- Anyone who joins the video room is referred to as a **Participant**. Participants can be further categorized into two types:
  - **Local Participant** – Refers to oneself (a single individual).
  - **Remote Participant** – Refers to other participants excluding oneself.
- Among the attributes of a **Participant**, the **metadata** string can be converted into JSON, which contains member information, allowing identification of which `FlipFlop Cloud` app member the participant corresponds to.

##### **Track Publication/Subscription**

- When a participant publishes a stream, it is referred to as a **Track Publication**.
- A **Local Participant's Track Publication** refers to information about the video/audio streams they have published.
  - When publishing a stream, a **Track** is created by collecting data from a camera or microphone and converting it into video or audio. A **TrackPublication** object can then be generated from the Track.
  - (The SDK provides APIs to simplify this process for ease of development, considering its complexity.)
- A **Remote Participant's Track Publication** refers to information about the video/audio streams published by other participants.
  - When subscribing to a stream, subscription settings are configured based on the list of **Track Publications** from remote participants.

##### **Connection**

- Creating an `FFCRtcVideoRoom` object does **not** mean joining the video room. To join, the object's **connect** function must be used.
- A **Local Participant** can create a **Track Publication** even before entering the `Video Room`.
- Upon entry:
  - The **Local Participant's Track Publication** is automatically published.
  - Information about already connected **Remote Participants** can be retrieved, including their **Track Publications**.
  - Newly joining **Remote Participants** can be detected through events triggered in the `FFCRtcVideoRoom` object.

#### FFCRtcVideoRoom Instantiation and Preperation

Create `FFCRtcVideoRoom` object and prepare for connection.

```typescript
const FFC_RTC_SERVER_URL = '[OBTAINED_WHEN_ISSUING_VIDEO_ROOM_TOKEN]';
const FFC_RTC_TOKEN = '[OBTAINED_WHEN_ISSUING_VIDEO_ROOM_TOKEN]';
const room = new FFCRtcVideoRoom();
room.prepareConnection(FFC_RTC_SERVER_URL, FFC_RTC_TOKEN);
```

Set up listeners for [`FFCRtcVideoRoomEvent`](https://jocoos-public.s3.ap-northeast-2.amazonaws.com/docs/ffc-sdk-client-javascript/enums/FFCRtcVideoRoomEvent.html).

```typescript
room.on(/* ROOM EVENT */, /* CALLBACK */)
```

#### Joining Room

Connect to room to join.

```typescript
await room.connect(FFC_RTC_SERVER_URL, FFC_RTC_TOKEN);
```

#### Publishing Streams

Publish by enabling camera and microphone using manually created `FFCTrack` or [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack).

```typescript
// Prepare webcam and microphone and create track and track publication so it could be published
room.localParticipant.enableCameraAndMicrophone();

// Or you can create tracks and publish them manually
// Create tracks
const tracks = await createLocalTracks({
  video: true,
  audio: true,
});
// publish the created tracks
await room.localParticipant.publishTrack(tracks[0]);
await room.localParticipant.publishTrack(tracks[1]);

// Or if you have a MediaStreamTrack you can publish it too.
await room.localParticipant.publishTrack(mediaStreamTrack);
```

#### Subscribing Streams

```typescript
// If FFCRtcVideoRoom object was not created with autoSubscribe option set to true,
// The iniation of a subscription must happen manually.
const REMOTE_PARTICIPANT_IDENTITY = '[IDENTITY_STRING_OF_SOME_PARTICIPANT]';
const TRACK_PUBLICATION_SID = '[PUBLICATION_TRACK_STREAM_ID]';
const remoteParticipant = room.remoteParticipant.get(REMOTE_PARTICIPANT_IDENTITY);
const publication = remoteParticipant.trackPublications.get(TRACK_PUBLICATION_SID);
publication.setSubscribed(true);


// Add event listeners for subscription and unsubsciption
room
  .on(FFCRtcVideoRoomEvent.TRACK_SUBSCRIBED, handleTrackSubscribed)
  .on(FFCRtcVideoRoomEvent.TRACK_UNSUBSCRIBED, handleTrackUnsubscribed)

function handleTrackSubscribed(
  track: FFCRemoteTrack,
  publication: FFCRemoteTrackPublication,
  participant: FFCRemoteParticipant,
) {
  if (track.kind === FFCTrack.Kind.Video || track.kind === FFCTrack.Kind.Audio) {
    // attach it to a new HTMLVideoElement or HTMLAudioElement
    const element = track.attach();
    parentElement.appendChild(element);
  }
}

function handleTrackUnsubscribed(
  track: FFCRemoteTrack,
  publication: FFCRemoteTrackPublication,
  participant: FFCRemoteParticipant,
) {
  // remove tracks from all attached elements
  track.detach();
}
```

## Example Code

```typescript
import {
  FFCLocalParticipant,
  FFCLocalTrackPublication,
  FFCParticipant,
  FFCRemoteParticipant,
  FFCRemoteTrack,
  FFCRemoteTrackPublication,
  FFCRtcVideoRoom,
  FFCRtcVideoRoomEvent,
  FFCTrack,
  FFCVideoPresets,
} from 'ffc-sdk-client-javascript';

// Use FlipFlopCloud.issueRtcVideoRoomTicket() to retrieve following information
const url = '';
const token = '';

async function main() {
  // creates a new room with options
  const room = new FFCRtcVideoRoom({
    // automatically manage subscribed video quality
    adaptiveStream: true,

    // optimize publishing bandwidth and CPU for published tracks
    dynacast: true,

    // default capture settings
    videoCaptureDefaults: {
      resolution: FFCVideoPresets.h720.resolution,
    },
  });

  // pre-warm connection, this can be called as early as your page is loaded
  room.prepareConnection(url, token);

  // set up event listeners
  room
    .on(FFCRtcVideoRoomEvent.TRACK_SUBSCRIBED, handleTrackSubscribed)
    .on(FFCRtcVideoRoomEvent.TRACK_UNSUBSCRIBED, handleTrackUnsubscribed)
    .on(FFCRtcVideoRoomEvent.ACTIVE_SPEAKERS_CHANGED, handleActiveSpeakerChange)
    .on(FFCRtcVideoRoomEvent.DISCONNECTED, handleDisconnect)
    .on(FFCRtcVideoRoomEvent.LOCAL_TRACK_UNPUBLISHED, handleLocalTrackUnpublished);

  // connect to room
  await room.connect(url, token);
  console.log('connected to room', room.name);

  // publish local camera and mic tracks
  await room.localParticipant.enableCameraAndMicrophone();
}

function handleTrackSubscribed(
  track: FFCRemoteTrack,
  publication: FFCRemoteTrackPublication,
  participant: FFCRemoteParticipant,
) {
  if (track.kind === FFCTrack.Kind.Video || track.kind === FFCTrack.Kind.Audio) {
    const parentElement = document.getElementById('subscriptions')
    if (parentElement === null) {
      console.error('parent element not found');
      return;
    }
    const element = track.attach();
    parentElement.appendChild(element);
  }
}

function handleTrackUnsubscribed(
  track: FFCRemoteTrack,
  publication: FFCRemoteTrackPublication,
  participant: FFCRemoteParticipant,
) {
  // remove tracks from all attached elements
  track.detach();
}

function handleLocalTrackUnpublished(
  publication: FFCLocalTrackPublication,
  participant: FFCLocalParticipant,
) {
  // when local tracks are ended, update UI to remove them from rendering
  publication.track?.detach();
}

function handleActiveSpeakerChange(speakers: FFCParticipant[]) {
  // show UI indicators when participant is speaking
}

function handleDisconnect() {
  console.log('disconnected from room');
}

main().then(() => {
  console.log('done');
}).catch((error) => {
  console.error('error', error);
});
```