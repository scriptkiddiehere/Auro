import { AttachFileOutlined, InsertDriveFile } from "@mui/icons-material";
import AttachFile from "@mui/icons-material/AttachFile";
import moment from "moment";
import React, { Suspense } from "react";
import { MessagePayload } from "vani-meeting-client";
import Utility from "../utility/Utility";
import WebrtcCallHandler from "../utility/WebrtcCallHandler";
import SmallSuspense from "./SmallSuspense";

const Avatar = React.lazy(() => import("@mui/material/Avatar"));
interface MessageBubbleProps {
  message: MessagePayload;
}
const MessageBubble = (props: MessageBubbleProps) => {
  console.log(props.message);

  return (
    <div
      className={
        props.message.senderUserId &&
        props.message.senderUserId ===
          WebrtcCallHandler.getInstance().getMeetingRequest()?.userId
          ? "message-box self-message-box"
          : "message-box"
      }
    >
      <Suspense fallback={<SmallSuspense />}>
        <Avatar
          style={{
            width: 30,
            height: 30,
          }}
        />
      </Suspense>
      <div
        className={
          props.message.senderUserId &&
          props.message.senderUserId ===
            WebrtcCallHandler.getInstance().getMeetingRequest()?.userId
            ? "message-detail self-msg"
            : "message-detail"
        }
      >
        <p className="msg-from">
          {props.message.sender
            ? props.message.sender.userData.name
            : "Unknown"}
        </p>
        <div className="msg-text">
          {props.message.type === "file" && <InsertDriveFile fontSize="small" />}
          <p
            dangerouslySetInnerHTML={{
              __html: Utility.getLinkOrText(
                props.message.message,
                props.message.type
              ),
            }}
          />
        </div>
        <p className="msg-time">
          {moment(props.message.time).format("h:mm A")}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
