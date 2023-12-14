import { ImageResponse } from 'next/og'
import supabase from '../../supabase'
 import Image from 'next/image'

// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Icon() {
    const {data, error} = await supabase.from('settings').select('value').eq('name', 'favicon')
    console.log(data, 'ddddd')
  return new ImageResponse(
    
    (
      
      // ImageResponse JSX element
        <img  src={data?.[0].value.split('?')[0]} width='32' height='32'  alt='hi'/>
 
   
    ),
    // ImageResponse options
    { 
     
      
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}