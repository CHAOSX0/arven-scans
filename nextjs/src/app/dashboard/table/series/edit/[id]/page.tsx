'use client';
import Select from 'react-select'
import { useEffect, useRef, useState } from "react";

import DashboardNav from "@/app/dashboard/components/nav/nav";
import Link from "next/link";
import SelectMenu from "./selectMenu";
import supabase from '../../../../../../../supabase';
import toast from 'react-hot-toast';
import { notFound } from 'next/navigation';
import Image from 'next/image';
export default function SeriesEdit({params: {id}}:{params: {id: string}}) {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [genresOptionsData, setGenres] = useState<{ slug: string, text: string }[]>([])
  const [statuses, setStatuses] = useState<{ slug: string, text: string }[]>([])
  const [types, setTypes] = useState<{ slug: string, text: string }[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [Description, setDescription] = useState<string>('')
  const [selectedGenres, setSelectedGenres] = useState<any>([])
  const [preloadedCovers, setPreloadedCovers] = useState<{cover: string, banner: string} | undefined>()
  useEffect(() => {
    // @ts-ignore
    (global.tinymce as any).init({
      hidden_input: true,
      selector: '#editor',
      content_css: "/globals.css",
      plugins: 'textcolor tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
      toolbar: ' undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | link image media table mergetags  | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
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
          setDescription(text)

          editor.save();
        });
      },

    });
    supabase.from('types').select().then(res=>{
      if(res.error) return toast.error('an error occurred');
      console.log(res)
      setTypes(res.data)
    })
    supabase.from('statuses').select().then(res=>{
      if(res.error) return toast.error('an error occurred');
      console.log(res)
      setStatuses(res.data)
    })
    supabase.from('genres').select('slug, text').order('created_at').then(res => {
      if (res.error || !res.data) return;
      setGenres(res.data)
      
    })
    
    supabase.from('series').select('*').eq('id', parseInt(id)).then(res=>{
      if(res.error) notFound();
      const series = res.data[0];
      console.log(series);
      (document.getElementById('title') as HTMLInputElement).value = (series?.title || '');
      (document.getElementById('slug') as HTMLInputElement).value = (series?.slug || '');

      (document.getElementById('author') as HTMLInputElement).value = (series?.author || '');
      (document.getElementById('artist') as HTMLInputElement).value = (series?.artist || '');

      (document.getElementById('rate') as HTMLInputElement).value = (series?.ratting || '');
      (document.getElementById('releaseDate') as HTMLInputElement).value = (series?.releaseYear.toString() || '');
      (document.getElementById('alternative_titles') as HTMLInputElement).value = (series?.alternativeTitles || '');
      (document.getElementById('type-select') as HTMLInputElement).value = (series?.type || '');
      (document.getElementById('status-select') as HTMLInputElement).value = (series?.status || '');
       setSelectedGenres(series?.genres?.map((e: string)=>({label: e, value: e})))
      setDescription(series.description)
      setPreloadedCovers({cover: `${series?.coverURL}`, banner: series.BannerURL || undefined})
      
    })
   
  }, [])
  async function HandelSubmit(e: React.SyntheticEvent) {
    setErrors([])
    e.preventDefault();
    const formData = new FormData((e?.target as HTMLFormElement));
    const formProps = Object.fromEntries(formData);
    console.log({ ...formProps, Description })
    console.log(isLoading)
    if (isLoading) return
    setIsLoading(true)
    //get values for all inputs in one line
    const { title, slug, author, artist, ratting, releaseYear, alternative_titles: Alt, status, type, post_status, cover, banner, sliderOption } = formProps
    const bannerFile = banner as File
    const coverFile = cover as File
    const descr = Description;
    const isVisible = post_status == 'published' ? 'visible' : 'hidden'
    const isSlider = sliderOption
    const Type = type
    function upload(File: File, path: string) {
      return supabase.storage
        .from('covers')
        .upload(path, File, {
          cacheControl: '3600',
          upsert: true
        })
    }
    function addToErrors(text: string){
     console.log(title)
      setErrors(prev=>{
        const res = [...prev]
        res.push(text)
        console.log(res)
        return res
        
      })
      window.scrollTo(0, 0);
    }
    console.log(title, !title)
    if(!title) return addToErrors('the title is required');
    if(!slug)return addToErrors('the slug is required');
    if(isSlider == 'yes' && !bannerFile.size) return addToErrors("can't add series to slider without slider cover");
      console.log(coverFile.size)
     
     
      const coverPromise = coverFile?.size ? upload(coverFile, `${title}/cover-${(coverFile as File).name}`) : null
      const bannerPromise = bannerFile?.size ? upload(bannerFile, `${title}/banner-${bannerFile.name}`) : null

     
      if(coverPromise){
      toast.promise(coverPromise, {
        loading: 'Uploading cover...',
        success: 'Cover uploaded',
        error: 'Failed to upload cover'
      })
    }
      if (bannerPromise) {
        toast.promise(bannerPromise, {
          loading: 'Uploading banner...',
          success: 'Banner uploaded',
          error: 'Failed to upload banner'
        })
      }
     
    
      const coverURL = coverPromise ? `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/covers/${(await coverPromise).data?.path || ''}` : undefined
      const BannerURL = bannerPromise ? `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/covers/${(await bannerPromise).data?.path || ''}` : undefined
      if(coverURL){
        setPreloadedCovers(prev=>{
          if(prev){
            return {banner: prev?.banner, cover: `${coverURL}`}
          }
        })
      }
      const { data, error } = await supabase.from('series').update({
        title,
        URL: 'series/' + slug,
        updated_at: new Date(),
        description: descr,
        author: author ? author : undefined, 
        artist: artist ? artist : undefined,
        releaseYear: releaseYear || new Date().getFullYear(),
        type: Type,
        slug,
        ratting: ratting || 0,
        status,
        is_visible: isVisible == "hidden",
        alternativeTitles: Alt,
        isSlider: isSlider == 'yes',
        coverURL,
        BannerURL,
        genres: selectedGenres.map((e: {label: string, value: string})=>e.value) || ''
      }).eq('id', parseInt(id))
      if (error) {
        if(error.code ='23505'){
          addToErrors('series identifiers are duplicated ')
        }else{
          toast.error(error.message)
        }
        
        
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      toast.success('Series updated successfully')
      // console.log(coverFile, 'cover')
      //  console.log(data, 'data')
    
  }

  const genresOptions = genresOptionsData.map(e => ({ label: e.text, value: e.slug }))
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
            <hr className="border-black/10 dark:border-white/10" />
            <div className={`bg-transparent border-[1px] border-white/10 rounded-md p-4 mb-3 flex gap-3 items-center ${!errors || errors.length == 0? 'hidden' : 'hi'} `}>
              <svg
              onClick={()=>{
                setErrors([])
              }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <div>
                {errors?.map((r, key)=> <p className="text-sm" key={key}>{r}</p>)}
             
              </div>
            </div>

            <form
              onSubmit={(e)=>{
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input

                    id="title"
                    name="title"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                    autoComplete="off"
                    defaultValue=""
                    placeholder="Title"
                    required
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

                    id="slug"
                    name="slug"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                    autoComplete="off"
                    defaultValue=""
                    placeholder="Slug"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="tom-select-it"
                  id="input-tags-ts-label"
                >
                  Genres
                </label>
                <Select value={selectedGenres} onChange={(e)=>{
                  console.log(e)
                 setSelectedGenres(e)
                }} isMulti options={genresOptions} styles={{
                  menu: base => ({
                    ...base, zIndex: 9999, color: 'var(--text-color)', backgroundColor: 'var(--background)', "&:hover": {

                    }
                  }),
                  menuList: (base, state) => ({
                    ...base,
                    backgroundColor: '#222223',
                  }),
                  container: (base, props) => ({
                    ...base,
                    '&:hover': {

                    },
                    "&:focus": {
                      display: 'none'
                    }
                  }),
                  control: (base, state) => ({
                    ...base,
                    border: state.isFocused ? '1.5px solid var(--border-color)' : '1.5px solid var(--border-color)',
                    boxShadow: 'none',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background)',
                    "&:hover": {
                      backdropFilter: 'invert(70%)',
                      backgroundColor: 'var(--background)'
                    }
                  }),
                  multiValueLabel: base => ({
                    ...base,
                    color: 'var(--text-color)',
                  }),
                  multiValueRemove: base => ({
                    ...base,
                    padding: '0',
                    margin: '0',
                    '&:hover': {
                      color: 'var(--text-color)',
                      backgroundColor: 'transparent'
                    }
                  }),
                  indicatorsContainer: base => ({
                    ...base,
                    displat: 'none'
                  }),
                  option: base => ({
                    ...base,
                    backgroundColor: '#222223',
                    '&:focus': {

                      backgroundFilter: 'invert(70%)'

                    },
                    '&:hover': {
                      backgroundColor: '#495c68'
                    }
                  }),
                  multiValue: base => ({
                    ...base,
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    gap: '-2px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingRight: '5px',
                    paddingLeft: '5px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-color)',
                    margin: '5px'

                  })
                }} />
              </div>
              <label
                className="text-sm font-medium cursor-pointer max-w-fit"
                htmlFor="editor"
              >
                Description
              </label>
              <div className='gap-4 flex justify-between  [&>*:nth-child(2)]:max-w-[1050px] [&>*:nth-child(2)]:h-[500px] [&>*:nth-child(2)]:grow' style={{ flexWrap:'wrap'}}>
             
              <textarea id='editor'>

              </textarea>
              {
                preloadedCovers?.cover &&(
                  <div className='grow relative flex justify-center rounded-lg grow' style={{objectFit:'cover', minWidth:'150px', maxWidth:'350px', overflow:'hidden', height:'400px', alignItems:'center'}} >
                   <img className='rounded-lg' src={preloadedCovers.cover} style={{maxWidth:'120%', objectFit:'cover'}}/>
                   <input
                   className='input absolute left-0 top-0 h-full w-full cursor-pointer opacity-0'
                    id="cover"
                  name="cover"
                  type="file"/>
                  </div>
                )
              }
             </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="author"
                  >
                    Author
                  </label>
                  <input

                    id="author"
                    name="author"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"

                    autoComplete="off"
                    defaultValue=""
                    placeholder="Author"
                  />
                </div>
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="artist"
                  >
                    Artist
                  </label>
                  <input
                    id="artist"
                    name="artist"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                    autoComplete="off"
                    defaultValue=""
                    placeholder="Artist"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="rate"
                >
                  Rate
                </label>
                <input
                  id="rate"
                  name="rate"
                  type="number"

                  className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                  autoComplete="off"
                  step="0.1"
                  defaultValue={0}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="alternative_titles"
                  >
                    Alternative Titles
                  </label>
                  <input
                    id="alternative_titles"
                    name="alternative_titles"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                    autoComplete="off"
                    defaultValue=""
                    placeholder="Alternative Titles"
                  />
                </div>
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="releaseDate"
                  >
                    Released Year
                  </label>
                  <input
                    id="releaseDate"
                    name="releaseDate"
                    type="text"
                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                    autoComplete="off"
                    defaultValue=""
                    placeholder="Released Year"
                  />
                </div>
              </div>
             
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex w-full flex-col gap-3">
                  <label className="text-sm font-medium cursor-pointer max-w-fit">
                    Type
                  </label>
                  <select name="type" className="input select-input" id="type-select">
                   {types.map((o, i)=><option  key={i} className="option" value={o.slug}>{o.text}</option>)}
                  </select>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <label className="text-sm font-medium cursor-pointer max-w-fit">
                    Status
                  </label>
                  <select name="status" className="input select-input" id="status-select">
                   {statuses.map((o, i)=><option  key={i} className="option" value={o.slug}>{o.text}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <label className="text-sm font-medium cursor-pointer max-w-fit">
                  Post Status
                </label>
                <select name="post_status" className="input select-input">
                  <option className="option" value="publish">
                    {" "}
                    Published
                  </option>
                  <option className="option" value="private">
                    {" "}
                    Private
                  </option>
                </select>
              </div>
              <div className="flex w-full flex-col gap-3">
                <label className="text-sm font-medium cursor-pointer max-w-fit">
                  Add to slider
                </label>
                <select name="slider_option" className="input select-input">
                  <option className="option" value={0}>
                    {" "}
                    No
                  </option>
                  <option className="option" value={1}>
                    {" "}
                    Yes
                  </option>
                </select>
              </div>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="slider_cover"
                >
                  Slider Cover
                </label>
                <input
                  id="slider_cover"
                  name="slider_cover"
                  type="file"
                  className="input add-input"
                  autoComplete="off"
                />
              </div>
              {
                preloadedCovers?.banner && 
                  (
                    <div className="bg-input mt-2 w-fit rounded-md p-3" id="slider-wrapper">
                      <img className="max-w-1/3 h-full object-contain" src={preloadedCovers.banner} alt="slider" />
                    </div>
                  )
                
              }
             
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