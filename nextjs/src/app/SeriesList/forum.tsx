"use client";
import { Box } from "@mui/material"
import Field from "../components/Field"
import SelectMenu from "../components/SelectMenu"
import {useState, useEffect} from 'react';
import {toast} from 'react-hot-toast'
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import supabase from "../../../supabase";
import Card from "./card";
import { useSearchParams } from 'next/navigation'

export default function SeriesListForum(){
    const searchParams = useSearchParams()
    const genre = searchParams.get('genre')
    const title = searchParams.get('title')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [genres, setGenres] = useState<string[]>(genre ? [genre] : [] )
    const [type, setType] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [GenresOptions, setGenresOptions] = useState<string[]>(['y', 'bye']);
    const [seriesData, setSeriesData] = useState<any[]>([])
    const cards = seriesData.map((series:any, i :number )=> <Card key={i} {...series} />)
    console.log(cards)
    useEffect( () => {
      supabase.from('genres').select().then(({data, error}) => {
        console.log(error)
        if(error) return toast.error('error fetching genres');
        console.log(data)
        toast.success(data.length + ' genres fetched')
        setGenresOptions(data.map((genre) => genre.text))
      })
     if(title){
      (document.getElementById('title-input') as HTMLInputElement).value = title
     }
      if(genre){
        setGenres([genre])
      }
      setIsLoading(true)
      HandelSubmit().then(res=>{
        setIsLoading(false)
      }).catch(res=>{
        setIsLoading(false)
      })
      
      }, []);
     
    async function HandelSubmit(t1?: string){
      const title = t1? t1: (document.getElementById('title-input') as HTMLInputElement).value
      const match = {...(type ?{type:type} : {}), ...(status ? {status: status} : {})};
      if(title){
        if(genres){
            const { data, error } = await supabase 
            .from('series') 
            .select('title, coverURL, genres, URL, slug')
            .textSearch('title', `${title}`, {  config: 'english'})
            .match(match).contains('genres', genres).limit(30)
         if(error) return console.warn(error)
          console.log(data)
          setSeriesData(data)
        }else{
            const { data, error } = await supabase 
            .from('series') 
            .select('title, coverURL, genres, URL, slug')
            .textSearch('title', `${title}`, {  config: 'english'})
            .match(match).limit(30)
         if(error) return console.warn(error)
          console.log(data)
          setSeriesData(data)
        }
      
      }else{
        console.log(match)
        if(genres){
            const {data, error} = await supabase.from('series').select('title, coverURL, genres, URL, slug').match(match).contains('genres', genres).limit(30)
            if(error) return console.warn(error)
            console.log(data)
            setSeriesData(data)
        }else{
            const {data, error} = await supabase.from('series').select('title, coverURL, genres, URL, slug').match(match).contains('genres', genres).limit(30)
            if(error) return console.warn(error)
            console.log(data)
            setSeriesData(data)
        }
        
      }
      

    }
    return(
        <>
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
        maxWidth: 900,
        margin: '0 auto',
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      className='w-full p-8 bg-[transparent] ] flex-col flex gap-10 justify-center items-center'
      noValidate
      autoComplete="off"
           >
             <div className="w-full " style={{height:'50px', width: '100% !important'}}>
               <Field   InputLabelProps={{ style: { color: 'white ' } }} sx={{flexGrow:1, width:'100%'}}  className="w-full"label='Title' id="title-input" variant="outlined"/>
             </div>
             <div className="w-full flex" style={{width: '100% !important', justifyContent:'space-between', flexWrap:'wrap', gap:'10px'}}>
                <div style={{flexGrow:1, minWidth:'250px'}}>
             <SelectMenu 
       
          setValue={setGenres} 
          value={genres} 
          isMultiple={true} 
          id="type-input" 
          label='genres' 

          options={GenresOptions} />
           </div>
           <div style={{flexGrow:1, minWidth:'250px'}}>

           
          <SelectMenu 
          isMultiple={false}
          options={['Manhua', 'Manhwa', 'Manga']}
          setValue={setType} 
          value={type}
          id="type-input" 
          label='Type' 
          />
          </div>
          <div style={{flexGrow:1, minWidth:'250px'}}>

        
           <SelectMenu 
          isMultiple={false}
         options={['Ongoing', 'Completed', 'Hiatus', 'Dropped']}
          setValue={setStatus} 
          value={status}
          id="status-input" 
          label='Status' 

          />
            </div>
             </div>
             <Button className='flex gap-2  rounded-lg' type='submit' sx={{ fontFamily: 'Poppins', textTransform: 'none', width:'100px' }} variant='contained'>
                <SearchIcon />
               Search
        </Button>
           </Box>
           <h2 className="mb-3 text-lg font-bold">Mangas List</h2>
  <div className="xlg:grid-cols-8 grid grid-cols-3 gap-[10px] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
    {cards}
   
  </div>
           </>
    )
}