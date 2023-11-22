"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../supabase";
import Nav from "../components/Nav";
import Footer from "../components/footer";
import toast from "react-hot-toast";

export default function UserSettings(){
    async function SubmitPassword(){
       const currentPassword = (document.getElementById('current_password') as HTMLInputElement).value
       const newPass = (document.getElementById('password') as HTMLInputElement).value
       const passConf =  (document.getElementById('password_confirmation') as HTMLInputElement).value
       if(newPass && newPass == passConf){
        const {error} = await supabase.rpc('change_user_password', {current_plain_password: currentPassword, new_plain_password: newPass})
        if(!error){
            toast.success('changed password successfully')
        }
        if(error){
            toast.error(error.message)
        }
       }
       
    }
   
    const [user, setUser] = useState<any>()
    const [isPasswordLoading, setIsPasswordLoading] = useState<boolean>(false)
    async function SubmitMeta() {
        const avatarFile = (document.getElementById('avatar') as HTMLInputElement)?.files?.[0]
        const username = (document.getElementById("username") as HTMLInputElement).value
        const email = (document.getElementById("email") as HTMLInputElement).value
        const description = (document.getElementById("description") as HTMLInputElement).value
        if(username){
            const {error} = await supabase.auth.updateUser({data: {username: username}})
            if(error){
                toast.error('error changing username')
                throw error
             }
             
            }
           
        if(email){
            const {error} = await supabase.auth.updateUser({email})
            if(error){
                toast.error('error changing email')
                throw error
            }
        }
        if(description){
            const {error} = await  supabase.auth.updateUser({data:{description}})
            if(error){
                toast.error('error changing email')
                throw error
            }
        }
        if(avatarFile){
            const key = `${user.id}/${avatarFile.name}`
           const {error} = await  supabase.storage.from('avatars').upload(key, avatarFile, {
                upsert:true
            })
            if(error){
                toast.error('error uploading avatar')
                console.log(error)
                throw error
            }
            const {error: InsertError} = await  supabase.auth.updateUser({data:{avatar: key}})
           if(InsertError){
            toast.error('error inserting description')
            throw InsertError
           }
        }
        toast.success('changed user data successfully')
        console.log({avatarFile, username, email, description})

    }
    const [isMetaLoading, setIsMetaLoading] = useState<boolean>(false)
    const router = useRouter()
    useEffect(()=>{
        supabase.auth.getSession().then(res=>{
            if(!res.data.session?.user){
             router.back()
            }
            setUser(res.data.session?.user);
            supabase.auth.onAuthStateChange((_event, session)=>{
                setUser(session?.user ?? null)
            })
          })
          
    }, [])
    return (
        <>
  <Nav />
  <main className="container mx-auto px-3 sm:px-0 md:px-0">
    <div id="update-user" className="flex flex-col items-center justify-center">
      <div className="flex flex-col md:w-2/3">
        <div className="rounded-md border-[1px] border-blue-500/60 bg-transparent p-3 dark:border-blue-500/30">
          {" "}
          We take privacy issues seriously. You can be sure that your personal
          data is securely protected.{" "}
        </div>
        <div className="wrap mt-10 flex gap-10">
          <div className="hidden lg:block lg:w-2/5">
            <h2 className="my-3 text-lg font-bold">
              Personal Information - ({user?.user_metadata?.username})
            </h2>
            <p className="text-sm text-black !text-opacity-60 dark:text-white">
              {" "}
              Update your username, email or your description. Remember if you
              changed the email you will need to reactivate the new email.{" "}
            </p>
          </div>
          <div className="w-full lg:w-3/5">
            <form
              onSubmit={(e)=>{
                e.preventDefault()
                if(!isMetaLoading){
                   SubmitMeta().then(()=>{
                    setIsMetaLoading(false)
                   }).catch(()=>{
                    setIsMetaLoading(false)
                   })
                }
              }}
              className="flex flex-col gap-3"
              
            >
              <input
                type="hidden"
                name="_token"
             
              />
              <input type="hidden" name="_method" defaultValue="PUT" />
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="avatar"
                >
                  Avatar
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  className="input "
                  style={{height:'53px'}}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
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
                     defaultValue={user?.user_metadata?.username}
                  />
                </div>
                <div className="flex w-full flex-col gap-3">
                  <label
                    className="text-sm font-medium cursor-pointer max-w-fit"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    autoComplete="off"
                    defaultValue={user?.email}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  className="input"
                  autoComplete="off" 
                  defaultValue={user?.user_metadata?.description}
                 
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
        </div>
        <hr className="mb-10 mt-10 border-black/10 dark:border-white/10" />
        <div className="wrap flex gap-10">
          <div className="hidden lg:block lg:w-2/5">
            <h2 className="my-3 text-lg font-bold">Security</h2>
            <p className="text-sm text-black !text-opacity-60 dark:text-white">
              {" "}
              Update your security information from this section!
            </p>
          </div>
          <div id="update-password" className="w-full lg:w-3/5">
            <form
              onSubmit={(e)=>{
                e.preventDefault()
                if(!isPasswordLoading){
                    SubmitPassword().then(()=>{
                        setIsPasswordLoading(false)
                    }).catch(()=>{
                        setIsPasswordLoading(false)
                    
                    })
                }
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="hidden"
                
              />
              <input type="hidden" name="_method" defaultValue="PUT" />
              <div className="flex w-full flex-col gap-3">
                <label
                  className="text-sm font-medium cursor-pointer max-w-fit"
                  htmlFor="current_password"
                >
                  Current Password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  className="input"
                  autoComplete="off"
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
        </div>
      </div>
    </div>
  </main>
  <Footer />
</>

    )
}