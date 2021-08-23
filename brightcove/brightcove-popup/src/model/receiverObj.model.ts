import { VideoList } from "./videoList.model";
import { ConfigObj } from "./config.model";

export interface PopupObject {
    source:any,
    origin:any,
    data: {
        message: string;
        config: ConfigObj;
        selectedVideos: VideoList[];
    }
}