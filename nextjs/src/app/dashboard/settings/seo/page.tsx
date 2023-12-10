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
        supabase.from('settings').select('name, value').eq('type', 'seo').then(res => {
            console.log(res.data)
            res.data?.forEach(e => {
                if (e.name == 'seo-manga-description') {
                    (document.getElementById('manga-description') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'seo-manga-title') {
                    (document.getElementById('manga-title') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'seo-chapter-title') {
                    (document.getElementById('chapter-title') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'seo-chapter-description') {
                    (document.getElementById('chapter-description') as HTMLInputElement).value = e.value
                    return
                }

                if (e.name == 'seo-seriesList-title') {
                    (document.getElementById('mangas-title') as HTMLInputElement).value = e.value
                    return
                }
                if (e.name == 'seo-seriesList-description') {
                    (document.getElementById('mangas-description') as HTMLInputElement).value = e.value
                    return
                }

            })
        })

    }, [])
    async function HandelSubmit(e: React.SyntheticEvent) {

        e.preventDefault();
        const formData = new FormData((e?.target as HTMLFormElement));
        const formProps = Object.fromEntries(formData);
        console.log(formProps)
        const { mangas_description, chapter_title, chapter_description, manga_title, mangas_title, manga_description } = formProps
       /* if (!manga_description asS).length || !chapter_title || !chapter_description || !manga_title || !manga_title || mangas_description) {
            toast.error("all values must not be empty")
            console.log(manga_description)
            console.log(chapter_title)
            console.log(chapter_description)
            console.log(manga_title)
            console.log(mangas_title)
            console.log(manga_description)
            

        }*/

        const { error: mangas_descriptionError } = await supabase.from('settings').update({ value: mangas_description || '' }).eq('name', 'seo-seriesList-description');
        const { error: chapter_titleError } = await supabase.from('settings').update({ value: chapter_title || '' }).eq('name', 'seo-chapter-title');
        const { error: chapter_descriptionError } = await supabase.from('settings').update({ value: chapter_description || '' }).eq('name', 'seo-chapter-description');
        const { error: manga_titleError } = await supabase.from('settings').update({ value: manga_title || '' }).eq('name', 'seo-manga-title');
        const { error: mangas_titleError } = await supabase.from('settings').update({ value: mangas_title || '' }).eq('name', 'seo-seriesList-title');
        const { error: manga_descriptionError } = await supabase.from('settings').update({ value: manga_description || ''}).eq('name', 'seo-manga-description');
        if(mangas_descriptionError || chapter_titleError || chapter_descriptionError ||  manga_titleError ||mangas_titleError ||  manga_descriptionError){
            toast.error('an error occurred')
        }
        toast.success('updated settings successfully')




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
                                <h3 className="text-3xl font-bold tracking-tight">Edit SEO Settings</h3>
                            </div>
                        </div>
                        <hr className="border-black/10 dark:border-white/10" />
                        <form
                            onSubmit={(e) => {
                                if (isLoading) return;
                                setIsLoading(true)
                                HandelSubmit(e).then(() => {
                                    setIsLoading(false)
                                }).catch(() => {
                                    setIsLoading(false)
                                })
                            }}
                            className="flex flex-col gap-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                defaultValue="OXCNnepsrsGQ84tw8mAKQfp5qLklDp9y17uTDJoB"
                            />
                            <input type="hidden" name="_method" defaultValue="PUT" />
                            <div className="rounded-md border-[1px] border-black/10 bg-transparent px-6 py-3 dark:border-white/10">
                                <h2 className="font-semibold">Single Manga SEO</h2>
                                <span className="text-sm text-black !text-opacity-60 dark:text-white">
                                    Use :title as a placeholder for the real manga title
                                </span>
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="manga-title"
                                >
                                    Manga Title
                                </label>
                                <input
                                    id="manga-title"
                                    name="manga_title"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="Manga :title"
                                />
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="manga-description"
                                >
                                    Manga Description
                                </label>
                                <input
                                    id="manga-description"
                                    name="manga_description"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="manga :title translated , :title translated , all chapters of :title translated"
                                />
                            </div>
                            <div className="mt-2 rounded-md border-[1px] border-black/10 bg-transparent px-6 py-3 dark:border-white/10">
                                <h2 className="font-semibold">Single Chapter SEO</h2>
                                <span className="text-sm text-black !text-opacity-60 dark:text-white">
                                    Use :manga as a placeholder for the real manga title and :chapter for
                                    chapter number
                                </span>
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="chapter-title"
                                >
                                    Chapter Title
                                </label>
                                <input
                                    id="chapter-title"
                                    name="chapter_title"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="Manga :manga - Chapter :chapter"
                                />
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="chapter-description"
                                >
                                    Chapter Description
                                </label>
                                <input
                                    id="chapter-description"
                                    name="chapter_description"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="manga :manga translated , :manga translated , all chapters of :manga translated, chapter :chapter translated , :chapter translated"
                                />
                            </div>
                            <div className="mt-2 rounded-md border-[1px] border-black/10 bg-transparent px-6 py-3 dark:border-white/10">
                                <h2 className="font-semibold">Manga List SEO</h2>
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="mangas-title"
                                >
                                    Manga List Title
                                </label>
                                <input
                                    id="mangas-title"
                                    name="mangas_title"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="Mangas List"
                                />
                            </div>
                            <div className="flex w-full flex-col gap-3">
                                <label
                                    className="text-sm font-medium cursor-pointer max-w-fit"
                                    htmlFor="mangas-description"
                                >
                                    Manga List Description
                                </label>
                                <input
                                    id="mangas-description"
                                    name="mangas_description"
                                    type="text"
                                    className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
                                    autoComplete="off"
                                    defaultValue="Mangas List"
                                />
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
                    </div>
                </section>

            </main>{" "}
            <div
                className="tox tox-silver-sink tox-tinymce-aux"
                style={{ position: "relative" }}
            />
        </>

    )
}