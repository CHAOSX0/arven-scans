import DashboardNav from "@/app/dashboard/components/nav/nav";
import EditAdForum from "./forum";
import { notFound } from "next/navigation";
import supabase from "../../../../../../../supabase";
import Link from "next/link";

async function getData(id: string) {
  const id_number = parseInt(id)

  //$ parseInt only returns number values and NaN(which is actually considered a number btw) being a falsy value 
  //$returned only when parsing fails we can use it to check if the id string from the URL is a number or not
  console.log(id_number, 'num')
  if (!id_number) {
    console.log(id)
    //% show 404 pagre and stop execution
    notFound()
  }
  const { data, error } = await supabase.from('ads').select('status, type, id, clicks, bannerURL, URL, identifier, code, name').eq('id', id_number)

  //$ if error show 404 page
  if (error) {
    notFound()
  }
  if (!data[0]) {
    notFound()
  }
  return data[0]
}
export default async function EditAdd({ params: { id } }: { params: { id: string } }) {
  const ad = await getData(id)
  return (
    <main>
      <DashboardNav currentPage="settings" />
      <section className="container-app p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h3 className="text-3xl font-bold tracking-tight">
                Edit Ad - {ad.name}
              </h3>
              <Link
                className="flex items-center gap-1 rounded-md border-[1px] border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/10 dark:border-white/10 dark:bg-[#09090b] dark:hover:bg-white/10"
                href="/dashboard/table/ads"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                <span>Back</span>
              </Link>
            </div>
          </div>
          <hr className="border-black/10 dark:border-white/10" />
          <EditAdForum initialData={ad} />
        </div>
      </section>
    </main>

  )
}