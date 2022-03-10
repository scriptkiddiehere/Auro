import { List } from "@mui/material";
import { Component } from "react";
import "../styles/auro/participant.css";
import { Participant } from "vani-meeting-client/lib/model/Participant";
import { ParticipantRow } from "./ParticipantRow";
import WebrtcCallHandler from "../utility/WebrtcCallHandler";
import { VaniEvent } from "vani-meeting-client";
import Close from "@mui/icons-material/Close";
import { DrawerViewType } from "../components/during_call/DuringCallComponent";

interface ParticipantScreenProps {
  t: any;
  duringCallComponent: any;
  closeIcon: boolean;
}

interface ParticipantScreenState {
  allParticipants: Participant[];
}

export default class ParticipantScreen extends Component<
  ParticipantScreenProps,
  ParticipantScreenState
> {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  constructor(props: ParticipantScreenProps) {
    super(props);
    this.state = {
      allParticipants: [],
    };
    this.onUserJoined = this.onUserJoined.bind(this);
    this.onUserLeft = this.onUserLeft.bind(this);
  }
  componentDidMount() {
    this.registerEventHandler();
    this.setState({
      allParticipants: WebrtcCallHandler.getInstance()

        .getAllParticipatWithoutRecording(),
    });
  }
  componentWillUnmount() {
    this.unregisterEventHandler();
  }
  onUserJoined(_participant: Participant) {
    if (_participant.isRecordingUser === false) {
      const filteredParticipants = this.state.allParticipants.filter(
        (participant) => participant.userId !== _participant.userId
      );
      filteredParticipants.unshift(_participant);
      this.setState({ allParticipants: [...filteredParticipants] });
    }
  }
  onUserLeft(_participant: Participant) {
    const filteredParticipants = this.state.allParticipants.filter(
      (participant) => participant.userId !== _participant.userId
    );
    this.setState({ allParticipants: [...filteredParticipants] });
  }
  registerEventHandler() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnUserJoined, this.onUserJoined);
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnUserLeft, this.onUserLeft);
  }
  unregisterEventHandler() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnUserJoined, this.onUserJoined);
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnUserLeft, this.onUserLeft);
  }
  render() {
    return (
      <div className="participant-screen">
        <div className="participant-header">
          <p>{this.props.t("participants")}</p>
          {this.props.closeIcon && <p
            onClick={() => {
              this.props.duringCallComponent.setCurrentDrawerViewType(
                DrawerViewType.None
              );
              this.props.duringCallComponent.toggleModal();
            }}
            className="msg-close"
          >
            <Close />
          </p>}
        </div>
        <div className="participants">
          <List>
            {this.state.allParticipants.map((participant) => {
              return (
                <ParticipantRow
                  key={participant.userId}
                  participant={participant}
                  t={this.props.t}
                />
              );
            })}
          </List>
        </div>
      </div>
    );
  }
}
