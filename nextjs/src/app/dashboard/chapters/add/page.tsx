"use client";

import DashboardNav from "../../components/nav/nav";
import Box from '@mui/material/Box';
import Field from "../../../components/Field";
import SelectMenu from "../../../components/SelectMenu";
import TextareaAutoSize from "../../../components/TextArea";
import NumberInput from "../../../components/numberInput";
import InputFileUpload from "../../../components/InputFileUpload";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import supabase from "../../../../../supabase";
import { useSearchParams, useRouter } from 'next/navigation';

export default function AddChapter() {
	const searchParams = useSearchParams()
	const seriesID = searchParams.get('series')
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
			if(seriesID){
				setSeries((await supabase.from('series').select('title').eq('id', seriesID))?.data?.[0]?.title || '')
			}
			const { data, error } = await supabase.from('series').select('title, slug')
			if (error) return toast.error('error fetching series')
			toast.success(data.length + ' series fetched')
			setSeriesList(data.map((series: { title: string, slug: string }) => series))
		})()

	}, [])
	async function HandelSubmit() {
		if (isLoading) return;
		setIsLoading(true)
		const number = (document.getElementById('number-input') as HTMLInputElement).value
		const pages = (document.getElementById('pages-input') as HTMLInputElement).files
		if (!number || !series || !pages) return toast.error('Please fill all the fields');
		const seriesSlug = seriesList.find(s => s.title == series)?.slug
		const pagesURLsPromise = Promise.all(Array.from(pages).map(async (page) => {
			const { data, error } = await supabase.storage.from('pages').upload(page.name, page, {
				cacheControl: '3600',
				upsert: true
			})
			if (error) return toast.error(`error uploading page ${error.message}`)
			return `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/pages/${data?.path}`
		}))
		toast.promise(pagesURLsPromise, {
			loading: 'uploading pages',
			success: 'pages uploaded successfully',
			error: 'error uploading pages'
		})
		const pagesURLs = await pagesURLsPromise
		const creatingPromise = supabase.from('chapters').insert({
			number: parseInt(number),
			seriesSlug: seriesSlug,
			pages: pagesURLs
		})
		const { error } = await creatingPromise
		if (error) return toast.error(`error creating chapter ${error.message}`)
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
						create Chapter
						<SendIcon />
					</Button>
				</div>

			</Box>
		</main>
	)
}