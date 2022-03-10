import { Participant } from "vani-meeting-client/lib/model/Participant";
import { Track } from "vani-meeting-client/lib/model/Track";
import Utility from "../utility/Utility";

export enum VideoHodlerModelType {

    Main = "main",
    Screenshare = "screenshare",
    Whiteboard = "whiteboard",
}

export class VideoHolderModel {

    public participant: Participant
    public tracks?: Track[];
    public containsAudio : boolean = false
    public videoHolderModelType: VideoHodlerModelType
    public isPinned : boolean = false
    public isSelf : boolean = false
    public whiteboardUrl? : string;

    constructor(participant: Participant ,videoHolderModelType : VideoHodlerModelType , isSelf = false) {
        this.participant = participant;
        this.videoHolderModelType = videoHolderModelType
        if(this.videoHolderModelType === VideoHodlerModelType.Screenshare){
            this.isPinned = true;
        }
        if(this.videoHolderModelType === VideoHodlerModelType.Whiteboard){
            this.whiteboardUrl =  Utility.getWhiteboardUrl(participant)
        }
        this.isSelf = isSelf;
    }

}