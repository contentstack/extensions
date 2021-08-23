import { ReactNode } from "react";
import { VideoList } from "./videoList.model";

export interface WindowOpner {
    children: ReactNode;
    url:string;
    videos:VideoList[];
    bridge:(error: object, res: {message:string;})=> void;
}