"use client";

import { useState } from "react";
import supabase from "../../../../../../supabase";
import DashboardNav from "@/app/dashboard/components/nav/nav";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TypesAdd(){
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<{name: string, slug: string }>({name: '', slug: ''})
    //$ e is the form submit event at line: 45
    async function Submit(e: React.SyntheticEvent): Promise<void>{
      e.preventDefault()
      const {error} = await supabase.from('types').insert({text: formData.name, slug: formData.slug}) 
      if(error){
        toast.error(error.message)
        return
      }
      toast.success('successfully created type')
      
    }

    function onChange(e: React.SyntheticEvent){
     
    const Name = (e.target as HTMLInputElement).name == 'title'
    const value =  (e.target as HTMLInputElement).value
    if(Name){
      setFormData({name: value, slug: value.replace(/[^a-z0-9]/gi, '')})
    }else{
      setFormData(prev=>({...prev, slug:value.replace(/[^a-z0-9]/gi, '') }))
    }
    }
    return (
        <main>
 <DashboardNav currentPage="content"/>
  <section className="container-app  p-5">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h3 className="text-3xl font-bold tracking-tight">Add New type</h3>
          <Link
            className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
            href="/dashboard/table/types"
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
      <hr className="border-black/10 dark:border-white/10" />
      <form
        onSubmit={(e)=>{
            if(isLoading) return;
            Submit(e).then(()=>{
                setIsLoading(false)
            }).catch(()=>{
                setIsLoading(false)
            })
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="hidden"
         
        />
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="title"
          >
            Name
          </label>
          <input
           value={formData.name}
            onChange={onChange}
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            id="title"
            name="title"
            type="text"
           
            autoComplete="off"
            placeholder="Genre Name"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="slug"
          >
            Slug
          </label>
          <input
           value={formData.slug}

            onChange={onChange}
            id="slug"
            name="slug"
            type="text"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            placeholder="Genre Slug"
          />
        </div>
        <button
          type="submit"
          className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
        >
          <span id="btn-text">Submit</span>
          <span
            id="btn-loader"
            className={`${isLoading ? '' : 'hidden'} h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </span>
        </button>
      </form>
    </div>
  </section>
</main>

    )
}