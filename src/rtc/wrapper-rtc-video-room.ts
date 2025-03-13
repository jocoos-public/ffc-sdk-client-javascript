import type { Room } from "livekit-client";
import type FFCRtcVideoRoom from "./rtc-video-room";

const wrappedRooms: WeakMap<object, FFCRtcVideoRoom> = new WeakMap();

/** @internal */
export function wrapRtcVideoRoom(room: Room, wrappedRoom?: FFCRtcVideoRoom): FFCRtcVideoRoom {
  if (wrappedRoom) {
    wrappedRooms.set(room, wrappedRoom);
    return wrappedRoom;
  }
  const existing = wrappedRooms.get(room);
  if (existing) {
    return existing;
  }
  throw new Error("Not Found");
  // const wrappedRoom = new FFCRtcVideoRoom(room);
  // wrappedRooms.set(room, wrappedRoom);
  // return wrappedRoom;
}