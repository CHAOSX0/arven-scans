'use client'

import { useState } from "react"

export default function Column({text, setData}: {text: string, setData: Function}){
  const timeCols = ['created_at']
  const numberCols = ['votes', 'views', 'number', 'id', 'view']
  //$ is ass refers to is ascending but couldn't pass the chance to have ass in my code ngl
  const [isAss, setIsAss] = useState<boolean>(false)
    return (
        <th
        onClick={()=>{
          
            setData((prev: any[])=>{
              const res  = [...prev]
              res.sort((a, b) => {
                const A_value = timeCols.includes(text) ? new Date(a?.[text]).getTime() : numberCols.includes(text)? parseInt(a?.[text]) : a?.[text]
                const B_value = timeCols.includes(text) ? new Date(b?.[text]).getTime() : numberCols.includes(text)? parseInt(b?.[text]) : b?.[text]
                console.log(A_value, B_value)
                //see? perfect naming could have wrote this in a one liner probably but its gonna be way to annoying to read
                if(isAss){
                  setIsAss(false)
                  return !timeCols.includes(text) && !numberCols.includes(text) ? A_value?.localeCompare(B_value) : A_value - B_value 
                }else{
                  setIsAss(true)
                  return !timeCols.includes(text) && !numberCols.includes(text) ? B_value?.localeCompare(A_value) : B_value - A_value 
                }
                
              })
              return res
            })
          
        }}
        scope="col"
        className="text-left pl-4 py-2 text-[13px] text-sm font-medium text-black text-opacity-60 dark:text-white"
      >
        <div className="group flex cursor-pointer items-center gap-1">
          <span>{text}</span>
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
    )
}