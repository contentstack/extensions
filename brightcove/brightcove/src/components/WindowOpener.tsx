/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { WindowOpner } from '../model/windowOpener.model';

const WindowOpener: React.FC<WindowOpner> = (props) => {
  let popup: any = null;
  let timer: any = null;
  const name = 'BrightCove Popup';
  const opts = `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, width=${800}, height=${590}`;

  const watcher = () => {
    if (!popup) {
      // if popup is null then let's clean the intervals.
      clearInterval(timer);
      timer = null;
    } else if (popup && !popup.closed) {
      // if popup is not null and it is not closed, then set the focus on it
      popup.focus();
    } else if (popup && popup.closed) {
      // if popup is closed, then let's clean everything
      clearInterval(timer);
      window.self.focus();
      // the onCloseEventHandler it notifies that the child has been closed.
      window.self.close();
      timer = null;
      popup = null;
    }
  };

  const onClickHandler = () => {
    if (popup && !popup.closed) {
      popup.focus();

      return;
    }

    popup = window.self.open(props.url, name, opts);

    setTimeout(() => {
      // The opener object is created once and only if a window has a parent
      // popup.opener.onOpen({message:"Opening YouTube Popup"});
      popup.opener.postMessage(
        { message: 'Opening Brightcove Popup', selectedVideos: props.videos },
        '*'
      );
    }, 0);

    if (timer === null) {
      // each two seconds we check if the popup still open or not
      timer = setInterval(watcher, 2000);
    }
  };

  return (
    <button className='choose_btn' type='button' onClick={onClickHandler}>
      {props.children}
    </button>
  );
};
export default WindowOpener;
