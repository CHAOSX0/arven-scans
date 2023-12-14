import Nav from "@/app/components/Nav";
import seriesData from "@/app/types/series";
import Ads from "@/app/components/ads";
import Footer from "@/app/components/footer";
import Bookmark from "./bookmark";
import Link from "next/link";
import SwitchContainer from "./switchContainer";
import supabase from "../../../../supabase";
function Genres({ genres }: { genres: string[] }) { 
  return genres.map((genre, i) => (
    <Link
    key={i}
    href={`/SeriesList?genre=${genre}`}
    className="inline-block rounded-md border-[1px] border-black/10 px-4 py-2 text-xs font-light shadow-sm transition hover:bg-black hover:text-white dark:border-white/10 dark:text-white dark:shadow-none dark:hover:bg-white dark:hover:text-black"
  >
    {genre}
  </Link>
  ))
}
export const revalidate = 60*60*20;
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { seriesID: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

 
async function getData(slug: string): Promise<seriesData>{
  
    const res = await fetch(`https://uuckqeakqoiezqehbitr.supabase.co/rest/v1/series?slug=eq.${slug}`, {
      
      headers:{
        
        'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y2txZWFrcW9pZXpxZWhiaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NDQzNTEsImV4cCI6MjAxNjMyMDM1MX0.ioakpOpVL5lr7E_a-RLftdosaQ0uMl24_SryLlWRaDI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y2txZWFrcW9pZXpxZWhiaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NDQzNTEsImV4cCI6MjAxNjMyMDM1MX0.ioakpOpVL5lr7E_a-RLftdosaQ0uMl24_SryLlWRaDI'
      }
    });
    
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      console.log(await res.json());
      // This will activate the closest `error.js` Error Boundary
      throw 'fuck';
     
    }
     const data = (await res.json())[0]
     console.log(data)
    return await data

}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getData(params.seriesID)
  const title =  (await supabase.from('settings').select('value').eq('name', 'site-title'))?.data?.[0].value
  const keywords = (await supabase.from('settings').select('value').eq('name', 'site-keywords'))?.data?.[0].value
  const titleTemplate = (await supabase.from('settings').select('value').eq('name', 'seo-manga-title'))?.data?.[0].value 
  const descriptionTemplate = (await supabase.from('settings').select('value').eq('name', 'seo-manga-description'))?.data?.[0].value 
  return {
    title: titleTemplate.replaceAll(':title', data.title),
    description:descriptionTemplate.replaceAll(':title', data.title),
    keywords:keywords,
    openGraph: {
      images: [data.coverURL],
    },
  }
}
export default async function Series({ params }: { params: { seriesID: string } }) {
  const data = await getData(params.seriesID)
  const {title, genres, description, coverURL, created_at, updated_at, status, type, releaseYear, artist, author, alternativeTitles, ratting}  = data

  return (
    <>
    <Nav />
      
      <main className="container mx-auto px-3 sm:px-0 md:px-0">
        <section>
          <div className="flex flex-col gap-6 sm:flex-row md:flex-row lg:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 rounded-lg sm:w-[17rem]">
              <div className="relative">
                <div className="to-dark-primary absolute inset-0 -bottom-1 bg-gradient-to-b from-transparent sm:hidden" />
                <img
                  className="h-full w-full rounded-lg object-cover object-bottom sm:max-h-[300px] md:max-h-[400px]"
                  src={coverURL}
                  alt={title}
                />
              </div>
              <div
                className="fixed inset-x-0 bottom-3 left-0 z-50 mx-auto flex w-5/6 gap-2 sm:static sm:w-full sm:flex-col"
                id="buttons"
              >
                <Link href={`/read/${params.seriesID}/read`}
                  className="flex items-center justify-center text-sm font-bold text-center px-4 py-4 sm:py-3 bg-blue-500 text-white rounded-full sm:rounded-md w-full h-12 w-5/6 hover:bg-blue-600 active:scale-95 transition-all duration-150"
                >
                  Read
                </Link>
               
                 <Bookmark data={data}/>
               
              </div>
              <div className="hidden sm:flex sm:flex-col sm:gap-1 sm:text-sm">
                <p className="flex justify-between !text-opacity-50 dark:text-white text-[--text-color]">
                  <span className="text-[--text-color]">Status</span>
                  <Link
                    href={`/SeriesList?status=${status}`}
                    className="transition-colors duration-200 hover:text-blue-500 dark:hover:text-white text-[--text-color]"
                  >
                    <span className="capitalize text-[--text-color]">{status}</span>
                  </Link>
                </p>
                <p className="flex justify-between !text-opacity-50 dark:text-white">
                  <span  className="text-[--text-color]">Type</span>
                  <Link
                    href={`/SeriesList?type=${type}`}
                    
                    className="transition-colors duration-200 hover:text-blue-500 dark:hover:text-white "
                  >
                    <span className="capitalize text-[--text-color]">{type}</span>
                  </Link>
                </p>
                <p className="flex justify-between !text-opacity-50 dark:text-white text-[--text-color]">
                  <span  className="text-[--text-color]" >Year</span>
                  <span className="capitalize !text-[--text-color]">{releaseYear}</span>
                </p>
                <p className="flex justify-between !text-opacity-50 dark:text-white !text-[--text-color]">
                  <span>Author</span>
                  <span className="capitalize">{author}</span>
                </p>
                <p className="flex justify-between !text-opacity-50 dark:text-white text-[--text-color]">
                  <span className="!text-[--text-color]">Artist</span>
                  <span className="capitalize text-[--text-color]">{artist}</span>
                </p>
                <p className="flex justify-between !text-opacity-50 dark:text-white text-[--text-color]">
                  <span className="!text-[--text-color]">Posted</span>
                  <span className="capitalize text-[--text-color]">admin</span>
                </p>
              </div>
            </div>
        
            <div className="flex w-full flex-col gap-3">
            <Ads Type='above-title-manga' currentPage='Series' />
              <div className="flex flex-wrap gap-1">
              <Genres genres={genres} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold leading-[1.5rem] text-[--text-color]">
                  {title}
                  <span className="text-sm capitalize !text-opacity-50 dark:text-white text-[--text-color]">
                    {" "}
                    {type}
                  </span>
                </h2>
                <div className="flex gap-1 text-[--text-color]">
                  <span className="font-semibold text-[--text-color]">Alternative Titles:</span>
                  <span className="block text-sm text-gray-700 dark:text-gray-400">
                   {alternativeTitles}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold underline text-[--text-color]">
                    Story of: {title}
                  </span>
                  <p className="text-black dark:text-gray-100 text-[--text-color]" id="description" />
                  <p>
                   {description}
                  </p>
                  
                  <p />
                  <span
                    id="show-more"
                    className="hidden cursor-pointer transition hover:text-gray-400 text-[--text-color]"
                  >
                    ...Show more
                  </span>
                </div>
              </div>
              <div className="-mb-3 mt-3 flex gap-3">
                
                
                <div className="flex items-center justify-center gap-1 text-[--text-color]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  <span className="text-sm font-bold">{ratting}</span>
                </div>
              </div>
            <Ads Type='below-information-manga' currentPage='Series' />
              <SwitchContainer seriesID={params.seriesID} />
            </div>
          </div>
        </section>
      </main>
    <Footer />
    </>

  )
}