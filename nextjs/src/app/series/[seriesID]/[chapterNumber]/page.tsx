import Nav from "@/app/components/Nav";
import supabase from "../../../../../supabase"
import chapter from "@/app/types/chapter";
import seriesData from "@/app/types/series";
import Footer from "@/app/components/footer";
import Image from "next/image";
import Link from "next/link";
import SelectChapters from "./selectChapters";
import ViewCounter from "./viewCounter";

async function getALlChapters(seriesID: string): Promise<chapter[]>{
const {error, data} = await supabase.from("chapters").select("*").eq("seriesSlug", seriesID)
if (error){ 
    console.log(error)
    return []
   };
return data
}

async function GetParentData(seriesID: string, chapterNumber: string): Promise<seriesData | null>{
  const { error, data } = await supabase.from('series').select('*').eq('slug', seriesID);
  if(error) return null;
    return data[0]
}

async function getData(seriesID: string, chapterNumber: string): Promise<chapter | null>{
const {error, data} = await supabase.from("chapters").select("*").eq("seriesSlug", seriesID).eq("number", chapterNumber)
console.log(data)
if(error) return null;
return data[0]
}

function Ender({data, ParentData, AllChapters}: {data: chapter| null, ParentData: seriesData| null, AllChapters: chapter[]}){
  console.log(data, 'data') 
  const prev = data ? AllChapters?.find((chapter) => {
    console.log(`is ${chapter.number} < ${data.number}`, `${chapter.number < data.number}`)
    return chapter.number < data.number
  }) :false
  const next = data ? AllChapters?.find((chapter) => chapter.number > data.number): false
  console.log(next, 'next')
  const nextURL = next? `/series/${next?.seriesSlug}/${next?.number}` : `/series/${ParentData?.slug}`
  const prevURL = prev? `/series/${prev?.seriesSlug}/${prev?.number}` : `/series/${ParentData?.slug}`
  console.log(nextURL, 'nextURL') 
  console.log(prevURL, 'prevURL')
  return (
     <div className="relative my-5 flex w-full flex-col gap-5 rounded-md bg-red-200/30 px-6 py-4 shadow-md dark:bg-zinc-900 lg:w-3/4">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start">
            <h3 className="text-md font-bold !text-opacity-60 transition hover:text-opacity-80 dark:dark:text-white">
              <a href={ParentData?.URL}>
                {ParentData?.title}
              </a>
            </h3>
            <span className="block">
              {" "}
              {ParentData?.title} - Chapter {data?.number} <span />
            </span>
          </div>
          <div className="w-full sm:w-1/3" >
           <SelectChapters data={data} AllChapters={AllChapters} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href={prevURL}>
              <button className={`${!prev? '!bg-opacity-40 cursor-not-allowed' : ''}  flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white transition bg-blue-600 shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`}>
                <svg
                  width={48}
                  height={48}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.375 9.375a.624.624 0 1 1 0 1.25H9.134l2.684 2.682a.627.627 0 0 1-.886.885l-3.75-3.75a.625.625 0 0 1 0-.885l3.75-3.75a.626.626 0 0 1 .886.886l-2.684 2.682h7.241Z" />
                </svg>
                <span>Previous</span>
              </button>
            </Link>
            <Link  href={nextURL}> 
              <button className={`${!next ? '!bg-opacity-40 cursor-not-allowed' : ''}  flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white transition bg-blue-600 shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`}>
                <span>Next</span>
                <svg
                  width={48}
                  height={48}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-4.375 9.375a.625.625 0 1 0 0 1.25h7.241l-2.684 2.682a.627.627 0 0 0 .886.885l3.75-3.75a.625.625 0 0 0 0-.885l-3.75-3.75a.626.626 0 1 0-.886.886l2.684 2.682H7.625Z" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
  )
}

function Header({title, number, URL}: {title: string| undefined, number: number|undefined, URL: string|undefined}){
return (
<>
      <h2 className="text-lg font-bold">
        {" "}
        {title || 'series'} - Chapter {number || 0} <span />
      </h2>
      <span className="text-xs text-gray-500">
        {" "}
        All chapter are in{" "}
        <a
          className="text-black transition hover:text-opacity-60 dark:text-gray-300"
          href={URL || '/'}
        >
          {title || 'series'}
        </a>
      </span>
      </>
)
}
import type { Metadata, ResolvingMetadata } from 'next'
import ChaptersComments from "./comments";
 
type Props = {params: {seriesID: string, chapterNumber: string}}
 
export async function generateMetadata(
  { params}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getData(params.seriesID, params.chapterNumber)
  const ParentData = await GetParentData(params.seriesID, params.chapterNumber)

  return {
    title: `chapter ${params.chapterNumber} of ${ParentData?.title} on Arven Scans`,
    keywords: `${ParentData?.title}, chapter ${data?.number} ${ParentData?.title}, arven scans, manhua, manga`,
    description:`chapter ${data?.number} of ${ParentData?.description} on arven scans`,
    openGraph: {
      images: [ParentData?.coverURL || ''],
    },
  }
}
export default async function({params : {seriesID, chapterNumber}}: {params: {seriesID: string, chapterNumber: string}}){
    const DataPromise = getData(seriesID, chapterNumber)
    const ParentDataPromise = GetParentData(seriesID, chapterNumber)
    const AllChaptersPromise = getALlChapters(seriesID)
    const [data, ParentData, AllChapters] = await Promise.all([DataPromise, ParentDataPromise, AllChaptersPromise])
    
    return (
        <>
 <Nav />

  <main className="container mx-auto px-3 sm:px-0 md:px-0">
    <section className="flex flex-col items-center">
      <Header title={ParentData?.title} number={data?.number} URL={ParentData?.URL} />
      <Ender  data={data} ParentData={ParentData} AllChapters={AllChapters}/>
      <div className="mx-auto max-w-3xl" id="chapter-container">
        {data?.pages?.map((page, i) => (<img key={i} src={page} alt={ParentData?.title || 'hi'} className="chapter-image w-full cursor-pointer" />))}
      </div>
      <Ender data={data} ParentData={ParentData} AllChapters={AllChapters} />
     <ChaptersComments slug={data?.id || 0}/>
    </section>

  </main>
 <Footer />
 {/*//# this component is a work around to run react hooks on the client, it does not render any actual content*/}
 <ViewCounter chapterID={data?.id?.toString()} SeriesID={ParentData?.id} />
</>

    )
}