export enum FFCRtcVideoRoomEvent {
  /**
   * When the connection to the server has been established
   */
  CONNECTED = 'CONNECTED',

  /**
   * When the connection to the server has been interrupted and it's attempting
   * to reconnect.
   */
  RECONNECTING = 'RECONNECTING',

  /**
   * When the signal connection to the server has been interrupted. This isn't noticeable to users most of the time.
   * It will resolve with a `RoomEvent.Reconnected` once the signal connection has been re-established.
   * If media fails additionally it an additional `RoomEvent.Reconnecting` will be emitted.
   */
  SIGNAL_RECONNECTING = 'SIGNAL_RECONNECTING',

  /**
   * Fires when a reconnection has been successful.
   */
  RECONNECTED = 'RECONNECTED',

  /**
   * When disconnected from room. This fires when room.disconnect() is called or
   * when an unrecoverable connection issue had occured.
   *
   * DisconnectReason can be used to determine why the participant was disconnected. Notable reasons are
   * - DUPLICATE_IDENTITY: another client with the same identity has joined the room
   * - PARTICIPANT_REMOVED: participant was removed by RemoveParticipant API
   * - ROOM_DELETED: the room has ended via DeleteRoom API
   *
   * args: ([[DisconnectReason]])
   */
  DISCONNECTED = 'DISCONNECTED',

  /**
   * Whenever the connection state of the room changes
   *
   * args: ([[ConnectionState]])
   */
  CONNECTION_STATE_CHANGED = 'CONNECTION_STATE_CHANGED',

  /**
   * When input or output devices on the machine have changed.
   */
  MEDIA_DEVICES_CHANGED = 'MEDIA_DEVICES_CHANGED',

  /**
   * When a [[RemoteParticipant]] joins *after* the local
   * participant. It will not emit events for participants that are already
   * in the room
   *
   * args: ([[RemoteParticipant]])
   */
  PARTICIPANT_CONNECTED = 'PARTICIPANT_CONNECTED',

  /**
   * When a [[RemoteParticipant]] leaves *after* the local
   * participant has joined.
   *
   * args: ([[RemoteParticipant]])
   */
  PARTICIPANT_DISCONNECTED = 'PARTICIPANT_DISCONNECTED',

  /**
   * When a new track is published to room *after* the local
   * participant has joined. It will not fire for tracks that are already published.
   *
   * A track published doesn't mean the participant has subscribed to it. It's
   * simply reflecting the state of the room.
   *
   * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
   */
  TRACK_PUBLISHED = 'TRACK_PUBLISHED',

  /**
   * The [[LocalParticipant]] has subscribed to a new track. This event will **always**
   * fire as long as new tracks are ready for use.
   *
   * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
   */
  TRACK_SUBSCRIBED = 'TRACK_SUBSCRIBED',

  /**
   * Could not subscribe to a track
   *
   * args: (track sid, [[RemoteParticipant]])
   */
  TRACK_SUBSCRIPTION_FAILED = 'TRACK_SUBSCRIPTION_FAILED',

  /**
   * A [[RemoteParticipant]] has unpublished a track
   *
   * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
   */
  TRACK_UNPUBLISHED = 'TRACK_UNPUBLISHED',

  /**
   * A subscribed track is no longer available. Clients should listen to this
   * event and ensure they detach tracks.
   *
   * args: ([[Track]], [[RemoteTrackPublication]], [[RemoteParticipant]])
   */
  TRACK_UNSUBSCRIBED = 'TRACK_UNSUBSCRIBED',

  /**
   * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
   *
   * args: ([[TrackPublication]], [[Participant]])
   */
  TRACK_MUTED = 'TRACK_MUTED',

  /**
   * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
   *
   * args: ([[TrackPublication]], [[Participant]])
   */
  TRACK_UNMUTED = 'TRACK_UNMUTED',

  /**
   * A local track was published successfully. This event is helpful to know
   * when to update your local UI with the newly published track.
   *
   * args: ([[LocalTrackPublication]], [[LocalParticipant]])
   */
  LOCAL_TRACK_PUBLISHED = 'LOCAL_TRACK_PUBLISHED',

  /**
   * A local track was unpublished. This event is helpful to know when to remove
   * the local track from your UI.
   *
   * When a user stops sharing their screen by pressing "End" on the browser UI,
   * this event will also fire.
   *
   * args: ([[LocalTrackPublication]], [[LocalParticipant]])
   */
  LOCAL_TRACK_UNPUBLISHED = 'LOCAL_TRACK_UNPUBLISHED',

  /**
   * When a local audio track is published the SDK checks whether there is complete silence
   * on that track and emits the LocalAudioSilenceDetected event in that case.
   * This allows for applications to show UI informing users that they might have to
   * reset their audio hardware or check for proper device connectivity.
   */
  LOCAL_AUDIO_SILENCE_DETECTED = 'LOCAL_AUDIO_SILENCE_DETECTED',

  /**
   * Active speakers changed. List of speakers are ordered by their audio level.
   * loudest speakers first. This will include the LocalParticipant too.
   *
   * Speaker updates are sent only to the publishing participant and their subscribers.
   *
   * args: (Array<[[Participant]]>)
   */
  ACTIVE_SPEAKERS_CHANGED = 'ACTIVE_SPEAKERS_CHANGED',

  /**
   * Participant metadata is a simple way for app-specific state to be pushed to
   * all users.
   * When RoomService.UpdateParticipantMetadata is called to change a participant's
   * state, *all*  participants in the room will fire this event.
   *
   * args: (prevMetadata: string, [[Participant]])
   *
   */
  PARTICIPANT_METADATA_CHANGED = 'PARTICIPANT_METADATA_CHANGED',

  /**
   * Participant's display name changed
   *
   * args: (name: string, [[Participant]])
   *
   */
  PARTICIPANT_NAME_CHANGED = 'PARTICIPANT_NAME_CHANGED',

  /**
   * Participant attributes is an app-specific key value state to be pushed to
   * all users.
   * When a participant's attributes changed, this event will be emitted with the changed attributes and the participant
   * args: (changedAttributes: [[Record<string, string]], participant: [[Participant]])
   */
  PARTICIPANT_ATTRIBUTES_CHANGED = 'PARTICIPANT_ATTRIBUTES_CHANGED',

  /**
   * Room metadata is a simple way for app-specific state to be pushed to
   * all users.
   * When RoomService.UpdateRoomMetadata is called to change a room's state,
   * *all*  participants in the room will fire this event.
   *
   * args: (string)
   */
  ROOM_METADATA_CHANGED = 'ROOM_METADATA_CHANGED',

  /**
   * Data received from another participant.
   * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
   * All participants in the room will receive the messages sent to the room.
   *
   * args: (payload: Uint8Array, participant: [[Participant]], kind: [[DataPacket_Kind]], topic?: string)
   */
  //DataReceived = 'dataReceived',

  /**
   * SIP DTMF tones received from another participant.
   *
   * args: (participant: [[Participant]], dtmf: [[DataPacket_Kind]])
   */
  //SipDTMFReceived = 'sipDTMFReceived',

  /**
   * Transcription received from a participant's track.
   * @beta
   */
  //TranscriptionReceived = 'transcriptionReceived',

  /**
   * Connection quality was changed for a Participant. It'll receive updates
   * from the local participant, as well as any [[RemoteParticipant]]s that we are
   * subscribed to.
   *
   * args: (connectionQuality: [[ConnectionQuality]], participant: [[Participant]])
   */
  CONNECTION_QUALITY_CHANGED = 'CONNECTION_QUALITY_CHANGED',

  /**
   * StreamState indicates if a subscribed (remote) track has been paused by the SFU
   * (typically this happens because of subscriber's bandwidth constraints)
   *
   * When bandwidth conditions allow, the track will be resumed automatically.
   * TrackStreamStateChanged will also be emitted when that happens.
   *
   * args: (pub: [[RemoteTrackPublication]], streamState: [[Track.StreamState]],
   *        participant: [[RemoteParticipant]])
   */
  TRACK_STREAM_STATE_CHANGED = 'TRACK_STREAM_STATE_CHANGED',

  /**
   * One of subscribed tracks have changed its permissions for the current
   * participant. If permission was revoked, then the track will no longer
   * be subscribed. If permission was granted, a TrackSubscribed event will
   * be emitted.
   *
   * args: (pub: [[RemoteTrackPublication]],
   *        status: [[TrackPublication.PermissionStatus]],
   *        participant: [[RemoteParticipant]])
   */
  TRACK_SUBSCRIPTION_PERMISSION_CHANGED = 'TRACK_SUBSCRIPTION_PERMISSION_CHANGED',

  /**
   * One of subscribed tracks have changed its status for the current
   * participant.
   *
   * args: (pub: [[RemoteTrackPublication]],
   *        status: [[TrackPublication.SubscriptionStatus]],
   *        participant: [[RemoteParticipant]])
   */
  TRACK_SUBSCRIPTION_STATUS_CHANGED = 'TRACK_SUBSCRIPTION_STATUS_CHANGED',

  /**
   * LiveKit will attempt to autoplay all audio tracks when you attach them to
   * audio elements. However, if that fails, we'll notify you via AudioPlaybackStatusChanged.
   * `Room.canPlaybackAudio` will indicate if audio playback is permitted.
   */
  AUDIO_PLAYBACK_STATUS_CHANGED = 'AUDIO_PLAYBACK_STATUS_CHANGED',

  /**
   * LiveKit will attempt to autoplay all video tracks when you attach them to
   * a video element. However, if that fails, we'll notify you via VideoPlaybackStatusChanged.
   * Calling `room.startVideo()` in a user gesture event handler will resume the video playback.
   */
  VIDEO_PLAYBACK_STATUS_CHANGED = 'VIDEO_PLAYBACK_STATUS_CHANGED',

  /**
   * When we have encountered an error while attempting to create a track.
   * The errors take place in getUserMedia().
   * Use MediaDeviceFailure.getFailure(error) to get the reason of failure.
   * [[LocalParticipant.lastCameraError]] and [[LocalParticipant.lastMicrophoneError]]
   * will indicate if it had an error while creating the audio or video track respectively.
   *
   * args: (error: Error)
   */
  MEDIA_DEVICES_ERROR = 'MEDIA_DEVICES_ERROR',

  /**
   * A participant's permission has changed.
   * args: (prevPermissions: [[ParticipantPermission]], participant: [[Participant]])
   */
  PARTICIPANT_PERMISSIONS_CHANGED = 'PARTICIPANT_PERMISSIONS_CHANGED',

  /**
   * Signal connected, can publish tracks.
   */
  SIGNAL_CONNECTED = 'SIGNAL_CONNECTED',

  /**
   * Recording of a room has started/stopped. Room.isRecording will be updated too.
   * args: (isRecording: boolean)
   */
  RECORDING_STATUS_CHANGED = 'RECORDING_STATUS_CHANGED',

  PARTICIPANT_ENCRYPTION_STATUS_CHANGED = 'PARTICIPANT_ENCRYPTION_STATUS_CHANGED',

  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  /**
   * Emits whenever the current buffer status of a data channel changes
   * args: (isLow: boolean, kind: [[DataPacket_Kind]])
   */
  //DCBufferStatusChanged = 'dcBufferStatusChanged',

  /**
   * Triggered by a call to room.switchActiveDevice
   * args: (kind: MediaDeviceKind, deviceId: string)
   */
  ACTIVE_DEVICE_CHANGED = 'ACTIVE_DEVICE_CHANGED',

  //ChatMessage = 'chatMessage',
  /**
   * fired when the first remote participant has subscribed to the localParticipant's track
   */
  LOCAL_TRACK_SUBSCRIBED = 'LOCAL_TRACK_SUBSCRIBED',

  /**
   * fired when the client receives connection metrics from other participants
   */
  METRICS_RECEIVED = 'METRICS_RECEIVED',
}

export enum FFCParticipantEvent {
  /**
   * When a new track is published to room *after* the local
   * participant has joined. It will not fire for tracks that are already published.
   *
   * A track published doesn't mean the participant has subscribed to it. It's
   * simply reflecting the state of the room.
   *
   * args: ([[RemoteTrackPublication]])
   */
  TRACK_PUBLISHED = 'TRACK_PUBLISHED',

  /**
   * Successfully subscribed to the [[RemoteParticipant]]'s track.
   * This event will **always** fire as long as new tracks are ready for use.
   *
   * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
   */
  TRACK_SUBSCRIBED = 'TRACK_SUBSCRIBED',

  /**
   * Could not subscribe to a track
   *
   * args: (track sid)
   */
  TRACK_SUBSCRIPTION_FAILED = 'TRACK_SUBSCRIPTION_FAILED',

  /**
   * A [[RemoteParticipant]] has unpublished a track
   *
   * args: ([[RemoteTrackPublication]])
   */
  TRACK_UNPUBLISHED = 'TRACK_UNPUBLISHED',

  /**
   * A subscribed track is no longer available. Clients should listen to this
   * event and ensure they detach tracks.
   *
   * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
   */
  TRACK_UNSUBSCRIBED = 'TRACK_UNSUBSCRIBED',

  /**
   * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
   *
   * args: ([[TrackPublication]])
   */
  TRACK_MUTED = 'TRACK_MUTED',

  /**
   * A track that was unmuted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
   *
   * args: ([[TrackPublication]])
   */
  TRACK_UNMUTED = 'TRACK_UNMUTED',

  /**
   * A local track was published successfully. This event is helpful to know
   * when to update your local UI with the newly published track.
   *
   * args: ([[LocalTrackPublication]])
   */
  LOCAL_TRACK_PUBLISHED = 'LOCAL_TRACK_PUBLISHED',

  /**
   * A local track was unpublished. This event is helpful to know when to remove
   * the local track from your UI.
   *
   * When a user stops sharing their screen by pressing "End" on the browser UI,
   * this event will also fire.
   *
   * args: ([[LocalTrackPublication]])
   */
  LOCAL_TRACK_UNPUBLISHED = 'LOCAL_TRACK_UNPUBLISHED',

  /**
   * Participant metadata is a simple way for app-specific state to be pushed to
   * all users.
   * When RoomService.UpdateParticipantMetadata is called to change a participant's
   * state, *all*  participants in the room will fire this event.
   * To access the current metadata, see [[Participant.metadata]].
   *
   * args: (prevMetadata: string)
   *
   */
  PARTICIPANT_METADATA_CHANGED = 'PARTICIPANT_METADATA_CHANGED',

  /**
   * Participant's display name changed
   *
   * args: (name: string, [[Participant]])
   *
   */
  PARTICIPANT_NAME_CHANGED = 'PARTICIPANT_NAME_CHANGED',

  /**
   * Data received from this participant as sender.
   * Data packets provides the ability to use LiveKit to send/receive arbitrary payloads.
   * All participants in the room will receive the messages sent to the room.
   *
   * args: (payload: Uint8Array, kind: [[DataPacket_Kind]])
   */
  //DataReceived = 'dataReceived',

  /**
   * SIP DTMF tones received from this participant as sender.
   *
   * args: (dtmf: [[DataPacket_Kind]])
   */
  //SipDTMFReceived = 'sipDTMFReceived',

  /**
   * Transcription received from this participant as data source.
   * @beta
   */
  //TranscriptionReceived = 'transcriptionReceived',

  /**
   * Has speaking status changed for the current participant
   *
   * args: (speaking: boolean)
   */
  IS_SPEAKING_CHANGED = 'IS_SPEAKING_CHANGED',

  /**
   * Connection quality was changed for a Participant. It'll receive updates
   * from the local participant, as well as any [[RemoteParticipant]]s that we are
   * subscribed to.
   *
   * args: (connectionQuality: [[ConnectionQuality]])
   */
  CONNECTION_QUALITY_CHANGED = 'CONNECTION_QUALITY_CHANGED',

  /**
   * StreamState indicates if a subscribed track has been paused by the SFU
   * (typically this happens because of subscriber's bandwidth constraints)
   *
   * When bandwidth conditions allow, the track will be resumed automatically.
   * TrackStreamStateChanged will also be emitted when that happens.
   *
   * args: (pub: [[RemoteTrackPublication]], streamState: [[Track.StreamState]])
   */
  TRACK_STREAM_STATE_CHANGED = 'TRACK_STREAM_STATE_CHANGED',

  /**
   * One of subscribed tracks have changed its permissions for the current
   * participant. If permission was revoked, then the track will no longer
   * be subscribed. If permission was granted, a TrackSubscribed event will
   * be emitted.
   *
   * args: (pub: [[RemoteTrackPublication]],
   *        status: [[TrackPublication.SubscriptionStatus]])
   */
  TRACK_SUBSCRIPTION_PERMISSION_CHANGED = 'TRACK_SUBSCRIPTION_PERMISSION_CHANGED',

  /**
   * One of the remote participants publications has changed its subscription status.
   *
   */
  TRACK_SUBSCRIPTION_STATUS_CHANGED = 'TRACK_SUBSCRIPTION_STATUS_CHANGED',

  // fired only on LocalParticipant
  /** @internal */
  MEDIA_DEVICES_ERROR = 'MEDIA_DEVICES_ERROR',

  // fired only on LocalParticipant
  /** @internal */
  AUDIO_STREAM_ACQUIRED = 'AUDIO_STREAM_ACQUIRED',

  /**
   * A participant's permission has changed.
   * args: (prevPermissions: [[ParticipantPermission]])
   */
  PARTICIPANT_PERMISSIONS_CHANGED = 'PARTICIPANT_PERMISSIONS_CHANGED',

  /** @internal */
  //PCTrackAdded = 'pcTrackAdded',

  /**
   * Participant attributes is an app-specific key value state to be pushed to
   * all users.
   * When a participant's attributes changed, this event will be emitted with the changed attributes
   * args: (changedAttributes: [[Record<string, string]])
   */
  ATTRIBUTES_CHANGED = 'ATTRIBUTES_CHANGED',

  /**
   * fired on local participant only, when the first remote participant has subscribed to the track specified in the payload
   */
  LOCAL_TRACK_SUBSCRIBED = 'LOCAL_TRACK_SUBSCRIBED',

  /** only emitted on local participant */
  //ChatMessage = 'chatMessage',
}

export enum FFCTrackEvent {
  MESSAGE = 'MESSAGE',
  MUTED = 'MUTED',
  UNMUTED = 'UNMUTED',
  /**
   * Only fires on LocalTracks
   */
  RESTARTED = 'RESTARTED',
  ENDED = 'ENDED',
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  /** @internal */
  //UpdateSettings = 'updateSettings',
  /** @internal */
  //UpdateSubscription = 'updateSubscription',
  /** @internal */
  //AudioPlaybackStarted = 'audioPlaybackStarted',
  /** @internal */
  //AudioPlaybackFailed = 'audioPlaybackFailed',
  /**
   * @internal
   * Only fires on LocalAudioTrack instances
   */
  //AudioSilenceDetected = 'audioSilenceDetected',
  /** @internal */
  //VisibilityChanged = 'visibilityChanged',
  /** @internal */
  //VideoDimensionsChanged = 'videoDimensionsChanged',
  /** @internal */
  //VideoPlaybackStarted = 'videoPlaybackStarted',
  /** @internal */
  //VideoPlaybackFailed = 'videoPlaybackFailed',
  /** @internal */
  //ElementAttached = 'elementAttached',
  /** @internal */
  //ElementDetached = 'elementDetached',
  /**
   * @internal
   * Only fires on LocalTracks
   */
  //UpstreamPaused = 'upstreamPaused',
  /**
   * @internal
   * Only fires on LocalTracks
   */
  //UpstreamResumed = 'upstreamResumed',
  /**
   * @internal
   * Fires on RemoteTrackPublication
   */
  //SubscriptionPermissionChanged = 'subscriptionPermissionChanged',
  /**
   * Fires on RemoteTrackPublication
   */
  SUBSCRIPTION_STATUS_CHANGED = 'SUBSCRIPTION_STATUS_CHANGED',
  /**
   * Fires on RemoteTrackPublication
   */
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  /**
   * @internal
   */
  //TrackProcessorUpdate = 'trackProcessorUpdate',

  /**
   * @internal
   */
  //AudioTrackFeatureUpdate = 'audioTrackFeatureUpdate',

  /**
   * @beta
   */
  //TranscriptionReceived = 'transcriptionReceived',

  /**
   * @experimental
   */
  TIME_SYNC_UPDATE = 'TIME_SYNC_UPDATE',
}

export enum FFCTrackPublicationEvent {
  MUTED = 'MUTED',
  UNMUTED = 'UNMUTED',
  ENDED = 'ENDED',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  SUBSCRIPTION_PERMISSION_CHANGED = 'SUBSCRIPTION_PERMISSION_CHANGED',
  UPDATE_SUBSCRIPTION = 'UPDATE_SUBSCRIPTION',
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  SUBSCRIPTION_STATUS_CHANGED = 'SUBSCRIPTION_STATUS_CHANGED',
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  //TranscriptionReceived = 'transcriptionReceived',
  TIME_SYNC_UPDATE = 'TIME_SYNC_UPDATE',
}