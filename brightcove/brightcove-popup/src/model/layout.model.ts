import React from "react"
import { VideoList } from "./videoList.model"

export interface Layout {
    videos:VideoList[];
    isSelected:boolean;
    checkFiles: boolean;
    loadContent:(e:React.MouseEvent<HTMLInputElement>)=>void;
    handleSelect: (video:VideoList)=>void;
    selectedVideoList:VideoList[];
    totalVideos:number;
}