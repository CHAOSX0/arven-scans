"use client";

import {useState, useEffect} from 'react'
import series from '@/app/types/series'
export default function Bookmark({data}: {data: series}){
    const [isClicked, setIsClicked] = useState(false)
    function getStorage(): Array<series> | undefined{
        const rawData: string | null = localStorage.getItem('bookmarks')
        if(rawData){
            return JSON.parse(rawData)
        }
       
    }
    function getSeries(series: string): series | undefined{
        const data = getStorage()
        if(data && data.length > 0){
            const res = data.filter((e)=>e.slug== series)[0]
            console.log(res)
          return res
        }
    }

    function removeSeries(series: string): true | false{
        const data = getStorage()
        const index = data?.findIndex(s=> s.slug== series)
        console.log(index, 'index')
        console.log(data, 'data')
        if(data){
            if(index !== -1 && index !== undefined){
                console.log('trying to remove')
                data?.splice(index, 1)
                console.log(data)
                localStorage.setItem('bookmarks', JSON.stringify(data))
                return true
            }else{
                console.log(index)
                console.log('no index')
                return false
        }
    }else{
        console.log('no data')
        return false
    }
}

    function addSeries(series: series){
        const data = getStorage() || []
        data.push(series)
        console.log(series)
        localStorage.setItem('bookmarks', JSON.stringify(data))
    }
    function bookmark(series: series, setIsClicked: any){
       if(getSeries(series.slug)){
         console.log('already clicked')
         removeSeries(series.slug)
         setIsClicked(false)
       }else{
        console.log('not already clicked')
        addSeries(series)
        setIsClicked(true)
       }
    }
    useEffect(()=>{
        const series = getSeries(data.slug)
        if(series){
         setIsClicked(true)
        }
    }, [])
    const color = isClicked ? '#2f2f2f' : '#01d9b9'
    console.log('rerendeer')
    console.log(color)
return (

    <button
    onClick={(e)=>{bookmark(data, setIsClicked)}}
    style={{backgroundColor:  color}} data-id={JSON.stringify(isClicked)}
                    type="submit"
                    id="submitBtn"
                    className="mb-2 flex h-12 w-full items-center justify-center gap-1 rounded-full bg-red-500 px-4 py-4 text-sm text-white transition-all duration-150 hover:bg-red-600 active:scale-95 sm:h-full sm:rounded-md sm:py-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                    </svg>
                    <span className="hidden sm:inline-block" id="btnText">
                      Add to Favorites
                    </span>
                  </button>
   
)
}