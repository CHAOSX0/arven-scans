type seriesData = {
    title: string,
    URL: string,
    thumbnail: string,
    created_at: string,
    updated_at: string | null,
    description: string,
    i: number | undefined,
    latestChapters: {number: number, URL: string, created_at: string}[] | null,

}

export default seriesData;