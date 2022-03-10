import React from "react";
import { Component, Suspense } from "react";
import { VaniEvent } from "vani-meeting-client";
import { Participant } from "vani-meeting-client/lib/model/Participant";
import {
  VideoHodlerModelType,
  VideoHolderModel,
} from "../../model/VideoHolderModel";
import { BrowserView, MobileView } from "react-device-detect";
import WebrtcCallHandler from "../../utility/WebrtcCallHandler";

import SuspenseFallBack from "../../small_components/SuspenseFallBack";
import { Track, TrackKind } from "vani-meeting-client/lib/model/Track";
import { withTranslation } from "react-i18next";
import Utility from "../../utility/Utility";
import RTMPRecordingHandler from "../../utility/RTMPRecordingHandler";

const DuringCallDesktop = React.lazy(
  () => import("../../views/during_call/DuringCallDesktop.View")
);
const DuringCallMobile = React.lazy(
  () => import("../../views/during_call/DuringCallMobile.View")
);

export enum DrawerViewType {
  None = 3,
  Message = 1,
  Participant = 2,
}

interface DuringCallComponentProps {
  t: any;
  i18n: any;
  history: any;
}

interface DuringCallComponentState {
  drawerViewType: DrawerViewType;
  videoHoldersModel: VideoHolderModel[];
  runningTime: string;
  moerOptionAnchorEl?: HTMLElement;
  isMuted: boolean;
  isCameraOff: boolean;
  isRecording: boolean;
  isScreenSharing: boolean;
  modalOpen: boolean;
  settingOpen: boolean;
  noOfParticipant: number;
  noOfNewMessage: number;
  moreOpen: boolean;
  showStreamOption: boolean;
}
class DuringCallComponent extends Component<
  DuringCallComponentProps,
  DuringCallComponentState
> {
  private webRtcHandler: WebrtcCallHandler | undefined;
  private interval?: any;
  public parentView: React.RefObject<HTMLDivElement>;
  public settingRef: any;
  public deviceSelectRef: any;

  constructor(props: DuringCallComponentProps) {
    super(props);
    this.state = {
      drawerViewType: DrawerViewType.None,
      videoHoldersModel: [],
      runningTime: "00:00:00",
      isMuted: true,
      isCameraOff: true,
      isRecording: false,
      isScreenSharing: false,
      modalOpen: false,
      settingOpen: false,
      noOfParticipant: 1,
      noOfNewMessage: 0,
      moreOpen: false,
      showStreamOption: false,
    };
    this.parentView = React.createRef();
    this.settingRef = React.createRef();

    this.loadWebrtcComponent = this.loadWebrtcComponent.bind(this);
    this.onWebrtcHandlerLoaded = this.onWebrtcHandlerLoaded.bind(this);
    this.registerEventHandler = this.registerEventHandler.bind(this);
    this.unregisterEventHandler = this.unregisterEventHandler.bind(this);
    this.onAllParticipants = this.onAllParticipants.bind(this);
    this.onMeetingStartTime = this.onMeetingStartTime.bind(this);
    this.onUserJoined = this.onUserJoined.bind(this);
    this.onUserLeft = this.onUserLeft.bind(this);
    this.setCurrentDrawerViewType = this.setCurrentDrawerViewType.bind(this);
    this.hideMoreOption = this.hideMoreOption.bind(this);
    this.showMoreOption = this.showMoreOption.bind(this);
    this.screenshareToggle = this.screenshareToggle.bind(this);
    this.onTrack = this.onTrack.bind(this);
    this.checkAndAddUser = this.checkAndAddUser.bind(this);
    this.onTrackEnded = this.onTrackEnded.bind(this);
    this.micToggle = this.micToggle.bind(this);
    this.videoToggle = this.videoToggle.bind(this);
    this.recordingToggle = this.recordingToggle.bind(this);
    this.getSelfVideoModel = this.getSelfVideoModel.bind(this);
    this.onSpeakerChanged = this.onSpeakerChanged.bind(this);
    this.onEndCallTapped = this.onEndCallTapped.bind(this);
    this.switchCameraTapped = this.switchCameraTapped.bind(this);
    this.onFullScreenTapped = this.onFullScreenTapped.bind(this);
    this.onCopyLinkTapped = this.onCopyLinkTapped.bind(this);
    this.onNewChatMessageReceived = this.onNewChatMessageReceived.bind(this);
  }
  componentDidMount() {
    //Show Loader
    this.loadWebrtcComponent();
    // RTMPRecordingHandler.getInstance().startRecording('https://fly.vanimeetings.com/rtmp/?vm=sachin','abc')
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.unregisterEventHandler();
  }

  loadWebrtcComponent() {
    import("../../utility/WebrtcCallHandler").then((WebRtcHandler) => {
      this.webRtcHandler = WebRtcHandler.default.getInstance();
      this.onWebrtcHandlerLoaded();
    });
  }

  onWebrtcHandlerLoaded() {
    if (this.webRtcHandler?.getMeetingRequest() === undefined) {
      this.props.history.replace("/?vm=" + Utility.getRoomIdForMeeting());
    } else {
      ////Hide Loader
      this.setState({
        videoHoldersModel: [
          new VideoHolderModel(
            this.webRtcHandler
              ?.getMeetingHandler()
              .participantByUserId(
                this.webRtcHandler?.getMeetingRequest()!.userId
              )!,
            VideoHodlerModelType.Main,
            true
          ),
        ],
      });

      this.registerEventHandler();
      this.webRtcHandler?.getMeetingHandler().getMeetingStartTime();
      this.webRtcHandler
        ?.getMeetingHandler()
        .getUpdatedParticipantsListFromServer();
      const tracks = this.webRtcHandler?.getMeetingHandler().getAllTracks();
      if (tracks) {
        tracks.forEach((track) => {
          this.onTrack(track);
        });
      }
    }
  }
  registerEventHandler() {
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnMeetingStartTime, this.onMeetingStartTime);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnAllParticipants, this.onAllParticipants);

    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnUserJoined, this.onUserJoined);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnUserLeft, this.onUserLeft);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnTrack, this.onTrack);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnUserLeft, this.onUserLeft);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnTrackEnded, this.onTrackEnded);

    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnSpeakerChanged, this.onSpeakerChanged);

    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnNewChatMessageReceived, this.onNewChatMessageReceived);
  }
  unregisterEventHandler() {
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnMeetingStartTime, this.onMeetingStartTime);

    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnAllParticipants, this.onAllParticipants);

    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnUserJoined, this.onUserJoined);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnUserLeft, this.onUserLeft);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnTrack, this.onTrack);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnTrackEnded, this.onTrackEnded);
    this.webRtcHandler
      ?.getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnSpeakerChanged, this.onSpeakerChanged);
  }

  onMeetingStartTime(timeStr: string) {
    console.log(timeStr);

    const time = parseInt(timeStr);
    import("moment").then((moment) => {
      this.interval = setInterval(() => {
        const finalTimer =
          moment.default
            .duration(moment.default(new Date()).diff(moment.default(time)))
            .hours()
            .toString()
            .padStart(2, "0") +
          ":" +
          (moment.default
            .duration(moment.default(new Date()).diff(moment.default(time)))
            .minutes()
            .toString()
            .padStart(2, "0") +
            ":") +
          (moment.default
            .duration(moment.default(new Date()).diff(moment.default(time)))
            .seconds()
            .toString()
            .padStart(2, "0") +
            "");
        this.setState({ runningTime: finalTimer });
      }, 1000);
    });
  }

  onSpeakerChanged(participant: Participant) {
    if (
      this.state.videoHoldersModel.length > 2 &&
      participant.userId !== this.webRtcHandler?.getMeetingRequest()?.userId &&
      this.state.videoHoldersModel[0].participant.userId !== participant.userId
    ) {
      let indexWhereToMoveParticipant = 0;
      if (this.state.videoHoldersModel[0].isPinned) {
        indexWhereToMoveParticipant = 1;
      }
      const indexOfItem = this.state.videoHoldersModel.findIndex(
        (videoHoldersModel) =>
          videoHoldersModel.participant.userId === participant.userId
      );
      if (indexOfItem > -1 && indexOfItem !== indexWhereToMoveParticipant) {
        const videoHolderModel = this.state.videoHoldersModel[indexOfItem];
        this.state.videoHoldersModel.splice(indexOfItem, 1);
        this.state.videoHoldersModel.splice(
          indexWhereToMoveParticipant,
          0,
          videoHolderModel
        );
        this.setState({ videoHoldersModel: [...this.state.videoHoldersModel] });
      }
    }
  }

  checkAndAddUser(
    participant: Participant,
    viewHolderType: VideoHodlerModelType,
    videoHoldersModels: VideoHolderModel[]
  ) {
    if(participant.isRecordingUser){
      return
    }
    const alreadyExitModel = videoHoldersModels.find(
      (viewHolder) =>
        viewHolder.participant.userId === participant.userId &&
        viewHolder.videoHolderModelType === viewHolderType
    );
    if (!alreadyExitModel) {
      if (videoHoldersModels.length > 0 && videoHoldersModels[0].isPinned) {
        videoHoldersModels.splice(
          1,
          0,
          new VideoHolderModel(
            participant,
            viewHolderType,
            participant.userId ===
              this.webRtcHandler!.getMeetingRequest()!.userId
          )
        );
      } else {
        videoHoldersModels.unshift(
          new VideoHolderModel(
            participant,
            viewHolderType,
            participant.userId ===
              this.webRtcHandler!.getMeetingRequest()!.userId
          )
        );
      }
    }
  }

  onAllParticipants(participants: Participant[]) {
    console.log("onAllParticipants ");
    console.log(participants);

    if (participants.length > 0) {
      const smallScreenVideos: VideoHolderModel[] = [];

      participants.forEach((participant) => {
        this.checkAndAddUser(
          participant,
          VideoHodlerModelType.Main,
          smallScreenVideos
        );
      });
      if (smallScreenVideos.length === 0) {
        this.checkAndAddUser(
          this.webRtcHandler
            ?.getMeetingHandler()
            .participantByUserId(
              this.webRtcHandler?.getMeetingRequest()!.userId
            )!,
          VideoHodlerModelType.Main,
          smallScreenVideos
        );
      }
      this.setState({
        videoHoldersModel: [...smallScreenVideos],
        noOfParticipant:
          this.webRtcHandler!.getAllParticipatWithoutRecording().length,
      });
    }
  }

  onUserJoined(participant: Participant) {
    const allVideoModels = this.state.videoHoldersModel;
    this.checkAndAddUser(
      participant,
      VideoHodlerModelType.Main,
      allVideoModels
    );
    this.setState({
      videoHoldersModel: [...allVideoModels],
      noOfParticipant:
        this.webRtcHandler!.getAllParticipatWithoutRecording().length,
    });
  }

  onUserLeft(participant: Participant) {
    const remaningVideoModels = this.state.videoHoldersModel.filter(
      (videoHoldersModel) =>
        videoHoldersModel.participant.userId !== participant.userId
    );
    this.setState({
      videoHoldersModel: [...remaningVideoModels],
      noOfParticipant:
        this.webRtcHandler!.getAllParticipatWithoutRecording().length,
    });
    if(this.webRtcHandler?.getMeetingRequest()?.isRecordingUser && this.webRtcHandler!.getAllParticipatWithoutRecording().length  === 0){
      RTMPRecordingHandler.getInstance().cleanUp()
    }
  }

  onTrack(track: Track) {
    if (
      track.trackKind === TrackKind.ScreenshareVideo ||
      track.trackKind === TrackKind.ScreenshareAudio
    ) {
      const allVideoModels = this.state.videoHoldersModel;
      this.checkAndAddUser(
        track.participant,
        VideoHodlerModelType.Screenshare,
        allVideoModels
      );
      this.setState({
        videoHoldersModel: [...allVideoModels],
      });
      if (track.isLocalTrack) {
        this.setState({ isScreenSharing: true });
      }
    } else if (track.isLocalTrack && track.trackKind === TrackKind.Video) {
      this.setState({ isCameraOff: false });
    } else if (track.isLocalTrack && track.trackKind === TrackKind.Audio) {
      this.setState({ isMuted: false });
    }
  }
  onTrackEnded(track: Track) {
    console.log("onTrackEnded");

    if (
      track.trackKind === TrackKind.ScreenshareVideo ||
      track.trackKind === TrackKind.ScreenshareAudio
    ) {
      const remaningVideoModels = this.state.videoHoldersModel.filter(
        (videoHoldersModel) =>
          !(
            videoHoldersModel.participant.userId === track.participant.userId &&
            videoHoldersModel.videoHolderModelType ===
              VideoHodlerModelType.Screenshare
          )
      );
      this.setState({
        videoHoldersModel: [...remaningVideoModels],

      });
      if(track.isLocalTrack){
        this.setState({  isScreenSharing: false,})
      }
    } else if (track.isLocalTrack && track.trackKind === TrackKind.Video) {
      this.setState({ isCameraOff: true });
    } else if (track.isLocalTrack && track.trackKind === TrackKind.Audio) {
      this.setState({ isMuted: true });
    }
  }

  setCurrentDrawerViewType(viewType: DrawerViewType) {
    if (this.state.drawerViewType === viewType) {
      this.setState({ drawerViewType: DrawerViewType.None });
    } else {
      this.setState({ drawerViewType: viewType });
    }

    if (viewType === DrawerViewType.Message) {
      this.setState({ noOfNewMessage: 0 });
    }
  }
  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };
  showMoreOption(event: React.MouseEvent<HTMLElement>) {
    this.setState({ moerOptionAnchorEl: event.currentTarget, moreOpen: true });
  }
  hideMoreOption() {
    this.setState({ moerOptionAnchorEl: undefined, moreOpen: false });
  }
  micToggle() {
    if (this.state.isMuted) {
      this.webRtcHandler?.getMeetingHandler().unmute();
      // this.setState({ isMuted: false });
    } else {
      this.webRtcHandler?.getMeetingHandler().muteUser();
      // this.setState({ isMuted: true });
    }
  }

  handleWhiteBoard = () => {
    console.log("handleWhiteBoard");

    const indexOfItem = this.state.videoHoldersModel.findIndex(
      (videoHoldersModel) =>
        videoHoldersModel.videoHolderModelType ===
        VideoHodlerModelType.Whiteboard
    );
    if (indexOfItem > -1) {
      this.state.videoHoldersModel.splice(indexOfItem, 1);
      this.state.videoHoldersModel.sort((a, b) => {
        if (a.isPinned) {
          return -1;
        }
        return 0;
      });
      this.setState({ videoHoldersModel: [...this.state.videoHoldersModel] });
    } else {
      const selfParticipant = this.webRtcHandler
        ?.getMeetingHandler()
        .participantByUserId(this.webRtcHandler.getMeetingRequest()!.userId);
      if (selfParticipant) {
        const videoHoldersModel = new VideoHolderModel(
          selfParticipant,
          VideoHodlerModelType.Whiteboard,
          true
        );
        videoHoldersModel.isPinned = true;
        this.state.videoHoldersModel.unshift(videoHoldersModel);
        this.setState({ videoHoldersModel: [...this.state.videoHoldersModel] });
      }
    }
  };
  videoToggle() {
    if (this.state.isCameraOff) {
      this.webRtcHandler?.getMeetingHandler().resumeCamera();
    } else {
      this.webRtcHandler?.getMeetingHandler().pauseCamera();
    }
  }
  recordingToggle() {
    if (!this.state.isRecording) {
      this.setState({ isRecording: true });
    } else {
      this.setState({ isRecording: false });
    }
  }

  switchCameraTapped() {
    this.webRtcHandler?.getMeetingHandler().switchCamera();
  }

  handleSettingOpen = () => {
    this.setState({ settingOpen: !this.state.settingOpen });
  };
  handleshowStreamOption = () => {
    this.setState({ showStreamOption: !this.state.showStreamOption });
  };
  closeOnEsc = (e:any) => {
    console.log(e.keyCode)
    if(e.target === this.deviceSelectRef.current){
        this.handleSettingOpen()
    }
  }
  handleBackDropClose = (e: any) => {
    console.log(e.target);
    // console.log('dawdaw',e.target === this.settingRef.current);

    if (e.target === this.settingRef.current) {
      this.setState({ settingOpen: false });
    }
  };
  getSelfVideoModel(): VideoHolderModel | undefined {
    if (this.state.videoHoldersModel) {
      const videoModel = this.state.videoHoldersModel.find(
        (videoHolderModel) =>
          videoHolderModel.participant.userId ===
          this.webRtcHandler!.getMeetingRequest()!.userId
      );
      return videoModel;
    }
    return undefined;
  }

  onEndCallTapped() {
    this.webRtcHandler?.cleanUp();
    // window.location.href = process.env.REACT_APP_END_CALL_URL!;
    window.location.reload();
  }

  onNewChatMessageReceived() {
    if (this.state.drawerViewType !== DrawerViewType.Message) {
      this.setState({ noOfNewMessage: this.state.noOfNewMessage + 1 });
    }
  }

  ////////////////////////////////
  //ScreenShare
  screenshareToggle() {
    if (this.state.isScreenSharing) {
      this.webRtcHandler?.getMeetingHandler().stopScreenSharing();
    } else {
      this.webRtcHandler?.getMeetingHandler().startScreenShare(false, true);
    }
  }
  ////////////////////////////////

  /////Menu Tapped////////////////////////////////

  onFullScreenTapped() {
    if (this.parentView.current?.ownerDocument.fullscreenElement) {
      this.parentView.current?.ownerDocument.exitFullscreen();
    } else {
      this.parentView.current?.requestFullscreen();
    }
  }

  onCopyLinkTapped() {
    if (process.env.REACT_APP_COPY_LINK_MESSAGE) {
      const link =
        window.location.origin +
        "?vm=" +
        this.webRtcHandler?.getMeetingRequest()?.roomId;
      const message = process.env.REACT_APP_COPY_LINK_MESSAGE.replace(
        "%name%",
        this.webRtcHandler?.getMeetingRequest()?.userData.name
      ).replace("%link%", link);
      console.log(message);
      navigator.clipboard.writeText(message);
    }
  }

  handleFBLogin = (res: any) => {
    console.log(res);
    this.handleshowStreamOption();
  };
  handleGLogin = (res: any) => {
    console.log(res);
    this.handleshowStreamOption();
  };
  ////////////////////////////////////////////////////////////////
  render() {
    return (
      <>
        <BrowserView className="broserView">
          <Suspense fallback={<SuspenseFallBack />}>
            <DuringCallDesktop duringCallComponent={this} />
          </Suspense>
        </BrowserView>
        <MobileView style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={<SuspenseFallBack />}>
            <DuringCallMobile duringCallComponent={this} />
          </Suspense>
        </MobileView>
      </>
    );
  }
}

export default withTranslation()(DuringCallComponent);
export interface MeetingDesktopProps {
  duringCallComponent: DuringCallComponent;
}
export interface MeetingMobileProps {
  duringCallComponent: DuringCallComponent;
}
