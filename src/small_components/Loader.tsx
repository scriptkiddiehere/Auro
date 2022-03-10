import React, { Component } from "react";
import logo from "../assets/vani.png";

interface loaderProps {
  size: string;
  outlineColor: string;
  img: boolean;
}
export default class Loader extends Component<loaderProps> {
  renderLoaderClass = () => {
    switch (this.props.size) {
      case "small":
        return "loader-small";
      case "medium":
        return "loader-medium";
      default:
        return "loader";
    }
  };
  renderLoaderWrapClass = () => {
    switch (this.props.size) {
      case "small":
        return "loader-wrap-no-back";
      case "medium":
        return "loader-wrap-no-back";
      default:
        return "loader-wrap";
    }
  };
  render() {
    return (
      <div className={this.renderLoaderWrapClass()}>
        {this.props.img ? (
          <img
            className={this.renderLoaderClass() + " " + 'loader-img'}
            style={{}}
            alt="logo"
            src={logo}
          />
        ) : (
          <div
            className={this.renderLoaderClass()}
            style={{
              border: `2px solid ${this.props.outlineColor}`,
            }}
          ></div>
        )}
      </div>
    );
  }
}
