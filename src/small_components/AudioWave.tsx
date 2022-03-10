import hark from "hark";
import React from "react";
import { Component, Suspense } from "react";
import SmallSuspense from "./SmallSuspense";
const Lottie = React.lazy(() => import("react-lottie"));
interface AudioWaveProps {
  audioTrack: MediaStreamTrack;
}
interface AudioWaveState {
  isUserSpeaking: boolean;
}
export default class AudioWave extends Component<
  AudioWaveProps,
  AudioWaveState
> {
  lottieOptions: any;
  speechEvents: hark.Harker;
  constructor(props: AudioWaveProps) {
    super(props);
    this.state = {
      isUserSpeaking: false,
    };
    this.lottieOptions = {
      loop: true,
      autoplay: true,
      animationData: require("../assets/utils/hark.json"),
    };
    this.speechEvents = hark(new MediaStream([this.props.audioTrack]));

    this.onSpeaking = this.onSpeaking.bind(this);
    this.onStopSpeaking = this.onStopSpeaking.bind(this);
  }

  componentDidMount() {
    this.speechEvents.on("speaking", this.onSpeaking);

    this.speechEvents.on("stopped_speaking", this.onStopSpeaking);
  }

  componentWillUnmount() {
    this.speechEvents.stop();
  }

  onSpeaking() {
    this.setState({ isUserSpeaking: true });
  }

  onStopSpeaking() {
    this.setState({ isUserSpeaking: false });
  }

  render() {
    return (
      <div className="wave-wrap">
        <Suspense fallback={<SmallSuspense />}>
          <Lottie
            options={this.lottieOptions}
            height={30}
            width={20}
            eventListeners={[]}
            isStopped={!this.state.isUserSpeaking}
            style={{ display: this.state.isUserSpeaking ? "block" : "none" }}
          />
        </Suspense>
      </div>
    );
  }
}
