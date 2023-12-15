import Script from 'next/script'
import { Inter, Poppins } from 'next/font/google'
import '../../public/globals.css'
import supabase from '../../supabase'
import { Metadata, ResolvingMetadata } from 'next'
const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({weight: ['600'], subsets: ['latin']})
async function getFavicon(){
  const {data, error} = await supabase.from('settings').select('value').eq('name', 'favicon')
return data?.[0].value || ''
}
export async function generateMetadata(params: any, parent: ResolvingMetadata): Promise<Metadata> {
  const title =  (await supabase.from('settings').select('value').eq('name', 'site-title'))?.data?.[0].value
  const keywords = (await supabase.from('settings').select('value').eq('name', 'site-keywords'))?.data?.[0].value
  const description = (await supabase.from('settings').select('value').eq('name', 'site-description'))?.data?.[0].value
  const favicon = (await supabase.from('settings').select('value').eq('name', 'favicon'))?.data?.[0].value
  console.log(title, 'title')
  console.log(favicon)
  return {
    title: title,
    keywords:keywords,
    description: description,
    icons:{
      icon: favicon
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      
      <script async src="https://cdn.tiny.cloud/1/tzjei70y8jw3lstfb7ql8a902o0fatc40v99oeov25kv98aj/tinymce/6/tinymce.min.js" referrerPolicy="origin"></script>
       
      </head>
      <body style={{overflowX:'hidden'}} className={`${inter.className} ${poppins.className} h-[100vh] text-sm text-white` } >{children}</body>
    </html>
  )
}
