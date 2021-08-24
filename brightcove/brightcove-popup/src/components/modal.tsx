import React, { useState, useEffect } from "react";
import Brightcove from "../helper/brightcove";
import { ConfigObj } from "../model/config.model";

import gridIcon from "../images/grid.png";
import refreshIcon from"../images/refresh.png";
import listIcon from "../images/list.png";

import ListLayout from "../components/listLayout";
import GridLayout from "../components/gridLayout";
import { ModelProps } from "../model/modal.model";
import { VideoList } from "../model/videoList.model";

interface TotalVideos {
  count: number;
}

interface BrightCoveResponse {
  data: VideoList[];
}

const Modal: React.FC<ModelProps> = props => {

  let brightcove: Brightcove;
  const limit = 8;
  const [isGrid, setIsGrid] = useState(true);
  const [config, setConfig] = useState(props.config);
  const [searchQuery, setSearchQuery] = useState("");
  const [renderVideos, setRenderVideos] = useState<VideoList[]>();
  const [errorFound, setErrorFound] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedVideoList, setSelectedVideoList] = useState<VideoList[]>(props.selectedVideos);


  useEffect(() => {
    let configData: ConfigObj;
    if (props.config && props.config !== config) {
      configData = props.config;
    } else {
      configData = config;
    }
    brightcove = new Brightcove(configData.proxyUrl);

    const data = {
      "authUrl": configData.oauthUrl,
      "videoUrl": configData.videocountUrl
    }
    brightcove.getVideos(data)
      .then((videoCount: TotalVideos) => {
        offset + 1 === videoCount.count &&
          Array.from(document.getElementsByClassName('load-more') as HTMLCollectionOf<HTMLElement>)[0]
            .style.setProperty("display", "none");

        setErrorFound(videoCount.count === 0 ? true : false);
        setCount(videoCount.count)
      })
      .catch((error: object) => {
        setErrorFound(true);
        console.error(error)
      });

    data.videoUrl = `${configData.brightcoveUrl}?limit=${limit}&offset=${offset}`;

    brightcove.getVideos(data).then((res: BrightCoveResponse) => {
      setRenderVideos(res.data);
      setOffset(preOffset => preOffset + limit);
    }).catch((err: object) => console.error(err))

  }, []);

  useEffect(() => {
    if (selectedVideoList !== props.selectedVideos) {
      setSelectedVideoList(props.selectedVideos);
    }
    if (props.config) {
      setConfig(props.config);
    }
  }, [props.selectedVideos])

  const loadMore = async (event: React.MouseEvent<HTMLElement>) => {

    try {
      if (count !== offset) {
        const data = {
          "authUrl": config.oauthUrl,
          "videoUrl": `${config.brightcoveUrl}?limit=${limit}&offset=${offset}`
        }

        if (searchQuery) {
          data.videoUrl = `${config.searchUrl}&limit=${limit}&offset=${offset}`
        }

        const loadmoreData = await brightcove.getVideos(data);
        let newVideos = renderVideos;
        newVideos = newVideos?.concat(loadmoreData.data);
        loadmoreData.data.length + 1 >= count && (event.currentTarget.style.setProperty("display", "none"))
        setRenderVideos(newVideos);
        setOffset(preOffset => preOffset + limit);
        setErrorFound(loadmoreData.data.length === 0 ? true : false);
      } else {
        event.currentTarget.style.setProperty("display", "none");
      }
    } catch (error) {
      setErrorFound(true);
    }
  }

  const sendAndClose = (closeandsend: boolean) => {
    closeandsend ? props.closeWindow(selectedVideoList)
      : props.closeWindow([]);
  }

  const changeLayout = () => {
    setIsGrid(prevGrid => !prevGrid);
  }

  const showAllVideos = () => {
    setIsSelected(prevSelected => !prevSelected);
  }

  const searchQueryHandler = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value.toLowerCase();
    setSearchQuery(query);
    if (event.code === "Enter") {
      try {
        const queryVideos = await brightcove.getVideos({
          "authUrl": config.oauthUrl,
          "videoUrl": `${config.searchUrl}&limit=${limit}&offset=${offset}`
        })
        setOffset(0);
        setRenderVideos(queryVideos.data);
        setErrorFound(queryVideos.data.length === 0 ? true : false)
      } catch (error) {
        setErrorFound(true);
      }
    }
  }

  const fetchQueryVideos = async () => {
    try {
      const queryVideos = await brightcove.getVideos({
        "authUrl": config.oauthUrl,
        "videoUrl": `${config.searchUrl}&limit=${limit}&offset=${offset}`
      })
      setOffset(0);
      setRenderVideos(queryVideos.data);
      setErrorFound(queryVideos.data.length === 0 ? true : false)
    } catch (error) {
      setErrorFound(true);
    }

  }

  const refreshHandler = async () => {
    const refreshedData = await brightcove.getVideos({
      "authUrl": config.oauthUrl,
      "videoUrl": `${config.brightcoveUrl}&limit=${limit}&offset=${offset}`
    })
    setRenderVideos(refreshedData.data);
    setOffset(preOffSet => preOffSet + 8);
  }

  const selectingVideos = (selectedVideos: VideoList) => {
    const checkList = selectedVideoList.some(
      (video) => video.id === selectedVideos.id
    );
    if (checkList) {
      selectedVideoList.splice(
        selectedVideoList.findIndex(
          (index) => index.id === selectedVideos.id
        ),
        1
      );
      setSelectedVideoList([...selectedVideoList])
    } else {
      const newlist = [...selectedVideoList];
      newlist.push(selectedVideos);
      setSelectedVideoList(newlist);
    }
  }

  return (
    <div className="modal display-block">
      <section className="modal-main">
        <div className="modal-header">
          <h2>Select Video</h2>
        </div>
        <div className="search-bar">
          <div className="cs-form-group search-box no-margin">
            <span className="search-input">
              <input
                type="search"
                id="search"
                className="cs-text-box cs-global-search"
                placeholder="Search Videos"
                onKeyPress={searchQueryHandler}
              />
            </span>
            <span className="search-icon"
              onClick={fetchQueryVideos}
            >
              <i className="icon-search"></i>
            </span>
          </div>
        </div>
        <div className="modal-body">
          <div className="video-section">
            <span>All Videos</span>
            <div className="icons">
              <img
                src={refreshIcon}
                alt="refresh-icon"
                onClick={refreshHandler}
              />
              <img
                src={isGrid ? gridIcon : listIcon}
                onClick={changeLayout}
                alt="view-option"
              />
            </div>
          </div>
          <div className="video-section">
            {isSelected ? (
              <span className="select-count"
                onClick={showAllVideos}
              >
                Show all videos({count})
              </span>
            ) : (
              <span
                className="select-count"
                onClick={showAllVideos}
              >
                Show selected videos({selectedVideoList.length})
              </span>
            )}
            <span className="video-count">
              showing {renderVideos?.length} of{" "}
              {count} videos
            </span>
          </div>
          {isGrid ? (
            renderVideos &&
            <GridLayout
              videos={renderVideos}
              isSelected={isSelected}
              checkFiles={errorFound}
              loadContent={loadMore}
              handleSelect={selectingVideos}
              selectedVideoList={selectedVideoList}
              totalVideos={count}
            />
          ) : (
            renderVideos &&
            <ListLayout
              videos={renderVideos}
              isSelected={isSelected}
              checkFiles={errorFound}
              loadContent={loadMore}
              handleSelect={selectingVideos}
              selectedVideoList={selectedVideoList}
              totalVideos={count}
            />
          )}
        </div>

        <div className="modal-footer">
          <div className="right">
            <button
              className="cancel-btn btn"
              onClick={() => sendAndClose(false)}
            >
              Cancel
            </button>
            <button
              className="add-btn btn"
              onClick={() => sendAndClose(true)}
            >
              Add Selected Videos
              {selectedVideoList.length}
            </button>
          </div>
        </div>
      </section>
    </div>)
}

export default Modal;