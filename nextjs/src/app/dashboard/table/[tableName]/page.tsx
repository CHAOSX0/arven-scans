"use client"

import supabase from "../../../../../supabase";
import { useRouter, useSearchParams } from 'next/navigation'
import { notFound } from "next/navigation";
import DashboardNav from "../../components/nav/nav";

import Table from "./table";
import { useEffect, useState } from "react";
import Modal from "./modal";
import toast from "react-hot-toast";
import Search from "@mui/icons-material/Search";
async function getPage(pageNum: number, pageSize: number, tableName: string, query?: string) {
  type objectType = {'comments': 'text', 'series': string, 'genres': string, 'chapters': string, 'types': string}
  const searchCols:objectType = {
    "comments": 'text',
    "series": 'title',
    "genres": 'text',
    "chapters": 'seriesSlug',
    "types": 'slug',
  }
  if(query ){
  const queryCol =searchCols[`${tableName as keyof objectType }`] as any || 'title'
  console.log(queryCol,searchCols[`${tableName as keyof objectType }`] as any, 'wtf' )
  console.log(tableName)
  console.log(queryCol)
  const { data, error } = await supabase.from(tableName).select('*').textSearch(`${queryCol}`, query).range((pageNum - 1) * pageSize, (pageNum * pageSize) - 1)
  if (error) notFound();
  console.log(data, data)
  return data
  }

  const { data, error } = await supabase.from(tableName).select('*').range((pageNum - 1) * pageSize, (pageNum * pageSize) - 1)
  if (error) notFound();
  return data
}

//this is needed for pagination
async function getRowsNumber(tableName: string, query?: string): Promise<number> {
  type objectType = {'comments': 'text', 'series': string, 'genres': string, 'chapters': string, "types": string}
  const searchCols:objectType = {
    "comments": 'text',
    "series": 'title',
    "genres": 'text', 
    "chapters": 'seriesSlug',
    "types": 'slug',
  }
  if(query ){
    const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: false }).textSearch(`${searchCols[`${tableName as keyof objectType }`] as any || 'title'}`, query)
    if (error) notFound();
    return count || 0
  
  }
  const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: false })
  if (error) notFound();
  return count || 0
}

export default function DynamicTableDashboard({ params: { tableName: table }}: { params: { tableName: string }, searchParams: { page: string } }) {
  const tableName = table.toLowerCase()
  const searchParams = useSearchParams()
  console.log(tableName)
  const page = searchParams.get('page')
  const filter = searchParams.get('filter') || undefined
  const router = useRouter()
  const pageNum = parseInt(page || '1')
  console.log(pageNum)
  //% this is arbitrary it can ba changed anytime 
  const PAGE_SIZE = 10
  //% table name is the url slug (ie. /table/hi, tableName = hi)
  const [data, setData] = useState<any[]>([])
  const [rowNumber, setRowNumber] = useState<number>(0)
  useEffect(() => {
  

    getPage(pageNum, PAGE_SIZE, tableName, filter).then(res => {
      console.log(res)
      setData(res)
    })
    getRowsNumber(tableName, filter).then(res => {
      setRowNumber(res)
    })
  }, [])
  const omittedColumns = ['author', 'authorAvatar', 'time', 'pages', 'view', 'coverURL', 'BannerURL', 'URL', 'genres', 'isSlider', 'is_visible', 'artist', 'ratting', 'updated_at', 'viewCount', 'alternativeTitles', 'deleted_at', 'phone', 'last_sign_in_at', 'is_sso_user']
  const renamedColumns = {"raw_user_meta_data": 'username'}
  //@ts-ignore
  const columns = Object.keys(data?.[0] || {}).filter(e => !omittedColumns.includes(e)).map(e=>(renamedColumns[e] as any ? renamedColumns[e] as any : e ))
  const [ModalPrompts, setModalPrompts] = useState<{ onDelete: () => void, links: { text: string, href: string }[], isOpen: boolean, position:{left: number, top: number}, lastClicked: number}>({
    onDelete: (() => { }),
    links: [],
    isOpen: false,
    position:{
      left:0,
      top:0,
    },
    lastClicked: -10
  })
 function toggleModal(tableName: string, left: number, top: number, id: number, slug: string){
  //$ this is just config
  const seriesLinks = [
   {href: `/dashboard/table/chapters?filter=${slug}`, text:'Chapters'},
   {href: `/dashboard/table/chapters/add?series=${slug}`, text: 'New Chapter'},
   {text:'bulk upload', href:`/dashboard/chapters/bulkCreate?series=${slug}`},
   {text: 'Edit', href:`/dashboard/table/series/edit/${id}`}]
 const chapterLinks = [
  {
   href: `/dashboard/table/${tableName}/edit/${id}`,
   text: 'edit'
  }
 ]
   const is_series_table = tableName == 'series'
   const is_chapter_table = tableName == 'chapters'
   const links = is_series_table? seriesLinks :  is_chapter_table? chapterLinks : chapterLinks

   async function OnDelete (){
    const promise = supabase.from(tableName).delete().eq('id', id)
    toast.promise(promise as any, {
      loading: 'deleting',
      error:'failed to delete',
      success:'deleted successfully'
    })
    const {error} = await promise
    console.error(error)
    if(!error){
     setData((prev: any[])=>{
      console.log(prev)
      const index = prev.findIndex((s: any)=> s.id == id)
      console.log(index)
      const res = [...prev]
      res.splice(index, 1)
      console.log(res)
      return res
     })
     setRowNumber((prev: number)=>prev-1)
    }
  }

   setModalPrompts(prev=>{
    const isOpen = (prev.lastClicked == id? !prev.isOpen : true)
    return ({links: links, position: {left: left, top: top}, isOpen, onDelete:OnDelete, lastClicked:id })
  })

}
function onModalBlur(){
  setModalPrompts(prev=>({...prev, isOpen: false}))
}
  const canADD = tableName != 'comments'
  async function on_filter_input_change() {
    
      const input = (document.getElementById('filter-input') as HTMLInputElement).value
      const is_series = tableName == 'series'
      const is_chapter = tableName == 'chapters'
      const is_genres = tableName == 'genres'
      const is_comments = tableName == 'comments'
      const dataPromise =  getPage(1, PAGE_SIZE, tableName, input)
      const numberPromise = getRowsNumber(tableName, input)
      toast.promise(Promise.all([dataPromise, numberPromise]), {
        loading:'loading...',
        success:'',
        error:'failed'
      })
      setData(await dataPromise)
      setRowNumber(await numberPromise)
  }
  return (
    <div className="w-screen h-screen relative">
      <main>
        <DashboardNav currentPage="series" />
        <section className="container-app pl-5">
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl font-bold tracking-tight">{tableName} List</h3>
              <p className="text-gray-500 dark:text-white dark:text-opacity-50">
                {" "}
                Take control of your {tableName} from this page.{" "}
              </p>
            </div>
            {/* passing setState is props is bad practice but Im too lazy to fix it */}
            <Table
            on_filter_input_change={on_filter_input_change}
              onToggleModal={toggleModal}
              canADD={canADD}
              columns={columns}
              data={data}
              setData={setData}
              tableName={tableName}
              rowNumber={rowNumber}
              pageSize={PAGE_SIZE}
              pageNum={pageNum} />


          </div>
        </section>
      </main>
      <Modal links={ModalPrompts.links} isOpen={ModalPrompts.isOpen} onDelete={ModalPrompts.onDelete} position={ModalPrompts.position} onBlur={onModalBlur}/>
    </div>
  )
}