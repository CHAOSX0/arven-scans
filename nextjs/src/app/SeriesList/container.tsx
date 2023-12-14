'use client'
import { useState } from "react"
import SeriesListForum from "./forum"
import Card from "./card"
import supabase from "../../../supabase"
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

export default function Container({initialData, PAGE_SIZE, pageNum}: {initialData: {seriesData: any, genresOptions: any[], statusOptions: any[], typesOptions: any[], genre: string | undefined, type:string | undefined, title: string | undefined, status: string | undefined }, PAGE_SIZE: number, pageNum: number}){
    const genresOptions = initialData.genresOptions
    const [SeriesData, setSeriesData]: any = useState<any[]>(initialData.seriesData)
    async function HandelSearch(e:React.SyntheticEvent){
        e.preventDefault();
        const formData = new FormData((e?.target as HTMLFormElement));
        const formProps = Object.fromEntries(formData);
        console.log(formProps, 'props')
        const selectedGenres: string[] = []
        genresOptions?.forEach((e: any)=>{
            if((document.getElementById(e.slug) as HTMLInputElement).checked){
                selectedGenres.push(e.slug)
            }
        })
        console.log('pre res')
        const res = await QuerySeriesInPage({pageNum:1, PageSize: PAGE_SIZE, title:formProps.title as string, genres: selectedGenres, status:formProps.status as string, type:formProps.type as string})
        console.log(res)
        setSeriesData(res)
        console.log(selectedGenres)
      
    }
    const seriesElements = SeriesData.data.map((S: any, i: number) => <Card {...S} key={i} />)
    return (
        <main className="container mx-auto px-3 sm:px-0 md:px-0">
                <SeriesListForum 
                status={initialData.status || null} 
                title={initialData.title || null}
                type={initialData.type || null}
                genre={initialData.genre || null}
                Submit={HandelSearch}
                statusesOptions={initialData.statusOptions}
                genresOptions={initialData.genresOptions}
                typesOptions={initialData.typesOptions} />
                <h2 className="mb-3 text-lg font-bold">Mangas List</h2>
                <div className="xlg:grid-cols-8 grid grid-cols-3 gap-[10px] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {seriesElements}
                </div>
                <div className="flex justify-end">
                    <nav className="flex items-center gap-5">
                        <h3 className="hidden sm:block text-[--text-color]"> Page {pageNum} of {Math.ceil(SeriesData.count / PAGE_SIZE)} </h3>
                        <ul className="pagination flex gap-1">
                            <li
                                className="pagination-link text-[--text-color]"
                                aria-label="« Previous"
                            >
                                <a
                                    href={pageNum !== 1 ? `/SeriesList?page=${pageNum - 1}` : '#'}
                                >

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-3 w-3 block h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li
                                className="pagination-link pagination-active text-[--text-color]"
                                aria-current="page"
                            >
                                <span>{pageNum}</span>
                            </li>
                            <li
                                className="pagination-link text-[--text-color]"

                            >
                                <a
                                    href={!(pageNum >= (Math.ceil(SeriesData.count / PAGE_SIZE))) ? `/SeriesList?page=${pageNum + 1}` : '#'}
                                >

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-3 w-3 h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </main>
    )
}