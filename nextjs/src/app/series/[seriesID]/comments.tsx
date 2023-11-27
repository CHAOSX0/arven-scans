"use client";

import { useRouter } from "next/navigation";
import supabase from "../../../../supabase";
import {useState, useEffect} from 'react'
import toast from "react-hot-toast";
import chapter from "@/app/types/chapter";

type comment= {
    created_at: string,
    text: string,
    authorUsername: string,
    id: number,
    author: string,
    authorAvatar: string,
    votes: number,
    time: string,
}

function timeAgo(dateString: string) {
    const currentDate = new Date();
    console.log(dateString)
    const pastDate = new Date(parseInt(dateString));
    console.log(pastDate)
    const seconds = Math.floor((currentDate.getTime() - parseInt(dateString)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    }
  }

function Comment({author, text, time, votes, id, authorAvatar, authorUsername}: {author: string, text: string, created_at: string, votes: number, id: number, authorAvatar: string, authorUsername: string, time: string}){
    const [Votes, setVotes] = useState(votes)
    async function incrementVote(v: number, id: number) {
        const key = `series-${id}-like`
        const isLiked: boolean = JSON.parse(localStorage.getItem(key) || 'false') == 'true'? true : false
      
        if(v==1 && isLiked) return;
        if(v == -1 && isLiked == false) return;
        if(v==1)localStorage.setItem(key, JSON.stringify('true'));
        if(v== -1)localStorage.setItem(key, JSON.stringify('false'));
        const {data, error} = await supabase.rpc('increment', {table_name:'comments', x: v, row_id: id, field_name: 'votes'})
        setVotes(prev=>prev + v)
        if(error) toast.error(error.message);
        console.log(error)
    }
    return (
        <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <img
            className="h-10 w-10 rounded-full border-[1px] border-solid border-black/5 object-cover object-top dark:border-none"
            src={`https://uuckqeakqoiezqehbitr.supabase.co/storage/v1/object/public/avatars/${authorAvatar}` || '/no-image.jpg'}
            alt="admin"
          />
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-2 rounded-md border-[1px] border-black/10 px-5 py-3 pb-4 dark:border-white/10">
              <div className="flex gap-1 items-baseline">
                <h3 className="font-bold">{authorUsername}</h3>
                <span className="text-black dark:dark:text-white !text-opacity-60 text-xs">
                  {timeAgo(time)}
                </span>
              </div>
              <p className="text-sm">{text}</p>
            </div>
            <div className="flex items-baseline gap-3">
              <form
                onSubmit={(e)=>{
                    e.preventDefault()
                    incrementVote(1, id)
                    
                }}
              >
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="ioa0KDlR8jCy5XeZOzvAnal9MQmPAiuLdRULjmGC"
                />
                <div className="flex items-baseline gap-2">
                  <button>
                    <svg
                      width={48}
                      height={48}
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 h-4 w-4 hover:fill-black dark:hover:fill-white"
                      id="like-btn"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </button>
                </div>
              </form>
              <form
               onSubmit={(e)=>{
                e.preventDefault()
                incrementVote(-1, id)
               
               }}
              >
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="ioa0KDlR8jCy5XeZOzvAnal9MQmPAiuLdRULjmGC"
                />
                <button>
                  <svg
                    width={48}
                    height={48}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 h-4 w-4 hover:fill-black dark:hover:fill-white"
                    id="dislike-btn"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                  </svg>
                </button>
              </form>
              <span
                className="text-sm text-black dark:text-white"
                id="total-likes"
              >
                {Votes}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
}
export default function SeriesComments({slug}: {slug: string}){
    const [IsLoading, setIsLoading] = useState<Boolean>(false)
    const [Comments, setComments] = useState<comment[]>([])
    const [commentsNumber, setCommentsNumber] =  useState<number>(0)
    const [formText, setFormText] = useState<string>('')
    const [formSize, setFormSize] = useState<number>(0)
    const router = useRouter()
    useEffect(() => {
     supabase.from('comments').select().eq('seriesSlug', slug).then((res)=>{
        setComments(res.data || [])
     })
    }, [])
    const commentsElements = Comments.map((c: comment, i: number)=> <Comment key={i} {...c} />)
    async function HandelSubmit(){
       const {data: {user}} = await supabase.auth.getUser()
       if(user){
          const text = (document.getElementById('comment-input')  as HTMLInputElement).value
          const author = user.id
          const {error, data} = await supabase.from('comments').insert({text, author, votes: 0, authorUsername: user.user_metadata.username, authorAvatar: user.user_metadata.avatar, seriesSlug: slug, time: `${new Date().getTime()}`}).select()
          if(!error){
            toast.success('posted comment successfully')
            console.log(data, 'data')
            setComments((prev: any) =>{
                if(data){
                    let res = [...prev]
                    res.push(data[0])
                  return res

                }else{
                    return prev
                }
               
            })
            setFormText('')
            setFormSize(0)
          }else{
            toast.error(error.message)
          }
       }else{
        toast.error('you need to be signed in');
        router.push('/login')
       }
    }
    return (
        <div id="comments-list" className="w-full lg:w-3/4">
  <h2 className="mb-3 block text-lg font-bold leading-[1rem]">Comments ({commentsNumber}) </h2>
  <form onSubmit={(e)=>{
    e.preventDefault()
    if(IsLoading) return;
    HandelSubmit().then(()=>{
        
        setIsLoading(false)
    }).catch(()=>{
        setIsLoading(false)
    })
  }}>
    <input
      type="hidden"
      name="_token"
      defaultValue="ioa0KDlR8jCy5XeZOzvAnal9MQmPAiuLdRULjmGC"
    />
    <input type="hidden" name="type" defaultValue="App\Models\Manga" />
    <input type="hidden" name="key" defaultValue={24} />
    <div className="relative">
      <input
        name="comment"
        type="text"
        id="comment-input"
        className="input w-full py-4 focus:outline-none bg-[transparent]"
        autoComplete="off"
        placeholder="Add Comment..."
        value={formText}
        onChange={(e)=>{
            e.preventDefault
            setFormText(e.target.value)
            setFormSize(e.target.value.length)
        }}
        required
      />
      <button
        className="right-4 absolute top-1/2 -translate-y-1/2"
        type="submit"
        
      >
        <svg
          className="h-5 w-5 text-blue-500"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
        </svg>
      </button>
    </div>
    <p className="mt-1 text-xs text-black !text-opacity-50 dark:text-white">
      <span id="comment-char">{formSize}</span>/500 Max{" "}
    </p>
  </form>
  <div className="mt-5 flex flex-col gap-4">
    {commentsElements}
  </div>
</div>

    )}