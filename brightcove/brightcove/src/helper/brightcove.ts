import axios from "axios";

const headers = {
    'Content-Type': 'application/json'
}

class Brightcove {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    getVideos = async (data: object) => {
        try {
            return await axios({ method: "POST", url: this.url, headers, data });
        } catch (error) {
            console.error(error);
            return error
        }
    }
}

export default Brightcove
