import Nav from "@/app/components/Nav";
//import Link from "next/link";
import supabase from "../../../supabase";
import Footer from "../components/footer";
import { notFound } from "next/navigation";
//import type { Metadata, ResolvingMetadata } from 'next'


async function getData(page: string) {
    const {data, error} = await supabase.from('pages').select().eq('slug', page)
    console.log(page)
    if(error){
      notFound()
    }else{
        return data[0]
    }
}

export const revalidate = 60*60*20;
 
type Props = {
  params: { page: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

/*
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    
  }
}
*/

export default async function Series({ params }: { params: { page: string } }) {
  const data = await getData(params.page)
  

  return (
    <>
    <Nav />
      
     <main style={{color:'var(--text-color)'}} dangerouslySetInnerHTML={{__html: data?.content || ''}}>
     </main>
    <Footer />
    </>

  )
}