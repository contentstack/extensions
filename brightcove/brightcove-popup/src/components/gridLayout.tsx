import React from 'react';
import Loader from './loader';
import imageNotFound from '../images/not-found-icon.jpg';
import { Layout } from '../model/layout.model';

const GridLayout: React.FC<Layout> = (props) => {
  const {
    isSelected,
    selectedVideoList,
    videos,
    totalVideos,
    checkFiles,
    handleSelect,
    loadContent,
  } = props;
  const renderVideos = isSelected ? selectedVideoList : videos;

  return (
    <ul className='grid-layout'>
      <div className='grid-body'>
        {renderVideos ? (
          <>
            <ul>
              {renderVideos?.map((video) => {
                const checked = selectedVideoList.some(
                  (check) => check.id === video.id
                );
                return (
                  <li
                    title={video.name}
                    id={video.id}
                    key={video.id}
                    className={checked ? 'active' : ''}
                    onClick={(event) => {
                      const liElement = event.currentTarget;
                      !checked && video.id === liElement.id
                        ? liElement.classList.add('active')
                        : liElement.classList.remove('active');
                      handleSelect(video);
                      const checkbox = liElement.childNodes[0].childNodes[0]
                        .childNodes[0] as HTMLInputElement;

                      checkbox.checked = !checkbox.checked;
                    }}
                  >
                    <div className='cs-checkbox'>
                      <label>
                        <input
                          type='checkbox'
                          className='cs'
                          defaultChecked={checked}
                          id={`checkbox-${video.id}`}
                          onChange={(event) => {
                            const style = event.target?.parentNode?.parentNode
                              ?.parentNode as HTMLElement;
                            !checked && video.id === style.id
                              ? style.classList.add('active')
                              : style.classList.remove('active');
                            handleSelect(video);
                          }}
                        />
                        <span className='lbl'></span>
                      </label>
                    </div>
                    <div className='item'>
                      {video.images.thumbnail ? (
                        <span
                          className='img'
                          style={{
                            backgroundImage: `url(${
                              video.images.thumbnail.src
                                ? video.images.thumbnail.src
                                : video.images.thumbnail.source[0].src
                            })`,
                          }}
                        ></span>
                      ) : (
                        <span
                          className='img'
                          style={{
                            backgroundImage: `url(${imageNotFound})`,
                          }}
                        ></span>
                      )}
                      <span className='name'>{video.name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div
              className='load-more'
              onClick={loadContent}
              style={{
                display:
                  isSelected || videos.length + 1 > totalVideos
                    ? 'none'
                    : 'block',
              }}
            >
              <span>Load More</span>
            </div>
          </>
        ) : checkFiles ? (
          <div className='file-not-found'>File Not Found!</div>
        ) : (
          <Loader />
        )}
      </div>
    </ul>
  );
};

export default GridLayout;
