import axios, { AxiosResponse } from "axios";

const headers = {
    'Content-Type': 'application/json'
}

class Brightcove {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    getVideos = async (data: object): Promise<AxiosResponse> => {
        try {
            return await axios({ method: "POST", url: this.url, headers, data });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default Brightcove
