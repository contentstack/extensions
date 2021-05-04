/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import "./styles/style.css";
import Dragula from "react-dragula";
import { WindowOpener } from "./components/window-opener";
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
    this.deleteVideo = this.deleteVideo.bind(this);
  }

  componentDidMount() {
    ContentstackUIExtension.init().then((extension) => {
      const { items } = extension.field.getData();
      this.setState({
        config: extension.config,
        videoList: items,
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
        this.extension.field.setData({ items: data.selectedVideosList });
        this.setState({ videoList: data.selectedVideosList });
      }
    };
    window.addEventListener("message", receiveMessage, false);
  }

  deleteVideo(event) {
    const videoId = event.target.parentNode.parentNode.parentNode.id;
    const { videoList } = this.state;
     videoList.splice(
      videoList.findIndex((index) => index.id.videoId === videoId),
      1
    );
    this.extension.field.setData({ items: videoList });
    this.setState({
      videoList: videoList,
    });
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
    const { videoList, config } = this.state;
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
                        <li id={video.id.videoId} title={video.snippet.title} key={video.snippet.channelTitle}>
                          <div className="file">
                            <a
                              href={`https://www.youtube.com/embed/${video.id.videoId}`}
                              target="_blank"
                              className="fileimage"
                            >
                              <span
                                className="fileimg"
                                style={{
                                  backgroundImage: `url(${video.snippet.thumbnails.default.url})`,
                                }}
                              ></span>
                            </a>
                            <span>{video.snippet.title}</span>
                            <span className="file-text">
                              Channel Name-{video.snippet.channelTitle}
                            </span>
                            <span className="file-text">
                              Description-{video.snippet.description}
                            </span>
                            <div
                              className="file-action trash"
                              onClick={this.deleteVideo}
                            >
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
            url={config.redirect_url}
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
