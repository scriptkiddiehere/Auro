
import axios from "axios";
const queryString = require("query-string");

class RTMPRecordingHandler {
    static instance = new RTMPRecordingHandler();
    type: string | undefined;
    filenameOrKeyName: string | undefined;
    static getInstance() {
        if (RTMPRecordingHandler.instance === null) {
            RTMPRecordingHandler.instance = new RTMPRecordingHandler();
        }
        return RTMPRecordingHandler.instance;
    }

    constructor() {

        this.type = undefined;
        this.filenameOrKeyName = undefined;
        this.cleanUp = this.cleanUp.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.startRTMPStream = this.startRTMPStream.bind(this);
        this.stopRTMPStream = this.stopRTMPStream.bind(this);
    }

    setup() {
        const queryParmas = queryString.parse(window.location.search);
        this.type = queryParmas.type;
        if (this.type === "recording") {
            this.filenameOrKeyName = queryParmas.filename
        }
        else {
            this.filenameOrKeyName = queryParmas.keyname
        }

    }
    cleanUp() {
        console.log("Vani CLeanup");
        if (this.type && this.filenameOrKeyName) {
            if (this.type === "recording") {
                this.stopRecording(this.filenameOrKeyName)
            }
            else {
                this.stopRTMPStream(this.filenameOrKeyName)
            }
        }
    }

    startRecording(url: string, fileName: string) {
        axios.defaults.timeout = 10000;
        url = url + "&type=recording&filename=" + fileName;
        console.log(url);

        const params = {
            url: url,
            s3Bucket: process.env.REACT_APP_RECORDING_BUCKET_NAME,
            fileName: fileName,
        };
        const apiUrl = process.env.REACT_APP_RECORDING_RTMP_BASE_URL + "api/startRecording";
        axios
            .post(apiUrl, params, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("response sachin ");
                console.log(response);

                if (
                    response &&
                    response.data &&
                    response.data.status &&
                    response.data.ipAddress
                ) {
                    console.log(response.data);
                    // this.startRecordingForServer(response.data.ipAddress,url)

                } else {

                    setTimeout(() => {
                        this.startRecording(url, fileName);
                    }, 1000);
                }
            })
            .catch((error) => {
                this.startRecording(url, fileName);
                console.log(error);
            });
    }

    stopRecording(fileName: string) {
        const apiUrl = process.env.REACT_APP_RECORDING_RTMP_BASE_URL + "api/stopRecording";
        const params = { fileName: fileName }
        axios.post(apiUrl, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log("response sachin")
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            });
    }

    startRTMPStream(urlToOpen: string, keyName: string, streamUrl: string): void {
        urlToOpen = urlToOpen + "&type=rtmp&keyname=" + keyName;
        const apiUrl = process.env.REACT_APP_RECORDING_RTMP_BASE_URL + "api/startRTMP";
        const body = { url: urlToOpen, keyName: keyName, streamUrl: streamUrl };

        axios.post(apiUrl, body).then((response) => {
            console.log(response);
            if (response && response.data && response.data) {
                const data: any = response.data;
                if (data && data.status === true && data.ipAddress && data.ipAddress !== null) {
                }
            }
        })
            .catch((error) => {
                console.log(error);
            });
    }
    stopRTMPStream(keyName: string): void {
        console.log("stopRTMPStream");

        const apiUrl = process.env.REACT_APP_RECORDING_RTMP_BASE_URL + "api/stopRTMP";
        const body = { keyName: keyName };

        axios.post(apiUrl, body).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });

    }
}

export default RTMPRecordingHandler;
