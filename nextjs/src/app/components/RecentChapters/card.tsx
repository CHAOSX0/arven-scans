import seriesData from '../../types/series'
function Chapter({created_at, number, URL}: {created_at: string, number: number, URL: string}){
    function getTimeAgo(date: string){
        const timeAgo = new Date(date).getTime();
        const timeNow = new Date().getTime();
        const timeDifference = timeNow - timeAgo;
        const timeDifferenceInSeconds = timeDifference / 1000;
        const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
        const timeDifferenceInHours = timeDifferenceInMinutes / 60;
        const timeDifferenceInDays = timeDifferenceInHours / 24;
        const timeDifferenceInMonths = timeDifferenceInDays / 30;
        const timeDifferenceInYears = timeDifferenceInMonths / 12;
        if(timeDifferenceInSeconds < 60)return `${Math.floor(timeDifferenceInSeconds)}s`;
        if(timeDifferenceInMinutes < 60)return `${Math.floor(timeDifferenceInMinutes)}m`;
        if(timeDifferenceInHours  <  24)return `${Math.floor(timeDifferenceInHours)}h`;
        if(timeDifferenceInDays  <   30)return `${Math.floor(timeDifferenceInDays)}d`;
        if(timeDifferenceInMonths  < 12)return `${Math.floor(timeDifferenceInMonths)}mo`
        if(timeDifferenceInYears    > 1)return `${Math.floor(timeDifferenceInYears)}y`;
    }
return (
    <div className="mb-1 flex items-center justify-between text-sm">
            <a
              style={{border: '1.5px solid var(--border-color)'}}
              className="boder-black/10 w-fit rounded-md border-[1px] bg-transparent px-3 py-1 text-center text-xs transition hover:bg-[--background] hover:text-[-text-color] dark:border-white/10 dark:text-[--text-color] dark:hover:bg-[--text-color] dark:hover:text-[--background-color]"
              href={URL}
            >
              <span className="hidden sm:inline-block text-[--text-color]">Chapter</span>
              <span className="sm:hidden text-[--text-color]">Chp</span>
              <b className='text-[--text-color]'>{number}</b>
            </a>
            <span className="text-xs text-gray-500 dark:text-gray-300 sm:block text-[--text-color]">
              {getTimeAgo(created_at)} ago
            </span>
          </div>
)
}
export default function Card({URL, title, created_at, coverURL, description, latestChapters, i}: seriesData){
    const chapters = latestChapters?.map((chapter) => <Chapter key={chapter.number} {...chapter} />)
    return (
        <div className="flex flex-col gap-2">
        <div className="rounded-lg" id="card-real">
          <a href={URL}>
            <figure className="group relative">
              <div className="absolute bottom-0 left-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-black/50 transition" />
              <img
                className="h-56 w-full rounded-lg object-cover dark:shadow-none sm:h-64 ls-is-cached lazyloaded"
                data-src={coverURL}
                alt="Crimson Eternity"
                src={coverURL}
              />
              <div className="absolute bottom-0 p-4">
                <p className="group-hover:hidden text-xs capitalize leading-[1rem] text-[--text-color] text-opacity-60" />
                <h2 className="text-sm font-semibold text-white group-hover:hidden">
                  {title}
                </h2>
              </div>
              <div className="absolute bottom-0 p-2 md:p-4">
                <div className="group-hover:scale-y-100 group-hover:opacity-100 flex scale-y-50 flex-col gap-2 text-xs font-medium text-white opacity-0 transition">
                  <h2 className="text-sm font-semibold text-white">
                    {title}
                  </h2>
                  <p>
                    {description}
                  </p>
                </div>
              </div>
            </figure>
          </a>
        </div>
        <div className="flex flex-col">
         {chapters}
        </div>
      </div>
    )
}