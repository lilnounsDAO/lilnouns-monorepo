import {Idea, IdeaResponse} from "./types";
import axios from "axios";

/**
 * Fetch all prop lot ideas
 *
 * @returns All ideas and votes from Prop Lot
 */
export async function getAllIdeas(): Promise<Idea[]> {
    const response = await axios.get<IdeaResponse>("https://lil-noun-api.fly.dev/ideas?sort=OLDEST");

    const {data, status, message} = await response.data;

    if (status) {
        return data;
    }

    return Promise.reject(message);
}
