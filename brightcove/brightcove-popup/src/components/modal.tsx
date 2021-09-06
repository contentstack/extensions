import React, { useState, useEffect, ChangeEventHandler } from 'react';
import Brightcove from '../helper/brightcove';
import { ConfigObj } from '../model/config.model';

import gridIcon from '../images/grid.png';
import refreshIcon from '../images/refresh.png';
import listIcon from '../images/list.png';

import ListLayout from '../components/listLayout';
import GridLayout from '../components/gridLayout';
import { ModelProps } from '../model/modal.model';
import { VideoList } from '../model/videoList.model';

interface BrightCoveResponse {
  data: VideoList[];
}

const Modal: React.FC<ModelProps> = (props) => {
  const { config, selectedVideos } = props;
  const brightCove = new Brightcove(config.proxyUrl);

  const limit = 8;
  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [configData, setConfig] = useState(config);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [renderVideos, setRenderVideos] = useState<VideoList[]>([]);
  const [errorFound, setErrorFound] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [counts, setCount] = useState<number>(0);
  const [brightcove, setBrightcove] = useState<Brightcove>(brightCove);
  const [selectedVideoList, setSelectedVideoList] =
    useState<VideoList[]>(selectedVideos);

  useEffect(() => {
    let newconfigData: ConfigObj;
    if (config && config !== configData) {
      newconfigData = config;
    } else {
      newconfigData = configData;
    }
    const data = {
      authUrl: newconfigData.oauthUrl,
      videoUrl: newconfigData.videocountUrl,
    };
    brightcove
      .getVideos(data)
      .then(({ data }) => {
        setCount(data.count);
        offset >= data.count &&
          Array.from(
            document.getElementsByClassName(
              'load-more'
            ) as HTMLCollectionOf<HTMLElement>
          )[0].style.setProperty('display', 'none');

        setErrorFound(data.count === 0 ? true : false);
      })
      .catch((error) => {
        setErrorFound(true);
        console.error(error);
      });

    data.videoUrl = `${newconfigData.brightcoveUrl}?limit=${limit}&offset=${offset}`;
    brightcove
      .getVideos(data)
      .then((res: BrightCoveResponse) => {
        setRenderVideos(res.data);
        setOffset((preOffset) => preOffset + limit);
      })
      .catch((err: object) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedVideoList !== props.selectedVideos) {
      setSelectedVideoList(props.selectedVideos);
    }
    if (config) {
      setConfig(config);
    }
  }, [props.selectedVideos]);

  const loadMore = async (event: React.MouseEvent<HTMLElement>) => {
    try {
      if (counts !== offset && renderVideos) {
        const body = {
          authUrl: config.oauthUrl,
          videoUrl: `${config.brightcoveUrl}?limit=${limit}&offset=${offset}`,
        };

        if (searchQuery) {
          body.videoUrl = `${
            config.searchUrl + searchQuery
          }&limit=${limit}&offset=${offset}`;
        }
        const { data } = await brightcove?.getVideos(body);
        let newVideos = renderVideos;
        newVideos = newVideos?.concat(data);
        newVideos = newVideos?.filter(
          (video, index, videosCollection) =>
            index ===
            videosCollection.findIndex(
              (matchVideo) => matchVideo.id === video.id
            )
        );
        setRenderVideos(newVideos);
        setOffset((preOffset) => preOffset + limit);
        setErrorFound(data.length === 0 ? true : false);
        newVideos.length >= counts &&
          event.currentTarget.style.setProperty('display', 'none');
      } else {
        event.currentTarget.style.setProperty('display', 'none');
      }
    } catch (error) {
      setErrorFound(true);
    }
  };

  const sendAndClose = (closeandsend: boolean) => {
    closeandsend ? props.closeWindow(selectedVideoList) : props.closeWindow([]);
  };

  const changeLayout = () => {
    setIsGrid((prevGrid) => !prevGrid);
  };

  const showAllVideos = () => {
    setIsSelected((prevSelected) => !prevSelected);
  };

  const setQueryHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    setSearchQuery(query);
  };

  const searchQueryHandler = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const query = event.currentTarget.value;

    if (event.code === 'Enter' && brightcove) {
      const { oauthUrl, videocountUrl, searchUrl } = config;
      try {
        const {
          data: { count },
        } = await brightCove.getVideos({
          authUrl: oauthUrl,
          videoUrl: `${videocountUrl}?q=${query}&limit=${limit}&offset=0`,
        });
        const queryVideos = await brightcove.getVideos({
          authUrl: oauthUrl,
          videoUrl: `${searchUrl + query}&limit=${limit}&offset=0`,
        });
        setOffset(0);
        setCount(count);
        setRenderVideos(queryVideos.data);
        setErrorFound(queryVideos.data.length === 0 ? true : false);
      } catch (error) {
        setErrorFound(true);
      }
    }
  };

  const fetchQueryVideos = async () => {
    try {
      if (brightcove) {
        const { oauthUrl, searchUrl, videocountUrl } = config;
        const {
          data: { count },
        } = await brightCove.getVideos({
          authUrl: oauthUrl,
          videoUrl: `${videocountUrl}?q=${searchQuery}&limit=${limit}&offset=0`,
        });
        const queryVideos = await brightcove.getVideos({
          authUrl: oauthUrl,
          videoUrl: `${searchUrl + searchQuery}&limit=${limit}&offset=0`,
        });
        setOffset(0);
        setCount(count);
        setRenderVideos(queryVideos.data);
        setErrorFound(queryVideos.data.length === 0 ? true : false);
      }
    } catch (error) {
      setErrorFound(true);
    }
  };

  const refreshHandler = async () => {
    if (brightcove) {
      const { oauthUrl, videocountUrl, brightcoveUrl } = config;
      const {
        data: { count },
      } = await brightCove.getVideos({
        authUrl: oauthUrl,
        videoUrl: videocountUrl,
      });
      const videos = await brightcove.getVideos({
        authUrl: oauthUrl,
        videoUrl: `${brightcoveUrl}?limit=${limit}&offset=0`,
      });
      setCount(count);
      setRenderVideos(videos.data);
      setOffset(8);
    }
  };

  const selectingVideos = (selectedVideos: VideoList) => {
    const checkList = selectedVideoList.some(
      (video) => video.id === selectedVideos.id
    );
    if (checkList) {
      selectedVideoList.splice(
        selectedVideoList.findIndex((index) => index.id === selectedVideos.id),
        1
      );
      setSelectedVideoList([...selectedVideoList]);
    } else {
      const newlist = [...selectedVideoList];
      newlist.push(selectedVideos);
      setSelectedVideoList(newlist);
    }
  };

  return (
    <div className='modal display-block'>
      <section className='modal-main'>
        <div className='modal-header'>
          <h2>Select Video</h2>
        </div>
        <div className='search-bar'>
          <div className='cs-form-group search-box no-margin'>
            <span className='search-input'>
              <input
                type='search'
                id='search'
                className='cs-text-box cs-global-search'
                placeholder='Search Videos'
                onChange={setQueryHandler}
                onKeyPress={searchQueryHandler}
              />
            </span>
            <span className='search-icon' onClick={fetchQueryVideos}>
              <i className='icon-search'></i>
            </span>
          </div>
        </div>
        <div className='modal-body'>
          <div className='video-section'>
            <span>All Videos</span>
            <div className='icons'>
              <img
                src={refreshIcon}
                alt='refresh-icon'
                onClick={refreshHandler}
              />
              <img
                src={isGrid ? gridIcon : listIcon}
                onClick={changeLayout}
                alt='view-option'
              />
            </div>
          </div>
          <div className='video-section'>
            {isSelected ? (
              <span className='select-count' onClick={showAllVideos}>
                Show all videos({counts})
              </span>
            ) : (
              <span className='select-count' onClick={showAllVideos}>
                Show selected videos({selectedVideoList.length})
              </span>
            )}
            <span className='video-count'>
              showing {renderVideos?.length} of {counts} videos
            </span>
          </div>
          {isGrid ? (
            <GridLayout
              videos={renderVideos}
              isSelected={isSelected}
              checkFiles={errorFound}
              loadContent={loadMore}
              handleSelect={selectingVideos}
              selectedVideoList={selectedVideoList}
              totalVideos={counts}
            />
          ) : (
            <ListLayout
              videos={renderVideos}
              isSelected={isSelected}
              checkFiles={errorFound}
              loadContent={loadMore}
              handleSelect={selectingVideos}
              selectedVideoList={selectedVideoList}
              totalVideos={counts}
            />
          )}
        </div>

        <div className='modal-footer'>
          <div className='right'>
            <button
              className='cancel-btn btn'
              onClick={() => sendAndClose(false)}
            >
              Cancel
            </button>
            <button className='add-btn btn' onClick={() => sendAndClose(true)}>
              Add Selected Videos {selectedVideoList.length}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Modal;
