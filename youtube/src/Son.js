import React from "react";
import Modal from "./components/modal";
export class Son extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      config: undefined,
      selectedVideosList: [],
    };
    this.onCloseWindow = this.onCloseWindow.bind(this);
  }
  componentDidMount() {
    // this route should only be avaleable from a popup
    if (!window.opener) {
      window.close();
    }
    window.opener.postMessage(
      { message: "get youtube config and selected videos", getConfig: true },
      "*"
    );
    const receiveMessage = ({ data }) => {
      if (data.config) {
        this.setState({
          message: data.message,
          config: data.config,
        });
      }
      if (data.selectedVideos) {
        this.setState({
          message: data.message,
          selectedVideosList: data.selectedVideos,
        });
      }
    };
    window.addEventListener("message", receiveMessage, false);
  }
  onCloseWindow = (selectedVideos) => {
    console.log("close window");
    selectedVideos.length > 0
      ? window.opener.postMessage(
          {
            message: "sending selected videos",
            selectedVideosList: selectedVideos,
          },
          "*"
        )
      : window.opener.postMessage(
          {
            message: "Window closed sending selected videos",
          },
          "*"
        );
        window.close();
  };

  render() {
    const { config, selectedVideosList } = this.state;
    return (
      <div>
        {config && (
          <Modal
            config={config}
            closeWindow={this.onCloseWindow}
            selectedVideos={selectedVideosList}
          />
        )}
      </div>
    );
  }
}
