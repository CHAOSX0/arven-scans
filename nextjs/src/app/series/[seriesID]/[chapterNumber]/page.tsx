import Nav from "@/app/components/Nav";
import supabase from "../../../../../supabase"
import chapter from "@/app/types/chapter";
import seriesData from "@/app/types/series";
import Footer from "@/app/components/footer";
import Image from "next/image";
import Link from "next/link";
import SelectChapters from "./selectChapters";
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
        {data?.pages?.map((page) => (<img src={page} alt={ParentData?.title || 'hi'} className="chapter-image w-full cursor-pointer" />))}
      </div>
      <Ender data={data} ParentData={ParentData} AllChapters={AllChapters} />
      <div className="container mx-auto mt-10 flex justify-center px-3 sm:px-0 md:px-0">
        <div id="comments-list" className="w-full lg:w-3/4">
          <h2 className="mb-3 block text-lg font-bold leading-[1rem]">
            Comments (0)
          </h2>
          <form method="POST" action="https://iimanga.com/comments/post">
            <input
              type="hidden"
              name="_token"
              defaultValue="JxbEZZagl0avoY9Pwh14eOV0LflnwQww5zCisxh3"
            />
            <input
              type="hidden"
              name="type"
              defaultValue="App\Models\Chapter"
            />
            <input type="hidden" name="key" defaultValue={228} />
            <div className="relative">
              <input
                name="comment"
                type="text"
                className="input w-full py-4"
                autoComplete="off"
                placeholder="Add Comment..."
                required
              />
              <button
                className="right-4 absolute top-1/2 -translate-y-1/2"
                type="submit"
              >
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-black !text-opacity-50 dark:text-white">
              <span id="comment-char">0</span>/500 Max{" "}
            </p>
          </form>
          <div className="mt-5 flex flex-col gap-4" />
        </div>
      </div>
    </section>

  </main>
 <Footer />
</>

    )
}