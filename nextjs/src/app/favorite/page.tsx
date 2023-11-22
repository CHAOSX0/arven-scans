"use client"
import supabase from "../../../supabase"
import Nav from "../components/Nav"
import Footer from "../components/footer"
import seriesData from "../types/series"
import {useState, useEffect} from "react"
function Card({title, URL, type, coverURL}: seriesData){

return (
    <div className="rounded-lg">
    <a href={URL}>
      <figure className="relative">
        <div className="absolute bottom-0 left-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-black/50 transition hover:opacity-0" />
        <img
          className="h-56 w-full rounded-lg object-cover sm:h-64"
          src={coverURL}
          alt={title}
        />
        <div className="absolute bottom-0 p-4">
          <p className="text-xs font-semibold capitalize leading-[1rem] text-gray-300">
            {type}
          </p>
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>
        </div>
      </figure>
    </a>
  </div>
)
}
export default  function Favorite(){
    const [userName, setUsername] = useState<string | null | 'anonymous'>(null)
    useEffect(()=>{
        (async()=>{

          const {data, error} =  await supabase.auth.getSession()
          if(error) return setUsername('anonymous');
          setUsername(data?.session?.user.user_metadata.username || 'anonymous')
        }
        )()
       
        
    
    }, [])
    const [series, setSeries] = useState<seriesData[]>([])
    useEffect(()=>{
        const rawData = localStorage.getItem('bookmarks')
        console.log(rawData)
        if(rawData){
            setSeries(JSON.parse(rawData))
            return
        }
    }, [])
    const cards = series.length > 0? series.map((series: seriesData, i: number) => <Card key={i} {...series} />) : ''
    return (
        <>
       <Nav />
        <main className="container mx-auto px-3 sm:px-0 md:px-0">
          <h2 className="mb-3 text-lg font-bold">Bookmarks - {userName}</h2>
          <div className="xlg:grid-cols-8 grid grid-cols-3 gap-[10px] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {cards}
          </div>
          <div className="mb-5 mt-5 flex justify-end" />
        </main>
       <Footer />
      </>
      
    )
}