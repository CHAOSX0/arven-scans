"use client"
import Link from "next/link"
import supabase from "../../../supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function Nav() {
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(true)
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
    const [isDark, setIsDark] = useState<boolean>(true)
    const router = useRouter()
    document.documentElement.style.setProperty(`--background`, !isDark ? 'white' : 'black' ); //suffix may be px or ''
    document.documentElement.style.setProperty(`--text-color`, !isDark ? 'black' : 'white' ); //suffix may be px or ''
    document.documentElement.style.setProperty(`--border-color`, !isDark ? '#0000001a' : 'rgba(255, 255, 255, 0.15)' ); 
    useEffect(()=>{
      const isDark = localStorage.getItem('dark') == 'true'
      if (localStorage.getItem('dark') === 'true' || (!('dark' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }
      console.log(isDark, 'isDark \n\n\n\n\n\n\n')
      setIsDark(isDark)
        supabase.auth.getUser().then(session=>{
          setUser(session.data.user)
          supabase.auth.getSession().then(res=>{
        
            supabase.from('admins').select().eq('id', res.data.session?.user.id ).then((res)=>{
              console.log(res, 'admin')
             if(!(res?.data?.length == 0)){
                 setIsAdmin(true)
                 console.log(isAdmin)
             }
            })
           })
          supabase.auth.onAuthStateChange((_event, session)=>{
              setUser(session?.user ?? null)
          })
        })
        
    }, [])
    console.log(user)
    return (
      <>
      <header
      className="container relative z-50 mx-auto px-3 sm:px-0 sm:text-white"
      id="navbar"
    >
        <nav className="flex items-center justify-between py-6">
        <div className="flex h-0 items-center gap-4">
          <Link href="/" className="py-2 font-bold text-[--text-color]">
           Home
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              href="/SeriesList"
              className="text-[--text-color] nav-link text-sm p-2 hover:bg-black/10 hover:rounded-sm flex gap-2 items-center transition hover:!bg-black/80"
            >
              <span>Series</span>
            </Link>
            <Link
              href="/favorite"
              className=" text-[--text-color] nav-link text-sm p-2 hover:bg-black/10 hover:rounded-sm flex gap-2 items-center transition hover:!bg-black/80"
            >
              <svg
                className="text-red-500 h-4 w-4"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
              </svg>
              <span>Favorites</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-5 relative">
          <div className="flex items-center gap-3">
            <a onClick={()=>{
              setIsSearchOpen((prev: boolean)=>!prev)
            }} id="search-link" aria-label="Search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="text-[--text-color] h-3 w-3 h-5 w-5 transition hover:text-blue-500 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </a>
           
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
          </div>
          <div
            onClick={()=>{
               setIsDropDownOpen(prev=>!prev)
            }}
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500"
            data-toggle="dropdown"
            aria-label="User Menu"
          >
            <img
              className="h-9 w-9 rounded-full border-[1px] border-solid border-black/10 object-cover object-top"
              alt="avatar"
              src={user?.user_metadata.avatar ? `https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/avatars/${user?.user_metadata.avatar}`: '/no-image.jpg'}
            />
          </div>
          <div style={{border:'2px solid var(--border-color)'}} className={`${isDropDownOpen ? 'hidden' : ''} dropdown-menu absolute right-0 top-10 z-20  min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10 bg-white p-2 text-sm dark:border-white/10 !bg-[--background]`}>
            <div className="flex flex-col px-0 pt-0">
              {!user && (
                <>
                  <Link
                  className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors !text-[--text-color]"
                  href="/signup"
                >
                  {" "}
                  Register{" "}
                </Link>
                <Link
                  className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors !text-[--text-color]"
                  href="/login"
                >
                  {" "}
                  Login{" "}
                </Link>
                </>
              )}
              {user && (
              <>
                 <div
                 className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors !text-[--text-color]"
                 onClick={()=>{
                  supabase.auth.signOut()
                 }}
               >
                 Logout
               </div>
               <Link
                 className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors !text-[--text-color]"
                 href='/userSettings'
               >
                user Settings
               </Link>
               {isAdmin && (
                <Link
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors !text-[--text-color]"
                href="/dashboard/"
              >
                Dashboard
              </Link>
              )}
              </>
              )}
            </div>
          </div>
        </div>
      </nav>
       <div
       id="nav-search"
       className={`animate__animated animate__fast mb-8 w-full sm:absolute h-10 ${!isSearchOpen && 'hidden' }`}
     >
       <form
         onSubmit={(e)=>{
          e.preventDefault()
          const title = (document.getElementById('search-input') as HTMLInputElement).value
          router.push(`/SeriesList?title=${title}`)
         }}
         className="flex gap-3 h-full"
         id="search-form"
       >
         <div className="relative w-full">
           <input
             name="title"
             type="text"
             className="input w-full sm:bg-[#191919] sm:placeholder:text-white/50 h-full"
             autoComplete="off"
             id="search-input"
             placeholder="Search for content..."
             required
           />
           <button className="right-4 absolute top-1/2 -translate-y-1/2">
             <svg
               className="h-4 w-4 text-blue-500 transition-colors duration-200 hover:text-blue-600"
               fill="currentColor"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512 512"
             >
               <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
             </svg>
           </button>
         </div>
       </form>
     </div>
     </header>
     <div
      id="phone-nav"
      className="-mt-4 mb-4 flex flex-col gap-3 bg-blue-600 p-3 text-white sm:hidden md:hidden lg:hidden"
    >
      <div className="flex w-full flex-wrap justify-center gap-3 text-sm">
        <a href="https://iimanga.com/manga" className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
          </svg>
          <span>Mangas</span>
        </a>
      </div>
    </div>
     </>
    )
}