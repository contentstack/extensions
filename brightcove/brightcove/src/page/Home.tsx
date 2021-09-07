import React, { useState, useRef, useEffect } from 'react';
import reactDragula from 'react-dragula';
import { Drake } from 'dragula';

import Brightcove from '../helper/brightcove';
import { ConfigObj } from '../model/config.model';
import { VideoList } from '../model/videoList.model';
import WindowOpener from '../components/WindowOpener';
import { ExtensionObj } from '../model/extension.model';
import { PopupObject } from '../model/receiverObj.model';
import imageNotFound from '../images/not-found-icon.jpg';

interface ErrorMessage {
  message: string;
}
interface ResponseObj {
  header: object;
  data: VideoList[];
}

declare global {
  interface Window {
    ContentstackUIExtension: any;
  }
}

const Home: React.FC = () => {
  const draggableContainer = useRef<HTMLUListElement>(null);

  const [config, setConfig] = useState<ConfigObj | null>();
  const [message, setMessage] = useState('');
  const [videoList, setVideoList] = useState<VideoList[] | []>([]);
  const [drake, setDrake] = useState<Drake | null>(null);
  const [extension, setExtension] = useState<ExtensionObj>();

  const splitItemsArray = (items: string[]) => {
    const temporary = [];
    for (let i = 0; i < items.length; i += 10) {
      const ids = items.slice(i, i + 10);
      temporary.push(ids.toString());
    }
    return temporary;
  };

  useEffect(() => {
    const ContentstackUIExtension = window.ContentstackUIExtension;
    ContentstackUIExtension.init().then((extensions: ExtensionObj) => {
      const { items } = extensions.field.getData();
      setExtension(extensions);
      setConfig(extensions.config);
      extensions.window.enableAutoResizing();
      if (items && typeof items[0] !== 'object') {
        const idArray =
          items.length > 10 ? splitItemsArray(items) : [items.toString()];
        const {
          config: { proxyUrl, oauthUrl, brightcoveUrl },
        } = extensions;
        const brightcove = new Brightcove(proxyUrl);
        let videos: VideoList[] = [];
        idArray.forEach((ids) => {
          brightcove
            .getVideos({
              authUrl: oauthUrl,
              videoUrl: `${brightcoveUrl}/${ids}`,
            })
            .then(({ data }: ResponseObj) => {
              videos = videos.concat(data);
              items.length === videos.length && setVideoList(videos);
            })
            .catch((err) => console.error(err));
        });
      } else {
        setVideoList(items);
      }
    });
  }, []);

  useEffect(() => {
    if (draggableContainer.current) {
      setDrake(
        reactDragula([draggableContainer.current], {
          moves: (_el, _container, handle) => {
            if (!handle) {
              return false;
            }
            return Boolean(handle.closest('.draggable'));
          },
        })
      );
    }
  }, [draggableContainer.current]);

  useEffect(() => {
    const receiveMessage = (event: PopupObject) => {
      const { getConfig, selectedVideosList } = event.data;
      if (getConfig) {
        event.source.postMessage(
          {
            message: 'Sending Config files',
            config,
            selectedVideos: videoList,
          },
          event.origin
        );
      } else if (selectedVideosList) {
        saveExtensionData(selectedVideosList);
      }
    };
    console.info('message :' + message);
    window.addEventListener('message', receiveMessage, false);
  });

  const deleteVideo = (event: React.MouseEvent<HTMLElement>) => {
    const videoId = event.currentTarget.getAttribute('data-id');

    if (videoList) {
      videoList.splice(
        videoList.findIndex((index) => index.id === videoId),
        1
      );

      saveExtensionData([...videoList]);
    } else {
      saveExtensionData([]);
    }
  };

  const saveExtensionData = (videos: VideoList[]) => {
    let extensionData: VideoList[] | string[] = [];
    if (config && !config.saveFullResponse) {
      extensionData = videos.map((selected) => selected.id.toString());
    } else {
      extensionData = videos;
    }
    if (extension) {
      extension.field.setData({ items: extensionData });
      setVideoList(videos);
    } else {
      console.error('extension is not define');
    }
  };

  const sonResponse = (error: object, res: ErrorMessage) => {
    if (error) {
      setMessage(res.message);
    }
  };

  return (
    <header className='App-header'>
      <div className='wrapper'>
        <div className='container'>
          <div className='reference-loading' style={{ display: 'none' }}>
            <div className='loading-flash'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='main'>
            <div className='selected-item'>
              <div className='row selected-list'>
                <ul className='drag1' ref={draggableContainer}>
                  {videoList &&
                    videoList.map((video) => {
                      const {
                        name,
                        id,
                        description,
                        images: { thumbnail, poster },
                      } = video;
                      return (
                        <li id={id} title={name} key={id}>
                          <div className='file'>
                            {thumbnail ? (
                              <a
                                href={
                                  poster.source
                                    ? poster.source[0].src
                                    : poster.src
                                    ? poster.src
                                    : imageNotFound
                                }
                                target='_blank'
                                className='fileimage'
                                rel='noreferrer'
                              >
                                <span
                                  className='fileimg'
                                  style={{
                                    backgroundImage: `url(${
                                      thumbnail.source
                                        ? thumbnail.source[0].src
                                        : thumbnail.src
                                        ? thumbnail.src
                                        : imageNotFound
                                    })`,
                                  }}
                                ></span>
                              </a>
                            ) : (
                              <a
                                href={imageNotFound}
                                target='_blank'
                                className='fileimage'
                                rel='noreferrer'
                              >
                                <span
                                  className='fileimg'
                                  style={{
                                    backgroundImage: `url(${imageNotFound})`,
                                  }}
                                ></span>
                              </a>
                            )}
                            <span className='file-text'>Title-{name}</span>
                            <span className='file-text'>
                              Description-{description}
                            </span>
                            <div
                              className='file-action trash'
                              onClick={deleteVideo}
                              data-id={id}
                            >
                              <span className='close-icon'></span>
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
        {config && (
          <WindowOpener
            url={config.redirectUrl}
            bridge={sonResponse}
            videos={videoList}
          >
            Choose Videos
          </WindowOpener>
        )}
      </div>
    </header>
  );
};
export default Home;
