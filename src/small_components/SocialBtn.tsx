import React from "react";

const SocialBtn = (props: any) => {
  return (
    <div className="social-btn" onClick={props.onClick}>
      {props.img}
      <p>{props.name}</p>
    </div>
  );
};

export default SocialBtn;
