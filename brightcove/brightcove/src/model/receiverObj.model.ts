import { VideoList } from "./videoList.model";

export interface PopupObject {
    source:any,
    origin:any,
    data: {
        message: string;
        getConfig: boolean;
        selectedVideosList: VideoList[];
    }
}