import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import postRobot from 'post-robot'
import ContentstackAppSDK from '@contentstack/app-sdk'
import {
  AssetCardVertical,
  openChooseAssetModal,
  openUploadAssetModal,
  SkeletonTile,
  Carousel,
  Button,
} from '@contentstack/venus-components'

import styles from './App.module.css'
import { getAssetType } from './utils'


const assetType = {
  null: 'image',
  Document: 'document',
  Group: 'folder',
  Pdf: 'pdf',
  Archive: 'zip',
  Video: 'video',
  Audio: 'audio',
}

const App = () => {
  const ref = useRef(null)
  const [state, setState] = useState({
    allSelectedImages: [],
    isMultiple: true,
    isLoading: true,
  })
  const [allImageComponent, setAllImageComponent] = useState([])
  const [contentstackSDK, setContenstackSDK] = useState(null)
  const [extension, setExtension] = useState(null)

  const handleAssetDelete = (index) => {
    let updateAllSelectedImage = state.allSelectedImages.slice()
    updateAllSelectedImage.splice(index, 1)
    setState({
      ...state,
      allSelectedImages: updateAllSelectedImage,
    })
    const newFieldData = state.isMultiple
      ? updateAllSelectedImage.map((ele) => ({
        uid: ele.file.uid,
        _content_type_uid: 'sys_assets',
      }))
      : (updateAllSelectedImage.length ? { uid: updateAllSelectedImage[0].file.uid, _content_type_uid: 'sys_assets' }: {})
    extension.field.setData(newFieldData)
  }

  useEffect(() => {
    window.iframeRef = ref.current
    window.postRobot = postRobot
    ContentstackAppSDK.init()
      .then((sdk) => {
        const extension = sdk.location.CustomField
        setContenstackSDK(sdk)
        setExtension(extension)
        extension.frame.enableAutoResizing()
        const currentAssets = extension.field.schema.value
        const isMultiple = extension.field.schema.multiple
        const assetPickerConfig = extension.field.schema.config || {}
        // Remove multiple in asset picker if custom field type is not multiple
        if (!isMultiple) delete assetPickerConfig['multiple']

        if (!currentAssets || _.isEmpty(currentAssets)) {
          setState({
            ...state,
            isMultiple,
            isLoading: false,
          })
        } else {
          setState({
            ...state,
            isLoading: false,
            allSelectedImages: Array.isArray(currentAssets) ? currentAssets.map((ele) => ({
              file: {
                url: ele?.asset?.url,
                title: ele?.asset?.title,
                fileSize: ele?.asset?.file_size,
                contentType: ele?.asset?.content_type,
                fileName: ele?.asset?.filename,
                uid: ele?.asset?.uid,
              },
            })) : [{
              file: {
                url: currentAssets?.asset?.url,
                title: currentAssets?.asset?.title,
                fileSize: currentAssets?.asset?.file_size,
                contentType: currentAssets?.asset?.content_type,
                fileName: currentAssets?.asset?.filename,
                uid: currentAssets?.asset?.uid,
              }
            }],
            isMultiple,
          })
        }
      })
      .catch(() => {
        console.log('Error in initiating Contentstack SDK')
      })
  }, [])

  useEffect(() => {
    let allItems = Array.from(state.allSelectedImages || []).map(
      (val, index) => {
        const { url, title, fileSize, contentType, fileName } = val.file
        return {
          index: index,
          id: index,
          component: (
            <AssetCardVertical
              onClick={() => {}}
              url={url}
              title={title ?? fileName}
              size={fileSize}
              imageWidth={'100%'}
              type={assetType[getAssetType(contentType)]}
              onDeleteClick={() => {
                handleAssetDelete(index)
              }}
            />
          ),
        }
      }
    )
    setAllImageComponent(allItems)
  }, [state.allSelectedImages])

  const setImage = (images) => {
    const updatedSelectedImages = [
      ...(state.allSelectedImages || []),
      ...images.map((image) => ({ file: image })),
    ]
    setState({
      ...state,
      allSelectedImages: updatedSelectedImages,
    })
    const newFieldData = state.isMultiple
      ? updatedSelectedImages.map((ele) => ({
          uid: ele.file.uid,
          _content_type_uid: 'sys_assets',
        }))
      : (images.length ? { uid: images[0].uid, _content_type_uid: 'sys_assets' }: {})

    extension.field.setData(newFieldData)
  }

  const onSubmit = (images) => {
    setImage(images)
  }

  const onUploadSubmit = (images) => {
    setImage(images)
  }

  const isEmpty = allImageComponent.length < 1

  const excludeAssetUids = state.allSelectedImages.map(ele => ele.file.uid)
  return (
    <div
      className={styles['asset-picker']}
      ref={ref}
    >
      {state.isLoading && (
        <SkeletonTile
          numberOfTiles={2}
          tileHeight={10}
          tileWidth={300}
          tileRadius={10}
          tileBottomSpace={20}
          tileTopSpace={10}
          tileleftSpace={0}
        />
      )}

      {/* Show selected asset(s) */}
      {!state.isLoading && (
        <div>
          {!isEmpty &&
            (allImageComponent.length > 3 ? (
              <div className='preset-picker-carousal-wrapper'>
                <Carousel
                  spacing={30}
                  slidesPerView={3}
                  items={allImageComponent}
                  itemCount={allImageComponent.length}
                />
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                {Array.from(allImageComponent).map((val, index) => (
                  <div key={index} className='assetcard-wrapper'>
                    {val.component}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Allow more selection only if type multiple */}
      {!isEmpty && !state.isMultiple
        ? null
        : !state.isLoading && (
            <div>
              <Button
                buttonType='primary'
                onClick={() =>
                  openChooseAssetModal({
                    onSubmit,
                    sdk: contentstackSDK,
                    excludeAssetUids,
                    ...(extension.field.schema.config || {}),
                  })
                }
              >
                Choose a file
              </Button>
              <span
                className={styles['or']}
              >
                /
              </span>
              <span
                onClick={() =>
                  openUploadAssetModal({
                    onSubmit: onUploadSubmit,
                    sdk: contentstackSDK,
                    ...(extension.field.schema.config || {}),
                  })
                }
                className={styles['upload-link']}
              >
                Upload a new File
              </span>
            </div>
          )}
    </div>
  )
}

export default App
