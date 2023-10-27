"use client"
import { toast } from "react-hot-toast"
import Link from "next/link"
import supabase from "../../../supabase"

export default function SignUp(){
    async function HandelSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const username = (document.getElementById('username') as HTMLInputElement).value
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value
        const password_confirmation = (document.getElementById('password_confirmation') as HTMLInputElement).value
        if( password !== password_confirmation){
            toast.error('Password does not match')
         return    
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options:{
                data:{
                    username
                }
            }
        })
        if( error){
            toast.error(error.message)
            window.location.pathname = '/login'
            return console.log(error)
        }
        window.location.pathname = '/'
        console.log(data)
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
      <span className="block text-xl font-bold">Register</span>
      <div className="flex flex-col gap-3">
        <form
          onSubmit={HandelSubmit}
          className="flex flex-col gap-3"
        >
          <input
            type="hidden"
            name="_token"
            defaultValue="O4SuNvIv17DvYt2kLkAGSLOKWvs6uK4zC8yL2f0P"
          />
          <div className="flex w-full flex-col gap-3">
            <label
              className="text-sm font-medium cursor-pointer max-w-fit"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="input"
              autoComplete="off"
              placeholder="ex. mangalover"
              required={true}
            />
          </div>
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
              placeholder="email@example.com"
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
              required={true}
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <label
              className="text-sm font-medium cursor-pointer max-w-fit"
              htmlFor="password_confirmation"
            >
              Password Confirmation
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              className="input"
              autoComplete="off"
              required={true}
            />
          </div>
          <button
            type="submit"
            className="flex gap-3 items-center justify-center relative font-semibold px-4 py-3 bg-white text-black rounded-md duration-200 transition-all shadow-sm border-[1px] border-black/10 hover:border-white/20 hover:bg-black hover:text-white disabled:cursor-not-allowed"
          >
            <span id="btn-text">Register</span>
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
          Already have an account?{" "}
          <Link
            className="text-blue-400 hover:text-blue-500 duration-200 transition-all"
            href="/login"
          >
            Login
          </Link>
        </span>
        <Link
          className="text-blue-400 hover:text-blue-500 duration-200 transition-all"
          href="/forgot-password"
        >
          Forgot Your Password?
        </Link>
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