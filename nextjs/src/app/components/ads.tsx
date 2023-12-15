import Link from "next/link";

async function getAds() {
  const { data, error } = await supabase.from('ads').select().eq('status', 'active')
  if (error) throw 'fuck'
  return data
}

async function getAdByIDentifier(identifier: string) {
  const { data, error } = await supabase.from('ads').select().eq('status', 'active').eq('identifier', identifier)
  if (error) throw 'fuck'
  return data[0]
}

import Script from "next/script";
import supabase from "../../../supabase";
import Image from "next/image";
import Ad from "./ad";

export default async function Ads({ currentPage, Type }: { currentPage: string, Type: string }) {
  const isFloat = Type == 'float'
  if(isFloat){
    const adsList = await getAds()
    const floatsIds = ['float-right', 'float-left', 'float-top', 'float-bottom']
    const floats = adsList.filter(e=>floatsIds.includes(e.identifier)).filter(e=>{
      if(e.type == 'banner' && e.URL){
        return true
      }
      if(e.type == 'script' && e.code){
        return true
      }
    })
    console.log(floats, 'float')
    const floatsElements  = floats.map((ad, i)=>{
      const isHor = ad.identifier == 'float-top' || ad.identifier == 'float-bottom'
      const isScript = ad.type == 'script'
      console.log(isScript)
      return (<Ad key={i} identifier={ad.identifier} URL={ad.URL} id={ad.id} bannerURL={ad.bannerURL} code={ad.code} isScript={isScript} is_horizontal={isHor} isDefault={false}  />)
      
    })
   /// console.log(adsList, 'list')
    return (
      <>
       {floatsElements}
      </>
    )
  }else{
    const ad = await getAdByIDentifier(Type)
    console.log(Type, ad)
    return (
      <>
      {ad && (
       <Ad is_horizontal={true} isScript={ad.type == 'script'} isDefault={true} identifier={Type} code={ad.code} bannerURL={ad.bannerURL} id={ad.id} URL={ad.URL}/>
      )}
      </>
    )
  }

}