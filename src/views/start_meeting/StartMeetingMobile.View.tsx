import React, { Suspense } from "react";
import { StartMeetingViewProps } from "../../components/start_meeting/StartMeetingComponent";
import "../../styles/auro/Auroapp-mobile.css";
import "../../styles/auro/Auroapp-desktop.css";
import SettingsIcon from "@mui/icons-material/Settings";
import SmallSuspense from "../../small_components/SmallSuspense";

const MicIcon = React.lazy(() => import("@mui/icons-material/Mic"));
const MicOffIcon = React.lazy(() => import("@mui/icons-material/MicOff"));
const VideocamIcon = React.lazy(() => import("@mui/icons-material/Videocam"));
const AdvanceSetting = React.lazy(
  () => import("../../small_components/AdvanceSetting")
);
const Avatar = React.lazy(() => import("@mui/material/Avatar"));
const PermissionError = React.lazy(
  () => import("../../small_components/PermissionError")
);
const VideocamOffIcon = React.lazy(
  () => import("@mui/icons-material/VideocamOff")
);
const CameraSelection = React.lazy(
  () => import("../../small_components/CameraSelection")
);
const MicSelection = React.lazy(
  () => import("../../small_components/MicSelection")
);
const VideoPlayer = React.lazy(
  () => import("../../small_components/VideoPlayer")
);
const LanguageSelector = React.lazy(
  () => import("../../small_components/LanguageSelector")
);

const StartMeetingMobile = (
  props: React.PropsWithChildren<StartMeetingViewProps>
) => {
  return (
    <div className="StartmeetingMobile">
      <div className="mobileHeader">
        <Suspense fallback={<SmallSuspense />}>
          <LanguageSelector />
        </Suspense>
      </div>
      <div className="mobile-video">
        {props.startMeetingComponent.state.selfTrack ? (
          <Suspense fallback={<SmallSuspense />}>
            <VideoPlayer isLocal={true} track={props.startMeetingComponent.state.selfTrack} />
          </Suspense>
        ) : (
          <Suspense fallback={<SmallSuspense />}>
            <Suspense fallback={<SmallSuspense />}>
              <div className="disableVideo">
                <Avatar />
              </div>
            </Suspense>
          </Suspense>
        )}
        {props.startMeetingComponent.state.permissionError && (
          <div className="float">
            <Suspense fallback={<SmallSuspense />}>
              <PermissionError
                error={props.startMeetingComponent.props.t("permission")}
                refreshText={props.startMeetingComponent.props.t("refresh")}
              />
            </Suspense>
          </div>
        )}
        <div className="videoActionButtons">
          {props.startMeetingComponent.state.micEnabled ? (
            <div
              className="toggle-btn"
              onClick={props.startMeetingComponent.switchMicEnableDisable}
            >
              <Suspense fallback={<SmallSuspense />}>
                <MicIcon />
              </Suspense>
            </div>
          ) : (
            <div
              className="toggle-btn"
              onClick={props.startMeetingComponent.switchMicEnableDisable}
            >
              <Suspense fallback={<SmallSuspense />}>
                <MicOffIcon />
              </Suspense>
            </div>
          )}
          {props.startMeetingComponent.state.videoEnabled ? (
            <div
              className="toggle-btn"
              onClick={props.startMeetingComponent.switchVideoEnableDisable}
            >
              <Suspense fallback={<SmallSuspense />}>
                <VideocamIcon />
              </Suspense>
            </div>
          ) : (
            <div
              className="toggle-btn"
              onClick={props.startMeetingComponent.switchVideoEnableDisable}
            >
              <Suspense fallback={<SmallSuspense />}>
                <VideocamOffIcon />
              </Suspense>
            </div>
          )}
        </div>
      </div>
      <div className="joinMeetingMobile">
        <form
          className="joinmeeting_form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!props.startMeetingComponent.state.name) {
              props.startMeetingComponent.setState({ inputError: true });
            } else {
              props.startMeetingComponent.startMeetingTapped();
            }
          }}
        >
          <div className="namefield">
            <input
              type="text"
              placeholder={props.startMeetingComponent.props.t(
                "name-placeholder"
              )}
              onChange={(evt) => {
                props.startMeetingComponent.onUpdateName(evt);
              }}
              value={props.startMeetingComponent.state.name}
            />
            {props.startMeetingComponent.state.inputError && (
              <span
                style={{
                  color: "red",
                  marginLeft: 5,
                }}
              >
                Please Enter Name
              </span>
            )}
          </div>
          <button>{props.startMeetingComponent.props.t("join-meet")}</button>
        </form>
        {process.env.REACT_APP_IS_ADVANCE_OPTIONS_REQUIRED === "1" && (
          <div className="advancedSettingButton">
            <button onClick={props.startMeetingComponent.openAdvanceOptions}>
              <div className="advancedSettingContainer">
                <SettingsIcon />
                <div className="advancedSettingContent">
                  <h4>{props.startMeetingComponent.props.t("advance")}</h4>
                  <p>{props.startMeetingComponent.props.t("advance-notice")}</p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
      <div className="meeting-start__select">
        {!props.startMeetingComponent.state.permissionError &&
        props.startMeetingComponent.state.permissionApproved ? (
          <div className="dropdowns">
            <Suspense fallback={<SmallSuspense />}>
              <CameraSelection />
            </Suspense>

            <Suspense fallback={<SmallSuspense />}>
              <MicSelection />
            </Suspense>
          </div>
        ) : null}
      </div>
      {props.startMeetingComponent.state.advanceOptionOpen ? (
        <Suspense fallback={<SmallSuspense />}>
          <AdvanceSetting startMeetingComponent={props.startMeetingComponent} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default StartMeetingMobile;
