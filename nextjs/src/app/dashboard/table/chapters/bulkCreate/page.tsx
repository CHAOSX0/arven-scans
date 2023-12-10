"use client";

import DashboardNav from "@/app/dashboard/components/nav/nav";
import SearchSelect from "../../searchSelect";
import supabase from "../../../../../../supabase";
import React, { useEffect, useState } from "react";
import Dropzone from "dropzone";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function AddChapterPage() {
  const [isAttached, setIsAttached] = useState<boolean>(false)
  const [pages, setPages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const search = useSearchParams()
  const series= search.get('series')
  useEffect(() => {
    if(series){
      document.getElementById('')
    }
    if (document.getElementById('dropzone'), !document.getElementById('dropzone')?.getAttribute('isLoaded')) {

      let myDropzone = new Dropzone("div#dropzone", { url: "/api/upload-zip-file", addRemoveLinks: true, maxFiles:1, acceptedFiles:'.zip'});
      // myDropzone.on('')
      myDropzone.on('success', f => {
        if (!f.xhr) return;
        const url = JSON.parse(f.xhr.response)?.url
        console.log(url, 'zhr')
        setPages(prev => [...prev, url])
      })
      myDropzone.on("addedfile", file => {
        console.log(file, 'file')
        console.log(`File added: ${file.name}`);
      });
      document.getElementById('dropzone')?.setAttribute('isLoaded', 'true')
      // other code here
    }

  }, [])
  async function getSeries(): Promise<{ label: string, value: string }[]> {

    const { data, error } = await supabase.from('series').select()
    if (error) throw error;
    if (!data) return [];

    const res = data.map(e => ({ label: e.title, value: e.slug }))
    return res
  }
  async function Submit(e: React.SyntheticEvent) {

    e.preventDefault()
    const formData = new FormData((e?.target as HTMLFormElement));
    const formProps = Object.fromEntries(formData);
    if(!formProps.select) return toast.error("don't be acting dump out here, give me some series to work with man!!!")
    if(!pages.length) return toast.error(`i don't really think you understand what "bulk upload" means, you have to give me a zip file i ain't gonna translate the chapters for you`)
    console.log(formProps)
   console.log(pages)
    fetch('/api/add-bulk-chapters', {method: 'POST', body:JSON.stringify({
      series: formProps.select,
      file: pages[0]
    })})

  }
  return (
    <>
      <main>
        <DashboardNav currentPage="content" />
        <section className="container-app p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h3 className="text-3xl font-bold tracking-tight">
                  Add Bulk Chapters
                </h3>
                <a
                  className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
                  href="https://iimanga.com/dashboard/mangas/chapters"
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
                </a>
              </div>
            </div>
            <hr className="border-black/10 dark:border-white/10" />
            <form
              onSubmit={(e: React.SyntheticEvent) => {
                if (isLoading) return;
                Submit(e).then(() => {
                  setIsLoading(false)
                }).catch(() => {
                  setIsLoading(false)
                })
              }}
              className="flex flex-col gap-4"
              id="chapter-form"
            >
              <input
                type="hidden"

              />
           
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-3">
                  <label className="text-sm font-medium cursor-pointer max-w-fit">
                    Manga
                  </label>
                  <SearchSelect defaultValue={series || ''} isMulti={false} getValues={getSeries} />
                </div>
             
              </div>
              <div className="relative flex flex-col gap-3" id="images-upload">
                <label className="text-sm font-medium cursor-pointer max-w-fit">
                  Files
                </label>
                <div
                  id="dropzone"

                  className="input dropzone !border-[1px] !border-white/10 dz-clickable"
                >

                </div>
              </div>
              <button
                type="submit"
                className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white "
                id="submit-chapter"

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
            </form>
          </div>



        </section>
        <link href="https://unpkg.com/dropzone@6.0.0-beta.1/dist/dropzone.css" rel="stylesheet" type="text/css" />
      </main>{" "}

    </>

  )
}