"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import InputFileUpload from '../../../../components/InputFileUpload';
import NumberInput from '../../../../components/numberInput';
import SelectMenu from '../../../../components/SelectMenu';
import TextareaAutoSize from '../../../../components/TextArea';
import Field from '../../../../components/Field';
import supabase from '../../../../../../supabase';
import { toast } from 'react-hot-toast';
import {useEffect} from 'react';
import seriesData from '@/app/types/series';
import { useRouter } from 'next/navigation';

export default function Forum({params:{seriesID}}: {params: {seriesID: string} }) {
  const [genresOptions, setGenresOptions] = React.useState<string[]>([]);
  const router = useRouter()
 
  console.log(genresOptions, 'data')
  //I know this a stupid approach but I am too lazy to do it the right way
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [genres, setGenres] = React.useState<string[]>([]);
  const [type, setType] = React.useState<string>('');
  const [status, setStatus] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = React.useState<string | null>(null);
  const [isSlider, setIsSlider] = React.useState<string | null>(null);
  const [descDef, setDescDef] = React.useState<string>('e')
  const [releaseDef, setReleaseDef] = React.useState<string>('1999')
  const [rattingDef, setRattingDef] = React.useState<string>('0')
  useEffect( () => {
    supabase.auth.getSession().then(res=>{
        
      supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((res)=>{
       if((res?.data?.length == 0)){
           router.back()
       }
      })
     })
    supabase.from('series').select().eq('id', seriesID).then((res: any) =>{
        const series = res.data[0]
        setGenres(series.genres)
        setStatus(series.status)
        setType(series.type)
        setIsVisible(series.is_visible ? 'Visible' : 'hiddens');
        setIsSlider(series.isSlider ? 'on' : 'off');
        setDescDef(series.description)
        setReleaseDef(series.releaseYear.toString())
        setRattingDef(series.ratting.toString())
        console.log(series);
        (document.getElementById('title-input') as HTMLInputElement).value = series.title;
        (document.getElementById('slug-input') as HTMLInputElement).value =  series.slug;
        (document.getElementById('author-input') as HTMLInputElement).value = series.author;
        (document.getElementById('artist-input') as HTMLInputElement).value = series.artist;
        (document.getElementById('descr-input') as HTMLInputElement).value = series.description;
        (document.getElementById('ratting-input') as HTMLInputElement).defaultValue = series.ratting.toString();
        (document.getElementById('releaseYear-input') as HTMLInputElement).value = series.releaseYear;
        (document.getElementById('Alt-input') as HTMLInputElement).value = series.alternativeTitles;
        (document.getElementById('type-input') as HTMLInputElement).value = series.type;
    })
    supabase.from('genres').select().then(({data, error}) => {
      console.log(error)
      if(error) return toast.error('error fetching genres');
      console.log(data)
      toast.success(data.length + ' genres fetched')
      setGenresOptions(data.map((genre) => genre.text))

    
    })

    
  }, []);
  async function HandelSubmit() {
    if (isLoading) return
    setIsLoading(true)
    //get values for all inputs in one line
    const title = (document.getElementById('title-input') as HTMLInputElement).value
    const slug = (document.getElementById('slug-input') as HTMLInputElement).value
    const author = (document.getElementById('author-input') as HTMLInputElement).value
    const artist = (document.getElementById('artist-input') as HTMLInputElement).value
    const descr = (document.getElementById('descr-input') as HTMLInputElement).value
    const ratting = parseInt((document.getElementById('ratting-input') as HTMLInputElement).value)
    const releaseYear = parseInt((document.getElementById('releaseYear-input') as HTMLInputElement).value)
    const coverFile = (document.getElementById('cover-up') as HTMLInputElement).files?.[0]
    const bannerFile = (document.getElementById('banner-up') as HTMLInputElement).files?.[0]
    const Alt = (document.getElementById('Alt-input') as HTMLInputElement).value
    const Type = (document.getElementById('type-input') as HTMLInputElement).value
    function upload(File: File, path: string) {
      return supabase.storage
        .from('covers')
        .upload(path, File, {
          cacheControl: '3600',
          upsert: true
        })
    }
    if(!title || !slug || !descr  || !status || !isVisible || !isSlider) return toast.error('Please fill all the fields');
    if (coverFile) {
      const coverPromise = upload(coverFile, `${title}/cover-${coverFile.name}`)
      const bannerPromise = bannerFile ? upload(bannerFile, `${title}/banner-${bannerFile.name}`) : null
      toast.promise(coverPromise, {
        loading: 'Uploading cover...',
        success: 'Cover uploaded',
        error: 'Failed to upload cover'
      })
      if (bannerPromise) {
        toast.promise(bannerPromise, {
          loading: 'Uploading banner...',
          success: 'Banner uploaded',
          error: 'Failed to upload banner'
        })
      }
      const { data: coverData, error: CoverError } = await coverPromise
      if (CoverError) {
        toast.error(CoverError.message)
        setIsLoading(false)
        return
      }
      const coverURL = `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/covers/${coverData.path}`
      const BannerURL = bannerPromise ? `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/covers/${(await bannerPromise).data?.path || ''}` : undefined
      const { data, error } = await supabase.from('series').update({
        title,
        URL: 'series/' + slug,
        created_at: new Date(),
        updated_at: null,
        description: descr,
        author,
        artist,
        releaseYear: releaseYear == 1999? undefined : releaseYear,
        type: Type,
        slug,
        ratting: ratting == 0 ? undefined : ratting,
        status,
        is_visible: isVisible == "hidden",
        alternativeTitles: Alt,
        isSlider: isSlider == 'on',
        coverURL,
        BannerURL,
        genres
      }).eq('id', seriesID)
      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      toast.success('Series updated successfully')

      // console.log(coverFile, 'cover')
      //  console.log(data, 'data')
    }else{
      const bannerPromise = bannerFile ? upload(bannerFile, `${title}/banner-${bannerFile.name}`) : null
      if (bannerPromise) {
        toast.promise(bannerPromise, {
          loading: 'Uploading banner...',
          success: 'Banner uploaded',
          error: 'Failed to upload banner'
        })
      }
      const BannerURL = bannerPromise ? `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/covers/${(await bannerPromise).data?.path || ''}` : undefined
      const { data, error } = await supabase.from('series').update({
        title,
        URL: 'series/' + slug,
        created_at: new Date(),
        updated_at: null,
        description: descr,
        author,
        artist,
        BannerURL,
        releaseYear: releaseYear == 1999? undefined : releaseYear,
        type: Type,
        slug,
        ratting: ratting == 0? undefined : ratting,
        status,
        is_visible: isVisible == "hidden",
        alternativeTitles: Alt,
        isSlider: isSlider == 'on',
        genres
      }).eq('id', seriesID)
      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      toast.success('Series updated successfully')
    }
  }
  return (
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
      <div style={{ width: '100%' }} className='w-full text-3xl text-center'><span>Enter Series Data</span></div>
      <div className='gap-10 flex flex-col' style={{ width: '90%', maxWidth: '600px' }}>
        <div className='flex gap-4 justify-center'>
          <Field
           required sx={{ flexGrow: 1 }} 
           InputLabelProps={{ style: { color: 'white ' } }}
           id="title-input" 
           label="Title" 
           defaultValue="i"
           variant="outlined" />
          <Field 
           name='slug' 
           sx={{ flexGrow: 1 }} 
           InputLabelProps={{ style: { color: 'white ' } }} 
           id="slug-input" 
           label="URL slug" 
           defaultValue='1'
           variant="outlined" />
        </div>
        <div className='flex justify-center w-full'>
          <Field
           name='Alt'
           defaultValue='2'
           sx={{ flexGrow: 1 }}
           InputLabelProps={{ style: { color: 'white ' } }}
           id="Alt-input"
           label="Alternative Titles"
           variant="outlined" />
        </div>
        <div className='w-full flex'>
          <SelectMenu 
          setValue={setGenres} 
          value={genres} 
          isMultiple={true} 
          id="genres-input" 
          label='Genres' 
          options={genresOptions} />
        </div>
        <div className='w-full flex'>
          <SelectMenu 
          setValue={setType} 
          value={type} 
          isMultiple={false}
          id="type-input" 
          label='Type' 
          options={['Manhwa', 'Manhua', 'Manga']} />
        </div>
        <div>
          <TextareaAutoSize id="descr-input" value={descDef} setValue={setDescDef}/>
        </div>
        <div className='flex gap-4 justify-center'>
          <Field 
          defaultValue='0'
          sx={{ flexGrow: 1 }} 
          InputLabelProps={{ style: { color: 'white ' } }} 
          id="author-input" 
          label="Author" 
          variant="outlined" />
          <Field 
          defaultValue='1'
          sx={{ flexGrow: 1 }} 
          InputLabelProps={{ style: { color: 'white ' } }} 
          id="artist-input" 
          label="Artist" 
          variant="outlined" />
        </div>
        <div className='flex flex-col gap-8'>
          <div >
            <div className='text-sm' style={{ color: '#8c959f', paddingBottom: '5px', fontWeight: '400' }}>Rating</div>
            <NumberInput defaultValue={rattingDef} id="ratting-input" min={0} max={10} />
          </div>
          <div>
            <div className='text-sm' style={{ color: '#8c959f', paddingBottom: '5px', fontWeight: '400' }}>Release Year</div>
            <NumberInput defaultValue={releaseDef} id="releaseYear-input" min={1990} max={new Date().getFullYear()} />
          </div>


        </div>
        <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%' }}>
          <div>Cover</div>
          <InputFileUpload id="cover-up" label='Upload Cover' />
        </div>
        <div className='w-full flex flex-col gap-3'>
          <SelectMenu setValue={setStatus} value={status} id="status-input" isMultiple={false} label='Status' options={['Hiatus', 'Completed', 'onGoing']} />
          <SelectMenu setValue={setIsVisible} value={isVisible} id="visibility-input" isMultiple={false} label='Visibility' options={['Visible', 'hidden']} />
          <SelectMenu setValue={setIsSlider} value={isSlider} id="slider-input" isMultiple={false} label='Slider' options={['on', 'off']} />

        </div>
        <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%' }}>
          <div>Slider Banner</div>
          <InputFileUpload id="banner-up" label="Upload Banner" />
        </div>
      </div>

      <div className='w-full flex justify-center' style={{ width: '100%' }}>
        <Button className='flex gap-1 rounded-lg' type='submit' sx={{ fontFamily: 'Poppins', textTransform: 'none' }} variant='contained'>
          update Series
          <SendIcon />
        </Button>
      </div>

    </Box>
  );
}