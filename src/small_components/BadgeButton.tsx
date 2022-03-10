import { Badge } from "@mui/material";
import React, { Component } from "react";
interface BadgeButtonProps {
  badgeIcon: any;
  badgeCount: string | number;
}

export default class BadgeButton extends Component<BadgeButtonProps, {}> {
  constructor(props: BadgeButtonProps) {
    super(props);
  }
  render() {
    return (
      <Badge
        badgeContent={this.props.badgeCount}
        color="primary"
        className="badge-color"
      >
        {this.props.badgeIcon}
      </Badge>
    );
  }
}
