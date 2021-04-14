import React from "react";
import moment from "moment";
import "./modal.css";

export default class ListLayout extends React.PureComponent {
  render() {
    const { videos, selectedVideoList, handleSelect, loadContent } = this.props;

    return (
      <ul className="list-layout">
        <li className="table-head">
          <div className="table-cell w-5"></div>
          <div className="table-cell w-35">Name</div>
          <div className="table-cell w-30">Modified By</div>
          <div className="table-cell w-30">Last Modified</div>
        </li>
        <div className="table-body">
          <ul className="video-list">
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
                  <div className="table-cell w-35">{video.snippet.title}</div>
                  <div className="table-cell w-30">
                    {video.snippet.channelTitle}
                  </div>
                  <div className="table-cell w-30">
                    {moment(video.snippet.publishTime).format(
                      "ddd, MMM D YYYY"
                    )}
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
