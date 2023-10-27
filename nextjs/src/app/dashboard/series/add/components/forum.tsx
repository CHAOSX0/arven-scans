"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import InputFileUpload  from './InputFileUpload';
import NumberInput from './numberInput';
import SelectMenu from './SelectMenu';
import TextareaAutoSize from './TextArea'; 
import Field from './Field';
import supabase from '../../../../../../supabase';
import { toast } from 'react-hot-toast';

export default function Forum() {
    //I know this a stupid approach but I am too lazy to do it the right way
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const TitleRef = React.useRef<HTMLInputElement>(null);                      
    const SlugRef = React.useRef<HTMLInputElement>(null);
    const [genres, setGenres] = React.useState<string[]>([]);
    const DescrRef = React.useRef<HTMLInputElement>(null);
    const AuthorRef = React.useRef<HTMLInputElement>(null);
    const ArtistRef = React.useRef<HTMLInputElement>(null);
    const ReleaseYearRef = React.useRef<HTMLInputElement>(null);
    const RattingRef = React.useRef<HTMLInputElement>(null);
    const [status, setStatus] = React.useState<string | null>(null);
    const [isVisible, setIsVisible] = React.useState<string | null>(null);
    const [isSlider, setIsSlider] = React.useState<string | null>(null);
    const [cover, setCover] = React.useState<string | null>(null);
    const [banner, setBanner] = React.useState<string | null>(null);
  
    async function HandelSubmit(){
      if(isLoading) return
      setIsLoading(true)
     //get values for all inputs in one line
     const title = (document.getElementById('title-input') as HTMLInputElement).value
     const slug = (document.getElementById('slug-input') as HTMLInputElement).value
     const author= (document.getElementById('author-input') as HTMLInputElement).value
     const artist= (document.getElementById('artist-input') as HTMLInputElement).value
     const descr= (document.getElementById('descr-input') as HTMLInputElement).value
     const ratting= parseInt((document.getElementById('ratting-input') as HTMLInputElement).value)
     const releaseYear= parseInt((document.getElementById('releaseYear-input') as HTMLInputElement).value)
     const coverFile = (document.getElementById('cover-up') as HTMLInputElement).files?.[0]
     const bannerFile = (document.getElementById('banner-up') as HTMLInputElement).files?.[0]

     function upload(File: File, path: string){
      return supabase.storage
      .from('covers')
      .upload(path, File, {
        cacheControl: '3600',
        upsert: true
      })
     }
    if(coverFile){
      const coverPromise = upload(coverFile, `${title}/cover-${coverFile.name}`)
      const bannerPromise = bannerFile ? upload(bannerFile, `${title}/banner-${bannerFile.name}`) : null
      toast.promise(coverPromise, {
        loading: 'Uploading cover...',
        success: 'Cover uploaded',
        error: 'Failed to upload cover'
      })
      if(bannerPromise){
        toast.promise(bannerPromise, {
          loading: 'Uploading banner...',
          success: 'Banner uploaded',
          error: 'Failed to upload banner'
        })
      }
      const { data: coverData, error: CoverError } = await coverPromise
      if(CoverError){
        toast.error(CoverError.message)
        setIsLoading(false)
        return
      }
      const coverURL = `http://localhost:8000/storage/v1/object/public/covers/${coverData.path}`
      const BannerURL = bannerPromise ? `http://localhost:8000/storage/v1/object/public/covers/${(await bannerPromise).data?.path || '' }` : null
      const { data, error } = await supabase.from('series').insert({
        title,
        created_at: new Date(),
        updated_at: null,
        description: descr,
        author,
        artist,
        releaseYear,
        ratting,
        status,
        //is_visible: isVisible,
        isSlider,
        coverURL,
        BannerURL,
        genres
    })
    if(error){
      toast.error(error.message)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    toast.success('Series created successfully')
     
    // console.log(coverFile, 'cover')
      //  console.log(data, 'data')
    }}
    return (
    <Box
      component="form"
      onSubmit={(e)=>{
        e.preventDefault()
        HandelSubmit().then(()=>{
          setIsLoading(false)
        })
        console.log('submit')
        e.preventDefault()}}
      sx={{

        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      className='p-8 bg-[transparent] ] flex-col flex gap-10 justify-center items-center'
      noValidate
      autoComplete="off"
    >
      <div style={{width:'100%'}} className='w-full text-3xl text-center'><span>Enter Series Data</span></div>
      <div className='gap-10 flex flex-col' style={{width:'90%', maxWidth:'600px'}}>
       <div className='flex gap-4 justify-center'>
         <Field ref={TitleRef} required sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="title-input" label="Title" variant="outlined"/>
         <Field ref={SlugRef} name='slug' sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="slug-input" label="URL slug" variant="outlined"/>
       </div>
       <div className='w-full flex'>
       <SelectMenu setValue={setGenres} value={genres} isMultiple={true} id="genres-input" label='Genres' options={['hi', 'bye', 'welcome']} />
       </div>
       <div>
        <TextareaAutoSize id="descr-input"/>
       </div>
       <div className='flex gap-4 justify-center'>
         <Field ref={AuthorRef} sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="author-input" label="Author" variant="outlined"/>
         <Field ref={ArtistRef}sx={{flexGrow:1}} InputLabelProps={{style:{color:'white '}}} id="artist-input" label="Artist" variant="outlined"/>
       </div>
       <div className='flex flex-col gap-8'>
        <div >

       
        <div className='text-sm' style={{color:'#8c959f', paddingBottom:'5px', fontWeight:'400'}}>Rating</div>
        <NumberInput id="ratting-input"  ref={RattingRef} min={0} max={10} />
        </div>
        <div>
         <div className='text-sm' style={{color:'#8c959f', paddingBottom:'5px', fontWeight:'400'}}>Release Year</div>
         <NumberInput id="releaseYear-input" ref={ReleaseYearRef} min={1990} max={new Date().getFullYear()} />
        </div>
        

       </div>
       <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%'}}>
        <div>Cover</div>
        <InputFileUpload id="cover-up" label='Upload Cover' />
      </div>
      <div className='w-full flex flex-col gap-3'>
        <SelectMenu setValue={setStatus} value={status} id="status-input" isMultiple={false} label='Status' options={['Hiatus', 'Completed', 'onGoing']} />
        <SelectMenu setValue={setIsVisible} value={isVisible} id="visibility-input" isMultiple={false} label='Visibility' options={['Visible', 'hidden']} />
        <SelectMenu setValue={setIsSlider} value={isSlider} id="slider-input" isMultiple={false}  label='Slider' options={['on', 'off']}/>
        
      </div>
      <div className='flex justify-start w-full flex-col gap-1' style={{ width: '100%'}}>
        <div>Slider Banner</div>
        <InputFileUpload id="banner-up" label="Upload Banner" />
      </div>
      </div>
      
      <div className='w-full flex justify-center' style={{width:'100%'}}>
        <Button className='flex gap-1 rounded-lg' type='submit'  sx={{fontFamily: 'Poppins', textTransform:'none'}} variant='contained'>
            Create Series
            <SendIcon />
        </Button>
      </div>
      
    </Box>
  );
}