import seriesData from "@/app/types/series";
import Card from "./card";
import supabase from "../../../../supabase";
import Link from "next/link";

async function getRecentChapters(n: number){
 const {data, error} = await supabase.from('series').select('*, chapters(id, number, created_at )').order('updated_at', {ascending: false}).limit(n)
 if(error) throw error;

 return data.map((series: any)=> ({...series, latestChapters: series.chapters.map((chapter: any) => ({...chapter, URL: `/series/${series.slug}/${chapter.number}`}))}))
}
export default async function RecentChapters(){
 
  const data = await getRecentChapters(15)
  console.log(data[0]?.chapters)
  const Elements = data.map((series, i) => <Card key={i} {...series} i={i} />)
    return(
        <section>
        <div className="flex items-center justify-between">
          <h2 className="my-3 text-lg font-bold">Recent Chapters</h2>
          <Link href="/SeriesList">
            <span className="text-xs text-gray-400 transition hover:text-gray-300">
              View More
            </span>
          </Link>
        </div>
        <div className="xlg:grid-cols-8 grid grid-cols-3 gap-[10px] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Elements}
      </div>
       
      </section>
    )
}