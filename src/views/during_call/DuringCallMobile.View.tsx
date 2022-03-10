import React, { Suspense } from "react";
import {
  DrawerViewType,
  MeetingMobileProps,
} from "../../components/during_call/DuringCallComponent";
import SmallSuspense from "../../small_components/SmallSuspense";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "../../styles/auro/setting.css";
import SwiperCore, { Pagination, Lazy } from "swiper";
import MoreVert from "@mui/icons-material/MoreVert";
import { VideoHodlerModelType } from "../../model/VideoHolderModel";
import { ListItemIcon, ListItemText } from "@mui/material";
import "../../styles/auro/message.css";
import { Dashboard, Fullscreen, LiveTv } from "@mui/icons-material";
import BadgeButton from "../../small_components/BadgeButton";
const SocialStream = React.lazy(() => import("../../small_components/SocialStream"));
const LanguageSelector = React.lazy(
  () => import("../../small_components/LanguageSelector")
);
const Settings = React.lazy(() => import("@mui/icons-material/Settings"));

const Close = React.lazy(() => import("@mui/icons-material/Close"));
const MicSelection = React.lazy(
  () => import("../../small_components/MicSelection")
);
const CameraSelection = React.lazy(
  () => import("../../small_components/CameraSelection")
);

const MicIcon = React.lazy(() => import("@mui/icons-material/Mic"));
const MicOffIcon = React.lazy(() => import("@mui/icons-material/MicOff"));
const VideocamIcon = React.lazy(() => import("@mui/icons-material/Videocam"));
const VideocamOffIcon = React.lazy(
  () => import("@mui/icons-material/VideocamOff")
);
const CallEndIcon = React.lazy(() => import("@mui/icons-material/CallEnd"));
const ChatIcon = React.lazy(() => import("@mui/icons-material/Chat"));
const PeopleIcon = React.lazy(() => import("@mui/icons-material/People"));
const VideoBox = React.lazy(() => import("../../small_components/VideoBox"));
const CameraswitchIcon = React.lazy(
  () => import("@mui/icons-material/FlipCameraAndroid")
);
const SpeakerIcon = React.lazy(() => import("@mui/icons-material/VolumeUp"));
const MenuItem = React.lazy(() => import("@mui/material/MenuItem"));
const MoreOptionsDialog = React.lazy(
  () => import("../../small_components/MoreOptionsDialog")
);
const MobileParticipantScreen = React.lazy(
  () => import("../../small_components/MobileParticipantScreen")
);
const MobileMessageScreen = React.lazy(
  () => import("../../small_components/MobileMessageScreen")
);

SwiperCore.use([Pagination, Lazy]);
export default class DuringCallDesktop extends React.Component<MeetingMobileProps> {
  renderVideo = (): any => {
    let eachVideoPlayerIndex = 1;
    const reactElments = [];
    while (
      eachVideoPlayerIndex <
      this.props.duringCallComponent.state.videoHoldersModel.length
    ) {
      const eachSlideItem: any[] = [];
      while (
        eachSlideItem.length <
        (process.env
          .REACT_APP_MOBILE_EACH_PAGE_MAX_VIDEOS as unknown as number) &&
        eachVideoPlayerIndex <
        this.props.duringCallComponent.state.videoHoldersModel.length
      ) {
        const holder =
          this.props.duringCallComponent.state.videoHoldersModel[
          eachVideoPlayerIndex
          ];
        if (holder.isSelf === false) {
          const viewHolder =
            this.props.duringCallComponent.state.videoHoldersModel[
            eachVideoPlayerIndex
            ];
          eachSlideItem.push(
            <ul className="mobile-video_grid">
              <li>
                <Suspense fallback={<SmallSuspense />}>
                  <div className="remote-video-box">
                    <VideoBox
                      isFullScreenView={false}
                      key={
                        viewHolder.participant.userId +
                        viewHolder.videoHolderModelType
                      }
                      videoHolderModel={viewHolder}
                    />
                  </div>
                </Suspense>
              </li>
            </ul>
          );
        }
        eachVideoPlayerIndex = eachVideoPlayerIndex + 1;
      }
      if (eachSlideItem.length > 0) {
        reactElments.push(
          <SwiperSlide>
            <div className="DC-participantGrid">{eachSlideItem}</div>
          </SwiperSlide>
        );
      }
    }
    if (reactElments && reactElments.length > 0) {
      return reactElments;
    }
    return null;
  };
  render() {
    return (
      <div
        className="DC-Mobile-Container"
        ref={this.props.duringCallComponent.parentView}
      >
        {this.props.duringCallComponent.state.showStreamOption && (
          <Suspense fallback={<SmallSuspense />}>

            <SocialStream duringCallComponent={this.props.duringCallComponent} />
          </Suspense>
        )}
        {this.props.duringCallComponent.state.settingOpen && (
          <div
            className="setting-dialog"
            onClick={(e) => {
              console.log(e);

              this.props.duringCallComponent.handleBackDropClose(e);
            }}
            ref={(ref) => (this.props.duringCallComponent.settingRef = ref)}
          >
            <div
              style={{
                backgroundColor: "#fff",
              }}
              className="setting-mobile-bg"
            >
              <div className="dropdown">
                <Suspense fallback={<SmallSuspense />}>
                  <CameraSelection />
                </Suspense>
                <Suspense fallback={<SmallSuspense />}>
                  <MicSelection />
                </Suspense>
              </div>
            </div>
            <div
              onClick={this.props.duringCallComponent.handleSettingOpen}
              className="setting-close"
            >
              <Suspense fallback={<SmallSuspense />}>
                <Close
                  style={{
                    color: "#000",
                  }}
                />
              </Suspense>
            </div>
          </div>
        )}
        <div className="DC-Mobile-Header">
          <div className="DC-Mobile-HeaderLeft">
            <div className="DC-UserAvatar">
              <span>{`${this.props.duringCallComponent.state.runningTime}`}</span>
            </div>
          </div>
          <div className="DC-Mobile-HeaderRight">
            <div
              className="speaker-control"
              onClick={this.props.duringCallComponent.showMoreOption}
            >
              <Suspense fallback={<SmallSuspense />}>
                <MoreVert />
              </Suspense>
            </div>
            {/* <div className="speaker-control">
              <Suspense fallback={<SmallSuspense />}>
                <SpeakerIcon />
              </Suspense>
            </div> */}
            <div
              className="camera-switch"
              onClick={this.props.duringCallComponent.switchCameraTapped}
            >
              <Suspense fallback={<SmallSuspense />}>
                <CameraswitchIcon />
              </Suspense>
            </div>
            <div className="DC-Language">
              <Suspense fallback={<SmallSuspense />}>
                <LanguageSelector />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="DC-Mobile-MeetView">
          <div className="Carousel">
            {this.props.duringCallComponent.state.videoHoldersModel.length >
              0 &&
              this.props.duringCallComponent.state.videoHoldersModel[0]
                .videoHolderModelType === VideoHodlerModelType.Whiteboard && (
                <div className="wb-iframe">
                  <div
                    className="board-close"
                    onClick={() => {
                      this.props.duringCallComponent.handleWhiteBoard();
                    }}
                  >
                    <Close />
                  </div>
                  <iframe
                    title="whiteboard"
                    src={
                      this.props.duringCallComponent.state.videoHoldersModel[0]
                        .whiteboardUrl!
                    }
                    height={"100%"}
                    width={"100%"}
                  />
                </div>
              )}
            <Swiper
              slidesPerView={1}
              pagination={{
                dynamicBullets: true,
              }}
              lazy={true}
            >
              <SwiperSlide>
                <div className="DC-participant">
                  {this.props.duringCallComponent.state.videoHoldersModel
                    .length > 0 &&
                    this.props.duringCallComponent.state.videoHoldersModel[0]
                      .videoHolderModelType !==
                    VideoHodlerModelType.Whiteboard && (
                      <Suspense fallback={<SmallSuspense />}>
                        <div className="remote-video-box">
                          <VideoBox
                            isFullScreenView={true}
                            key={
                              this.props.duringCallComponent.state
                                .videoHoldersModel[0].participant.userId +
                              this.props.duringCallComponent.state
                                .videoHoldersModel[0].videoHolderModelType
                            }
                            videoHolderModel={
                              this.props.duringCallComponent.state
                                .videoHoldersModel[0]
                            }
                          />
                        </div>
                      </Suspense>
                    )}
                </div>
              </SwiperSlide>
              {this.renderVideo()}
            </Swiper>
          </div>
          {this.props.duringCallComponent.state.videoHoldersModel.length > 1 &&
            this.props.duringCallComponent.getSelfVideoModel() && (
              <div className="DC-Mobile-SelfView">
                <Suspense fallback={<SmallSuspense />}>
                  <VideoBox
                    isFullScreenView={false}
                    key={
                      this.props.duringCallComponent.getSelfVideoModel()!
                        .participant.userId +
                      this.props.duringCallComponent.getSelfVideoModel()!
                        .videoHolderModelType
                    }
                    videoHolderModel={
                      this.props.duringCallComponent.getSelfVideoModel()!
                    }
                  />
                </Suspense>
              </div>
            )}
        </div>
        <div className="DC-Mobile-Footer">
          <ul>
            <li>
              {/* <div className="badge">
                  <MoreVertIcon />
              </div> */}
              {this.props.duringCallComponent.state.isMuted ? (
                <Suspense fallback={<SmallSuspense />}>
                  <MicOffIcon
                    onClick={this.props.duringCallComponent.micToggle}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={<SmallSuspense />}>
                  <MicIcon onClick={this.props.duringCallComponent.micToggle} />
                </Suspense>
              )}
            </li>
            <li>
              {this.props.duringCallComponent.state.isCameraOff ? (
                <Suspense fallback={<SmallSuspense />}>
                  <VideocamOffIcon
                    onClick={this.props.duringCallComponent.videoToggle}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={<SmallSuspense />}>
                  <VideocamIcon
                    onClick={this.props.duringCallComponent.videoToggle}
                  />
                </Suspense>
              )}
            </li>
            <li
              className="DC-EndButton"
              onClick={this.props.duringCallComponent.onEndCallTapped}
            >
              <Suspense fallback={<SmallSuspense />}>
                <CallEndIcon />
              </Suspense>
            </li>
            <li
              onClick={() => {
                this.props.duringCallComponent.setCurrentDrawerViewType(
                  DrawerViewType.Message
                );
                this.props.duringCallComponent.toggleModal();
              }}
            >
              <Suspense fallback={<SmallSuspense />}>
                {this.props.duringCallComponent.state.noOfNewMessage >= 1 ? (
                  <BadgeButton
                    badgeCount={
                      this.props.duringCallComponent.state.noOfNewMessage + ""
                    }
                    badgeIcon={<ChatIcon />}
                  />
                ) : (
                  <ChatIcon />
                )}
              </Suspense>
            </li>
            <li
              onClick={() => {
                this.props.duringCallComponent.setCurrentDrawerViewType(
                  DrawerViewType.Participant
                );
                this.props.duringCallComponent.toggleModal();
              }}
            >
              <Suspense fallback={<SmallSuspense />}>
                <BadgeButton
                  badgeCount={
                    this.props.duringCallComponent.state.noOfParticipant + ""
                  }
                  badgeIcon={<PeopleIcon />}
                />
              </Suspense>
            </li>
          </ul>
        </div>
        {this.props.duringCallComponent.state.drawerViewType ===
          DrawerViewType.Message && (
            <Suspense fallback={<SmallSuspense />}>
              <MobileMessageScreen
                duringCallComponent={this.props.duringCallComponent}
              />
            </Suspense>
          )}
        {this.props.duringCallComponent.state.drawerViewType ===
          DrawerViewType.Participant && (
            <Suspense fallback={<SmallSuspense />}>
              <MobileParticipantScreen
                duringCallComponent={this.props.duringCallComponent}
                t={this.props.duringCallComponent.props.t}
              />
            </Suspense>
          )}
        <Suspense fallback={<SmallSuspense />}>
          <MoreOptionsDialog
            parenetContainer={this.props.duringCallComponent.parentView.current}
            anchorEl={this.props.duringCallComponent.state.moerOptionAnchorEl}
            handleClick={this.props.duringCallComponent.showMoreOption}
            handleClose={this.props.duringCallComponent.hideMoreOption}
          >
            <Suspense fallback={<SmallSuspense />}></Suspense>
            {/* <Suspense fallback={<SmallSuspense />}>
              <MenuItem
                onClick={() => {
                  this.props.duringCallComponent.hideMoreOption();
                }}
              >
                <ListItemIcon>
                  <Fullscreen />
                </ListItemIcon>
                <ListItemText>
                  {this.props.duringCallComponent.props.t("fullscreen")}
                </ListItemText>
              </MenuItem>
            </Suspense> */}
            <MenuItem
              onClick={() => {
                this.props.duringCallComponent.handleSettingOpen();
                this.props.duringCallComponent.hideMoreOption();
              }}
            >
              <ListItemIcon>
                <Suspense fallback={<SmallSuspense />}>
                  <Settings />
                </Suspense>
              </ListItemIcon>
              <ListItemText>
                {this.props.duringCallComponent.props.t("settings")}
              </ListItemText>
            </MenuItem>
            {process.env.REACT_APP_IS_WHITEBOARD_REQUIRED === "1" ? (
              <Suspense fallback={<SmallSuspense />}>
                <MenuItem
                  onClick={() => {
                    this.props.duringCallComponent.handleWhiteBoard();
                    this.props.duringCallComponent.hideMoreOption();
                  }}
                >
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText>
                    {this.props.duringCallComponent.props.t("whiteboard")}
                  </ListItemText>
                </MenuItem>
              </Suspense>
            ) : null}
            <MenuItem
              onClick={() => {
                this.props.duringCallComponent.handleshowStreamOption();
                this.props.duringCallComponent.hideMoreOption();
              }}
            >
              <ListItemIcon>
                <LiveTv />
              </ListItemIcon>
              <ListItemText>Go Live</ListItemText>
            </MenuItem>
          </MoreOptionsDialog>
        </Suspense>
      </div>
    );
  }
}
