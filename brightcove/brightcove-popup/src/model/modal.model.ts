import { ConfigObj } from "./config.model";
import { VideoList } from "./videoList.model";

export interface ModelProps {
    config: ConfigObj;
    selectedVideos: VideoList[];
    closeWindow: (videos:VideoList[])=>void;

}