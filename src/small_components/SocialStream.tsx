import React, { Component } from "react";
import SocialBtn from "./SocialBtn";
import fb from "../assets/fb.png";
import google from "../assets/google.png";
// import FaceBookLogin from 'react-facebook-login';
// import FacebookLogin from "react-facebook-login";
import FacebookLogin from "@greatsumini/react-facebook-login";
import GoogleLogin from "react-google-login";
import RTMPRecordingHandler from "../utility/RTMPRecordingHandler";
import WebrtcCallHandler from "../utility/WebrtcCallHandler";

interface SocialStreamProps {
  duringCallComponent: any;
}

export default class SocialStream extends Component<SocialStreamProps, {}> {
  private outDiv: any;
  // constructor(props: SocialStreamProps) {
  //   super(props);
  // }
  componentDidMount(){
    // console.log('key',process.env.REACT_APP_fb_key);
    const link =  window.location.origin + "/rtmp" +
    "?vm=" +
    WebrtcCallHandler.getInstance().getMeetingRequest()?.roomId;
    RTMPRecordingHandler.getInstance().startRTMPStream(link,'2mwm-agw6-zq3s-7jyd-bc47','rtmp://a.rtmp.youtube.com/live2/')
  }
  handleDismiss = (e: any) => {
    if (e.target === this.outDiv) {
      this.props.duringCallComponent.handleshowStreamOption();
    }
  };
  render() {
    return (
      <div
        className="setting-dialog"
        onClick={(e: any) => {
          this.handleDismiss(e);
        }}
        ref={(ref) => (this.outDiv = ref)}
      >
        <div className="paper">
          <FacebookLogin
            appId={process.env.REACT_APP_FB_KEY!}
            onSuccess={this.props.duringCallComponent.handleFBLogin}
            render={({ onClick }) => (
              <SocialBtn
                onClick={onClick}
                img={<img alt="png" src={fb} />}
                name="Log in with Facebook"
              />
            )}
          />
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_KEY!}
            render={(renderProps) => (
              <SocialBtn
                onClick={renderProps.onClick}
                img={<img alt="png" src={google} />}
                name="Log in with Google"
              />
            )}
            onSuccess={this.props.duringCallComponent.handleGLogin}
            onFailure={(err) => {
              console.log(err);

            }}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    );
  }
}
