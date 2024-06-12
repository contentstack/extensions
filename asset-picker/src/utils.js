export const getAssetType = (content_type) => {
  let assetType = 'Document'
  if (content_type) {
    switch (true) {
      case content_type.indexOf('image') > -1:
        assetType = null;
        break
      case content_type.indexOf('folder') > -1:
        assetType = 'Group'
        break
      case content_type.indexOf('pdf') > -1:
        assetType = 'Pdf'
        break
      case content_type.indexOf('excel') > -1:
      case content_type.indexOf('presentation') > -1:
      case content_type.indexOf('json') > -1:
      case content_type.indexOf('document') > -1:
      case content_type.indexOf('text/plain') > -1:
      case content_type.indexOf('text/html') > -1:
        assetType = 'Document'
        break
      case content_type.indexOf('zip') > -1:
        assetType = 'Archive'
        break
      case content_type.indexOf('video') > -1:
        assetType = 'Video'
        break
      case content_type.indexOf('audio') > -1:
        assetType = 'Audio'
        break
    }
    if (content_type.indexOf('image/tiff') > -1) {
      assetType = 'Document'
    }

    return assetType
  }

  return assetType
}