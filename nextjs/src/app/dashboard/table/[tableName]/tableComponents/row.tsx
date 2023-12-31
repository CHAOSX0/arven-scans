"use client";

import { useEffect, useRef, useState } from "react"
import supabase from "../../../../../../supabase";


function Field ({text, column, id}: {text: string, column: string, id: string}){
  const is_timeStamp = column == 'created_at'
  
  const [textValue, setText] = useState<string>(is_timeStamp ? new Date(text).toLocaleDateString() : `${text}`)
    const is_role = column == 'role'
    
  useEffect(()=>{
    if(is_role){
      supabase.from('admins').select('id').eq('id', id).then(res=>{
        if(res.data?.length){
          setText('admin')
          return
        }
        supabase.from('uploaders').select('id').eq('id', id).then(res=>{
          if(res.data?.length){
            setText('uploader')
            return
          }
        })
      })
    }
  })
return  (<td className="pl-4 py-2 text-sm font-medium">{textValue}</td>)
}
export default function Row({values, id, tableName, data, onToggleModal}: {values: {key: string, prop: string}[], id: number, tableName: string, data: any, onToggleModal: (tableName: string, left: number, top: number, id: number, slug: string)=>void}){
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [top, setTop] = useState(0)
    const [left, setLeft]= useState(0)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const omittedColumns = ['author', 'authorAvatar', 'time', 'pages', 'view', 'coverURL', 'BannerURL', 'URL', 'genres', 'isSlider', 'is_visible', 'artist', 'ratting', 'updated_at', 'viewCount', 'alternativeTitles', 'deleted_at', 'phone', 'last_sign_in_at', 'is_sso_user']
    const deepColumns = {"raw_user_meta_data": 'username'}
    //@ts-ignore
    const fields = Object.keys(data).filter(c=>!omittedColumns.includes(c)).map(e=>e).map((c, i)=><Field id={data.id} text={deepColumns[c] ? data[c][deepColumns[c]] : data[c]} column={c} key={i}/>)
      return (
          <tr
         
           className="transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10  h-5 h-max-5 relative" style={{overflow:'visible', clear:'both'}}>
           {fields}
          <td className="px-5" style={{overflow:'visible'}}>
            <button
            
              onClick={(e)=>{
              onToggleModal(tableName, e.clientX || 0, e.clientY || 0,  id, data?.slug)
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
            </button>
           
          </td>
        </tr>
      )
  }