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
    text: string,
    URL: string
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
 
  function Element({ text, URL }: { text: string, URL: string }) {
    return (
      <Link
        className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
        href={URL}
      >
        {text}
      </Link>
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
        className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500"
        data-toggle="dropdown"
      >
        {text}
      </div>
      <div className={`dropdown-menu sm:z-20 sm:absolute sm:top-6 sm:left-0 sm:bg-white sm:border-black/10 sm:dark:bg-[#09090b] sm:border-[1px] sm:dark:border-white/10 sm:p-2 sm:rounded-md text-sm sm:min-w-[200px] max-w-fit ${!isOn && 'hidden'}`}>
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
      URL: '/dashboard/series'
    },
    {
      text: 'Chapters',
      URL: '/dashboard/chapters'
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
      URL: '/dashboard/table/Types',

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
      URL: '/dashboard/settings/ads'
    },
    {
      text: 'upload settings',
      URL: '/dashboard/settings/upload'
    }
  ]

  const [user, setUser] = useState<any>()
  const [isDropDownOpen, setIsDropDownOpen]= useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const router = useRouter()
  useEffect(()=>{
    supabase.auth.getUser().then(session=>{
      setUser(session.data.user)
      supabase.auth.getSession().then(res=>{
        supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((res)=>{
         if((res?.data?.length == 0)){
          router.back()
         }
        })
       })
      supabase.auth.onAuthStateChange((_event, session)=>{
          setUser(session?.user ?? null)
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
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-black dark:text-white"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <DropDown text='Content' options={ContentOption} URL='#' isCurrent={'content' == currentPage} />

          <Link
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500"
            href="/dashboard/pages"
          >
            Pages
          </Link>
          <Link
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500"
            href='/dashboard/users'
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
              style={{ border: '1.5px solid rgba(255, 255, 255, 0.2)' }}
              autoComplete="off"
              placeholder="Search..."
            />
            <button type="submit">
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
          <a className="cursor-pointer" data-toggle="dark" aria-label="Dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 transition text-white hover:text-yellow-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </a>
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
          <div className={`dropdown-menu absolute right-0 top-16 z-20  min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10 bg-white p-2 text-sm dark:border-white/10 dark:bg-[#09090b] ${isDropDownOpen? '' : 'hidden'}`}>
            <div className="flex flex-col px-0 pt-0">
              {user &&(<>
             
              <Link
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
                href="/userSettings"
              >
                {" "}
                Account Settings{" "}
              </Link>
              <Link
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
                href="/"
              >
                {" "}
                Back to home{" "}
              </Link>
             
                <a
                onClick={()=>{
                  supabase.auth.signOut()
                }}
                  className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
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