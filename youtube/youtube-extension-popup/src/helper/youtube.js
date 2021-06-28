
import axios from "axios";
class Youtube {
  constructor({ apiKey, channelId }) {
    this.apiKey = apiKey;
    this.channelId = channelId;
  }
  getVideos(query = "", limit = 8, nextPageToken) {
    let setting = this;
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        baseURL: "https://www.googleapis.com/youtube/v3/",
        url: `/search?part=snippet&maxResults=${limit}&key=${
          setting.apiKey
        }&channelId=${setting.channelId}&type=video${
          query ? `&q=${query}` : "&order=date"
        }&pageToken=${nextPageToken || ""}`,
      };
      axios(options)
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default {
  async initalizingVideoList(config, query, nextPageToken) {
    const youtube = new Youtube(config);
    return await youtube.getVideos(query, 8, nextPageToken);
  },

  async initializeSearchField(config, query) {
    const youtube = new Youtube(config);
    return await youtube.getVideos(query, 8, "");
  },
};
