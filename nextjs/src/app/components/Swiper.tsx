"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState, DOMAttributes }  from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import bannerData from '../types/banner';
import { fa, faker } from '@faker-js/faker';
import { register } from 'swiper/element/bundle';
import Link from 'next/link';

register();
function SLide({BannerURL, title, description, genres, type, URL, index}: bannerData): JSX.Element{
  function Genre({text, URL}: {text: string, URL: string}): JSX.Element {
    return (
      <a
      href={`/SeriesList?genre=${text}`}
      className="inline-block rounded-md border-[1px] border-white/10 bg-white px-2 py-1 text-xs font-light text-black shadow-sm transition hover:bg-black hover:text-white dark:bg-black dark:text-white dark:shadow-none dark:hover:bg-white dark:hover:text-black sm:px-4 sm:py-2"
    >
      {text}
    </a>
    )
  }
  const GenresElements = genres.map((genre) => <Genre key={genre.text} {...genre} />)
 return(
  <swiper-slide 
  style={{width:'100%', display: 'block'}}
  class="swiper-slide"
>
  <figure className="relative" style={{overflow:'hidden', height:'100%'}}>
    <div style={{paddingBottom: '10px'}} className="absolute -bottom-[10px] left-0 h-1/2 w-full bg-gradient-to-b from-transparent to-white transition dark:to-[#121212]" />
    <img
       style={{objectFit:'cover', width:'100%'}}
      className="min-h-[45vh] w-full object-cover md:h-[75vh] lazyloaded"
      data-src={BannerURL}
      alt={title}
      src={BannerURL}
    />
    <div className="absolute bottom-0 z-50 flex flex-col gap-3 px-5 py-5 sm:px-10 lg:py-16 xl:px-32">
      <div className="flex flex-col">
        <p className="mx-1 text-xs capitalize leading-[1rem] text-white text-opacity-60">
          {type}
        </p>
        <h2 className="text-xl font-semibold text-white drop-shadow-sm sm:text-3xl lg:text-5xl">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-1">
        {GenresElements}
      </div>
      <p
        className="text-xs text-white md:w-2/3 md:text-sm"
        style={{ textShadow: "1px 1px 9px rgba(0,0,0,1)" }}
      >
        {description}
      </p>
      <div className="mt-3 flex flex-row gap-3">
        <Link
          href={URL}
          className="flex items-center gap-2 rounded-md bg-blue-500 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 lg:px-14 lg:py-5"
        >
          <svg
            width={48}
            height={48}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 h-5 w-5"
          >
            <path d="M19.778 3.579a.6.6 0 0 1 .124.668L13.113 19.52a.6.6 0 0 1-1.1-.008l-2.45-5.719-5.72-2.45a.6.6 0 0 1-.007-1.1L19.11 3.455a.6.6 0 0 1 .667.124h.001Z" />
          </svg>
          <span>Read now</span>
        </Link>
     
      </div>
    </div>
  </figure>
</swiper-slide>
 )
}
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['swiper-container']: CustomElement<any>;
      ['swiper-slide']: CustomElement<any>;
    }
  }
}
export default function SeriesSwiper({data}: {data: bannerData[]}): JSX.Element{
  
    const sliders = data.map((slide, i) => <SLide key={slide.title} {...slide} index={i}/>)
  return (
    <>
      
       {sliders.length && <swiper-container
          id="home-slider"
          slideClass="swiper-slide"
          slides-per-view={1}
          centeredSlides={false}
          loop= {true}
        
        >
        
         {sliders}
  </swiper-container>}
  </>
    
  );
}   