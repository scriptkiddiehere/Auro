import React, { Suspense, useEffect } from "react";
import "./i18n.ts";
import "./styles/base/base.css";
import { BrowserRouter, Route } from "react-router-dom";
import SuspenseFallBack from "./small_components/SuspenseFallBack";
import { Toaster } from "react-hot-toast";
const StartMeetingComponent = React.lazy(
  () => import("./components/start_meeting/StartMeetingComponent")
);
const DuringCallComponent = React.lazy(
  () => import("./components/during_call/DuringCallComponent")
);
const RTMPRecordingComponent = React.lazy(
  () => import("./components/rtmp_recording/RTMPRecordingComponent")
);

function App() {
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<SuspenseFallBack />}>
          <Route path="/" exact component={StartMeetingComponent} />
        </Suspense>
        <Suspense fallback={<SuspenseFallBack />}>
          <Route path="/meeting" exact component={DuringCallComponent} />
        </Suspense>
        <Suspense fallback={<SuspenseFallBack />}>
          <Route path="/rtmp" exact component={RTMPRecordingComponent} />
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
