import seriesData from "@/app/types/series";
import Card from "./card";
import { faker } from "@faker-js/faker";
export default function RecentChapters(){
  function createRandomUser(): seriesData {
    return {
     title: `${faker.word.adjective()} ${faker.word.noun()}`,
     description: faker.lorem.paragraph(),
    thumbnail: faker.image.url(),
    created_at: faker.date.past().toString(),
    updated_at: faker.date.past().toString(),
    URL: faker.internet.url(),
    i:undefined,
    latestChapters: faker.helpers.multiple(()=>{
      return {
        created_at: faker.date.past().toString(),
        number: faker.number.int(100),
        URL: faker.internet.url()
      }
    }, {
      count:2
    })
    };
  }
  const recentChaptersDummyData = faker.helpers.multiple(createRandomUser, {
    count: 5,
  });
  const data = recentChaptersDummyData
  const Elements = data.map((series, i) => <Card key={i} {...series} i={i} />)
    return(
        <section>
        <div className="flex items-center justify-between">
          <h2 className="my-3 text-lg font-bold">Recent Chapters</h2>
          <a href="https://iimanga.com/manga">
            <span className="text-xs text-gray-400 transition hover:text-gray-300">
              View More
            </span>
          </a>
        </div>
        <div className="xlg:grid-cols-8 grid grid-cols-3 gap-[10px] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Elements}
      </div>
        <div className="mb-5 mt-5 flex justify-end">
          <nav className="flex items-center gap-5">
            <h3 className="hidden sm:block"> Page 1 of 2 </h3>
            <ul className="pagination flex gap-1">
              <li
                className="pagination-link pagination-disabled"
                aria-disabled="true"
                aria-label="« Previous"
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
              </li>
              <li
                className="pagination-link pagination-active"
                aria-current="page"
              >
                <span>1</span>
              </li>
              <li
                className="pagination-link"
             //   onclick="window.location.href='http://iimanga.com?page=2'"
              >
                2
              </li>
              <li
                className="pagination-link"
               // onclick="window.location.href='http://iimanga.com?page=2'"
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
              </li>
            </ul>
          </nav>
        </div>
      </section>
    )
}