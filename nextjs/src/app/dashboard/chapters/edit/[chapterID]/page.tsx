"use client";

import DashboardNav from "../../../components/nav/nav";
import Box from '@mui/material/Box';
import Field from "../../../../components/Field";
import SelectMenu from "../../../../components/SelectMenu";
import TextareaAutoSize from "../../../../components/TextArea";
import NumberInput from "../../../../components/numberInput";
import InputFileUpload from "../../../../components/InputFileUpload";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import supabase from "../../../../../../supabase";
import { useRouter } from "next/navigation";

export default function AddChapter({params}: {params: {chapterID: string}}) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [seriesList, setSeriesList] = useState<{ title: string, slug: string }[]>([]);
    const [series, setSeries] = useState<string>('');
    const router = useRouter()
    useEffect(() => {
        supabase.auth.getSession().then(res=>{
        
            supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((res)=>{
             if((res?.data?.length == 0)){
                 router.back()
             }
            })
           });
        (async () => {
            const { data, error } = await supabase.from('series').select('title, slug')
            if (error) return toast.error('error fetching series')
            toast.success(data.length + ' series fetched')
            setSeriesList(data.map((series: { title: string, slug: string }) => series))
            const {data: chapterData, error: chapterError} = await supabase.from('chapters').select('*').eq('id', params.chapterID)
            if(chapterError) return toast.error('error fetching chapter');
            (document.getElementById('number-input') as HTMLInputElement).value = chapterData[0].number
            setSeries(chapterData[0].seriesSlug)
            console.log(chapterData)
        })()

    }, [])
    async function HandelSubmit() {
        if (isLoading) return;
        setIsLoading(true)
        const number = (document.getElementById('number-input') as HTMLInputElement).value
        const pages = (document.getElementById('pages-input') as HTMLInputElement).files
        if (!number || !series) return toast.error('Please fill all the fields');
        const seriesSlug = seriesList.find(s => s.title == series)?.slug
      let pagesURLs;
        if(pages){
            const pagesURLsPromise = Promise.all(Array.from(pages).map(async (page) => {
                const { data, error } = await supabase.storage.from('pages').upload(`${series}-${number}-${page.name}`, page, {
                    cacheControl: '3600',
                    upsert: true
                })
                if (error) return toast.error(`error uploading page ${error.message}`)
            return `http://localhost:8000/storage/v1/object/public/pages/${data?.path}`
        }))
        toast.promise(pagesURLsPromise, {
            loading: 'uploading pages',
            success: 'pages uploaded successfully',
            error: 'error uploading pages'
        })
        pagesURLs = await pagesURLsPromise
        }
    
            
    
        const creatingPromise = supabase.from('chapters').update({
            id: params.chapterID,
            number: parseInt(number),
            seriesSlug: seriesSlug,
            pages: pages? pagesURLs : undefined
        }).eq('id', params.chapterID)
        const { error } = await creatingPromise
        if (error) return toast.error(`error updating chapter ${error.message}`)
        toast.success('updated chapter successfully')
    }
    return (
        <main>
            <DashboardNav currentPage="" />
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    HandelSubmit().then(() => {
                        setIsLoading(false)
                    })
                    console.log('submit')
                    e.preventDefault()
                }}
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                className='p-8 bg-[transparent] ] flex-col flex gap-10 justify-center items-center'
                noValidate
                autoComplete="off"
            >
                <div style={{ width: '100%' }} className='w-full text-3xl text-center'><span>Enter Chapter Data</span></div>
                <div className='gap-10 flex flex-col' style={{ width: '90%', maxWidth: '600px' }}>

                    <div>
                        <NumberInput id='number-input' />
                    </div>
                    <div>
                        <SelectMenu
                            setValue={setSeries}
                            value={series}
                            isMultiple={false}
                            id="series-input"
                            label='Series'
                            options={seriesList.map(series => series.title)} />
                    </div>
                </div>
                <div className="w-full flex">
                    <InputFileUpload multiple label="choose pages" id="pages-input" />
                </div>
                <div className='w-full flex justify-center' style={{ width: '100%' }}>
                    <Button className='flex gap-1 rounded-lg' type='submit' sx={{ fontFamily: 'Poppins', textTransform: 'none' }} variant='contained'>
                        update Chapter
                        <SendIcon />
                    </Button>
                </div>

            </Box>
        </main>
    )
}