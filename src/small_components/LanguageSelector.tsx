import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import React, { Component, KeyboardEventHandler, Suspense } from "react";
import i18next from "i18next";
import SmallSuspense from "./SmallSuspense";

const Popper = React.lazy(() => import("@mui/material/Popper"));

interface LanguageSelectorProps {}
interface LanguageSelectorState {
  shouldOpen: boolean;
}

export default class LanguageSelector extends Component<
  LanguageSelectorProps,
  LanguageSelectorState
> {
  anchorRef: React.RefObject<HTMLButtonElement>;
  constructor(props: LanguageSelectorProps) {
    super(props);
    this.state = {
      shouldOpen: false,
    };
    this.anchorRef = React.createRef();
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleOpenCloseToggle = this.handleOpenCloseToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleLanguageChange(language: string) {
    i18next.changeLanguage(language);
    this.handleClose();
  }
  handleOpenCloseToggle() {
    this.setState({ shouldOpen: !this.state.shouldOpen });
  }
  handleClose() {
    this.setState({ shouldOpen: false });
  }

  handleListKeyDown(event: KeyboardEventHandler) {
    // if (event.key === "Tab") {
    //   event.preventDefault();
    //   this.setState({shouldOpen : false});
    // }
  }
  render() {
    return (
      <>
        <Button
          className="langPopperBtn"
          ref={this.anchorRef}
          aria-controls={this.state.shouldOpen ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleOpenCloseToggle}
        >
          <LanguageOutlined className="LanguageOutlined" />{" "}
          <span className="language-span">{i18next.language}</span>
        </Button>
        <Suspense fallback={<SmallSuspense />}>
          <Popper
            className="langPopper"
            open={this.state.shouldOpen}
            anchorEl={this.anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList
                      autoFocusItem={this.state.shouldOpen}
                      id="menu-list-grow"
                      // onKeyDown={this.handleListKeyDown}
                    >
                      <MenuItem onClick={() => this.handleLanguageChange("en")}>
                        English
                      </MenuItem>
                      <MenuItem
                        onClick={() => this.handleLanguageChange("हिंदी")}
                      >
                        हिंदी
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Suspense>
      </>
    );
  }
}
