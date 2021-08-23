import { ConfigObj } from "./config.model"
import { VideoList } from "./videoList.model";

interface FieldData {
    items: VideoList[] | string[]
}

export interface ExtensionObj {
    config: ConfigObj;
    field: {
        uid: string;
        data: FieldData[];
        setData: (data:object) => void;
        getData: () => any;
    };
    currentUser: object;
    window: {
        state:string;
        _autoResizingEnabled:boolean;
        _height:number;
        _resizingEnabled:boolean;
        enableAutoResizing:()=>void
    };
}