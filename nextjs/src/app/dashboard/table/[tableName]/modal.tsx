"use client";
import { useState } from "react"
import Link from "next/link"

function LinkElement({href, text}: {href: string, text: string}){
    return (
        <Link
        className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
       href={href}
        >
            {text}
        </Link>
    )
}
export default function Modal({onDelete, links, isOpen, position}: {onDelete:Function, links: {text:string, href: string}[], isOpen: boolean,position: {left: number, top: number}}){
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const LinksElements = links.map((l: {text: string, href: string}, i: number)=><LinkElement href={l.href} text={l.text}></LinkElement>)
    return (
        <div className={`dropdown-menu absolute top-[${position.top}px]  left-[${position.left}px] z-20  min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10 bg-white p-2 text-sm dark:border-white/10 dark:bg-[#09090b] ${isOpen ? '':  'hidden' }`} style={{top:position.top, left: position.left -200}}>
        <div className="flex flex-col px-0 pt-0">
         
          <a
            className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
            data-toggle="delete"
          
           onClick={()=>{
            if(isLoading) return;
            setIsLoading(true)
            onDelete().then(()=>{
             setIsLoading(false)
            }).catch(()=>{
                setIsLoading(false)
            })
        }}
          >
          
            Delete
          </a>
          {LinksElements}
 {/*
          {tableName == 'series' &&(
            <>
            
           
             <Link
          className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
          data-toggle="Chapters"
          data-id={25}
          href={`/dashboard/chapters?series=${data.slug}`}
        >
          {" "}
          Chapters{" "}
        </Link>
        <a
          className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
          data-toggle="New Chapter"
         
          href={`/dashboard/chapters/add?series=${data.slug}`}
        >
          {" "}
          New Chapter{" "}
        </a>
        <a
          className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
          data-toggle="Buld Upload"
          
          href={`/dashboard/chapters/bulkCreate?series=${id}`}
        >
          {" "}
          Buld Upload{" "}
        </a>
        <a
          className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
          data-toggle="Edit"
          data-id={25}
          href={`/dashboard/series/edit/${id}`}
        >
          {" "}
          Edit{" "}
        </a>
          
            </>
          ) }
            */}

        </div>
      </div>
    )
}