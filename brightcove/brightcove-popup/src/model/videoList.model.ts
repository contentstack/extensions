interface Video {
    src: string;
    source: { src: string }[];
}

export interface VideoList {
    id: string;
    images: {
        thumbnail: Video;
        poster: Video;
    };
    name: string;
    updated_at: string;
    description: string;
}