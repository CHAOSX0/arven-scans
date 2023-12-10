
import { toast } from "react-hot-toast"
import Link from "next/link"
import supabase from "../../../supabase"
import SignUpForum from "./forum"

export default async function SignUp(){
   
    return (
        <main className="flex h-full justify-between">
   <SignUpForum />
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