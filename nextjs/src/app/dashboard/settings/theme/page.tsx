"use client";

import { useEffect, useState} from "react";
import DashboardNav from "../../components/nav/nav";
import supabase from "../../../../../supabase";
import toast from "react-hot-toast";


export default function ThemeSettings(){
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(()=>{
       supabase.from('settings').select().eq('type', 'theme').then(res=>{
        if(res.data){
           res.data.forEach(S=>{
             (document.getElementById(S.name) as HTMLInputElement).value = S.value
           })
        }
       })

    })
    async function Submit(e: React.SyntheticEvent) {
        e.preventDefault();
        const formData = new FormData((e?.target as HTMLFormElement));
        const formProps = Object.fromEntries(formData);
        console.log(formProps)
        const colorP = supabase.from('settings').update({value: formProps.theme_mode}).eq('name', 'theme-default-mode')
        const themeP = supabase.from('settings').update({value: formProps.theme_slider}).eq('name', 'theme-slider-enabled')
        const faceP = supabase.from('settings').update({value: formProps.facebook}).eq('name', 'theme-facebook')
        const instaP = supabase.from('settings').update({value: formProps.instagram}).eq('name', 'theme-instagram')
        const twitterP = supabase.from('settings').update({value: formProps.twitter}).eq('name', 'theme-twitter')
        const discordP = supabase.from('settings').update({value: formProps.discord}).eq('name', 'theme-discord')
        const prom = Promise.all([colorP, themeP, faceP, instaP, twitterP, discordP])
        toast.promise(prom, {
            loading:'updating settings...',
            success: 'successfully updated settings',
            error:'error updating settings'
        })

    }
    return (
        <main>
 <DashboardNav currentPage="settings"/>
  <section className="container-app p-5">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <h3 className="text-3xl font-bold tracking-tight">
            Edit Theme Settings
          </h3>
        </div>
      </div>
      <hr className="border-black/10 dark:border-white/10" />
      <form
        onSubmit={(e)=>{
         if(isLoading) return;
         setIsLoading(true)
         Submit(e).then(()=>{
            setIsLoading(false)
         }).catch(()=>{
            setIsLoading(false)
         })
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="hidden"
          
        />
       
        
        <div className="flex w-full flex-col gap-3">
          <label className="text-sm font-medium cursor-pointer max-w-fit">
            Default Mode
          </label>
          <select name="theme_mode" id='theme-default-mode'  className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg ">
            <option className="option" value="dark" >
              {" "}
              Dark
            </option>
            <option className="option" value="light">
              {" "}
              Light
            </option>
          </select>
        </div>
        <div className="flex w-full flex-col gap-3">
          <label className="text-sm font-medium cursor-pointer max-w-fit">
            Theme Slider
          </label>
          <select name="theme_slider" id='theme-slider-enabled' className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg ">
            <option className="option" value='true'>
              {" "}
              Enabled
            </option>
            <option className="option" value='false'>
              {" "}
              Disabled
            </option>
          </select>
        </div>
        
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="facebook"
          >
            Facebook link
          </label>
          <input
            id="theme-facebook"
            name="facebook"
            type="text"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue="https://facebook.com"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="instagram"
          >
            Instagram link
          </label>
          <input
            id="theme-instagram"
            name="instagram"
            type="text"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue="https://instagram.com"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="twitter"
          >
            Twitter link
          </label>
          <input
            id="theme-twitter"
            name="twitter"
            type="text"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue="https://twitter.com"
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <label
            className="text-sm font-medium cursor-pointer max-w-fit"
            htmlFor="discord"
          >
            Discord link
          </label>
          <input
            id="theme-discord"
            name="discord"
            type="text"
            className="input bg-[transparent] py-2 px-2 focus:outline-none border rounded-lg"
            autoComplete="off"
            defaultValue="https://discord.com"
          />
        </div>
        <button
          type="submit"
          className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
        >
          <span id="btn-text">Update</span>
          <span
            id="btn-loader"
            className="hidden h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </span>
        </button>
      </form>
    </div>
  </section>
</main>

    )
}