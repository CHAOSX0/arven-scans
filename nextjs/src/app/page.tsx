import Image from 'next/image'
import Nav from './components/Nav'
import Footer from './components/footer'
import SeriesSwiper from './components/Swiper'
import ScrollableSeriesRow from './components/ScrollableSeriesRow'
import RecentChapters from './components/RecentChapters/Container'
import { faker } from '@faker-js/faker';
import seriesData from './types/series'
import bannerData from './types/banner'
async function getPopularSeriesData(n: number){
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
    return;
  }

  return await res.json()
}
async function getLatesAddedSeriesData(n: number){
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
    return;
  }

  return await res.json()
}
export default async function Home() {

  let i = -1
  function GenerateBanner(): bannerData{
   i++
    return {
      URL: faker.internet.url(),
      title: `${faker.word.adjective()} ${faker.word.noun()}`,
      description: faker.lorem.paragraph(),
      BannerURL: faker.image.url(),
      index:i,
      type: faker.helpers.arrayElement(["Manga", "Manhua", "Manhwa"]),
      genres: faker.helpers.multiple(()=>{
        return{
          URL: faker.internet.url(),
          id: faker.string.uuid(),
          text: faker.word.noun()
        }
      }, {count: 3})
    }
  }
  
  const slidersDummyData = faker.helpers.multiple(GenerateBanner, {
count: 5})
 
    const PopularSeriesData= await getPopularSeriesData(15)
    const recentlyAddedData = await getLatesAddedSeriesData(15)
  return (
    <>
   
    <Nav />
    <main className="container mx-auto px-3 sm:px-0 md:px-0">
    <section
        className="-mt-4 mb-5 ml-[calc((100%-100vw)/2)] w-screen sm:-mt-24"
        id="slider-container"
        style={{ marginLeft: "calc(((100% - 100vw) - 10px) / 2)", overflow:'hidden', paddingBottom: '10px'}}
      >
      <SeriesSwiper data={slidersDummyData}/>
      </section>
      <ScrollableSeriesRow headerText='Most Popular' data={PopularSeriesData} />
      <ScrollableSeriesRow headerText='Recently Added' data={recentlyAddedData} />
     <RecentChapters />
    </main>
    <Footer />
  </>
  
  )
}
