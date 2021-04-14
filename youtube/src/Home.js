/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import "./styles/style.css";
import Dragula from "react-dragula";
import { WindowOpener } from "./window-opener";
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk";
export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.extension = {};
    this.state = {
      message: "",
      videoList: [],
      config: {},
    };
    this.sonResponse = this.sonResponse.bind(this);
  }

  componentDidMount() {
    ContentstackUIExtension.init().then((extension) => {
      const { items } = extension.field.getData();
      this.setState({
        config: extension.config,
        videoList: items[0],
      });
      this.extension = extension;
      extension.window.updateHeight(500);
      extension.window.enableResizing();
    });

    const receiveMessage = (event) => {
      const { data } = event;
      const { videoList } = this.state;
      if (data.getConfig) {
        const { config } = this.state;
        event.source.postMessage(
          {
            message: "Sending Config files",
            config,
            selectedVideos: videoList,
          },
          event.origin
        );
      } else if (data.selectedVideosList) {
        this.extension.field.setData({ items: [data.selectedVideosList] });
        this.setState({ videoList: data.selectedVideosList });
      }
    };
    window.addEventListener("message", receiveMessage, false);
  }

  sonResponse(err, res) {
    if (err) {
      this.setState({ message: res.message });
    }
  }
  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = {
        copySortSource: true,
      };
      Dragula([componentBackingInstance], options);
    }
  };

  render() {
    const { videoList } = this.state;
    return (
      <header className="App-header">
        <div className="wrapper">
          <div className="container">
            <div className="reference-loading" style={{ display: "none" }}>
              <div className="loading-flash">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="main">
              <div className="selected-item">
                <div className="row selected-list">
                  <ul className="drag1" ref={this.dragulaDecorator}>
                    {videoList?.map((video) => {
                      return (
                        <li id={video.id.videoId}>
                          <div className="file">
                            <a
                              href={video.snippet.thumbnails.default.url}
                              target="_blank"
                              className="fileimage"
                            >
                              <span className="fileimg">
                                <iframe
                                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                  className="fileimg"
                                  title={video.snippet.title}
                                  target="_blank"
                                ></iframe>
                              </span>
                            </a>
                            <span>{video.snippet.title}</span>
                            <span className="file-size">
                              Channel Name-{video.snippet.channelTitle}
                            </span>
                            <div className="file-action trash">
                              <span className="close-icon"></span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <WindowOpener
            url="http://localhost:3000/son"
            bridge={this.sonResponse}
            videos={videoList}
          >
            Choose Videos
          </WindowOpener>
        </div>
      </header>
    );
  }
}
