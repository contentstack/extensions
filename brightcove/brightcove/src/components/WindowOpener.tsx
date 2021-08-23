/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { WindowOpner } from "../model/windowOpener.model";

const WindowOpener: React.FC<WindowOpner> = props => {

    let browser: any;
    let popup: any = null;
    let timer: any = null;
    const name = "BrightCove Popup";
    const opts = `dependent=${1}, alwaysOnTop=${1}, alwaysRaised=${1}, width=${800}, height=${590}`;

    useEffect(() => {
        browser = window.self;
    }, [])

    const watcher = () => {
        // if popup is null then let's clean the intervals.
        if (popup === null) {
            clearInterval(timer);
            timer = null;
            // if popup is not null and it is not closed, then let's set the focus on it... maybe...
        } else if (popup !== null && !popup.closed) {
            popup.focus();
            // if popup is closed, then let's clean errthing.
        } else if (popup !== null && popup.closed) {
            clearInterval(timer);
            browser.focus();
            // the onCloseEventHandler it notifies that the child has been closed.
            browser.close({ message: "child was closed" });
            timer = null;
            popup = null;
        }
    }

    const onClickHandler = () => {

        if (popup) {
            popup.focus();
            return;
        }
        popup = browser.open(props.url, name, opts);

        setTimeout(() => {
            // The opener object is created once and only if a window has a parent
            // popup.opener.onOpen({message:"Opening YouTube Popup"});
            popup.opener.postMessage(
                { message: "Opening YouTube Popup", selectedVideos: props.videos },
                "*"
            );
        }, 0);

        if (timer === null) {
            // each two seconds we check if the popup still open or not
            timer = setInterval(watcher, 2000);
        }
    }

    return (
        <button
            className="choose_btn"
            type="button"
            onClick={onClickHandler}
        >
            {props.children}
        </button>
    )
}
export default WindowOpener;