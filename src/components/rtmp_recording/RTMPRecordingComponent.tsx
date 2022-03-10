
import { Component } from "react";
import { withTranslation } from "react-i18next";

import Utility from "../../utility/Utility";
import WebrtcCallHandler, {
} from "../../utility/WebrtcCallHandler";
import { VaniEvent } from "vani-meeting-client";

import { RouteComponentProps, withRouter } from "react-router";
import RTMPRecordingHandler from "../../utility/RTMPRecordingHandler";

interface RTMPRecordingComponentProps {
    t: any;
    i18n: any;
    history: any;
}
interface RTMPRecordingComponentState {
    isWebrtcSDKLoaded: boolean;
}

class RTMPRecordingComponent extends Component<
    RTMPRecordingComponentProps & RouteComponentProps,
    RTMPRecordingComponentState
> {
    private webRtcHandler: WebrtcCallHandler | undefined;
    constructor(props: RTMPRecordingComponentProps & RouteComponentProps) {
        super(props);

        this.state = {
            isWebrtcSDKLoaded: false,
        };
        this.loadWebrtcComponent = this.loadWebrtcComponent.bind(this);
        this.registerWebrtcCallBack = this.registerWebrtcCallBack.bind(this);
        this.onInitDone = this.onInitDone.bind(this);
    }


    componentWillUnmount() {
        this.unregisterWebrtcCallBack();
    }

    componentDidMount() {
        this.loadWebrtcComponent();
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
            this.webRtcHandler.getMeetingRequest()!.isRecordingUser = true;
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
                ?.on(VaniEvent.OnConnected, this.onConnected);
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
                ?.off(VaniEvent.OnConnected, this.onConnected);
        }
    }

    onInitDone() {
        this.setState({ isWebrtcSDKLoaded: true });
        this.webRtcHandler!.getMeetingHandler().startLocalStream(false, false);
        this.webRtcHandler?.getMeetingHandler().checkSocket();
    }

    onConnected = () => {
        RTMPRecordingHandler.getInstance().setup()
        this.webRtcHandler?.getMeetingHandler().startMeeting();
        this.props.history.push("/meeting?vm=" + this.webRtcHandler?.getMeetingRequest()?.roomId);
    };
    render() {
        return (
            <>

            </>
        );
    }
}

const ComponentWithRouter = withRouter(RTMPRecordingComponent);

export default withTranslation()(ComponentWithRouter);
