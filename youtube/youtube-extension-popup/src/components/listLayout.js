/* eslint-disable react/prop-types */
import React from "react";
import moment from "moment";

export default class ListLayout extends React.PureComponent {
  render() {
    const { isSelected, videos, selectedVideoList, handleSelect, loadContent } = this.props;
    const renderVideos = isSelected ? selectedVideoList : videos;
    
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
            {renderVideos?.map((video) => {
              const checked = selectedVideoList.some(
                (check) => check.id.videoId === video.id.videoId
              );
              return (
                <li
                  title={video.snippet.title}
                  id={video.id.videoId}
                  key={video.id.videoId}
                  className={checked ? "selected-display-list" : ""}
                >
                  <div className="cs-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        className="cs"
                        defaultChecked={checked}
                        onChange={(event) => {
                          const style =
                            event.target.parentNode.parentNode.parentNode;
                          !checked && video.id.videoId === style.id
                            ? style.classList.add("selected-display-list")
                            : style.classList.remove("selected-display-list");
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
          <div className="load-more" onClick={loadContent} style={{display:isSelected?"none":"block"}}>
            <a>Load More</a>
          </div>
        </div>
      </ul>
    );
  }
}
