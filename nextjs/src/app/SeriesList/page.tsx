
import Nav from "../components/Nav"
import SeriesListForum from "./forum";

import supabase from "../../../supabase";
import { notFound, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Card from "./card";
import Footer from "../components/footer";
import Container from "./container";

async function GetAllFromTable(tableName: string): Promise<{ text: string, slug: string }[]> {
    const { data, error } = await supabase.from(tableName).select('text, slug')
    console.log(error)
    if (error) notFound();
    return data
}

//% note: this function takes arguments as an object but it is NOT a component, this approach was used to prevent confusion when calling it
async function QuerySeriesInPage(
    { pageNum, PageSize, title, genres, status, type }:
        { pageNum: number, PageSize: number, title?: string, genres?: string[], status?: string, type?: string }): Promise<{ data: { coverURL: string, title: string, genres: string[], URL: string, type: string }[], count: number }> {

    const LastPageEnd = (pageNum - 1) * PageSize; //aka. current page start
    const CurrentPageEnd = pageNum * PageSize;

    //$ base query structure
    const query = supabase.from('series').select('coverURL, genres, title, description, URL, type', { count: 'exact' }).range(LastPageEnd, CurrentPageEnd)

    //$ add filters to query if provided
    if (title) query.textSearch('title', title);
    if (genres && !!genres.length) query.contains('genres', genres);
    if (status) query.eq('status', status);
    if (type) query.eq('type', type);

    const { error, data, count } = await query
    if (error) {
        //$ if an error occurs send it to the user and return an empty list
        console.log(error)
        return { data: [], count: 0 }
    }
    //$ if count is null return 0 as count
    return { data: data, count: count || 0 }
}
type Props = {
    params?: {
      num?: string;
    };
    searchParams?: {
      title?: string,
      genre: string,
      status?: string,
      type?: string,
      page?: string,
    };
  };
  
export default async function SeriesList({searchParams} :Props) {
    //THIS IS A CONFIGURATION VALUE CHANGE IT WHEN NEEDED
    const PAGE_SIZE = 50
    const {title, genre, type,status, page} = searchParams || {}
  
    console.log('rerender')
    const pageNum = parseInt(page|| '1') || 1
    //parseInt(search.get('page') || '1') || 1
   // console.log(statuses)

    const SeriesData: { data: { URL: string, coverURL: string, title: string, genres: string[], type: string }[], count: number } =  await QuerySeriesInPage({ pageNum, PageSize: PAGE_SIZE, genres:genre ? [genre] : undefined,  title: title || undefined, type: type || undefined, status: status || undefined })
    const statuses = await GetAllFromTable('statuses')
    const genresOptions = await GetAllFromTable('genres')
    const types = await GetAllFromTable('types')
   
    const seriesElements = SeriesData.data.map((S, i) => <Card {...S} key={i} />)
    
    return (
        <>
            <Nav />
            <Container PAGE_SIZE={PAGE_SIZE} pageNum={parseInt(page || '0') || 0} initialData={{seriesData: SeriesData, genresOptions: genresOptions, typesOptions: types, statusOptions: statuses, genre, title, status, type}}/>
            <Footer />
        </>

    )
}