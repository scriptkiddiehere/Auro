import React, { Component, createRef, Suspense } from "react";
import "../styles/auro/message.css";

import MessageBubble from "../small_components/MessageBubble";
import { ChatMessageType, MessagePayload } from "vani-meeting-client";
import WebrtcCallHandler, { LocalEvents } from "../utility/WebrtcCallHandler";
import SmallSuspense from "../small_components/SmallSuspense";
import { CircularProgress } from "@mui/material";
import { DrawerViewType } from "../components/during_call/DuringCallComponent";
import Close from "@mui/icons-material/Close";
const AttachFileIcon = React.lazy(
  () => import("@mui/icons-material/AttachFile")
);

interface MessageScreenProps {
  t: any;
  duringCallComponent: any;
  closeIcon:boolean;
}
interface MessageScreenState {
  messages: MessagePayload[];
  file: any;
  fileUploading: boolean;
}
export default class MessageScreen extends Component<
  MessageScreenProps,
  MessageScreenState
> {
  messageInputRef: any;
  bottomRef: any;
  constructor(props: MessageScreenProps) {
    super(props);
    this.messageInputRef = createRef();
    this.bottomRef = createRef();
    this.state = {
      messages: WebrtcCallHandler.getInstance().messages,
      file: null,
      fileUploading: false,
    };
    this.sendMessageTapped = this.sendMessageTapped.bind(this);
    this.onMessageListUpdated = this.onMessageListUpdated.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
  }

  scrollToEnd() {
    this.bottomRef.scrollIntoView({ behavior: "smooth" });
  }
  componentDidMount() {
    WebrtcCallHandler.getInstance().eventEmitter.on(
      LocalEvents.OnMessageListUpdated,
      this.onMessageListUpdated
    );
    this.bottomRef.scrollIntoView()
  }

  componentWillUnmount() {
    WebrtcCallHandler.getInstance().eventEmitter.off(
      LocalEvents.OnMessageListUpdated,
      this.onMessageListUpdated
    );
  }

  componentDidUpdate() {
    // this.scrollToEnd();
  }
  onMessageListUpdated(messages: MessagePayload[]) {
    this.setState({ messages: [...messages] }, () => {
      this.scrollToEnd();
    });
  }
  sendMessageTapped() {
    if (this.messageInputRef.value.length > 0) {
      const messagePayload = new MessagePayload(
        this.messageInputRef.value.trim()
      );
      WebrtcCallHandler.getInstance().sendMessage(messagePayload);
      this.messageInputRef.value = "";
    } else {
      return;
    }
  }
  handleFileUpload = async (file: any) => {
    console.log("handleFileUpload");
    if (this.state.fileUploading) return;
    else this.setState({ file: file[0].name, fileUploading: true });
    const awsUtils = new (await import("../utility/AWSUtils")).AWSUtils();
    const s3File = await awsUtils.uploadFileAttachment(file[0], file[0].name);
    if (s3File) {
      const messagePayload = new MessagePayload(s3File);
      messagePayload.type = ChatMessageType.File;
      this.setState({ file: null, fileUploading: false });
      WebrtcCallHandler.getInstance().sendMessage(messagePayload);
    }
  };
  render() {
    return (
      <div className="message-screen">
        <div className="msg-header">
          <p>{this.props.t("in-call")}</p>
         {this.props.closeIcon && <p
            onClick={() => {
              this.props.duringCallComponent.setCurrentDrawerViewType(
                DrawerViewType.None
              );
              this.props.duringCallComponent.toggleModal();
            }}
            className="msg-close"
          >
            <Close />
          </p>}
        </div>
        <div className="messages">
          {this.state.messages.map((message) => {
            return (
              <MessageBubble
                message={message}
                key={message.senderUserId! + message.time}
              />
            );
          })}
          {this.state.fileUploading && (
            <div className="fileload-wrap">
              <div className="fileload">
                <p className="filename">{this.state.file || "random.file"}</p>
                <CircularProgress color="inherit" size={20} />
              </div>
            </div>
          )}
          <div ref={(ref) => (this.bottomRef = ref)} />
        </div>

        {/* <form className="message-actions"> */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("inside");

            // alert(this.messageInputRef.value.length)
            this.sendMessageTapped();
          }}
          className="input-box"
        >
          <label className="input-file-lable">
            <Suspense fallback={<SmallSuspense />}>
              <AttachFileIcon />
            </Suspense>
            <input
              type="file"
              onChange={(e) => {
                this.handleFileUpload(e.target.files);
              }}
              style={{
                display: "none",
              }}
            />
          </label>
          <input
            type="text"
            ref={(ref) => (this.messageInputRef = ref)}
            placeholder={this.props.t("message-placeholder")}
          />
          <button onClick={this.sendMessageTapped}>
            {this.props.t("send")}
          </button>
        </form>
        {/* </form> */}
      </div>
    );
  }
}
