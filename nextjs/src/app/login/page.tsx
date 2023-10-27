"use client";
import { useRouter } from 'next/navigation'
import supabase from "../../../supabase";
import Image from "next/image";
// Create a single supabase client for interacting with your database
import Link from "next/link";
import { toast } from "react-hot-toast";
export default function Login() {  
  const router = useRouter()
  async function HandelSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value
        const remember = (document.getElementById('remember') as HTMLInputElement).value
  
        const data = {
            email,
            password,
            remember
        }
        
      
       const { data: UserData, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password})
        if(error){
          toast.error(error.message)
        
        }
        console.log(UserData)
        router.push('/')
        console.log(data, 'data')
  }
    return (
            <main className="flex h-full justify-between">
  <div className="dark:bg-dark-secondary flex h-full w-full items-center justify-center border-l border-white/10 md:w-3/5 lg:w-2/5">
    <div className="mx-auto flex w-[90%] flex-col gap-8 sm:w-3/5">
      <Link
        href="/"
        className="-mb-6 text-blue-400 hover:text-blue-600 duration-200 transition-all"
      >
        {" "}
        ← Go Back{" "}
      </Link>
      <span className="block text-xl font-bold">Login</span>
      <div className="flex flex-col gap-3">
        <form
           onSubmit={HandelSubmit}
          className="flex flex-col gap-3"
        >
      
          <div className="flex w-full flex-col gap-3">
            <label
              className="text-sm font-medium cursor-pointer max-w-fit"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              autoComplete="off"
              style={{color:'white'}}
              placeholder="email@example.com"
              //defaultValue="admin@admin.com"
              required={true}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <label
              className="text-sm font-medium cursor-pointer max-w-fit"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              autoComplete="off"
              placeholder="password"
              //defaultValue="11223344xx"
              required={true}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="remember" className="cursor-pointer">
              Remember me
            </label>
            <input
              id="remember"
              type="checkbox"
              className="w-5 h-5 rounded-md bg-transparent -order-1 cursor-pointer"
              name="remember"
            />
          </div>
          <button
            type="submit"
            className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
          >
            <span id="btn-text">Login</span>
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
      <div className="flex flex-col gap-1">
        <span className="text-sm">
          {" "}
          Don't have an account?{" "}
          <Link
            className="text-blue-400 hover:text-blue-500 duration-200 transition-all"
            href="/signup"
          >
            Register here.
          </Link>
        </span>
        <a
          className="text-blue-400 hover:text-blue-500 duration-200 transition-all"
          href="/resetpassword"
        >
          Forgot Your Password?
        </a>
      </div>
    </div>
  </div>
  <div className="bg-dark-primary hidden h-full items-center justify-center md:flex md:w-2/5 lg:flex lg:w-3/5">
    <img
      className="h-full w-full object-cover opacity-10"
      src="https://iimanga.com/storage/site/auth-cover.jpg"
      alt="Auth Cover"
    />
  </div>
</main>

    )
 }