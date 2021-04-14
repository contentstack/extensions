import React from "react";
import "./modal.css";
import gridIcon from "../images/grid.png";
import refreshIcon from "../images/refresh.png";
import listIcon from "../images/list.png";
import GridLayout from "./gridLayout";
import ListLayout from "./listLayout";
import Youtube from "../helper/youtube";

export default class Modal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isGrid: false,
      searchQuery: "",
      renderVideos: [],
      selectedVideoList: [],
      nextPageToken: undefined,
      initialReqVideo: undefined,
    };
    this.loadMore = this.loadMore.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.refreshHandler = this.refreshHandler.bind(this);
    this.selectingVideos = this.selectingVideos.bind(this);
    this.fetchQueryVideos = this.fetchQueryVideos.bind(this);
    this.searchQueryHandler = this.searchQueryHandler.bind(this);
  }

  selectingVideos = (selectedVideos) => {
    const { selectedVideoList } = this.state;
    const checkList = selectedVideoList.some(
      (video) => video.id.videoId === selectedVideos.id.videoId
    );
    if (checkList) {
      const newList = selectedVideoList.splice(
        selectedVideoList.findIndex(
          (index) => index.id.videoId === selectedVideos.id.videoId
        ),
        1
      );
      this.setState({
        selectedVideoList: newList,
      });
    } else {
      const newlist = [...selectedVideoList];
      newlist.push(selectedVideos);
      this.setState({ selectedVideoList: newlist });
    }
  };

  componentDidMount() {
    const { config } = this.props;
    Youtube.initalizingVideoList(config)
      .then((videoList) => {
        this.setState({
          initialReqVideo: videoList.data,
          renderVideos: videoList.data.items,
          nextPageToken: videoList.data.nextPageToken,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedVideos } = this.props;
    console.log("checking videos", selectedVideos);
    if (prevProps.selectedVideos !== prevState.selectedVideoList) {
      console.log("setting videos", selectedVideos);
      this.setState({
        selectedVideoList: selectedVideos,
      });
    }
  }

  refreshHandler = () => {
    const { config } = this.props;
    Youtube.initalizingVideoList(config)
      .then((videoList) => {
        console.log(videoList);
        this.setState({
          initialReqVideo: videoList.data,
          renderVideos: videoList.data.items,
          nextPageToken: videoList.data.nextPageToken,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadMore = (event) => {
    console.log(event);
    const { config } = this.props;
    const {
      searchQuery,
      nextPageToken,
      renderVideos,
      initialReqVideo,
    } = this.state;
    if (renderVideos.length !== initialReqVideo.pageInfo.totalResults) {
      Youtube.initalizingVideoList(config, searchQuery, nextPageToken)
        .then((videoList) => {
          let newVideos = this.state.renderVideos;
          newVideos = videoList.data.items.concat(newVideos);

          this.setState({
            renderVideos: newVideos,
            nextPageToken: videoList.data.nextPageToken,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      event.target.style.display = "none";
    }
  };

  sendAndClose = (closeandsend) => {
    const { selectedVideoList } = this.state;
    closeandsend
      ? this.props.closeWindow(selectedVideoList)
      : this.props.closeWindow([]);
  };

  handleClick() {
    this.setState((prevState) => ({
      isGrid: !prevState.isGrid,
    }));
  }

  changeLayout = (e) => {
    this.setState((prevState) => ({
      isGrid: !prevState.isGrid,
    }));
  };

  searchQueryHandler = (event) => {
    const { config } = this.props;
    const query = event.target.value.toLowerCase();
    this.setState({ searchQuery: query });
    if (event.charCode === 13) {
      Youtube.initializeSearchField(config, query).then((queryVideos) => {
        this.setState({
          initialReqVideo: queryVideos.data,
          renderVideos: queryVideos.data.items,
          nextPageToken: queryVideos.data.nextPageToken,
        });
      });
    }
  };

  fetchQueryVideos = () => {
    const { config } = this.props;
    const { searchQuery } = this.state;
    Youtube.initializeSearchField(config, searchQuery).then((queryVideos) => {
      this.setState({
        initialReqVideo: queryVideos.data,
        renderVideos: queryVideos.data.items,
        nextPageToken: queryVideos.data.nextPageToken,
      });
    });
  };

  render() {
    const { renderVideos, selectedVideoList, initialReqVideo } = this.state;
    console.log("render videos", selectedVideoList);
    return (
      <div className="modal display-block">
        <section className="modal-main">
          {this.props.children}
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
                  onKeyPress={this.searchQueryHandler}
                />
              </span>
              <span className="search-icon" onClick={this.fetchQueryVideos}>
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
                  onClick={this.refreshHandler}
                />
                <img
                  src={this.state.isGrid ? gridIcon : listIcon}
                  onClick={this.changeLayout}
                  alt="view-option"
                />
              </div>
            </div>
            <div className="video-section">
              <span className="select-count">
                Show selected videos({selectedVideoList.length})
              </span>
              <span className="video-count">
                showing {renderVideos.length} of{" "}
                {initialReqVideo?.pageInfo.totalResults} videos
              </span>
            </div>
            {this.state.isGrid ? (
              <GridLayout
                videos={renderVideos}
                loadContent={this.loadMore}
                handleSelect={this.selectingVideos}
                selectedVideoList={selectedVideoList}
              />
            ) : (
              <ListLayout
                videos={renderVideos}
                loadContent={this.loadMore}
                handleSelect={this.selectingVideos}
                selectedVideoList={selectedVideoList}
              />
            )}
          </div>

          <div className="modal-footer">
            <div className="right">
              <button
                className="cancel-btn btn"
                onClick={() => this.sendAndClose(false)}
              >
                Cancel
              </button>
              <button
                className="add-btn btn"
                onClick={() => this.sendAndClose(true)}
              >
                Add Selected Videos {selectedVideoList.length}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}