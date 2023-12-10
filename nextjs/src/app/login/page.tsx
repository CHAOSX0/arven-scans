
import { useRouter } from 'next/navigation'
import supabase from "../../../supabase";
import Forum from './forum'
import Image from "next/image";
// Create a single supabase client for interacting with your database
import Link from "next/link";
import { toast } from "react-hot-toast";

async function getCoverURL(){
  const {error, data} = await supabase.from('settings').select().eq('name', 'auth-cover')
  if(error) return 'https://iimanga.com/storage/site/auth-cover.jpg'
  return data[0].value
}
export default async function Login() {  
 
  
  const cover = await getCoverURL()
    return (
            <main className="flex h-full justify-between">
  <div className="dark:bg-dark-secondary flex h-full w-full items-center justify-center border-l border-white/10 md:w-3/5 lg:w-2/5">
    <Forum/>
  </div>
  <div className="bg-dark-primary hidden h-full items-center justify-center md:flex md:w-2/5 lg:flex lg:w-3/5">
    <img
      className="h-full w-full object-cover opacity-10"
      src={cover}
      alt="Auth Cover"
    />
  </div>
</main>

    )
 }