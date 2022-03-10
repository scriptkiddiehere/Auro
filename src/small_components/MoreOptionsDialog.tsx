import Menu from "@mui/material/Menu";

interface myProps {
  anchorEl: any;
  handleClose: any;
  handleClick: any;
  children: any;
  parenetContainer : any;
}

function MoreOptionsDialog({
  anchorEl,
  handleClose,
  handleClick,
  children,
  parenetContainer
}: myProps) {
  const open = Boolean(anchorEl);

  return (
    <div>
      <Menu
        container={parenetContainer}
        id="basic-menu"
        disableEscapeKeyDown={false}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            transform: "translateY(-25%)",
          },
        }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {children}
      </Menu>
    </div>
  );
}

export default MoreOptionsDialog;

