import { Participant } from "vani-meeting-client/lib/model/Participant";

const queryString = require("query-string");
const isURL = require("is-url");

class Utility {
  static getRoomIdForMeeting(): string {
    const queryParmas = queryString.parse(window.location.search);

    if (queryParmas.vm && queryParmas.vm !== null) {
      return queryParmas.vm.toLowerCase();
    }
    return Math.random().toString(36).slice(2).toLowerCase();
  }

  static geUserIdForMeeting(): string {
    return new Date().getTime() + "";
  }

  static getAppId(): string {
    if (process.env.REACT_APP_ID) {
      return process.env.REACT_APP_ID;
    }
    return "vani";
  }
  static getLinkOrText(text: any,type:string): any {
    console.log('text',text,type);
    if(type === "file"){
      const fileSplit = text.split('/')
      const fileName = fileSplit[fileSplit.length - 1]
      console.log(fileSplit[fileSplit.length - 1]);
      return (
        '<a href="' +
        text +
        '" target="_blank" rel="noopener noreferrer">' +
        fileName +
        "</a>"
      );
    }
    else if (isURL(text)) {
      return (
        '<a href="' +
        text +
        '" target="_blank" rel="noopener noreferrer">' +
        text +
        "</a>"
      );
    } else {
      return `<span>${text}</span>`;
    }
  }
  static getNumberOfParticipant(): number {
    if (
      process.env.REACT_IS_SFU_REQUIRED &&
      process.env.REACT_IS_SFU_REQUIRED + "" === "1"
    ) {
      return 12;
    } else {
      return 2;
    }
  }


  static getWhiteboardUrl(participant : Participant){
    return process.env.REACT_APP_WHITEBOARD_URL?.replace("%roomId%" , participant.roomId).replace("%canEdit%","1");
  }
}

export default Utility;
