import { Component } from "react";
import React from "react";
import WebrtcCallHandler, { LocalEvents } from "../utility/WebrtcCallHandler";
import "../styles/auro/dropdown.css";
import Dropdown from "./Dropdown";
import { GetDevicesType } from "vani-meeting-client/lib/user-media-handler/UserMediaHandler";
import { Device, VaniEvent } from "vani-meeting-client";
const CameraIcon = React.lazy(() => import("@mui/icons-material/CameraAlt"));

interface CameraSelectionProps { }

interface CameraSelectionState {
  cameraDevices?: Device[] | any[];
  selectedCameraId?: string;
  openDropDown: boolean;
}

export default class CameraSelection extends Component<
  CameraSelectionProps,
  CameraSelectionState
> {
  constructor(props: CameraSelectionProps) {
    super(props);
    this.state = {
      cameraDevices: [],
      selectedCameraId:
        WebrtcCallHandler.getInstance().getMeetingRequest()?.cameraDevice,
      openDropDown: false,
    };
    this.fetchAndUpdateDevices = this.fetchAndUpdateDevices.bind(this);
    // this.handleCameraChange = this.handleCameraChange.bind(this);
  }

  componentDidMount() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnDevicesChanged, this.fetchAndUpdateDevices);
    WebrtcCallHandler.getInstance().eventEmitter.on(
      LocalEvents.OnRefershDevices,
      this.fetchAndUpdateDevices
    );
    this.fetchAndUpdateDevices();
  }

  componentWillUnmount() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnDevicesChanged, this.fetchAndUpdateDevices);
    WebrtcCallHandler.getInstance().eventEmitter.off(
      LocalEvents.OnRefershDevices,
      this.fetchAndUpdateDevices
    );
  }

  // async handleCameraChange(event: React.ChangeEvent<HTMLSelectElement>) {
  //   event.preventDefault();
  //   WebrtcCallHandler.getInstance().getMeetingRequest()!.cameraDevice =
  //     event.target.value;
  //   WebrtcCallHandler.getInstance()
  //     .getMeetingHandler()
  //     .startLocalStream(true, false);
  //   this.setState({
  //     selectedCameraId:
  //       WebrtcCallHandler.getInstance().getMeetingRequest()?.cameraDevice,
  //   });
  // }

  async fetchAndUpdateDevices() {
    this.setState({
      cameraDevices: await WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .getDevices(GetDevicesType.VideoIn),
    });
  }

  onCameraSelect = (cameraDeviceId: string) => {
    WebrtcCallHandler.getInstance().getMeetingRequest()!.cameraDevice =
      cameraDeviceId;
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .startLocalStream(true, false);
    this.setState({
      selectedCameraId:
        WebrtcCallHandler.getInstance().getMeetingRequest()?.cameraDevice,
    });
  };
  render() {
    return (
      <>
        <Dropdown
          title={<CameraIcon className="cameraSelectionIcon" />}
          onChange={this.onCameraSelect}
          values={this.state.cameraDevices}
          selectedValue={
            this.state.selectedCameraId
          }
        />
      </>
    );
  }
}
