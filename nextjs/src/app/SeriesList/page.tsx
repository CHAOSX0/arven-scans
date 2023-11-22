"use client";

import Nav from "../components/Nav"
import SeriesListForum from "./forum";
import seriesData from "../types/series"


export default function SeriesList(){
    return (
        <div>
           <Nav />
           <main className="container mx-auto px-3 sm:px-0 md:px-0">
            <SeriesListForum />
  
  <div className="mb-5 mt-5 flex justify-end">
   
  </div>
</main>

        </div>
    )
}