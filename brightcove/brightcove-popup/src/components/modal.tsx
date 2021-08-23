/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Brightcove from "../helper/brightcove";
import { ConfigObj } from "../model/config.model";

import { ModelProps } from "../model/modal.model";
import { VideoList } from "../model/videoList.model";


const Modal: React.FC<ModelProps> = props => {

  const limit = 8;
  const [isGrid, setIsGrid] = useState(true);
  const [config, setConfig] = useState(props.config);
  const [searchQuery, setSearchQuery] = useState("");
  const [renderVideos, setRenderVideos] = useState<VideoList[]>();
  const [errorFound, setErrorFound] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [offset, setOffset] = useState(0);
  const [initialReqVideo, setInitialReqVideo] = useState<VideoList[]>();
  const [selectedVideoList, setSelectedVideoList] = useState<VideoList[]>(props.selectedVideos);


useEffect(()=>{
  let configData:ConfigObj;
  if (props.config !== config) {
    configData = props.config;
  }else{
    configData = config;
  }
const brightcove = new Brightcove(configData.proxyUrl);
const data = {
  "authUrl": configData.oauthUrl,
  "videoUrl": `${configData.brightcoveUrl}?limit=${limit}&offset=${offset}`
}

brightcove.getVidoes(data).then(res=>{

}).catch(err=>console.error(err)
)
},[])

  useEffect(()=>{
    if (selectedVideoList !== props.selectedVideos) {
    setSelectedVideoList(props.selectedVideos);
    }
    if (props.config) {
      setConfig(props.config);
    }
  },[props.selectedVideos])

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
              //   onKeyPress={this.searchQueryHandler}
              />
            </span>
            <span className="search-icon"
            //    onClick={this.fetchQueryVideos}
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
                //   src={refreshIcon}
                alt="refresh-icon"
              //   onClick={this.refreshHandler}
              />
              <img
                //   src={this.state.isGrid ? gridIcon : listIcon}
                //   onClick={this.changeLayout}
                alt="view-option"
              />
            </div>
          </div>
          <div className="video-section">
            {/* {this.state.isSelected ? ( */}
            <span className="select-count"
            // onClick={this.showAllVideos}
            >
              {/* Show all videos({initialReqVideo?.pageInfo.totalResults}) */}
            </span>
            {/* //   ) : ( */}
            <span
              className="select-count"
            //   onClick={this.showSelectedVideos}
            >
              {/* Show selected videos({selectedVideoList.length}) */}
            </span>
            {/* //   )} */}
            <span className="video-count">
              {/* showing {renderVideos.length} of{" "} */}
              {/* {initialReqVideo?.pageInfo.totalResults} videos */}
            </span>
          </div>
          {/* {this.state.isGrid ? (
          <GridLayout
            videos={renderVideos}
            isSelected={isSelected}
            checkFiles = {errorFound}
            loadContent={this.loadMore}
            handleSelect={this.selectingVideos}
            selectedVideoList={selectedVideoList}
            totalVideos={initialReqVideo && initialReqVideo.pageInfo.totalResults}
          />
        ) : (
          <ListLayout
            videos={renderVideos}
            isSelected={isSelected}
            checkFiles = {errorFound}
            loadContent={this.loadMore}
            handleSelect={this.selectingVideos}
            selectedVideoList={selectedVideoList}
            totalVideos={initialReqVideo && initialReqVideo.pageInfo.totalResults}
          />
        )} */}
        </div>

        <div className="modal-footer">
          <div className="right">
            <button
              className="cancel-btn btn"
            // onClick={() => this.sendAndClose(false)}
            >
              Cancel
            </button>
            <button
              className="add-btn btn"
            // onClick={() => this.sendAndClose(true)}
            >
              Add Selected Videos
              {/* {selectedVideoList.length} */}
            </button>
          </div>
        </div>
      </section>
    </div>)
}

export default Modal;