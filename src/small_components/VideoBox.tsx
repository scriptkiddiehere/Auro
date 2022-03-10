import React, { Component, Suspense } from "react";
import VisibilitySensor from 'react-visibility-sensor';
import { VaniEvent } from "vani-meeting-client";
import { Track, TrackKind } from "vani-meeting-client/lib/model/Track";
import {
  VideoHodlerModelType,
  VideoHolderModel,
} from "../model/VideoHolderModel";
import WebrtcCallHandler from "../utility/WebrtcCallHandler";
import SmallSuspense from "./SmallSuspense";
const VideoPlayer = React.lazy(() => import("./VideoPlayer"));
const AudioPlayer = React.lazy(() => import("./AudioPlayer"));
const MicOff = React.lazy(() => import("@mui/icons-material/MicOff"));
const AudioWave = React.lazy(() => import("./AudioWave"));

interface VideoBoxProps {
  videoHolderModel: VideoHolderModel;
  isFullScreenView: boolean;
}
interface VideoBoxState {
  videoTrack?: Track;
  audioTrack?: Track;
}
export class VideoBox extends Component<VideoBoxProps, VideoBoxState> {
  private videoHolderModel?: VideoHolderModel;
  private isLocal: boolean = false;
  constructor(props: VideoBoxProps) {
    super(props);

    this.state = {
    };

    this.videoHolderModel = props.videoHolderModel;

    this.registerEventHandler = this.registerEventHandler.bind(this);
    this.unregisterEventHandler = this.unregisterEventHandler.bind(this);
    this.onTrack = this.onTrack.bind(this);
    this.onTrackEnded = this.onTrackEnded.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }
  componentDidMount() {
    this.registerEventHandler();
    if (this.videoHolderModel) {
      if (
        this.videoHolderModel.participant.userId ===
        WebrtcCallHandler.getInstance()!.getMeetingRequest()!.userId
      ) {
        this.isLocal = true;
      }
      const tracks = WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .getTracksByParticipantId(this.videoHolderModel.participant.userId);

      tracks.forEach((track) => {
        this.onTrack(track);
      });
    }
  }
  componentWillUnmount() {
    this.unregisterEventHandler();
  }
  registerEventHandler() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnTrack, this.onTrack);
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.on(VaniEvent.OnTrackEnded, this.onTrackEnded);
  }
  unregisterEventHandler() {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnTrack, this.onTrack);
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .getEventEmitter()
      ?.off(VaniEvent.OnTrackEnded, this.onTrackEnded);
  }
  onTrackEnded(track: Track) {
    if (
      track.participant?.userId === this.videoHolderModel?.participant.userId
    ) {
      if (
        this.videoHolderModel?.videoHolderModelType ===
        VideoHodlerModelType.Main
      ) {
        if (track.trackKind === TrackKind.Video) {
          this.setState({ videoTrack: undefined });
        } else if (track.trackKind === TrackKind.Audio) {
          this.setState({ audioTrack: undefined });
        }
      }
    }
  }

  onTrack(track: Track) {
    console.log('onTrack');

    if (
      track.participant?.userId === this.videoHolderModel?.participant.userId
    ) {
      if (
        this.videoHolderModel?.videoHolderModelType ===
        VideoHodlerModelType.Main &&
        (track.trackKind === TrackKind.Video ||
          track.trackKind === TrackKind.Audio)
      ) {
        if (track.trackKind === TrackKind.Audio) {
          this.setState({ audioTrack: track });
        } else if (track.trackKind === TrackKind.Video) {
          // WebrtcCallHandler.getInstance().getMeetingHandler().updateSpatialForTrack(track,0)
          this.setState({ videoTrack: track });
          if (!track.isLocalTrack) {
            (this.props.isFullScreenView) ? WebrtcCallHandler.getInstance().getMeetingHandler().updateSpatialForTrack(track, 1) : WebrtcCallHandler.getInstance().getMeetingHandler().updateSpatialForTrack(track, 0)
          }
        }
      } else if (
        this.videoHolderModel?.videoHolderModelType ===
        VideoHodlerModelType.Screenshare &&
        (track.trackKind === TrackKind.ScreenshareVideo ||
          track.trackKind === TrackKind.ScreenshareAudio)
      ) {
        if (
          !track.isLocalTrack &&
          track.trackKind === TrackKind.ScreenshareAudio
        ) {
          this.setState({ audioTrack: track });
        } else if (track.trackKind === TrackKind.ScreenshareVideo) {
          this.setState({ videoTrack: track });
        }
      }
    }
  }

  onVisibilityChange(isVisible: boolean) {
    if (!this.isLocal) {
      console.log("isVisible ", isVisible);
      // this.setState({ isBoxVisible: isVisible });
      if (!isVisible) {
        if (this.state.videoTrack) {
          WebrtcCallHandler.getInstance().getMeetingHandler().pauseIncomingTrack(this.state.videoTrack);
        }
      }
      else {
        if (this.state.videoTrack) {
          WebrtcCallHandler.getInstance().getMeetingHandler().resumeIncomingTrack(this.state.videoTrack);
        }
      }
    }


  }
  render() {
    return (
      <VisibilitySensor onChange={this.onVisibilityChange} partialVisibility={true} >

        {({ isVisible }) => {
          return (
            <>

              <div className="video-participants"></div>
              {isVisible && this.state.videoTrack && this.state.videoTrack.track ? (
                <Suspense fallback={<SmallSuspense />}>
                  <VideoPlayer
                    key={this.state.videoTrack.track.id}
                    isLocal={this.isLocal && this.videoHolderModel?.videoHolderModelType === VideoHodlerModelType.Main }
                    track={this.state.videoTrack.track}
                  />
                </Suspense>
              ) : (
                <div className="participants-avatar" >
                  <span>
                    {this.props.videoHolderModel.participant.userData.name
                      ? this.props.videoHolderModel.participant.userData.name[0]
                      : ""}
                  </span>
                </div>
              )}
              <div className="status-icon">
                {(!this.state.audioTrack || !this.state.audioTrack.track) && (
                  <Suspense fallback={<SmallSuspense />}>
                    <MicOff fontSize="small" />
                  </Suspense>
                )}
                {isVisible && this.state.audioTrack && this.state.audioTrack.track && (
                  <Suspense fallback={<SmallSuspense />}>
                    <AudioWave audioTrack={this.state.audioTrack.track} />
                  </Suspense>
                )}
              </div>
              <div className="participant-name">
                <p>
                  {this.props.videoHolderModel.participant.userData.name
                    ? this.props.videoHolderModel.participant.userData.name
                    : ""}
                </p>
              </div>

              {this.state.audioTrack && this.state.audioTrack.track && !this.isLocal && (
                <Suspense fallback={<SmallSuspense />}>
                  <AudioPlayer
                    key={this.state.audioTrack.track.id}
                    track={this.state.audioTrack.track}
                  />
                </Suspense>
              )}
            </>
          )
        }}
      </VisibilitySensor>

    );
  }
}

export default VideoBox;
