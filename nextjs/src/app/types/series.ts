import seriesType from "./seriesType";

type seriesData = {
    id: number,
    title: string,
    URL: string,
    coverURL: string,
    created_at: string,
    updated_at: string | null,
    genres: string[],
    releaseYear: string,
    author: string,
    artist: string,
    ratting: number,
    slug: string,
    alternativeTitles: string[],
    status: "ongoing" | "Complete" | "Dropped" | "Hiatus",
    type:seriesType,
    description: string,
    i: number | undefined,
    latestChapters: {number: number, URL: string, created_at: string}[] | null,

}

export default seriesData;