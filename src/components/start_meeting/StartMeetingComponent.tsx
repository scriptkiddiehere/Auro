import React, { Suspense } from "react";
import { Component } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { withTranslation } from "react-i18next";
import SuspenseFallBack from "../../small_components/SuspenseFallBack";
import Utility from "../../utility/Utility";
import WebrtcCallHandler, {
  LocalEvents,
} from "../../utility/WebrtcCallHandler";
import { VaniEvent } from "vani-meeting-client";
import { Track, TrackKind } from "vani-meeting-client/lib/model/Track";
import { RouteComponentProps, withRouter } from "react-router";
import Loader from "../../small_components/Loader";

const StartMeetingMobile = React.lazy(
  () => import("../../views/start_meeting/StartMeetingMobile.View")
);
const StartMeetingDesktop = React.lazy(
  () => import("../../views/start_meeting/StartMeetingDesktop.View")
);

interface StartMeetingComponentProps {
  t: any;
  i18n: any;
  history: any;
}
interface StartMeetingComponentState {
  isWebrtcSDKLoaded: boolean;
  selfTrack?: MediaStreamTrack;
  permissionError: boolean;
  permissionApproved: boolean;
  micEnabled: boolean;
  videoEnabled: boolean;
  advanceOptionOpen: boolean;
  isAdmin: boolean;
  name?: string;
  inputError: boolean;
  connecting: boolean;
}

class StartMeetingComponent extends Component<
  StartMeetingComponentProps & RouteComponentProps,
  StartMeetingComponentState
> {
  private webRtcHandler: WebrtcCallHandler | undefined;
  constructor(props: StartMeetingComponentProps & RouteComponentProps) {
    super(props);

    this.state = {
      permissionApproved: false,
      isWebrtcSDKLoaded: false,
      permissionError: false,
      micEnabled: false,
      videoEnabled: false,
      advanceOptionOpen: false,
      isAdmin: false,
      inputError: false,
      connecting: false,
    };
    this.loadWebrtcComponent = this.loadWebrtcComponent.bind(this);
    this.registerWebrtcCallBack = this.registerWebrtcCallBack.bind(this);
    this.permissionError = this.permissionError.bind(this);
    this.permissionApproved = this.permissionApproved.bind(this);
    this.onTrack = this.onTrack.bind(this);
    this.onTrackEnded = this.onTrackEnded.bind(this);
    this.openAdvanceOptions = this.openAdvanceOptions.bind(this);
    this.closeAdvanceOptions = this.closeAdvanceOptions.bind(this);
    this.switchMicEnableDisable = this.switchMicEnableDisable.bind(this);
    // this.switchVideoEnableDisable = this.switchVideoEnableDisable.bind(this);
    this.switchVideoEnableDisable = this.switchVideoEnableDisable.bind(this);
    this.onInitDone = this.onInitDone.bind(this);
    this.startMeetingTapped = this.startMeetingTapped.bind(this);
    this.onAdminOptionSwitched = this.onAdminOptionSwitched.bind(this);
    this.storeNameIfRequired = this.storeNameIfRequired.bind(this);
  }

  switchMicEnableDisable() {
    if (this.state.micEnabled) {
      this.webRtcHandler
        ?.getMeetingHandler()
        .muteUser(this.webRtcHandler!.getMeetingRequest()!.userId);
    } else {
      this.webRtcHandler
        ?.getMeetingHandler()
        .unmute(this.webRtcHandler!.getMeetingRequest()!.userId);
    }
    // this.setState({ micEnabled: !this.state.micEnabled });
  }
  switchVideoEnableDisable() {
    if (this.state.videoEnabled) {
      this.webRtcHandler
        ?.getMeetingHandler()
        .pauseCamera(this.webRtcHandler!.getMeetingRequest()!.userId);
      // this.setState({ selfTrack: undefined })
    } else {
      this.webRtcHandler
        ?.getMeetingHandler()
        .resumeCamera(this.webRtcHandler!.getMeetingRequest()!.userId);
    }
    // this.setState({ videoEnabled: !this.state.videoEnabled });
  }

  openAdvanceOptions() {
    this.setState({ advanceOptionOpen: true });
  }
  closeAdvanceOptions() {
    this.setState({ advanceOptionOpen: false });
  }

  componentWillUnmount() {
    this.unregisterWebrtcCallBack();
  }

  componentDidMount() {
    this.loadWebrtcComponent();
    const localStorageName  = this.getNameFromLocalStorage()
    if(localStorageName){
      this.setState({name  : localStorageName});
    }
  }

  loadWebrtcComponent() {
    import("../../utility/WebrtcCallHandler").then((WebRtcHandler) => {
      this.webRtcHandler = WebRtcHandler.default.getInstance();
      this.onWebrtcHandlerLoaded();
    });
  }
  onWebrtcHandlerLoaded() {
    if (this.webRtcHandler) {
      this.registerWebrtcCallBack();
      this.webRtcHandler.setup(
        Utility.getRoomIdForMeeting(),
        Utility.geUserIdForMeeting(),
        {}
      );
      this.webRtcHandler.getMeetingHandler().init();
    }
  }
  registerWebrtcCallBack() {
    if (this.webRtcHandler) {
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnInitDone, this.onInitDone);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnTrack, this.onTrack);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnPermissionError, this.permissionError);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnPermissionApproved, this.permissionApproved);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnConnected, this.onConnected);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.on(VaniEvent.OnTrackEnded, this.onTrackEnded);
    }
  }

  unregisterWebrtcCallBack() {
    if (this.webRtcHandler) {
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnInitDone, this.onInitDone);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnTrack, this.onTrack);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnPermissionError, this.permissionError);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnPermissionApproved, this.permissionApproved);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnConnected, this.onConnected);
      this.webRtcHandler
        .getMeetingHandler()
        .getEventEmitter()
        ?.off(VaniEvent.OnTrackEnded, this.onTrackEnded);
    }
  }

  onInitDone() {
    this.setState({ isWebrtcSDKLoaded: true });
    this.webRtcHandler!.getMeetingHandler().startLocalStream(true, true);
  }
  permissionApproved() {
    this.setState({ permissionError: false, permissionApproved: true });
    this.webRtcHandler!.eventEmitter.emit(LocalEvents.OnRefershDevices, {});
    //Enable Start Meeting Button
  }
  permissionError() {
    //Show Permission issue
    this.setState({ permissionError: true, permissionApproved: false });
  }

  onTrack(track: Track): void {
    console.log('onTrack');

    if (track && track.track && track.isLocalTrack) {
      if (track.trackKind === TrackKind.Video) {
        this.setState({ selfTrack: undefined },()=>{
          this.setState({ selfTrack: track.track, videoEnabled: true });
        })
      } else if (track.trackKind === TrackKind.Audio) {
        this.setState({ micEnabled: true });
      }
    }
  }

  onTrackEnded(track: Track): void {
    if (track && track.isLocalTrack) {
      if (track.trackKind === TrackKind.Video) {
        this.setState({ videoEnabled: false, selfTrack: undefined });
      } else if (track.trackKind === TrackKind.Audio) {
        this.setState({ micEnabled: false });
      }
    }
  }

  onConnected = () => {
    this.webRtcHandler?.getMeetingHandler().startMeeting();
    this.setState({ connecting: false });
    this.props.history.push("/meeting?vm=" + this.webRtcHandler?.getMeetingRequest()?.roomId);
  };

  startMeetingTapped() {
    this.webRtcHandler!.getMeetingRequest()!.isAdmin = this.state.isAdmin;
    this.webRtcHandler!.getMeetingRequest()!.userData.name = this.state.name;

    const selfParticipant =
      this.webRtcHandler!.getMeetingHandler().participantByUserId(
        this.webRtcHandler!.getMeetingRequest()!.userId
      );
    if (selfParticipant) {
      selfParticipant.isAdmin =
        this.webRtcHandler!.getMeetingRequest()!.isAdmin;
      selfParticipant.userData =
        this.webRtcHandler!.getMeetingRequest()!.userData;
      this.webRtcHandler!.getMeetingHandler().updateParticipantData(
        selfParticipant
      );
    }
    this.storeNameIfRequired();
    this.webRtcHandler?.getMeetingHandler().checkSocket();
    this.setState({ connecting: true });

  }

  storeNameIfRequired() {
    if (process.env.REACT_APP_SHOULD_PRESIST_NAME === '1') {
      localStorage.setItem('userName', this.state.name ? this.state.name : '')
    }

  }
  getNameFromLocalStorage() : string | undefined {
    if (process.env.REACT_APP_SHOULD_PRESIST_NAME === '1') {
      const localStorageName = localStorage.getItem('userName')
      if(!localStorageName || localStorageName === null || localStorageName.length === 0){
        return undefined
      }
      console.log(localStorageName);

      return localStorageName
    }
    return undefined;
  }

  onAdminOptionSwitched(event: any) {
    this.setState({ isAdmin: event.target.checked });
  }
  onUpdateName(event: any) {
    this.setState({ name: event.target.value, inputError: false });
  }
  render() {
    return (
      <>
        {
          this.state.connecting ? (
            <Loader size="large" img={false} outlineColor="#2160fd" />
          ) : this.state.isWebrtcSDKLoaded ? (
            <>
              <BrowserView className="broserView">
                <Suspense fallback={<SuspenseFallBack img={false} />}>
                  <StartMeetingDesktop startMeetingComponent={this} />
                </Suspense>
              </BrowserView>
              <MobileView>
                <Suspense fallback={<SuspenseFallBack img={false} />}>
                  <StartMeetingMobile startMeetingComponent={this} />
                </Suspense>
              </MobileView>
            </>
          ) : (
            <Loader img={false} size="large" outlineColor="#2160fd" />
          ) //Show Loader
        }
      </>
    );
  }
}

const ComponentWithRouter = withRouter(StartMeetingComponent);

export default withTranslation()(ComponentWithRouter);

export interface StartMeetingViewProps {
  startMeetingComponent: StartMeetingComponent;
}
