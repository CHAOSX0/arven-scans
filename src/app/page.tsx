import Image from 'next/image'
import Nav from './components/Nav'
import Footer from './components/footer'
import SeriesSwiper from './components/Swiper'
import ScrollableSeriesRow from './components/ScrollableSeriesRow'
import RecentChapters from './components/RecentChapters/Container'
import { faker } from '@faker-js/faker';
import seriesData from './types/series'
import bannerData from './types/banner'
export default function Home() {
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
  function GenerateSeriesData(): seriesData{
    return{
      title: `${faker.word.adjective()} ${faker.word.noun()}`,
      description: faker.lorem.paragraph(),
      thumbnail: faker.image.url(),
      created_at: faker.date.past().toString(),
      updated_at: faker.date.past().toString(),
      URL: faker.internet.url(),
      i:undefined,
      latestChapters: null,
    }
  }
  const slidersDummyData = faker.helpers.multiple(GenerateBanner, {count: 5})
  const mostPopularDummyData = faker.helpers.multiple(GenerateSeriesData, {count: 15})
    const RecentlyAddedDummyData = faker.helpers.multiple(GenerateSeriesData, {count: 15})
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
      <ScrollableSeriesRow headerText='Most Popular' data={mostPopularDummyData} />
      <ScrollableSeriesRow headerText='Recently Added' data={RecentlyAddedDummyData} />
     <RecentChapters />
    </main>
    <Footer />
  </>
  
  )
}
