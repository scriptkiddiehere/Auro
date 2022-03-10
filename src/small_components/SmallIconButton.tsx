import '../styles/auro/Auroapp-desktop.css';

interface SmallIconButtonProps {
  onClick?: (event?: any) => void
  icon: any;
}

function SmallIconButton(props: SmallIconButtonProps) {
  return (
    <div className="smallIconButton"  onClick={props.onClick}>
      {props.icon}
    </div>
  );
}

export default SmallIconButton;
