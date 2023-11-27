"use client"

// this component is a work around to run react hooks on the client, it does not render any actual content

import {useEffect} from 'react';
import supabase  from '../../../../../supabase'

//$ note: this approach is not safe is it allows users to infinitely increment views if local storage is deleted 
//$       a proper way of doing it would be by storing user id's in the db for each view, but that would present more challenges

export default function ViewCounter({chapterID, SeriesID}: {chapterID: string | undefined, SeriesID: number | null | undefined}) {
    function increment(bypass?: boolean){
        const key = `chapter-${chapterID}-view`
        const isViewed = bypass ? false : localStorage.getItem(key) == 'true'
        if(isViewed) return;
       fetch('/api/increment-chapter-views', {
        method: 'POST',
        body: JSON.stringify({
            SeriesID: SeriesID ,
            chapterID: chapterID
        })
       }).then(res=>{
        localStorage.setItem(key, 'true')
        console.log(res)
        res.text().then(text=>{
            console.log(text)
        })
      })
    }
    useEffect(()=>{
      increment()
    })
    return (
        <>
        
        </>
        )
}