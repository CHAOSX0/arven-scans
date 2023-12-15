import chapter from "@/app/types/chapter";
import supabase from "../../../../supabase"
import Link from "next/link";
async function getCahpters(slug: string){
const {data, error} = await supabase.from('chapters').select('*').eq('seriesSlug', slug).order('number')
if(error) return console.log(error);
return data;
}
function Chapter({number, seriesSlug, created_at}: chapter){
    return (
        <Link href={`/series/${seriesSlug}/${number}`}>
        <div className="group mb-2 flex flex-wrap justify-between rounded-md border-[1px] border-black/10 bg-transparent p-3 transition dark:border-white/10 dark:hover:bg-white dark:hover:text-black text-[--text-color]">
          <div className="flex gap-2">
            <span>Chapter {number}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">{new Date(created_at).toLocaleDateString()}</span>
            
          </div>
        </div>
      </Link>
    )
}
export default async function ChapterList({slug}: {slug: string}) {
const chaptersData = await getCahpters(slug)
console.log(chaptersData)
chaptersData?.sort((a, b) => b.number - a.number)
const chapters = chaptersData ? chaptersData.map((chapter: chapter, i:number) => <Chapter key={i} {...chapter} /> ): "No Chapters Found";
return (
    <div className="mt-3 block lg:flex lg:gap-5 text-[--text-color]">
    <div id="chapters-list" className="w-full lg:w-3/4">
      <h2 className="mb-3 block text-lg font-bold leading-[1rem]">
        Chapters List
      </h2>
      {chapters}
      <div className="mt-5 flex justify-end" />
    </div>
    <div id="comments-list" className="hidden w-full lg:w-3/4">
      <h2 className="mb-3 block text-lg font-bold leading-[1rem] text-[--text-color]">
        Comments (0)
      </h2>
      <form method="POST" action="https://iimanga.com/comments/post">
        <input
          type="hidden"
          name="_token"
          defaultValue="ytwH2q07KwtBlip6MP2zXR7HHyB1T1ToE52rxmAm"
        />
        <input
          type="hidden"
          name="type"
          defaultValue="App\Models\Manga"
        />
        <input type="hidden" name="key" defaultValue={16} />
        <div className="relative">
          <input
            name="comment"
            type="text"
            className="input w-full py-4"
            autoComplete="off"
            placeholder="Add Comment..."
            required={true}
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
)
}