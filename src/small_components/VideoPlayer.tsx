import React from "react";
import { Component } from "react";

interface VideoPlayerProps {
  track?: MediaStreamTrack;
  isLocal: boolean;
}

interface VideoPlayerState {}
export default class VideoPlayer extends Component<
  VideoPlayerProps,
  VideoPlayerState
> {
  videoPlayer: React.RefObject<HTMLVideoElement>;
  constructor(props: VideoPlayerProps) {
    super(props);
    this.videoPlayer = React.createRef();
  }

  componentDidMount() {
    console.log("componentDidMount");

    if (
      this.videoPlayer !== null &&
      this.videoPlayer.current !== null &&
      this.props.track &&
      this.props.track !== null
    ) {
      this.videoPlayer.current.srcObject = new MediaStream([this.props.track]);
    } else if (
      this.videoPlayer !== null &&
      this.videoPlayer.current !== null &&
      (!this.props.track || this.props.track === null)
    ) {
      this.videoPlayer.current.srcObject = null;
    }
  }

  render() {
    return (
      <video
        className={`global-video-player ${this.props.isLocal ? "flip" : ""}`}
        playsInline
        autoPlay
        muted
        ref={this.videoPlayer}
      ></video>
    );
  }
}
