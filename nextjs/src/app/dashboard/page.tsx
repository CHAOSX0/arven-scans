import DashboardNav from "./components/nav/nav";
import supabase from "../../../supabase";
import { notFound } from "next/navigation";

import { createClient } from '@supabase/supabase-js'
type timeLogNumbers ={lastMonth: number, currentMonth: number}
async function getViews(): Promise<timeLogNumbers> {
   
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) notFound();
  const SupabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  const {data, error} = await SupabaseAdmin.from('analytics').select('number, created_at').order('created_at', {ascending: false})

  if(error) notFound();
  const latest_log = data[0]
  const second_to_last = data[1]
  const ms_in_month = 1000*60*60*24*30;
  const is_latest_log_month_old = new Date().getTime() -  new Date(latest_log.created_at).getTime() > ms_in_month
  return {
    //$ if the latest month is a month old or its number is falsy (i.e: 0, undefined, null) return 0 otherwise return the number
    currentMonth: is_latest_log_month_old ? 0 : data?.[0]?.number || 0,
    //$ if the latest month is a month old return its number as the PAST(second to last) month's number otherwise
    //$ return the second to last month's number
    lastMonth: is_latest_log_month_old ? latest_log.number : second_to_last.number
  }
}
//$Fetch Functions Start
async function GetTotalTable(table: string): Promise<timeLogNumbers> {
  const { error: currentError, count: currentCount } = await supabase.from(table).select('*', { count: 'exact', head: false })
  if (currentError)  notFound();
  const {error: logsError, data: logsData} = await supabase.from('analytics').select('number').eq('type', `${table}_count`).limit(2)
  const lastMonthLog = logsData?.[1]
  if(logsError) notFound();
  //$ if count is null return zero
  return {
    lastMonth: lastMonthLog?.number || 0,
    currentMonth: currentCount || 0
  }
}
async function getUserCount(): Promise<timeLogNumbers>{
  //@ this function uses service role (admin credentials) BE CAREFUL
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) notFound();
  const SupabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  const { count: currentCount, error: currentError } = await SupabaseAdmin.from('users').select('', { count: 'exact', head: false })
  const {data: logData, error: logError} = await SupabaseAdmin.from('analytics').select('number, created_at').order('created_at', {ascending: false}).eq('type', 'user_count')
  const second_toLast_log =logData?.[1]
  //$ throw any errors
  if (currentError || logError) notFound();
  //$ if count is null return zero
  return {lastMonth: second_toLast_log?.number || 0, currentMonth: currentCount || 0}
}

function getPercentage(current: number, last: number): string{
  return `${current - last >= 0 ?  '' : '-' }${Math.abs(100 - Math.round(current / last * 10000)/10000 *100 )}%`
}
export default async function Dashboard() {
  const seriesCount: timeLogNumbers = await GetTotalTable('series')
  const chapterCount: timeLogNumbers = await GetTotalTable('chapters')
  const userCount: timeLogNumbers = await getUserCount()
  const views: timeLogNumbers  = await getViews()
  const viewsRisePercentage = getPercentage(views.currentMonth, views.lastMonth)
  const userCountPercentage = getPercentage(userCount.currentMonth, userCount.lastMonth)
  const chapterCountPercentage = getPercentage(chapterCount.currentMonth, chapterCount.lastMonth)
  const seriesCountPercentage = getPercentage(userCount.currentMonth, userCount.lastMonth)
  return (
    <main className="relative">
      <DashboardNav currentPage="/" />
      <section className="container-app pl-4 pt-4">
        <section className="flex flex-col gap-5">
          <h3 className="text-3xl font-bold tracking-tight">Dashboard</h3>
          <a href="https://discord.gg/arven">
            <div className="flex items-start gap-3 rounded-md bg-gray-600 p-3 text-white transition hover:bg-gray-700">
              <svg
                width={48}
                height={48}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path d="M18.654 6.368a15.87 15.87 0 0 0-3.908-1.213.06.06 0 0 0-.062.03c-.17.3-.357.693-.487 1a14.628 14.628 0 0 0-4.39 0 9.911 9.911 0 0 0-.494-1 .061.061 0 0 0-.063-.03c-1.35.233-2.664.64-3.908 1.213a.05.05 0 0 0-.025.022c-2.49 3.719-3.172 7.346-2.837 10.928a.068.068 0 0 0 .025.045 15.936 15.936 0 0 0 4.794 2.424.06.06 0 0 0 .067-.023c.37-.504.699-1.036.982-1.595a.06.06 0 0 0-.034-.084 10.65 10.65 0 0 1-1.497-.714.06.06 0 0 1-.024-.08.06.06 0 0 1 .018-.022c.1-.075.201-.155.297-.234a.06.06 0 0 1 .061-.008c3.143 1.435 6.545 1.435 9.65 0a.062.062 0 0 1 .033-.005.061.061 0 0 1 .03.013c.096.08.197.159.298.234a.06.06 0 0 1 .016.081.062.062 0 0 1-.021.021c-.479.28-.98.518-1.499.713a.06.06 0 0 0-.032.085c.288.558.618 1.09.98 1.595a.06.06 0 0 0 .067.023 15.885 15.885 0 0 0 4.802-2.424.06.06 0 0 0 .025-.045c.4-4.14-.671-7.738-2.84-10.927a.04.04 0 0 0-.024-.023Zm-9.837 8.769c-.947 0-1.726-.87-1.726-1.935 0-1.066.765-1.935 1.726-1.935.968 0 1.74.876 1.726 1.935 0 1.066-.765 1.935-1.726 1.935Zm6.38 0c-.946 0-1.726-.87-1.726-1.935 0-1.066.764-1.935 1.725-1.935.969 0 1.741.876 1.726 1.935 0 1.066-.757 1.935-1.726 1.935Z" />
              </svg>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Join our community!</h3>
                <p className="text-white text-opacity-90">
                  {" "}
                  Stay Connected with Us on Discord - Get the Latest Updates,
                  Discuss Bugs, and Engage in the Project Discussions!
                </p>
              </div>
            </div>
          </a>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="boder-black/10 flex flex-col gap-4 rounded-lg border-[1px] p-6 shadow-sm dark:border-white/10 dark:shadow-none">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium tracking-tight">Total Series</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{seriesCount.currentMonth}</span>
                <span className="text-muted-foreground text-xs text-gray-500">
                  {seriesCountPercentage} from last month
                </span>
              </div>
            </div>
            <div className="boder-black/10 flex flex-col gap-4 rounded-lg border-[1px] p-6 shadow-sm dark:border-white/10 dark:shadow-none">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium tracking-tight">Series Chapters</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{chapterCount.currentMonth}</span>
                <span className="text-muted-foreground text-xs text-gray-500">
                  {chapterCountPercentage} from last month
                </span>
              </div>
            </div>
            <div className="boder-black/10 flex flex-col gap-4 rounded-lg border-[1px] p-6 shadow-sm dark:border-white/10 dark:shadow-none">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium tracking-tight">Total Views</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{views.currentMonth}</span>
                <span className="text-muted-foreground text-xs text-gray-500">
                  {viewsRisePercentage} from last month
                </span>
              </div>
            </div>
            <div className="boder-black/10 flex flex-col gap-4 rounded-lg border-[1px] p-6 shadow-sm dark:border-white/10 dark:shadow-none">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium tracking-tight">Total Members</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3 h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{userCount.currentMonth}</span>
                <span className="text-muted-foreground text-xs text-gray-500">
                 {userCountPercentage} from last month
                </span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>

  )
}