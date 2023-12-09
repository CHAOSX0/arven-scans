"use client";

import { Box } from "@mui/material"
import Field from "../components/Field"
import SelectMenu from "../components/SelectMenu"
import React, {useState, useEffect} from 'react';
import {toast} from 'react-hot-toast'
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import supabase from "../../../supabase";
import Card from "./card";
import { useSearchParams } from 'next/navigation'

type options = {
  text: string,
  slug: string,
}[]
function GenreOption({text, slug, isChecked}: {text: string, slug: string, isChecked: boolean}){
  return (
    <div className="flex items-center gap-2">
              <label className="cursor-pointer text-[--text-color]" htmlFor={slug}>
                {text}
              </label>
              <input
              defaultChecked={isChecked}
             
              style={{border:"1.5px solid var(--border-color)"}}
                id={slug}
                type="checkbox"
                name="genre[]"
                defaultValue={slug}
                className="input"
              />
            </div>
  )
}
function Option({value, text}:{value: string, text: string}){
  return (
    <option style={{border:"1.5px solid var(--border-color)"}} className="bg-[var(--background)] focus:bg-[var(--background)]" value={value}>{text}</option>
  )
}
export default function SeriesListForum({statusesOptions, typesOptions, genresOptions, Submit, genre}: {statusesOptions: options, typesOptions: options, genresOptions: options, Submit: (e: React.SyntheticEvent<Element, Event>) => Promise<void>, genre: string | null} ){
    const statusesOptionsElements = statusesOptions.map((O, i)=>(<Option text={O.text} value={O.slug} key={i}/>));
    const genresOptionsElements = genresOptions.map((O, i)=>(<GenreOption isChecked={O.slug == genre}  {...O} key={i}/>));
    const typesOptionsElements = typesOptions.map((O, i)=>(<Option text={O.text} value={O.slug} key={i}/>));
    const [isLoading, setIsLoading] = useState<boolean>(false)
    return(
      <form className="mb-4" onSubmit={(e)=>{
         if(isLoading) return;
         Submit(e).then(()=>{
             setIsLoading(false)
         }).catch(()=>{
          setIsLoading(false)
      })
      }}>
      <div className="mb-2 flex sm:mb-4">
        <div className="mb-4 w-full md:mb-0 md:w-full">
          <div className="flex w-full flex-col gap-3">
            <label
              className="text-sm font-medium cursor-pointer max-w-fit text-[--text-color]"
              htmlFor="title"
            >
              Title
            </label>
            <input
              style={{backgroundColor:'transparent', border:"1.5px solid var(--border-color)", color:'white'}}
              id="title"
              name="title"
              type="text"
              className="input bg-[transparent] py-2 px-2 !focus:outline-none border rounded-lg"
              autoComplete="off"
              placeholder="Search for content..."
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex w-full gap-3">
          <div className="mb-4 w-full md:mb-0">
            <div className="flex flex-col gap-3">
              <label
                className="text-sm font-medium cursor-pointer max-w-fit text-[--text-color]"
                htmlFor="type"
              >
                Type
              </label>
              <select style={{border:"1.5px solid var(--border-color)"}} id="type" className="input bg-[transparent] py-2 px-2 !focus:outline-none border rounded-lg" name="type">
                <option value=""  className="bg-[var(--background)] focus:bg-[var(--background)]" >All Types</option>
                {typesOptionsElements}
              </select>
            </div>
          </div>
          <div className="mb-4 w-full md:mb-0">
            <div className="flex flex-col gap-3">
              <label
                className="text-sm font-medium cursor-pointer max-w-fit text-[--text-color]"
                htmlFor="status"
              >
                Status
              </label>
              <select style={{border:"1.5px solid var(--border-color)"}} id="status" className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg" name="status">
                <option value=""  className="bg-[var(--background)] focus:bg-[var(--background)]" >All Status</option>
               {statusesOptionsElements}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-1 w-full md:w-1/2">
          <label className="text-sm font-medium cursor-pointer max-w-fit mb-3 block text-[--text-color]">
            Genres
          </label>
          <div className="grid max-h-[200px] grid-cols-2 justify-between gap-2 overflow-x-auto px-2 py-0">
            {genresOptionsElements}
         </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
        >
          <span id="btn-text">Search</span>
          <span
            id="btn-loader"

            className="hidden h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </span>
        </button>
      </div>
    </form>
    )
}