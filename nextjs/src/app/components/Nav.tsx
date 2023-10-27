"use client"

export default function Nav() {
    return (
      <>
      <header
      className="container relative z-50 mx-auto px-3 sm:px-0 sm:text-white"
      id="navbar"
    >
        <nav className="flex items-center justify-between py-6">
        <div className="flex h-0 items-center gap-4">
          <a href="https://iimanga.com" className="py-2 font-bold">
            {" "}
            MangaCMS{" "}
          </a>
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href="https://iimanga.com/manga"
              className="nav-link text-sm p-2 hover:bg-black/10 hover:rounded-sm flex gap-2 items-center transition hover:!bg-black/80"
            >
              <span>Mangas</span>
            </a>
            <a
              href="https://iimanga.com/bookmarks"
              className="nav-link text-sm p-2 hover:bg-black/10 hover:rounded-sm flex gap-2 items-center transition hover:!bg-black/80"
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
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-3">
            <a href="#" id="search-link" aria-label="Search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-3 w-3 h-5 w-5 transition hover:text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </a>
            <a href="https://iimanga.com/manga/random" aria-label="Random">
              <svg
                className="h-5 w-5 transition hover:text-yellow-400"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
            </a>
            <a
              className="cursor-pointer"
              data-toggle="dark"
              aria-label="Dark Mode"
            >
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
          </div>
          <a
            className="cursor-pointer hover:text-black dark:hover:text-white duration-200 transition-colors text-gray-500"
            data-toggle="dropdown"
            aria-label="User Menu"
          >
            <img
              className="h-9 w-9 rounded-full border-[1px] border-solid border-black/10 object-cover object-top"
              alt="avatar"
              src="https://iimanga.com/images/user/no-image.jpg"
            />
          </a>
          <div className="dropdown-menu absolute left-0 top-6 z-20 hidden min-w-[200px] max-w-fit rounded-md border-[1px] border-black/10 bg-white p-2 text-sm dark:border-white/10 dark:bg-[#09090b]">
            <div className="flex flex-col px-0 pt-0">
              <a
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
                href="https://iimanga.com/register"
              >
                {" "}
                Register{" "}
              </a>
              <a
                className="cursor-pointer py-1 sm:px-2 w-full sm:hover:rounded-sm sm:hover:bg-black/10 sm:dark:hover:bg-white/10 duration-200 transition-colors"
                href="https://iimanga.com/login"
              >
                {" "}
                Login{" "}
              </a>
            </div>
          </div>
        </div>
      </nav>
       <div
       id="nav-search"
       className="animate__animated animate__fast mb-8 hidden w-full sm:absolute"
     >
       <form
         method="GET"
         action="https://iimanga.com/manga"
         className="flex gap-3"
         id="search-form"
       >
         <div className="relative w-full">
           <input
             name="title"
             type="text"
             className="input w-full sm:bg-[#191919] sm:placeholder:text-white/50"
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