'use client';
import Select from 'react-select'
import { useEffect, useRef, useState } from "react";

import DashboardNav from "@/app/dashboard/components/nav/nav";
import Link from "next/link";

import supabase from '../../../../../supabase';
import toast from 'react-hot-toast';
export default function SeriesAdd() {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [IconsPreLoaded, setIconsPreLoaded] = useState<{ favicon: string, auth: string }>({ favicon: '', auth: '' })
    useEffect(() => {
        supabase.from('settings').select('name, value').eq('type', 'site').then(res => {
            console.log(res.data)
            res.data?.forEach(e => {
                if (e.name == 'site-title') {
                    (document.getElementById('title') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'site-description') {
                    (document.getElementById('description') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'site-description') {
                    (document.getElementById('description') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'site-keywords') {
                    (document.getElementById('keywords') as HTMLInputElement).value = e.value
                    return
                }

                if (e.name == 'auth-cover') {
                    setIconsPreLoaded(prev => ({ ...prev, auth: e.value }))
                }
                if (e.name == 'favicon') {
                    setIconsPreLoaded(prev => ({ ...prev, favicon: e.value }))
                }

            })
        })

    }, [])
    async function HandelSubmit(e: React.SyntheticEvent) {

        e.preventDefault();
        const formData = new FormData((e?.target as HTMLFormElement));
        const formProps = Object.fromEntries(formData);
        console.log(formProps)
        console.log(isLoading)
        if (isLoading) return
        setIsLoading(true)
        //get values for all inputs in one line
        const { title, description, logo, keywords, auth_cover } = formProps
        const logoFile = logo as File
        const auth_File = auth_cover as File

        function upload(File: File, path: string) {
            return supabase.storage
                .from('settings')
                .upload(path, File, {
                    cacheControl: '3600',
                    upsert: true
                })
        }

        console.log(title, !title)
        if (!title) return toast.error('the title is required');
        if (!keywords) return toast.error('keywords are required');
        console.log()
        const logoPromise = logoFile?.size ? upload(logoFile, `favicon.${(logoFile as File).name.split('.').pop()}`) : null
        const auth_Promise = auth_File?.size ? upload(auth_File, `auth-cover.${((auth_File as File).name.split('.').pop())}`) : null


        if (logoPromise) {
            toast.promise(logoPromise, {
                loading: 'Uploading favicon...',
                success: 'favicon uploaded',
                error: 'Failed to upload favicon'
            })
        }
        if (auth_Promise) {
            toast.promise(auth_Promise, {
                loading: 'Uploading auth cover...',
                success: 'auth cover uploaded',
                error: 'Failed to upload auth cover'
            })
        }


        const logoURL = logoPromise ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/settings/${(await logoPromise).data?.path || ''}` : undefined
        const authURL = auth_Promise ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/settings/${(await auth_Promise).data?.path || ''}` : undefined
        if (logoURL) {
            setIconsPreLoaded(prev => {
                return { ...prev, favicon: `${logoURL}` }

            })
        }
        if (authURL) {
            setIconsPreLoaded(prev => ({ ...prev, auth: authURL }))
        }
        const { error: titleError } = await supabase.from('settings').update({ value: title }).eq('name', 'site-title')
        if (logoURL) {
            const { error: favError } = await supabase.from('settings').update({ value: logoURL}).eq('name', 'favicon')
           if(favError){
            toast.error('an error occurred')
           }
        }
        if (authURL) {
            const { error: authError } = await supabase.from('settings').update({ value: authURL }).eq('name', 'auth-cover')
            if(authError){
            toast.error('an error occurred')

            }
        }
        const { error: descriptionsError } = await supabase.from('settings').update({ value: description }).eq('name', 'site-description');
        const { error: keywordsError } = await supabase.from('settings').update({ value: keywords }).eq('name', 'site-keywords');
        if (titleError || descriptionsError || keywordsError) {

            toast.error('an error occurred')
        }


        setIsLoading(false)
       
        toast.success('settings updated successfully')
        return
    }
  
    // console.log(coverFile, 'cover')
    //  console.log(data, 'data')




return (
    <>
        <main >
            <DashboardNav currentPage="content" />
            <section className="container-app p-5">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <h3 className="text-3xl font-bold tracking-tight">Add New Series</h3>
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
                        onSubmit={(e) => {
                            setIsLoading(true)
                            HandelSubmit(e).then(() => {
                                setIsLoading(false)
                            }).catch(() => {
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
                                    Site Title
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

                        </div>



                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="description"
                                >
                                    Site Description
                                </label>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue=""
                                    placeholder="Site Description"
                                />
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="keywords"
                                >
                                    Site Keywords
                                </label>
                                <input
                                    id="keywords"
                                    name="keywords"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue=""
                                    placeholder="Site Keywords"
                                />
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-3">
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="logo"
                                >
                                    Site favicon
                                </label>
                                <input

                                    id="logo"
                                    name="logo"
                                    type="file"
                                    className="input add-input bg-[transparent]"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center justify-center rounded-md bg-black/10 p-3 dark:bg-white/10"><img src={IconsPreLoaded.favicon} alt="Preview" /></div>
                        </div>
                        <div className="flex w-full flex-col gap-3">

                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="Auth_cover"
                                >
                                    Auth Cover
                                </label>
                                <input
                                    id="Auth_cover"
                                    name="auth_cover"
                                    type="file"
                                    className="input add-input"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center justify-center rounded-md bg-black/10 p-3 dark:bg-white/10"><img src={IconsPreLoaded.auth} alt="Preview" /></div>
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