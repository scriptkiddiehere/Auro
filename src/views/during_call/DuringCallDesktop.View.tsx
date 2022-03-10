import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import "../../styles/auro/Auroapp-desktop.css";
import {
  Badge,
  Button,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
// import EscapeOutside from "react-escape-outside";
import {
  VideoHodlerModelType,
  VideoHolderModel,
} from "../../model/VideoHolderModel";
import {
  DrawerViewType,
  MeetingDesktopProps,
} from "../../components/during_call/DuringCallComponent";
import { Suspense } from "react";
import SmallSuspense from "../../small_components/SmallSuspense";
import {
  ContentCopy,
  Dashboard,
  Fullscreen,
  LiveTv,
  Settings,
  VolumeUp,
} from "@mui/icons-material";
import "../../styles/auro/setting.css";
import CameraSelection from "../../small_components/CameraSelection";
import MicSelection from "../../small_components/MicSelection";
import Close from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import MoreOptionsDialog from "../../small_components/MoreOptionsDialog";
import MenuItem from "@mui/material/MenuItem";
import WebrtcCallHandler from "../../utility/WebrtcCallHandler";
// const MoreOptionsDialog = React.lazy(
//   () => import("../../small_components/MoreOptionsDialog")
// );
const MessageScreen = React.lazy(
  () => import("../../small_components/MessageScreen")
);
const ParticipantScreen = React.lazy(
  () => import("../../small_components/ParticipantScreen")
);
const Drawer = React.lazy(() => import("@mui/material/Drawer"));
const IconButton = React.lazy(() => import("@mui/material/IconButton"));
const ChatIcon = React.lazy(() => import("@mui/icons-material/Chat"));
const PeopleIcon = React.lazy(() => import("@mui/icons-material/People"));
const MoreVertIcon = React.lazy(() => import("@mui/icons-material/MoreVert"));
const VideoBox = React.lazy(() => import("../../small_components/VideoBox"));
const SocialStream = React.lazy(
  () => import("../../small_components/SocialStream")
);

const LanguageSelector = React.lazy(
  () => import("../../small_components/LanguageSelector")
);
const ChevronLeftIcon = React.lazy(
  () => import("@mui/icons-material/ChevronLeft")
);
const ChevronRightIcon = React.lazy(
  () => import("@mui/icons-material/ChevronRight")
);
const SmallIconButton = React.lazy(
  () => import("../../small_components/SmallIconButton")
);
const MicIcon = React.lazy(() => import("@mui/icons-material/Mic"));
const MicOffIcon = React.lazy(() => import("@mui/icons-material/MicOff"));
const ScreenShareIcon = React.lazy(
  () => import("@mui/icons-material/ScreenShare")
);
const ScreenShareOffIcon = React.lazy(
  () => import("@mui/icons-material/StopScreenShare")
);
const VideocamIcon = React.lazy(() => import("@mui/icons-material/Videocam"));
const VideocamOffIcon = React.lazy(
  () => import("@mui/icons-material/VideocamOff")
);
const CallEndIcon = React.lazy(() => import("@mui/icons-material/CallEnd"));
const RadioButtonCheckedIcon = React.lazy(
  () => import("@mui/icons-material/RadioButtonChecked")
);
const RecordingWave = React.lazy(
  () => import("../../small_components/RecordingWave")
);
const Box = React.lazy(() => import("@mui/material/Box"));

const drawerWidth = "25%";
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth})`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")<any>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function DuringCallDesktop(props: MeetingDesktopProps) {
  const theme = useTheme();
  React.useEffect(() => {
    toast.success('prabhat')
    document.addEventListener("keyup", (e) => {
      if (e.keyCode && props.duringCallComponent.state.settingOpen) {
        props.duringCallComponent.handleSettingOpen();
      }
    });
  }, []);
  return (
    <div
      className="DC-Desktop-Container"
      ref={props.duringCallComponent.parentView}
    >
      {props.duringCallComponent.state.showStreamOption && (
        <Suspense fallback={<SmallSuspense />}>
          <SocialStream duringCallComponent={props.duringCallComponent} />
        </Suspense>
      )}
      {props.duringCallComponent.state.settingOpen && (
        <div
          className="setting-dialog"
          onKeyUp={(e) => {
            console.log(e);
          }}
          onClick={(e: any) => {
            props.duringCallComponent.closeOnEsc(e);
          }}
          ref={(ref) => (props.duringCallComponent.deviceSelectRef = ref)}
        >
          <div
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div className="dropdown">
              <CameraSelection />
              <MicSelection />
            </div>
          </div>
          <div
            onClick={props.duringCallComponent.handleSettingOpen}
            className="setting-close"
          >
            <Close />
          </div>
        </div>
      )}
      {WebrtcCallHandler.getInstance().getMeetingRequest()?.isRecordingUser ===
        false ? (
        <div
          className={
            props.duringCallComponent.state.drawerViewType !==
              DrawerViewType.None
              ? "DC-Desktop-Header shrink"
              : "DC-Desktop-Header"
          }
        >
          <div className="timeInfo">
            <span
              style={{
                width: 80,
              }}
            >{`${props.duringCallComponent.state.runningTime}`}</span>
            {process.env.REACT_APP_COPY_LINK_REQUIRED === "1" && (
              <Tooltip
                title="Copy Meeting link"
                style={{
                  // marginLeft: 40,
                  cursor: "pointer",
                }}
              >
                <ContentCopy
                  onClick={props.duringCallComponent.onCopyLinkTapped}
                />
              </Tooltip>
            )}
          </div>
          <Suspense fallback={<SmallSuspense />}>
            <LanguageSelector />
          </Suspense>
        </div>
      ) : null}
      <div
        className={
          WebrtcCallHandler.getInstance().getMeetingRequest()?.isRecordingUser
            ? "DC-Desktop-Main full-h"
            : "DC-Desktop-Main"
        }
      >
        <Suspense fallback={<SmallSuspense />}>
          <Box className="dc-desktop-box">
            {WebrtcCallHandler.getInstance().getMeetingRequest()
              ?.isRecordingUser === false ? (
              <AppBar
                open={
                  props.duringCallComponent.state.drawerViewType !==
                  DrawerViewType.None
                }
                className="dc-dektop-appbar"
              >
                <Toolbar className="dc-desktop-toolbar">
                  <div className="toolbarLeftIconButtons">
                    <Suspense fallback={<SmallSuspense />}>
                      {props.duringCallComponent.state.isMuted ? (
                        <SmallIconButton
                          onClick={props.duringCallComponent.micToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "mic-off"
                                )}
                              >
                                <MicOffIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      ) : (
                        <SmallIconButton
                          onClick={props.duringCallComponent.micToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "mic-on"
                                )}
                              >
                                <MicIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      )}
                      {props.duringCallComponent.state.isCameraOff ? (
                        <SmallIconButton
                          onClick={props.duringCallComponent.videoToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "video-off"
                                )}
                              >
                                <VideocamOffIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      ) : (
                        <SmallIconButton
                          onClick={props.duringCallComponent.videoToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "video-on"
                                )}
                              >
                                <VideocamIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      )}

                      {props.duringCallComponent.state.isScreenSharing ? (
                        <SmallIconButton
                          onClick={props.duringCallComponent.screenshareToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "share-screen-off"
                                )}
                              >
                                <ScreenShareOffIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      ) : (
                        <SmallIconButton
                          onClick={props.duringCallComponent.screenshareToggle}
                          icon={
                            <Suspense fallback={<SmallSuspense />}>
                              <Tooltip
                                title={props.duringCallComponent.props.t(
                                  "share-screen"
                                )}
                              >
                                <ScreenShareIcon />
                              </Tooltip>
                            </Suspense>
                          }
                        />
                      )}
                    </Suspense>
                  </div>
                  <div className="toolbarMiddleIconButton">
                    <Button
                      onClick={props.duringCallComponent.onEndCallTapped}
                      variant="contained"
                      disableElevation
                      className="end-btn"
                      style={{
                        fontFamily: "inherit",
                      }}
                    >
                      <span>
                        {props.duringCallComponent.props.t("end-meet")}
                      </span>
                      <Suspense fallback={<SmallSuspense />}>
                        <CallEndIcon />
                      </Suspense>
                    </Button>
                  </div>
                  <div className="toolbarRightIconButtons">

                    <Suspense fallback={<SmallSuspense />}>
                      {process.env.REACT_APP_IS_RECORDING_REQUIRED === "1" ? (

                        <div>
                          {!props.duringCallComponent.state.isRecording ? (
                            <SmallIconButton
                              onClick={props.duringCallComponent.recordingToggle}
                              icon={
                                <Suspense fallback={<SmallSuspense />}>
                                  <Tooltip
                                    title={props.duringCallComponent.props.t(
                                      "record-on"
                                    )}
                                  >
                                    <RadioButtonCheckedIcon />
                                  </Tooltip>
                                </Suspense>
                              }
                            />
                          ) : (
                            <SmallIconButton
                              onClick={props.duringCallComponent.recordingToggle}
                              icon={
                                <Suspense fallback={<SmallSuspense />}>
                                  <Tooltip
                                    title={props.duringCallComponent.props.t(
                                      "record-off"
                                    )}
                                  >
                                    <RecordingWave />
                                  </Tooltip>
                                </Suspense>
                              }
                            />
                          )}
                        </div>) : null}

                      <SmallIconButton
                        icon={
                          <Suspense fallback={<SmallSuspense />}>
                            <Tooltip
                              title={props.duringCallComponent.props.t(
                                "participant"
                              )}
                            >
                              <Badge
                                className="badge badge-color"
                                badgeContent={
                                  props.duringCallComponent.state
                                    .noOfParticipant + ""
                                }
                                color="primary"
                              >
                                <PeopleIcon />
                              </Badge>
                            </Tooltip>
                          </Suspense>
                        }
                        onClick={() => {
                          props.duringCallComponent.setCurrentDrawerViewType(
                            DrawerViewType.Participant
                          );
                        }}
                      />
                      <SmallIconButton
                        icon={
                          <Suspense fallback={<SmallSuspense />}>
                            <Tooltip
                              title={props.duringCallComponent.props.t(
                                "message"
                              )}
                            >
                              {props.duringCallComponent.state.noOfNewMessage >=
                                1 ? (
                                <Badge
                                  badgeContent={
                                    props.duringCallComponent.state
                                      .noOfNewMessage + ""
                                  }
                                  className="badge badge-color"
                                  color="primary"
                                >
                                  <ChatIcon />
                                </Badge>
                              ) : (
                                <ChatIcon />
                              )}
                            </Tooltip>
                          </Suspense>
                        }
                        onClick={() => {
                          props.duringCallComponent.setCurrentDrawerViewType(
                            DrawerViewType.Message
                          );
                        }}
                      />
                      <SmallIconButton
                        icon={
                          <Suspense fallback={<SmallSuspense />}>
                            <Tooltip
                              title={props.duringCallComponent.props.t(
                                "more-options"
                              )}
                            >
                              <MoreVertIcon
                                id="basic-menu"
                                aria-haspopup="true"
                              />
                            </Tooltip>
                          </Suspense>
                        }
                        onClick={props.duringCallComponent.showMoreOption}
                      />
                    </Suspense>
                  </div>
                </Toolbar>
              </AppBar>
            ) : null}
            {/* {props.duringCallComponent.state.drawerViewType && ( */}
            <Suspense fallback={<SmallSuspense />}>
              <MoreOptionsDialog
                parenetContainer={props.duringCallComponent.parentView.current}
                anchorEl={props.duringCallComponent.state.moerOptionAnchorEl}
                handleClick={props.duringCallComponent.showMoreOption}
                handleClose={props.duringCallComponent.hideMoreOption}
              >
                {/* <Suspense fallback={<SmallSuspense />}>
                    <MenuItem>
                      <ListItemIcon>
                        <VolumeUp />
                      </ListItemIcon>
                      <ListItemText>
                        {props.duringCallComponent.props.t("speaker")}
                      </ListItemText>
                    </MenuItem>
                  </Suspense> */}
                {/* <Suspense fallback={<SmallSuspense />}> */}
                <MenuItem
                  onClick={() => {
                    props.duringCallComponent.onFullScreenTapped();
                    props.duringCallComponent.hideMoreOption();
                  }}
                >
                  <ListItemIcon>
                    <Fullscreen />
                  </ListItemIcon>
                  <ListItemText>
                    {props.duringCallComponent.props.t("fullscreen")}
                  </ListItemText>
                </MenuItem>
                {/* </Suspense> */}

                {process.env.REACT_APP_IS_WHITEBOARD_REQUIRED === "1" ? (
                  // <Suspense fallback={<SmallSuspense />}>
                  <MenuItem
                    onClick={() => {
                      props.duringCallComponent.handleWhiteBoard();
                      props.duringCallComponent.hideMoreOption();
                    }}
                  >
                    <ListItemIcon>
                      <Dashboard />
                    </ListItemIcon>
                    <ListItemText>
                      {props.duringCallComponent.props.t("whiteboard")}
                    </ListItemText>
                  </MenuItem>
                ) : // </Suspense>
                  null}
                {/* <Suspense fallback={<SmallSuspense />}> */}
                <MenuItem
                  onClick={() => {
                    props.duringCallComponent.handleSettingOpen();
                    props.duringCallComponent.hideMoreOption();
                  }}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText>
                    {props.duringCallComponent.props.t("settings")}
                  </ListItemText>
                </MenuItem>
                {/* </Suspense> */}
                {process.env.REACT_APP_COPY_LINK_REQUIRED === "1" ? (
                  // <Suspense fallback={<SmallSuspense />}>
                  <MenuItem
                    onClick={() => {
                      props.duringCallComponent.onCopyLinkTapped();
                      props.duringCallComponent.hideMoreOption();
                    }}
                  >
                    <ListItemIcon>
                      <ContentCopy />
                    </ListItemIcon>
                    <ListItemText>
                      {props.duringCallComponent.props.t("invite")}
                    </ListItemText>
                  </MenuItem>
                ) : // </Suspense>
                  null}
                {process.env.REACT_APP_IS_GO_LIVE_REQUIRED === "1" ? (
                  <MenuItem
                    onClick={() => {
                      props.duringCallComponent.handleshowStreamOption();
                      props.duringCallComponent.hideMoreOption();
                    }}
                  >
                    <ListItemIcon>
                      <LiveTv />
                    </ListItemIcon>
                    <ListItemText>Go Live</ListItemText>
                  </MenuItem>
                ) : null}
              </MoreOptionsDialog>
            </Suspense>
            {/* )} */}
            <Main
              open={
                props.duringCallComponent.state.drawerViewType !==
                DrawerViewType.None
              }
              className={
                props.duringCallComponent.state.drawerViewType !== 3
                  ? `video-root_container mr ${WebrtcCallHandler.getInstance().getMeetingRequest()
                    ?.isRecordingUser
                    ? "full-h"
                    : ""
                  }`
                  : `video-root_container ${WebrtcCallHandler.getInstance().getMeetingRequest()
                    ?.isRecordingUser
                    ? "full-h"
                    : ""
                  }`
              }
            >
              <div className="videos-container">
                <div
                  className={
                    props.duringCallComponent.state.videoHoldersModel.length ===
                      1
                      ? "local-video_wrap full-width"
                      : "local-video_wrap"
                  }
                >
                  {props.duringCallComponent.state.videoHoldersModel.length >
                    0 &&
                    props.duringCallComponent.state.videoHoldersModel[0]
                      .videoHolderModelType ===
                    VideoHodlerModelType.Whiteboard && (
                      <div className="wb-iframe">
                        <div
                          className="board-close"
                          onClick={() => {
                            props.duringCallComponent.handleWhiteBoard();
                          }}
                        >
                          <Close />
                        </div>
                        <iframe
                          title="whiteboard"
                          src={
                            props.duringCallComponent.state.videoHoldersModel[0]
                              .whiteboardUrl!
                          }
                          height={"100%"}
                          width={"100%"}
                        />
                      </div>
                    )}
                  {props.duringCallComponent.state.videoHoldersModel.length >
                    0 &&
                    props.duringCallComponent.state.videoHoldersModel[0]
                      .videoHolderModelType !==
                    VideoHodlerModelType.Whiteboard && (
                      <>
                        <Suspense fallback={<SmallSuspense />}>
                          <div
                            className="remote-video-box"
                            key={
                              props.duringCallComponent.state
                                .videoHoldersModel[0].participant.userId +
                              props.duringCallComponent.state
                                .videoHoldersModel[0].videoHolderModelType
                            }
                          >
                            <VideoBox
                              isFullScreenView={true}
                              key={
                                props.duringCallComponent.state
                                  .videoHoldersModel[0].participant.userId +
                                props.duringCallComponent.state
                                  .videoHoldersModel[0].videoHolderModelType
                              }
                              videoHolderModel={
                                props.duringCallComponent.state
                                  .videoHoldersModel[0]
                              }
                            />
                          </div>
                        </Suspense>

                        {/* <DisableVideo /> */}
                      </>
                    )}
                </div>

                <div
                  className={
                    props.duringCallComponent.state.videoHoldersModel.length < 2
                      ? "no-remote"
                      : "remote-video_wrap"
                  }
                >
                  {props.duringCallComponent.state.videoHoldersModel.map(
                    (_videoHoldersModel: VideoHolderModel, _index: number) => {
                      if (_index === 0) {
                        return null;
                      }
                      return (
                        <Suspense fallback={<SmallSuspense />}>
                          <div
                            className="video-box"
                            key={
                              _videoHoldersModel.participant.userId +
                              _videoHoldersModel.videoHolderModelType
                            }
                          >
                            <VideoBox
                              isFullScreenView={false}
                              key={
                                _videoHoldersModel.participant.userId +
                                _videoHoldersModel.videoHolderModelType
                              }
                              videoHolderModel={_videoHoldersModel}
                            />
                          </div>
                        </Suspense>
                      );
                    }
                  )}
                </div>
              </div>
            </Main>
            {props.duringCallComponent.state.drawerViewType !==
              DrawerViewType.None ? (
              <Suspense fallback={<SmallSuspense />}>
                <Drawer
                  sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: drawerWidth,
                      boxSizing: "border-box",
                    },
                  }}
                  variant="persistent"
                  anchor="right"
                  open={true}
                >
                  <DrawerHeader className="dc-desktop-drawer-header">
                    {" "}
                    <Suspense fallback={<SmallSuspense />}>
                      <IconButton
                        onClick={(evt: any) => {
                          props.duringCallComponent.setCurrentDrawerViewType(
                            DrawerViewType.None
                          );
                        }}
                      >
                        {theme.direction === "rtl" ? (
                          <Suspense fallback={<SmallSuspense />}>
                            <ChevronLeftIcon />
                          </Suspense>
                        ) : (
                          <Suspense fallback={<SmallSuspense />}>
                            <ChevronRightIcon />
                          </Suspense>
                        )}
                      </IconButton>
                    </Suspense>
                  </DrawerHeader>
                  <div className="drawer-wrap">
                    {props.duringCallComponent.state.drawerViewType ===
                      DrawerViewType.Message && (
                        <Suspense fallback={<SmallSuspense />}>
                          <MessageScreen
                            closeIcon={false}
                            duringCallComponent={props.duringCallComponent}
                            t={props.duringCallComponent.props.t}
                          />
                        </Suspense>
                      )}
                    {props.duringCallComponent.state.drawerViewType ===
                      DrawerViewType.Participant && (
                        <Suspense fallback={<SmallSuspense />}>
                          <ParticipantScreen
                            closeIcon={false}
                            duringCallComponent={props.duringCallComponent}
                            t={props.duringCallComponent.props.t}
                          />
                        </Suspense>
                      )}
                  </div>
                </Drawer>
              </Suspense>
            ) : null}
          </Box>
        </Suspense>
      </div>
    </div>
  );
}
