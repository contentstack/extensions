import React from "react";
import "./modal.css";

export default class GridLayout extends React.PureComponent {
  render() {
    const { videos, selectedVideoList, handleSelect, loadContent } = this.props;
    return (
      <ul className="grid-layout">
        <div className="grid-body">
          <ul>
            {videos?.map((video) => {
              return (
                <li
                  title={video.snippet.title}
                  id={video.id.videoId}
                  key={video.id.videoId}
                >
                  <div className="cs-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        className="cs"
                        defaultChecked={selectedVideoList.some(
                          (check) => check.id.videoId === video.id.videoId
                        )}
                        onChange={() => {
                          handleSelect(video);
                        }}
                      />
                      <span className="lbl"></span>
                    </label>
                  </div>
                  <div className="item">
                    <span
                      className="img"
                      style={{
                        backgroundImage: `url(${video.snippet.thumbnails.medium.url})`,
                      }}
                    ></span>
                    <span className="name">{video.snippet.title}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="load-more" onClick={loadContent}>
            <a>Load More</a>
          </div>
        </div>
      </ul>
    );
  }
}
