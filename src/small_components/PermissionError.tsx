import { Button } from "@mui/material";
import React from "react";

const PermissionError = (props: any) => {
  return (
    <div className="permissionError">
      <p>{props.error}</p>
      <Button variant="outlined">{props.refreshText}</Button>
    </div>
  );
};

export default PermissionError;
