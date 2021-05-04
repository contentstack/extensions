/* eslint-disable react/prop-types */
import React from "react";

export default class GridLayout extends React.PureComponent {
  render() {
    const {
      isSelected,
      videos,
      selectedVideoList,
      handleSelect,
      loadContent,
    } = this.props;
    const renderVideos = isSelected ? selectedVideoList : videos;
    return (
      <ul className="grid-layout">
        <div className="grid-body">
          <ul>
            {renderVideos?.map((video) => {
              const checked = selectedVideoList.some(
                (check) => check.id.videoId === video.id.videoId
              );
              return (
                <li
                  title={video.snippet.title}
                  id={video.id.videoId}
                  key={video.id.videoId}
                  className={checked ? "selected-display-grid" : ""}
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
                            ? style.classList.add("selected-display-grid")
                            : style.classList.remove("selected-display-grid");
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
          <div className="load-more" onClick={loadContent} style={{display:isSelected?"none":"block"}}>
            <a>Load More</a>
          </div>
        </div>
      </ul>
    );
  }
}
