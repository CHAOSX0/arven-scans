import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getRandomKey(length: number): string{
  function randomRange(min: number, max: number) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
  
  }
  
  const valid = ["A", "B", "C", "D", "E", "F", "G", "H", 'I', "J", "K", "L", "M", 'N', 'O', 'P', "Q", "R", "S", "T", "U", "V", "W", "X", "Y", 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  let res = []
  for (let i = 0; i < length; i++) {
    const r = randomRange(0, valid.length)
    res.push(valid[r])
    
  }
  return res.join('')
}
export async function POST(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE

    if(!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) throw 'no database credentials';
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
  const data = await request.formData();
  let body = Object.fromEntries(data);

  const file = body.file
  const dataBody = data.get("data") as string;

  const parsedBody = JSON.parse(dataBody);
  console.log(parsedBody)
  console.log(file)
  console.log(body)
  console.log(dataBody)
  try {
    const key = `${getRandomKey(7)}-${(file as File).name}`
    
    const {error} = await supabase.storage
      .from("pages")
      .upload(key, file as File, {
        upsert: true
      });
      if(error){
        console.log(error)
        return Response.error()
      }
   return NextResponse.json({url:`${SUPABASE_URL}/storage/v1/object/public/pages/${key}`});
  } catch (err) {
    console.error({ error: err });
  }

 
}
