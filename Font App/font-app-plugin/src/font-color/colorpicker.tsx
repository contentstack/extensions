import React, { Component } from "react";
import { ButtonGroup, Button } from "@contentstack/venus-components";
import { SketchPicker } from "react-color";

class ColorPicker extends Component<any> {
  state = {
    displayColorPicker: false,
    color: this.props.value,
    tempColor: this.props.value,
    default: false,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color: any) => {
    this.setState({
      tempColor: color.hex,
      default: false,
    });
  };

  handleChoose = () => {
    this.setState({
      color: this.state.tempColor,
      displayColorPicker: false,
    });
    if (this.props.onChange) {
      this.props.onChange(this.state.tempColor);
    }
  };
  selectDefault = () => {
    this.setState({
      default: true,
    });
  };
  presetColors = [
    "#222222",
  ];

  render() {
    return (
      <div className="ColorPicker__wrapper">
        <div onClick={this.handleClick} className="ColorPicker">
          <FontColorIcon />
        </div>
        {this.state.displayColorPicker ? (
          <div className="ColorPicker__modal">
            <div className="ColorPicker__popover">
              <div className="ColorPicker__heading ColorPicker__heading--custom">
                Select From Template
              </div>
              <div
                className="ColorPicker__layout"
                onClick={this.handleClose}
              ></div>
              <SketchPicker
                className="ColorPicker__sketch-picker"
                color={this.state.default ? "#222" : this.state.tempColor}
                disableAlpha={true}
                width="264px"
                presetColors={this.presetColors}
                onChange={this.handleChange}
              />
              <div className="ColorPicker__heading ColorPicker__heading--template">
                Select Custom
              </div>
              <div className="ColorPicker__hex-code">
                {this.state.default ? "#222" : this.state.tempColor}
              </div>
              <div className="ColorPicker__actions">
                <ButtonGroup style={{ marginRight: "0px!important" }}>
                  <Button buttonType="light" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button buttonType="secondary" onClick={this.handleChoose}>
                    Choose
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColorPicker;

const FontColorIcon = () => {
  return (
    <svg
      width="16"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.32031 12L5.31055 9.04102H9.82227L10.8184 12H13.1387L8.9082 0H6.22461L2 12H4.32031ZM5.89648 7.29492L7.51953 2.46094H7.61328L9.23633 7.29492H5.89648Z"
        fill="#647696"
      />
      <path d="M0 14H16V16H0V14Z" fill="#647696" />
    </svg>
  );
};