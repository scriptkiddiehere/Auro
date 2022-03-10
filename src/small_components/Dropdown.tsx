import { Component } from "react";

interface DropdownProps {
  title: any;
  values: any;
  onChange: Function;
  selectedValue: any;
}
interface DropdownState {
  openDropDown: boolean;
}
export default class Dropdown extends Component<DropdownProps, DropdownState> {
  constructor(props: any) {
    super(props);
    this.state = {
      openDropDown: false,
    };
  }
  toggleOption = (deviceId: string) => {
    this.setState({ openDropDown: !this.state.openDropDown });
    this.props.onChange(deviceId);
  };
  renderValFromId = () => {
    const item = this.props.values.find(
      (val: any) => val.id === this.props.selectedValue
    );
    if(item){
      return item.label
    }
    if(this.props.values.length > 0) {
      return this.props.values[0].label
    }
    return ''
  };
  render() {
    return (
      <>
        <div
          className="dropdown-back"
          style={{
            zIndex: !this.state.openDropDown ? -1 : 300,
          }}
          onClick={() => {
            this.setState({ openDropDown: false });
          }}
        ></div>
        <div className="custom-dropdown">
          <div
            className="dropdown-selected"
            onClick={() => {
              this.setState({ openDropDown: !this.state.openDropDown });
            }}
          >
            <p>{this.renderValFromId()}</p>
          </div>

          <div
            className="options"
            style={{
              display: this.state.openDropDown ? "block" : "none",
            }}
          >
            {this.props.values.map((val: any, i: number) => {
              return (
                <div key={val.id} className="option" onClick={() => {
                  this.toggleOption(val.id)
                }}>
                  <p>{val.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
