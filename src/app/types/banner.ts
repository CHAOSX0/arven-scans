import genre from "./genre"
import seriesType from "./seriesType";
type bannerData = {
    BannerURL: string,
    index: number
    URL: string,
    description: string,
    genres: genre[],
    type: seriesType,
    title: string,

}

export default bannerData;