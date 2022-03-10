import React from "react";
import { BootstrapDialogTitle, BootstrapDialog } from "./Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import { StartMeetingViewProps } from "../components/start_meeting/StartMeetingComponent";

export default function AdvanceSetting(
  props: React.PropsWithChildren<StartMeetingViewProps>
) {
  return (
    <div>
      <BootstrapDialog
        onClose={props.startMeetingComponent}
        aria-labelledby="customized-dialog-title"
        open={props.startMeetingComponent.state.advanceOptionOpen}
      >
        <BootstrapDialogTitle
          onClose={props.startMeetingComponent.closeAdvanceOptions}
        >
          <p className="advanceheader">
            {props.startMeetingComponent.props.t("advance") +
              " " +
              props.startMeetingComponent.props.t("option")}
          </p>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="adminRoleContainer">
            <input
              type="checkbox"
              id="admin"
              checked={props.startMeetingComponent.state.isAdmin}
              onChange={props.startMeetingComponent.onAdminOptionSwitched}
            ></input>
            <label htmlFor="admin">
              {props.startMeetingComponent.props.t("admin-role")}
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={props.startMeetingComponent.closeAdvanceOptions}
            className="LanguageOutlined"
          >
            {props.startMeetingComponent.props.t("close")}
          </Button>
          <Button
            autoFocus
            onClick={props.startMeetingComponent.closeAdvanceOptions}
            variant="contained"
            className="yellowBack"
          >
            {props.startMeetingComponent.props.t("save-changes")}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
