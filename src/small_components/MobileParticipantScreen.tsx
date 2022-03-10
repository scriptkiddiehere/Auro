import React, { Component } from "react";
import "../styles/auro/participant.css";
import { Participant } from "vani-meeting-client/lib/model/Participant";
import ParticipantScreen from "./ParticipantScreen";

interface MobileParticipantScreenProps {
  duringCallComponent: any;
  t: any;
}

interface MobileParticipantScreenState {
  allParticipants: Participant[];
}

export default class MobileParticipantScreen extends Component<
  MobileParticipantScreenProps,
  MobileParticipantScreenState
> {
  constructor(props: MobileParticipantScreenProps) {
    super(props);
    this.state = {
      allParticipants: [],
    };
  }
  render() {
    const { state } =
      this.props.duringCallComponent;
    return (
      <div className={state.modalOpen ? "DC-Mobile-modalwrap show" : "hide"}>
        <div className="participant-mobile-screen">
          <ParticipantScreen
          closeIcon={true}
            duringCallComponent={this.props.duringCallComponent}
            t={this.props.duringCallComponent.props.t}
          />
        </div>
      </div>
    );
  }
}
