import DashboardNav from "../../../components/nav/nav";
import Forum from "./forum";
export default function AddSeries({params}: {params: {seriesID: string}}){
    return(
       <main>
        <DashboardNav currentPage=""  />
        <Forum  params={params}/>
       </main>

    )
}