import React, { Component } from "react";
import "../styles/auro/Auroapp-mobile.css";
import "../styles/auro/message.css";
import MessageScreen from "./MessageScreen";

interface MobileMessageScreenProps {
  duringCallComponent: any;
}
export default class MobileMessageScreen extends Component<
  MobileMessageScreenProps,
  {}
> {
  render() {
    const { state } =
      this.props.duringCallComponent;
    return (
      <div className={state.modalOpen ? "DC-Mobile-modalwrap show" : "hide"}>
        <div className="message-screen mobile-msg">
          <MessageScreen closeIcon={true} duringCallComponent={this.props.duringCallComponent} t={this.props.duringCallComponent.props.t}/>
        </div>
      </div>
    );
  }
}
