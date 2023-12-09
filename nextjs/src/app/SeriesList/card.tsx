import seriesData from "../types/series"

export default function Card({title, URL, type, coverURL}:{title: string, URL: string, type: string, coverURL: string}){

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