import { createClient } from "@supabase/supabase-js";
export async function POST(request: Request) {
   //$ get env variables
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

    if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) throw 'no database credentials';
    const SupabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    //$ get request jsn
    const body = await request.json()

    //$ return error if no data
    if(!body) return new Response('error', {status: 400});
    if(!body.chapterID || !body.SeriesID) return new Response('error', {status: 400});

    //$ increment chapter row
    const {data, error} = await SupabaseAdmin.rpc('increment', {table_name:'chapters', x: 1, row_id: body.chapterID, field_name: 'views'});
    if(error) return new Response(error.message, {status: 500});
    //$ get latest analytics log (logs are separated into months) note: used let to modify data in case of error
    let {data: analyticsData, error: analyticsError} = await SupabaseAdmin.from('analytics').select('id, created_at').order('created_at', { ascending: false })
    if(analyticsError || !analyticsData) return new Response(analyticsError?.message, {status: 500});
    
    const latest_analytics_row = analyticsData[0];
    const ms_in_month = 1000*60*60*24*30;

    //$ if the log is older than a month create a new one
    const is_month_old: boolean= (new Date().getTime() - new Date(latest_analytics_row.created_at).getTime() > ms_in_month);
    if(is_month_old){
      const {error: analytics_new_row_error} = await  SupabaseAdmin.from('analytics').insert({number: 1, type: 'views_total'});
      if(analytics_new_row_error) return new Response(analytics_new_row_error.message, {status: 500});
    }

    //$ if month old return no error (since new row was set to 1) otherwise increment latest row
    const {error: totalError} = is_month_old ? {error: null} : await SupabaseAdmin.rpc('increment', 
    {
      table_name:'analytics',
     x: 1,
     row_id: latest_analytics_row.id,
     field_name: 'number'
     })

    //$ increment the series
    if(totalError) return new Response(totalError.message, {status: 500});
    const {error: seriesError} = await SupabaseAdmin.rpc('increment', {table_name:'series', x: 1, row_id:body.SeriesID , field_name: 'views'})
    if(seriesError) return new Response(seriesError.message, {status: 500});
     return new Response('success', {status:200})
  
  }