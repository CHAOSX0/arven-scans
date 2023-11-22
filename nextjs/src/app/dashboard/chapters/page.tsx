"use client";

import Nav from "@/app/components/Nav";
import DashboardNav from "../components/nav/nav";
import seriesData from "@/app/types/series";
import supabase from "../../../../supabase";
import Link from "next/link";
import { TextField } from "@mui/material";
import Field from "@/app/components/Field";
import chapter from "@/app/types/chapter";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from 'next/navigation'

async function getChapters(series: string | null){
const {error, data} = series ? await supabase.from('chapters').select('*').limit(100).eq('seriesSlug', series) : await supabase.from('chapters').select('*').limit(100)
if(error) throw error;
console.log(data)
return data
}

async function getChaptersNumber(series: string | null): Promise<number>{
    const {error, data, count} = series ? await supabase.from('chapters').select('*', {count: 'exact', head: true}).eq('seriesSlug', series) :  await supabase.from('chapters').select('*', {count: 'exact', head: true})
    if (error) throw error;
    console.log(data)
   // return data[0].count
   return count || 0
}
function Row({id, seriesSlug, number, setChaptersNumber, setChaptersData}: {id: number, seriesSlug: string, number: number, setChaptersNumber: Function, setChaptersData: Function}){
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [top, setTop] = useState<number>(0)
    const [left, setLeft] = useState<number>(0)
    return (
        <tr className="transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 " style={{overflow:'visible'}}>
        <td className="pl-4 py-2 text-sm font-medium">{id}</td>
        <td className="pl-4 py-2 text-sm font-medium">{seriesSlug}</td>
        <td className="pl-4 py-2 text-sm font-medium">{number}</td>
        <td className="pl-4 py-2 text-sm font-medium">admin</td>
        <td className="pl-4 py-2 text-sm font-medium">0</td>
        <td className="px-5" style={{overflow:'visible'}}>
          <a
              onClick={(e)=>{
              
                setLeft((e.target as HTMLAnchorElement).offsetLeft)
                setTop((e.target as HTMLAnchorElement).offsetTop)
                setIsOpen(prev=>!prev)
              }}
            className="group inline-block cursor-pointer"
            data-toggle="dropdown"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-3 w-3 h-6 w-6 rounded-sm transition"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </a>
          <div className={` ml-[-100px] absolute dropdown-menu absolute z-20  min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10 bg-white p-1 text-sm dark:border-white/10 dark:bg-[#09090b]  ${isOpen ? ' hidden'  :' '}`}>
            <div className="flex flex-col px-0 pt-0">
             <Link 
                href={`/dashboard/chapters/edit/${id}`}
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
             >
                edit
             </Link>
             <a
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
               onClick={async ()=>{
                const promise = supabase.from('chapters').delete().eq('id', id)
                toast.promise(promise as any, {
                  loading: 'deleting',
                  error:'failed to delete',
                  success:'deleted successfully'
                })
                const {error} = await promise
                console.error(error)
                if(!error){
                 setChaptersData((prev: chapter[])=>{
                  const index = prev.findIndex((s: chapter)=> s.id == id)
                  const res = [...prev].splice( index, 1)
                  return res
                 })
                 setChaptersNumber((prev: number)=>prev-1)
                }
               }}
             >
               Delete
             </a>
            </div>
          </div>
        </td>
      </tr>
    )
}
export default  function DashboardSeriesPage(){
    const searchParams = useSearchParams()
    const router = useRouter()
    const series = searchParams.get('series')
    const [ChaptersData, setChaptersData] = useState<chapter[]>([])
    const [ChaptersNumber, setChaptersNumber] = useState<number>(NaN)

    async function HandelChange(){
      const filterTitle = (document.getElementById('filter-input') as HTMLInputElement).value
      if(filterTitle){
        const SeriesPromise = supabase.from('chapters').select('*', {count:"exact"}).textSearch('seriesSlug', filterTitle).limit(100)
     
          const {data, error, count} = await SeriesPromise
        
          if(error){
            alert('opps! an error occurred')
         
          }
          setChaptersData([...data || []])
          console.log(count)
          setChaptersNumber(count || 0 )
      
    }
}
   
    useEffect(()=>{
      supabase.auth.getSession().then(res=>{
        
       supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((res)=>{
        if((res?.data?.length == 0)){
            router.back()
        }
       })
      })
        getChapters(series).then((res)=>{
          setChaptersData(res)
        })
        getChaptersNumber(series).then(res=>{
            setChaptersNumber(res)
        })
    }, [])
   
    console.log(ChaptersNumber)
    const rows = ChaptersData.map((chapter, i) => <Row key={i} {...chapter} setChaptersData={setChaptersData} setChaptersNumber={setChaptersNumber} />) 
    return (
        <main>
        <DashboardNav currentPage="chapters" />
  <section className="container-app pl-5">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-3xl font-bold tracking-tight">Chapters List</h3>
        <p className="text-gray-500 dark:text-white dark:text-opacity-50">
          {" "}
          Take control of your chapters from this page.{" "}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center">
        <div className="mb-7">

         
        <Field sx={{ flexGrow: 1, height:'20px' }}
           
           onChange={HandelChange}
           InputLabelProps={{ style: { color: 'white '} }}
           id="filter-input" 
           label="filter..." 
           variant="outlined" />
             </div>
        <Link
          className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
          href="/dashboard/chapters/add"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Add new</span>
        </Link>
      </div>
      <div className="boder-black/10 overflow-hidden overflow-x-auto rounded-md border-[1px] dark:border-white/10">
        <table className="min-w-full">
          <thead className="bg-transparent">
            <tr className="border-b-[1px] border-black/10 dark:border-white/10">
              <th
                scope="col"
                className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
              >
                <div className="group flex cursor-pointer items-center gap-1">
                  <span>#</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
              <th
                scope="col"
                className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
              >
                <div className="group flex cursor-pointer items-center gap-1">
                  <span>Series</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
              <th
                scope="col"
                className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
              >
                <div className="group flex cursor-pointer items-center gap-1">
                  <span>Chapter number</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
              <th
                scope="col"
                className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
              >
                <div className="group flex cursor-pointer items-center gap-1">
                  <span>Uploader</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
              <th
                scope="col"
                className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
              >
                <div className="group flex cursor-pointer items-center gap-1">
                  <span>Views</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                </div>
              </th>
             
            
            </tr>
          </thead>
          <tbody className="divide-y-[1px] divide-black/10 dark:divide-white/10">
            {rows}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <nav className="flex items-center gap-5">
          <h3 className="hidden sm:block"> Page 1 of {Math.ceil(ChaptersNumber / 100)} </h3>
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
    </div>
  </section>
</main>

    )
}