"use client";

import { useEffect, useState } from "react";
import supabase from "../../../../../../../supabase";

export default function EditAdForum({ initialData }: { initialData: { name: string, type: string, URL: string, identifier: string, status: string, code: string, id: number } }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [code, setCode] = useState<string>('')
  const [Type, setType] = useState<string>(initialData.type)
  useEffect(() => {
    // @ts-ignore
    (global.tinymce as any).init({
      hidden_input: true,
      selector: '#script',
      placeholder: 'hi',
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
          console.log('hi')
          const text = editor.getContent()
          setCode(text)

          editor.save();
        });
      },

    });
    // @ts-ignore
    global.tinymce.activeEditor.setContent(initialData.code);
  }, [])
  async function Submit(e: React.SyntheticEvent, id: number) {
    e.preventDefault()
    const formData = new FormData((e?.target as HTMLFormElement))
    const formProps = Object.fromEntries(formData)
    console.log(formProps)
    console.log(code)
   
    if (!formProps.name) return alert('name is required');
    if (!formProps.identifier) return alert('identifier is required');
    const bannerURL = (formProps.image as File).size ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${(await supabase.storage.from('covers').upload(
      `${(formProps.identifier as string).replace(' ', '-')}/banner.${(formProps.image as File).name.split('.').pop()}`,
      formProps.image as File, {
      upsert: true
    }
    )).data?.path}` : undefined

    console.log(formProps)
    const { error } = await supabase.from('ads').update({
       name: formProps.name,
       identifier: formProps.identifier,
       code,
       bannerURL,
       URL: formProps.link, 
       type: formProps.type, 
       status: formProps.is_active == '1' ? 'active' : 'disabled',
      
       }).eq('id', id)

    if (error) {
      console.log(error)
      alert('an error occurred')
      return
    }
    alert('successfully updated ad')


  }
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        if (isLoading) return;
        Submit(e, initialData.id).then(() => {
          setIsLoading(false)
        }).catch(() => {
          setIsLoading(false)
        })
      }}
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
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue={initialData.name}
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
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue={initialData.identifier}
            placeholder="Ad Identifier"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <label className="text-sm font-medium cursor-pointer max-w-fit">
          Type
        </label>
        <select
          onChange={(e) => {
            setType(e.target.value)
            console.log(Type)
          }} value={Type} name="type" className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg" id="ad-type">
          <option className="option" value='banner' >
            {" "}
            Banner
          </option>
          <option className="option" value="script">
            {" "}
            Script
          </option>
        </select>
      </div>
      <div id="ad-banner" className={`flex flex-col gap-4 ${Type == 'script' && 'hidden'}`}>
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="image"
          >
            Image
          </label>
          <input
            style={{ border: '1.5px solid var(--border-color)' }}
            id="image"
            name="image"
            type="file"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
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
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue={initialData.URL}
            placeholder="Ad Link"
          />
        </div>
      </div>
      <div id="ad-script" className={`${Type == 'banner' && 'hidden'}`}>
        <div className="flex flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="script"
          >
            Code / Script
          </label>
          <textarea
            id="script"
            className="input"
            name="script"
            defaultValue={initialData.code}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <label className="text-sm font-medium cursor-pointer max-w-fit">
          Status
        </label>
        <select defaultValue={initialData.status == 'active' ? 1 : 0} name="is_active" className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg">
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
        <span id="btn-text">Update</span>
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
  )
}