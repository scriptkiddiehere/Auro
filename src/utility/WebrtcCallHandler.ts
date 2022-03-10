import {
  MeetingHandler,
  MeetingStartRequest,
  MeetingType,
  MessagePayload,
  VaniEvent,
} from "vani-meeting-client";

import Utility from "./Utility";
import EventEmitter from "events";
import { isMobile } from "react-device-detect";

export enum LocalEvents {
  OnRefershDevices = "refershDevices",
  OnMessageListUpdated = "onMessageListUpdated",
}

class WebrtcCallHandler {
  static instance = new WebrtcCallHandler();
  meetingHandler: MeetingHandler = new MeetingHandler();
  meetingRequest?: MeetingStartRequest;
  eventEmitter: any;
  isAdmin: boolean;
  roomId: null;
  messages: MessagePayload[];
  static getInstance() {
    if (WebrtcCallHandler.instance === null) {
      WebrtcCallHandler.instance = new WebrtcCallHandler();
    }
    return WebrtcCallHandler.instance;
  }

  constructor() {
    this.meetingRequest = undefined;
    this.eventEmitter = new EventEmitter();
    this.isAdmin = false;
    this.roomId = null;
    this.messages = [];
    this.getMeetingRequest = this.getMeetingRequest.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.onNewChatMessageReceived = this.onNewChatMessageReceived.bind(this);
    this.onConnected = this.onConnected.bind(this);
    this.onOldMessages = this.onOldMessages.bind(this);
    this.getAllParticipatWithoutRecording = this.getAllParticipatWithoutRecording.bind(this);
  }
  cleanUp() {
    console.log("Vani CLeanup");
    this.getMeetingHandler().endAndDestory();
    this.meetingRequest = undefined;
    this.messages = [];
    this.eventEmitter.removeAllListeners();
  }
  setup(roomId: string, userId: string, userData: {}) {
    if (this.meetingRequest == null) {
      this.meetingRequest = this.getMeetingHandler().meetingStartRequestObject(
        roomId,
        userId,
        process.env.REACT_APP_ID as string,
        process.env.REACT_APP_WSS_URL as string
      );
      this.meetingRequest.numberOfUsers = Utility.getNumberOfParticipant();
      this.meetingRequest.userData = userData;
      this.meetingRequest.isAdmin = this.isAdmin;
      // if (!isMobile) {
      //   this.meetingRequest.videoCaptureHeight = 320
      //   this.meetingRequest.videoCaptureWidth = 480

      // }
      // else {
      //   this.meetingRequest.videoCaptureHeight = 640
      //   this.meetingRequest.videoCaptureWidth = 320
      // }

      if ((process.env.REACT_APP_MEETING_TECH_TYPE as string) === "SFU") {
        this.meetingRequest.meetingType = MeetingType.SFU;
      } else if (
        (process.env.REACT_APP_MEETING_TECH_TYPE as string) === "WEBRTC"
      ) {
        this.meetingRequest.meetingType = MeetingType.WEBRTC;
      } else {
        this.meetingRequest.meetingType = MeetingType.CHAT;
      }
      console.log(this.meetingRequest);
      this.getMeetingHandler()?.getEventEmitter()?.on(VaniEvent.OnConnected, this.onConnected);
    }
  }

  onConnected() {
    console.log("onConnected = WebrtcCallHandler");

    this.getMeetingHandler()?.getEventEmitter()?.off(VaniEvent.OnConnected, this.onConnected);
    this.getMeetingHandler()?.getEventEmitter()?.on(VaniEvent.OnOldMessages, this.onOldMessages);
    this.getMeetingHandler()?.getEventEmitter()?.on(VaniEvent.OnNewChatMessageReceived, this.onNewChatMessageReceived);

    this.getMeetingHandler().getOldMessages();
  }

  onNewChatMessageReceived(messagePayload: MessagePayload) {

    this.messages.push(messagePayload)
    this.eventEmitter.emit(LocalEvents.OnMessageListUpdated, this.messages);
  }

  onOldMessages(messages: MessagePayload[]) {
    this.messages = messages;
    console.log(this.messages);

    this.eventEmitter.emit(LocalEvents.OnMessageListUpdated, this.messages);
    this.getMeetingHandler()?.getEventEmitter()?.off(VaniEvent.OnOldMessages, this.onOldMessages);

  }

  sendMessage(messagePayload: MessagePayload) {
    messagePayload.shouldPresist = true;
    this.meetingHandler?.sendMessage(messagePayload)
    this.onNewChatMessageReceived(messagePayload);
  }

  getMeetingHandler() {
    return this.meetingHandler;
  }

  getMeetingRequest() {
    return this.meetingRequest;
  }

  getAllParticipatWithoutRecording(){
    return this.getMeetingHandler().getAllParticipants().filter(participant => participant.isRecordingUser === false);
  }

}

export default WebrtcCallHandler;
