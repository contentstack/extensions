import React from 'react';
import Loader from './loader';
import imageNotFound from '../images/not-found-icon.jpg';
import { Layout } from '../model/layout.model';

const GridLayout: React.FC<Layout> = ({
  isSelected,
  selectedVideoList,
  videos,
  totalVideos,
  checkFiles,
  handleSelect,
  loadContent,
}) => {
  const renderVideos = isSelected ? selectedVideoList : videos;

  return (
    <ul className='grid-layout'>
      <div className='grid-body'>
        {renderVideos.length ? (
          <>
            <ul>
              {renderVideos.map((video) => {
                const checked = selectedVideoList.some(
                  (check) => check.id === video.id
                );
                const {
                  name,
                  id,
                  images: { thumbnail },
                } = video;
                return (
                  <li
                    title={name}
                    id={id}
                    key={id}
                    className={checked ? 'active' : ''}
                    onClick={(event) => {
                      const liElement = event.currentTarget;
                      !checked && id === liElement.id
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
                          id={`checkbox-${id}`}
                          onChange={(event) => {
                            const style = event.target?.parentNode?.parentNode
                              ?.parentNode as HTMLElement;
                            !checked && id === style.id
                              ? style.classList.add('active')
                              : style.classList.remove('active');
                            handleSelect(video);
                          }}
                        />
                        <span className='lbl'></span>
                      </label>
                    </div>
                    <div className='item'>
                      {thumbnail ? (
                        <span
                          className='img'
                          style={{
                            backgroundImage: `url(${
                              thumbnail.src
                                ? thumbnail.src
                                : thumbnail.source[0].src
                                ? thumbnail.source[0].src
                                : imageNotFound
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
                      <span className='name'>{name}</span>
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
