import Image from 'next/image'
import Nav from './components/Nav'
import Footer from './components/footer'
import SeriesSwiper from './components/Swiper'
import ScrollableSeriesRow from './components/ScrollableSeriesRow'
import RecentChapters from './components/RecentChapters/Container'
import { faker } from '@faker-js/faker';
import seriesData from './types/series'
import bannerData from './types/banner'
import type { Metadata, ResolvingMetadata } from 'next'
async function getBanners(n: number): Promise<bannerData[]>{

  const res = await fetch('http://localhost:8000/rest/v1/series?isSlider=is.true&BannerURL=neq.null', {
    next:{
      revalidate: 10,  // Revalidate every 10 seconds

    },
    headers:{
      'Range-Unit': 'items',
      'Range': '0-'+n,
      'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
    }
  })
  if(!res.ok){
    console.log(await res.json());
    // This will activate the closest `error.js` Error Boundary
    throw 'fuck';
    
  }
  const data = await res.json()
  const ret = data.map((e: any)=>{
    return {...e, genres: e.genres.map((g:any)=>({text: g, URL:`/genre/${g}`, id: g}))}
  })
  return ret
//  return await res.json()
}
async function getPopularSeriesData(n: number): Promise<seriesData[]>{
  const res = await fetch('http://localhost:8000/rest/v1/series?order=viewCount', {
    next:{
      revalidate: 10
    },
    headers:{
      'Range-Unit': 'items',
      'Range': '0-'+n,
      'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
    }
  });
  
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    console.log(await res.json());
    // This will activate the closest `error.js` Error Boundary
    throw 'fuck';
   
  }

  return await res.json()
}
async function getLatesAddedSeriesData(n: number): Promise<seriesData[]>{
  const res = await fetch('http://localhost:8000/rest/v1/series?order=created_at', {
    next:{
      revalidate: 10
    },
    headers:{
      'Range-Unit': 'items',
      'Range': '0-'+n,
      'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
    }
  });
  
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    console.log(await res.json());
    // This will activate the closest `error.js` Error Boundary
    throw 'fuck';
   
  }

  return await res.json()
}
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
export const etadata: Metadata = {
    title: "Arven Scans Manhua, Manhwa and Manga",
    description:'read Manhuas, Manhwas and Mangas for free on Arven Scans',
    keywords:"Manhua Manhwa Manga anime",
    openGraph: {
      images: ['/logo.png',],
    },
  }

export default async function Home() {
  let i = -1
 
    const sliderData: bannerData[] = await getBanners(5)
    const PopularSeriesData: seriesData[] = await getPopularSeriesData(15)
    const recentlyAddedData: seriesData[] = await getLatesAddedSeriesData(15)
  return (
    <>
    <Nav />
    <main className="container mx-auto px-3 sm:px-0 md:px-0">
    <section
        className="-mt-4 mb-5 ml-[calc((100%-100vw)/2)] w-screen sm:-mt-24"
        id="slider-container"
        style={{ marginLeft: "calc(((100% - 100vw) - 10px) / 2)", overflow:'hidden', paddingBottom: '10px'}}
      >
      <SeriesSwiper data={sliderData}/>
      </section>
      <ScrollableSeriesRow headerText='Most Popular' data={PopularSeriesData} />
      <ScrollableSeriesRow headerText='Recently Added' data={recentlyAddedData} />
     <RecentChapters />
    </main>
    <Footer />
  </>
  
  )
}
