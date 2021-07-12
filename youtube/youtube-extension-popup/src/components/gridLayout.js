/* eslint-disable react/prop-types */
import React from "react";
import Loader from "./loader";

export default class GridLayout extends React.PureComponent {
  render() {
    const {
      isSelected,
      videos,
      selectedVideoList,
      handleSelect,
      loadContent,
      totalVideos,
      checkFiles,
    } = this.props;
    const renderVideos = isSelected ? selectedVideoList : videos;
    return (
      <ul className="grid-layout">
        <div className="grid-body">
          {renderVideos.length > 0 ? (
            <>
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
                      className={checked ? "active" : ""}
                      onClick={(event) => {
                        const liElement = event.currentTarget;
                        !checked && video.id.videoId === liElement.id
                          ? liElement.classList.add("active")
                          : liElement.classList.remove("active");
                        handleSelect(video);
                        const checkbox =
                          liElement.childNodes[0].childNodes[0].childNodes[0];

                        checkbox.checked = !checkbox.checked;
                      }}
                    >
                      <div className="cs-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            className="cs"
                            defaultChecked={checked}
                            id={`checkbox-${video.id.videoId}`}
                            onChange={(event) => {
                              const style =
                                event.target.parentNode.parentNode.parentNode;
                              !checked && video.id.videoId === style.id
                                ? style.classList.add("active")
                                : style.classList.remove("active");
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
              <div
                className="load-more"
                onClick={loadContent}
                style={{
                  display:
                    isSelected || videos.length + 1 > totalVideos
                      ? "none"
                      : "block",
                }}
              >
                <a>Load More</a>
              </div>
            </>
          ) : checkFiles ? (
            <div className="file-not-found">File Not Found!</div>
          ) : (
            <Loader />
          )}
        </div>
      </ul>
    );
  }
}
