"use client";

import chapter from "@/app/types/chapter"
import { useRouter } from "next/navigation";
export default function({AllChapters, data}: {AllChapters: chapter[]| null, data: chapter|null}){
    const router = useRouter()
    return (
        <select onChange={(e)=>{
            router.push(window.location.pathname.split('/').slice(0, 3).join('/') + '/' + e.target.value)
        }} style={{backgroundColor:'transparent', border:'2px solid grey', padding: '10px', borderRadius:'10px' }} name="type" value={AllChapters?.find(chapter=>chapter.number == data?.number)?.number} className="input w-full" id="chapter-select">
           {AllChapters?.map((chapter) => (<option key={chapter.number} style={{backgroundColor:'black'}} className="option" value={chapter.number} > {chapter.number} </option>))}
    </select>
    )
}