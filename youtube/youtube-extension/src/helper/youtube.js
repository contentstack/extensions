/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

class Youtube {
  constructor({ apiKey, channelId }) {
    this.apiKey = apiKey;
    this.channelId = channelId;
  }

  getSelectedVideos(videoIds) {
    const setting = this;
    return new Promise((resolve, reject) => {
      try {
        resolve(
          axios({
            method: "GET",
            baseURL: "https://www.googleapis.com/youtube/v3/videos/",
            url: `/?part=snippet&key=${setting.apiKey}
        &channelId=${setting.channelId}
        &type=video&order=date&id=${videoIds}`,
          })
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default {
  async initalizingVideoList(config, selectedVideos) {
    const youtube = new Youtube(config);
    return await youtube.getSelectedVideos(selectedVideos);
  },
};
