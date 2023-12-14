"use client";

import Link from "next/link";
import Image from "next/image";
import supabase from "../../../supabase";
import { useState } from "react";

export default function Ad({ identifier, is_horizontal, isDefault,isScript, code, bannerURL, id , URL}: { is_horizontal: boolean, isDefault: boolean, isScript: boolean, code: string, bannerURL: string, id: number, identifier: string, URL: string}) {
    let style: React.CSSProperties = { zIndex: 999, overflow: 'hidden', margin:'0 auto' }
    const width = is_horizontal ? '728px' : '90px';
    const height = is_horizontal ? '90px' : '728px';
    const [isLoading, setIsLoading] = useState<boolean>(false)
    if (identifier == 'float-top') {
      //$horizontal top
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        float: 'right',
        zIndex: 999,
         top: 0,
        width: width,
        position:'fixed',
  
        height: height,
      }
    }
    if (identifier == 'float-bottom') {
      //$horizontal bottom
      style = {
        left: '50%',
        transform: 'translateX(-50%)',
        float: 'right',
        zIndex: 999,
        bottom: 0,
        width: width,
        position:'fixed',
  
        height: height,
      }
    }
    if (identifier == 'float-right') {
      //$vertical right
      style = {
        top: '50%',
        transform: 'translateY(-50%)',
        float: 'right',
        zIndex: 999,
        right: 0,
        width: width,
        height: height,
        position:'fixed',
  
      }
    }
    if (identifier == 'float-left') {
      //$ vertical left
      style = {
        top: '50%',
        transform: 'translateY(-50%)',
        float: 'right',
        zIndex: 999,
        position:'fixed',
        left: 0,
        width: width,
        height: height,
      }
    }
    const content = isScript ? <div dangerouslySetInnerHTML={{__html: code}}></div> : (<div className="relative w-full h-full">
    <Link href={URL} onClick={()=>{
        if(isLoading) return;
        setIsLoading(true)
        supabase.rpc('increment', {table_name:'ads', x: 1, row_id: id, field_name: 'clicks'}).then(res=>{
            setIsLoading(false)
        })
    }}>
      <Image src={bannerURL} fill sizes='728' alt='' />
    </Link>
  </div>)
  
    return (
      <div
        className={` bg-[green] `}
        
        style={{ ...style, overflow: 'hidden', width:width, height: height}}>
        {content}
      </div>
    )
  }
  