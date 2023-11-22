"use client";

import dynamic from "next/dynamic"
const ChapterList = dynamic(()=>import('./ChapterList'), {ssr: false, loading:()=>(<div>loading...</div>)})

import {useState} from 'react'
import SeriesComments from "./comments";
export default function SwitchContainer({seriesID}: {seriesID: string}){
    const [isComments, setIsComments ]= useState<boolean>(false)
    return (
        <>
        <div className="-mb-3 mt-4 flex gap-3">
        <button id="showChapters" className="tab-active px-3 py-3" onClick={()=>{setIsComments(false)}}>
          Chapters 
        </button>
        <button id="showInfo" className="px-3 py-3" onClick={()=>{setIsComments(true)}}>
          Comments 
        </button>
      </div>
      <hr className="h-px border-0 bg-gray-500 bg-opacity-10" />
       {
        isComments ? (
            <SeriesComments slug={seriesID} />
           
        ) : (
            <ChapterList slug={seriesID} />
        )
       }
      
        
      </>
    )
}