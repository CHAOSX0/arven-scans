'use client';

import Select from 'react-select'
import { useEffect, useRef, useState } from "react";

import DashboardNav from "@/app/dashboard/components/nav/nav";
import Link from "next/link";

import supabase from '../../../../../../../supabase';
import toast from 'react-hot-toast';
import { notFound } from 'next/navigation';
import Image from 'next/image';
export default function UserEdit({params: {id}}:{params: {id: string}}) {
  const [role, setRole] = useState<string>('authenticated')
  const [loading, setIsLoading]= useState<boolean>()
  useEffect(() => {
    console.log(id)
    supabase.from('admins').select('id').eq('id', id).then(res=>{
        console.log(res)
        if(res.data?.length){
            console.log(res, 'admin sup');
          (document.getElementById('type-select') as HTMLInputElement).value = 'admin'
            
        }
    })
    supabase.from('uploaders').select('id').eq('id', id).then(res=>{
        if(res.data?.length){
            (document.getElementById('type-select') as HTMLInputElement).value = 'uploader'
        }
    })

   
   
  }, [])

 async function HandelSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const value = (document.getElementById('type-select') as HTMLInputElement).value
    const is_admin = value == 'admin'
    const is_uploader = value == 'uploader'
    const is_auth = value == 'none'
     console.log(is_auth, is_admin, is_uploader)
    if(is_admin){
        const {error: deleteError} =await supabase.from("uploaders").delete().eq('id', id)
        const {error} =await supabase.from('admins').upsert({id: id})
        return
    }
    if(is_uploader){
       const {error: deleteError} =await  supabase.from("admins").delete().eq('id', id)
       const {error: insert} =await supabase.from('uploaders').upsert({id: id})
       return
    }
    if(is_auth){
        const {error: deleteError} =await supabase.from("uploaders").delete().eq('id', id)
        const {error} =await supabase.from("admins").delete().eq('id', id)
        return
    }

    toast.success('successfully updated user')
 }

  

  return (
    <>
      <main >
        <DashboardNav currentPage="content" />
        <section className="container-app p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h3 className="text-3xl font-bold tracking-tight">Edit Series</h3>
                <Link
                  className={`flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10 `}
                  href="/dashboard/"
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
                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                  </svg>
                  <span>Back</span>
                </Link>
              </div>
            </div>
           

            <form
              onSubmit={(e)=>{
                if(loading) return;
                setIsLoading(true)
                HandelSubmit(e).then(()=>{
                  setIsLoading(false)
                }).catch(()=>{
                 setIsLoading(false)
                })
              }}

              id="form-editor"

              className="flex flex-col gap-4"
            >
              <input
                hidden
              />
        
                <div className="flex w-full flex-col gap-3">
                  <label className="text-sm font-medium cursor-pointer max-w-fit">
                    Role
                  </label>
                  <select name="type" className="input select-input" id="type-select">
                  <option value='none'>
                    authenticated
                  </option>
                  <option value='uploader'>
                     uploader
                  </option>
                  <option value='admin'>
                    Admin
                  </option>
                  </select>
                </div>
                

             
              <button
                type="submit"
                className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
              >
                <span id="btn-text">Submit</span>
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
              <div className="self-end" />
            </form>
          </div>
          <link
            rel="preload"
            as="style"
            href="https://iimanga.com/build/assets/tom-select-8b662d47.css"
          />
          <link
            rel="preload"
            as="style"
            href="https://iimanga.com/build/assets/editor-38e6a907.css"
          />
          <link
            rel="modulepreload"
            href="https://iimanga.com/build/assets/manga-6daff483.js"
          />
          <link
            rel="modulepreload"
            href="https://iimanga.com/build/assets/tomSelect-5d20063c.js"
          />
          <link
            rel="stylesheet"
            href="https://iimanga.com/build/assets/tom-select-8b662d47.css"
          />
          <link
            rel="stylesheet"
            href="https://iimanga.com/build/assets/editor-38e6a907.css"
          />
        </section>
      </main>{" "}
      <div
        className="tox tox-silver-sink tox-tinymce-aux"
        style={{ position: "relative" }}
      />
    </>

  )
}