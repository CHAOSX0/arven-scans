"use client";

import React, { DOMAttributes, useEffect }  from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Link from 'next/link';
import seriesData from '../types/series';
import { register } from 'swiper/element/bundle';
import Image from 'next/image';
register();
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['swiper-container']: CustomElement<any>;
      ['swiper-slide']: CustomElement<any>;
    }
  }
}
function Card({title, description, coverURL, URL, latestChapters, i}: seriesData): JSX.Element{
  
    return(
        <swiper-slide
         class="manga-slide"
         style={{width:'175px', display: 'block'}}
      >
        <div  className="rounded-lg" id="card-real">
          <Link href={URL}>
            <div className="group relative">
              <div className="absolute bottom-0 left-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-black/50 transition" />
              <div style={{aspectRatio:1/1.41}}>
              <Image 
                 
                className="h-56 w-full rounded-lg object-cover dark:shadow-none sm:h-64 lazyloaded"
               src={coverURL} fill alt={title}/>
               </div>
            
              <div className="absolute bottom-0 p-4">
                <p className="group-hover:hidden text-xs capitalize leading-[1rem] text-white text-opacity-60" />
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
            </div>
          </Link>
        </div>
      </swiper-slide>
    )
}
export default function ScrollableSeriesRow({headerText, data}: {headerText: string, data: seriesData[]}) {
  
const cards = data.map((series, i) => <Card key={i} {...series} i={i} />)
return (
    <section style={{marginTop:'-5px'}}>
    <div className="flex items-center justify-between">
      <h2 className="my-3 text-lg font-bold">{headerText}</h2>
      <Link href="/SeriesList">
        <span className="text-xs text-gray-400 transition hover:text-gray-300">
          View More
        </span>
      </Link>
    </div>
    {cards.length &&
    <swiper-container
    //slidesPerView={0}
      slides-per-View='auto'
     // centeredSlides={false}
      slide-class="manga-slide"
      space-between={10}
      id={`${headerText.split(' ').join('-').toLowerCase()}-swiper`}
      //loop={true}
      class="max-h-lg cards-container pb-7 swiper-initialized swiper-horizontal"
      style={{   width:'100%', display: 'block'}}
    >
    
      {cards}
    </swiper-container>
    }
  </section>
);
}