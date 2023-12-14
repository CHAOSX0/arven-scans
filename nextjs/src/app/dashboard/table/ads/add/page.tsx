"use client";

import DashboardNav from "@/app/dashboard/components/nav/nav";
import { useEffect, useState } from 'react'
import supabase from "../../../../../../supabase";
import Link from "next/link";

export default function AddAd() {
  const [type, setType] = useState<string>('banner')
  const [code, setCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  useEffect(() => {
    // @ts-ignore
    (global.tinymce as any).init({
      hidden_input: true,
      selector: '#script',
      content_css: "/globals.css",
      plugins: 'textcol anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ',
      toolbar: ' undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | link image media table | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
      ],
      // @ts-ignore,
      setup: function (editor) {
        editor.on('change', function () {
          const text = editor.getContent()
          setCode(text)

          editor.save();
        });
      },

    });
  }, [])
  async function Submit(e: React.SyntheticEvent) {
    e.preventDefault();
    const formData = new FormData((e?.target as HTMLFormElement));
    const formProps = Object.fromEntries(formData);
   console.log(formProps)
    if(!(formProps.image as File).size && type == 'banner') return alert('banner must have image');
    if(!formProps.identifier) return alert('identifier required');
    if(!code && type == 'script') return alert('script code is required');
    if(!formProps.name) return alert('name is required');
    const imageURL = (formProps.image as File).size? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${(await supabase.storage.from('covers').upload(
      `${(formProps.identifier as string).replace(' ', '-')}/banner.${(formProps.image as File).name.split('.').pop()}`,
       formProps.image as File,{
        upsert: true
       }
 )).data?.path}` : undefined

 console.log(imageURL)
    const {error} = await supabase.from('ads').upsert({
      URL: formProps.link || null,
      name: formProps.name,
      identifier: formProps.identifier,
      status: formProps.is_active == '1'? 'active' : 'disabled',
      type:formProps.type,
      clicks: 0,
      bannerURL: imageURL || undefined
    })
    if(error){
      alert(error.message)
    }
  }
  return (
    <main>
      <DashboardNav currentPage="settings" />
      <section className="container-app p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h3 className="text-3xl font-bold tracking-tight">Add New Ad</h3>
              <Link
                className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
                href="/dashboard/table/ads"
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
            onSubmit={(e) => {
              if (isLoading) return;
              Submit(e).then(() => {
                setIsLoading(false)
              }).catch(() => {
                setIsLoading(false)
              })
            }}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <input
              type="hidden"

            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input  bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                  autoComplete="off"
                  placeholder="Ad Name"
                />
              </div>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="identifier"
                >
                  Identifier
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  className="input  bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                  autoComplete="off"
                  placeholder="Ad Identifier"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <label className="text-sm font-medium cursor-pointer max-w-fit">
                Type
              </label>
              <select value={type} onChange={(e) => {
                setType(e.target.value)

              }} name="type" className="input  bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg" id="ad-type">
                <option className="option" value="banner">
                  {" "}
                  Banner
                </option>
                <option className="option" value="script">
                  {" "}
                  Script
                </option>
              </select>
            </div>
            <div id="ad-banner" className={`flex flex-col gap-4 ${type == 'script' && 'hidden'}`}>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="image"
                >
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  style={{ border: '1.5px solid var(--border-color)' }}
                  className="input px-3 py-2 rounded-lg"
                  autoComplete="off"
                />
              </div>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="link"
                >
                  Link
                </label>
                <input
                  id="link"
                  name="link"
                  type="text"
                  className="input  bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                  autoComplete="off"
                  placeholder="Ad Link"
                />
              </div>
            </div>
            <div id="ad-script" className={`${type == 'banner' && 'hidden'}`}>
              <div className="flex flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="script"
                >
                  Code / Script
                </label>
                <textarea id='script'>

                </textarea>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <label className="text-sm font-medium cursor-pointer max-w-fit">
                Status
              </label>
              <select name="is_active" className="input  bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg">
                <option className="option" value={1}>
                  {" "}
                  Active
                </option>
                <option className="option" value={0}>
                  {" "}
                  Disabled
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
          </form>
        </div>
      </section>
    </main>

  )
}