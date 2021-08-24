import React, { useState, useEffect } from "react";

import { ConfigObj } from "../model/config.model";
import { VideoList } from "../model/videoList.model";
import { PopupObject } from "../model/receiverObj.model";
import Modal from "../components/modal";

const Popup: React.FC = ()=> {
  const [message, setMessage] = useState("");
  const [config, setConfig] = useState<ConfigObj>();
  const [selectedVideosList, setSelectedVideosList] = useState<VideoList[]>();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { message: "get Brightcove config and selected videos", getConfig: true },
        "*"
      );
      console.info("message :" + message);
    } else {
      window.close();
    }

    const receiveMessage = (event: PopupObject) => {
      const { data } = event;
      if (data.config) {
        setMessage(data.message);
        setConfig(data.config);
      }
      if (data.selectedVideos) {
        setMessage(data.message);
        setSelectedVideosList(data.selectedVideos);
      }
    };
    window.addEventListener("message", receiveMessage, false);
  },[])

  const onCloseWindow = (selectedVideos: VideoList[]) => {
    if (selectedVideos.length > 0 && window.opener) {
      window.opener.postMessage(
        {
          message: "sending selected videos",
          selectedVideosList: selectedVideos,
        },
        "*"
      )
    } else if (window.opener) {
      window.opener.postMessage(
        {
          message: "Window closed sending selected videos",
        },
        "*"
      );
    }
    window.close();
  };

  return (
    <div>
      {config && selectedVideosList ? (
        <Modal
          config={config}
          closeWindow={onCloseWindow}
          selectedVideos={selectedVideosList}
        />
      ) : ""}
    </div>
  )
}

export default Popup