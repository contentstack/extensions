import { VideoList } from "./videoList.model";
import { ConfigObj } from "./config.model";

export interface PopupObject {
    source:unknown,
    origin:unknown,
    data: {
        message: string;
        config: ConfigObj;
        selectedVideos: VideoList[];
    }
}