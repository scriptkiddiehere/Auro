import { Component } from "react";
import React from "react";
import Dropdown from "./Dropdown";
import WebrtcCallHandler, { LocalEvents } from "../utility/WebrtcCallHandler";
import Mic from "@mui/icons-material/Mic";
import { GetDevicesType } from "vani-meeting-client/lib/user-media-handler/UserMediaHandler";
import { Device, VaniEvent } from "vani-meeting-client";

interface MicSelectionProps { }

interface MicSelectionState {
  micDevices?: Device[] | any[];
  selectedMicId?: string;
  // mic: Object;
}

export default class MicSelection extends Component<
  MicSelectionProps,
  MicSelectionState
> {
  constructor(props: MicSelectionProps) {
    super(props);
    this.state = {
      micDevices: [],
      selectedMicId:
        WebrtcCallHandler.getInstance().getMeetingRequest()?.audioInDevice,
    };
    this.fetchAndUpdateDevices = this.fetchAndUpdateDevices.bind(this);
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

  

  async fetchAndUpdateDevices() {
    console.log(
      await WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .getDevices(GetDevicesType.AudioIn)
    );

    this.setState({
      micDevices: await WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .getDevices(GetDevicesType.AudioIn),
    });
  }

  onMicSelect = (micDeviceId: string) => {
    WebrtcCallHandler.getInstance().getMeetingRequest()!.audioInDevice =
      micDeviceId;
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .startLocalStream(false, true);
    this.setState({
      selectedMicId:
        WebrtcCallHandler.getInstance().getMeetingRequest()!.audioInDevice,
    });
  };
  render() {
    return (
      <>
        <Dropdown
          title={<Mic className="micSelectionIcon" />}
          onChange={this.onMicSelect}
          values={this.state.micDevices}
          selectedValue={
            this.state.selectedMicId
          }
        />
      </>
    );
  }
}
