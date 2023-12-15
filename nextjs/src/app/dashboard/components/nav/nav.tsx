"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import supabase from '../../../../../supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Router } from 'next/router';

type navElement = {
  text: string,
  URL?: string | undefined,
  isCurrent?: boolean,
  options?: {
    text: string,
    URL: string,
  }[] | undefined
}
type DropDownData = {
  text: string,
  URL?: string,
  isCurrent: boolean,
  options?: {
    onClick?: any,
    text: string,
    URL?: string
  }[]
}
function ELement({ text, URL, options, isCurrent }: navElement) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  if (options) {

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <div>
        <Button
          sx={{
            fontFamily: 'Poppins !important',
            textTransform: 'none !important',
            fontWeight: '600 !important',
            padding: '0rem',
            color: isCurrent ? '#f2f2f2' : "#909090"
          }}
          id="basic-button"
          className='text-lg'

          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {text}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {options.map(option => <MenuItem key={option.text}><Link href={option.URL}>{option.text}</Link></MenuItem>)}

        </Menu>
      </div>
    )
  } else if (URL) {
    return (
      <Link href={URL} style={{ color: isCurrent ? '#f2f2f2 ' : "#909090" }}>
        {text}
      </Link>
    )
  }

}

function DropDown({ text, URL, options, isCurrent }: DropDownData) {
const [isOn, setISOn] = useState<boolean>(false)
  
  function Element({ text, URL, onClick }: { text: string, URL?: string, onClick?: ()=>Promise<void> }) {
    return (
      <>
      { URL ? (
      <Link
        className="cursor-pointer py-1 sm:px-2 w-full text-[--text-color] duration-200 transition-colors"
        href={URL}
      >
        {text}
      </Link>
      ) : (
        <div
        onClick={()=>{
          const res = fetch('/api/revalidate-all')
          toast.promise(res, {
            loading: 'clearing cache',
            error:'error clearing cache',
            success:'cleared cache successfully'
          })
        }}
        className="text-[--text-color] cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm bg-[--background] hover:bg-[--text-color] duration-200 transition-colors"
        >
         {text}

        </div>
      )
      }
      </>
    )
  }
  const elements = options?.map((option, i) => <Element {...option} key={i} />)
  return (
    <div className='relative'>
      <div
        onClick={(e) => {
          e.preventDefault()
          setISOn(prev => {
            console.log(prev)
            return !prev

          })
        }}
        className="cursor-pointer hover:text-[--text-color] duration-200 transition-colors text-gray-500"
        data-toggle="dropdown"
      >
        {text}
      </div>
      <div style={{borderColor:'var(--border-color)'}} className={`dropdown-menu sm:z-20 sm:absolute sm:top-6 sm:left-0 sm:border-black/10 bg-[--background] sm:border-[1px] sm:dark:border-white/10 sm:p-2 sm:rounded-md text-sm sm:min-w-[200px] max-w-fit ${!isOn && 'hidden'}`}>
        <div className="flex flex-col px-2 sm:px-0 sm:pt-0">
          {elements}
        </div>
      </div>
    </div>
  )
}
export default function DashboardNav({ currentPage }: { currentPage: string }): JSX.Element {
  const ElementsData = [{ text: "Home", URL: '/' }, { text: 'chapters', URL: "/dashboard/chapters" }, { text: 'series', URL: '/dashboard/series' }, { text: 'settings', options: [{ text: 'site settings', URL: '/dashboard/settings/site-settings' }] }]
  const Elements = ElementsData.map((element: navElement) => <ELement isCurrent={element.text == currentPage} key={element.text} {...element} />)
  const ContentOption = [
    {
      text: 'Series',
      URL: '/dashboard/table/series'
    },
    {
      text: 'Chapters',
      URL: '/dashboard/table/chapters'
    },
    {
      text: 'Comments',
      URL: '/dashboard/table/comments'
    },
    {
      text: 'genres',
      URL: '/dashboard/table/genres'
    },
    {
      text: 'Types',
      URL: '/dashboard/table/types',

    }, {
      text: 'statuses',
      URL: '/dashboard/table/statuses'
    }
  ]

  const settingsOption = [
    {
      text: 'Site Settings',
      URL: '/dashboard/settings/site'
    }, 
    {
      text: 'Theme Settings',
      URL: '/dashboard/settings/theme'
    }, 
    {
      text: 'seo Settings',
      URL: '/dashboard/settings/seo'
    },
    {
      text: 'ads settings',
      URL: '/dashboard/table/ads'
    },
    {
      text: 'clear cache',
    
    onclick: (async ()=>{
      const res = fetch('/api/revalidate-all')
      console.log('hi')
      toast.promise(res, {
        loading:'clearing',
        error:'error deleting cache',
        success:'deleted cache successfully'
      })
    })
    }
  ]

  const [user, setUser] = useState<any>()
  const [isDropDownOpen, setIsDropDownOpen]= useState<boolean>(false)
 
  const router = useRouter()
  useEffect(()=>{
    supabase.auth.getUser().then(session=>{
      setUser(session.data.user)
      if(!session.data.user?.id){
        router.back()
        return
      }
      supabase.auth.getSession().then(res=>{
        supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((reso)=>{
         if((reso?.data?.length == 0)){
          supabase.from('uploaders').select().eq('id', res.data.session?.user.id ).then((resn)=>{
            if((resn?.data?.length == 0)){
             router.back()
             console.log('back')
            }else{
             console.log('aha')
            }
           })
         }else{
          console.log('aha')
         }
        })
        
       })
      supabase.auth.onAuthStateChange((_event, session)=>{
          setUser(session?.user ?? null)
      })
    })
    
}, [])
  const [isDark, setIsDark] = useState<boolean>(true)
  
  if(!(typeof window === 'undefined')){
    document.documentElement.style.setProperty(`--background`, !isDark ? 'white' : 'black' ); //suffix may be px or ''
    document.documentElement.style.setProperty(`--text-color`, !isDark ? 'black' : 'white' ); //suffix may be px or ''
    document.documentElement.style.setProperty(`--border-color`, !isDark ? '#0000001a' : 'rgba(255, 255, 255, 0.15)' ); 
  }
  useEffect(()=>{
    const localIsDark = localStorage.getItem('dark')
    if(!localIsDark){
      supabase.from('settings').select('value').eq('name', 'theme-default-mode').then(res=>{
        setIsDark(res?.data?.[0].value == 'dark')
      })
    }else{
      setIsDark(localIsDark == 'true')
    if (localStorage.getItem('dark') === 'true' || (!('dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');

  } else {
      document.documentElement.classList.remove('dark')
  }
}
    
      supabase.auth.getUser().then(res=>{
      
            res.data.user
          supabase.from('admins').select().eq('id', res.data?.user?.id ).then((reso)=>{
            console.log(reso, 'admin')
           if(!(reso?.data?.length == 0)){
              
           }else{
            supabase.from('uploaders').select().eq('id', res.data?.user?.id ).then((res1)=>{
              console.log(res1, 'uploader')
             if(!(res1?.data?.length == 0)){
                 
             }else{
               router.push('/')
             }
            })
           }
          })
          
      
        supabase.auth.onAuthStateChange((_event, session)=>{
          
        })
      })
      
  }, [])
  return (
    <header className="border-b-[1px] border-black/10 dark:border-white/10 " style={{ height: 77.6 }}>
      <nav className="container-app flex items-center justify-between font-medium h-full p-5">
        <a href="#" className="sm:hidden" id="nav-toggle">
          <svg
            className="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 5.995c0-.55.446-.995.995-.995h8.01a.995.995 0 0 1 0 1.99h-8.01A.995.995 0 0 1 2 5.995Z" />
            <path d="M2 12.003c0-.55.446-.995.995-.995h18.01a.995.995 0 1 1 0 1.99H2.995A.995.995 0 0 1 2 12.003Z" />
            <path d="M2.995 17.008a.995.995 0 0 0 0 1.99h12.01a.995.995 0 0 0 0-1.99H2.995Z" />
          </svg>
        </a>
        <div className="hidden sm:flex sm:gap-4" id="nav-menu">
          <Link
            className="text-gray-500 cursor-pointer duration-200 transition-colors hover:text-[--text-color]"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <DropDown text='Content' options={ContentOption} URL='#' isCurrent={'content' == currentPage} />

          <Link
            className="text-gray-500 cursor-pointer  duration-200 transition-colors text-gray-500 hover:text-[--text-color]"
            href="/dashboard/table/pages"
          >
            Pages
          </Link>
          <Link
            className="text-gray-500 cursor-pointer  duration-200 transition-colors text-gray-500 hover:text-[--text-color]"
            href='/dashboard/table/users'
          >
            Users
          </Link>

          <DropDown text='settings' URL='#' options={settingsOption} isCurrent={'settings' == currentPage} />
        </div>
        <div className="flex items-center gap-3 h-full">
          <form className="relative">
            <input
              name="filter"
              type="text"
              className="input bg-[transparent] focus:outline-none px-4 py-2 rounded-lg"
              style={{ border: '1.5px solid var(--bor' }}
              autoComplete="off"
              placeholder="Search..."
            />
            <button type="submit" className='text-[--text-color]'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="right-3 absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </form>
          <div
            onClick={()=>{
              
              document.documentElement.style.setProperty(`--background`, isDark ? 'white' : 'black' ); //suffix may be px or ''
              document.documentElement.style.setProperty(`--text-color`, isDark ? 'black' : 'white' ); //suffix may be px or ''
              document.documentElement.style.setProperty(`--border-color`, isDark ? '#0000001a' : 'rgba(255, 255, 255, 0.15)' ); //suffix may be px or ''
              localStorage.setItem('dark', JSON.stringify(!isDark))
              setIsDark(prev=>!prev)
             
            }}
              className="cursor-pointer"
              data-toggle="dark"
              aria-label="Dark Mode"
            >
             {!isDark ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 transition hover:text-gray-600 text-[--text-color]"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>) : (<svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 transition text-[--text-color] hover:text-yellow-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>)}
            </div>
          <div
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500 h-full w-full aspect-square"
          >
            <div className='relative w-full h-full' onClick={(e)=>{
               e.preventDefault()
               setIsDropDownOpen(prev=>!prev)
            }}>
            <Image
              className="h-7 w-7 rounded-full object-cover"
              fill
              src={user?.user_metadata?.avatar? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.user_metadata.avatar}` : '/no-image.jpg'}
              alt="Profile"
            />
            </div>
          </div>
          <div className={`dropdown-menu absolute right-0 top-16 z-20  min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10  p-2 text-sm dark:border-white/10 bg-[--background] ${isDropDownOpen? '' : 'hidden'}`}>
            <div className="flex flex-col px-0 pt-0">
              {user &&(<>
             
              <Link
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm hover:bg-[--text-color] hover:text-[--background] duration-200 transition-colors bg-[--background] text-[--text-color]"
                href="/userSettings"
              >
                {" "}
                Account Settings{" "}
              </Link>
              <Link
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm hover:bg-[--text-color] hover:text-[--background] duration-200 transition-colors bg-[--background] text-[--text-color]"
               
                href="/"
              >
                {" "}
                Back to home{" "}
              </Link>
             
                <a
                onClick={()=>{
                  supabase.auth.signOut()
                }}
                  className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm hover:text-[--background] hover:bg-[--text-color] duration-200 transition-colors text-[--text-color] "
                  id="logout-button"
                >
                  {" "}
                  Logout{" "}
                </a>
            
              </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );

}