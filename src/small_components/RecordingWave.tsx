import React from 'react';
import Lottie from "react-lottie";
import animationData from "../assets/utils/recording.json";

export default function RecordingWave() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        // rendererSettings: {
        //   preserveAspectRatio: "xMidYMid slice"
        // }
      };
    
    return (
      <div>
        <Lottie 
          options={defaultOptions}
          height={25}
          width={25}
        />
      </div>
    );
  }