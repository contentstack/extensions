import React from "react";
import Loader from "./loader";
import moment from "moment";
import { Layout } from "../model/layout.model";

const ListLayout: React.FC<Layout> = (props) => {
    const { isSelected, selectedVideoList, videos, totalVideos, checkFiles, handleSelect, loadContent } = props;
    const renderVideos = isSelected ? selectedVideoList : videos;
    return (
        <ul className="list-layout">
            <li className="table-head">
                <div className="table-cell w-5"></div>
                <div className="table-cell w-35">Name</div>
                <div className="table-cell w-30">Modified By</div>
                <div className="table-cell w-30">Last Modified</div>
            </li>
            <div className="table-body">
                {renderVideos.length > 0 ? (
                    <>
                        <ul className="video-list">
                            {renderVideos?.map((video) => {
                                const checked = selectedVideoList.some(
                                    (check) => check.id === video.id
                                );
                                return (
                                    <li
                                        title={video.name}
                                        id={video.id}
                                        key={video.id}
                                        className={checked ? "active" : ""}
                                        onClick={(event) => {
                                            const liElement = event.currentTarget;
                                            !checked && video.id === liElement.id
                                                ? liElement.classList.add("active")
                                                : liElement.classList.remove("active");
                                            handleSelect(video);
                                            const checkbox =
                                                (liElement.childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement);
                                            checkbox.checked = !checkbox.checked;
                                        }}
                                    >
                                        <div className="cs-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    className="cs"
                                                    id={`checkbox-${video.id}`}
                                                    defaultChecked={checked}
                                                    onChange={(event) => {
                                                        const style =
                                                            (event.target?.parentNode?.parentNode?.parentNode as HTMLElement);
                                                        !checked && video.id === style.id
                                                            ? style.classList.add("active")
                                                            : style.classList.remove("active");
                                                        handleSelect(video);
                                                    }}
                                                />
                                                <span className="lbl"></span>
                                            </label>
                                        </div>
                                        <div className="table-cell w-35">
                                            {video.name}
                                        </div>
                                        <div className="table-cell w-30">
                                            {video.description}
                                        </div>
                                        <div className="table-cell w-30">
                                             {moment(video.updated_at).format(
                          "ddd, MMM D YYYY"
                        )} 
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            className="load-more"
                            onClick={loadContent}
                            style={{
                                display:
                                    isSelected || videos.length + 1 > totalVideos
                                        ? "none"
                                        : "block",
                            }}
                        >
                            <span>Load More</span>
                        </div>
                    </>
                ) : checkFiles ? (
                    <div className="file-not-found">File Not Found!</div>
                ) : (
                    <Loader />
                )}
            </div>
        </ul>
    )
}

export default ListLayout;