import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from 'fs'
var AdmZip = require('adm-zip');
var https = require('https');

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
const body = await request.json()

     
      
      https.get(body.file, function(res:any) {
        var data:any = [], dataLen = 0; 
      
        res.on('data', function(chunk:any) {
          data.push(chunk);
          dataLen += chunk.length;
      
        }).on('end', async function() {
          var buf = Buffer.alloc(dataLen);
      
          for (var i = 0, len = data.length, pos = 0; i < len; i++) { 
            data[i].copy(buf, pos); 
            pos += data[i].length; 
          } 
      
          var zip = new AdmZip(buf);
          console.log(zip)
          var zipEntries = zip.getEntries();
          console.log(zipEntries)
          console.log(zipEntries.length)
          const chapters = {}
          let ei= 0
          for await (let entry of zipEntries) {
            ei++
            const name = entry.entryName
            const slices = name.split('/')
            const fileName = slices[1]
            const chapterNumber = parseInt(slices[0])
            if(!chapterNumber) return Response.error();
            
            if(!entry.isDirectory){
              const data = entry.getData()
              console.log(name)
              console.log(typeof data)
               const key = `${getRandomKey(7)}-${fileName}`.replace(' ', '-')
               console.log(key)
               const {error} = await supabase.storage.from('pages').upload(key, data)
                console.log(error)
                if(error){
                  return Response.error()
                }
                const url = `${SUPABASE_URL}/storage/v1/object/public/pages/${key}` 
                //@ts-ignore
                chapters[chapterNumber] = [...(chapters[chapterNumber] || []),url ]
                console.log(url)
                console.log(slices)
                //$ if its the last
                if(ei == zipEntries.length){
                 console.log(chapters)
                }else{
                  console.log(ei, zipEntries.length)
                }
             
            }
           
          }
          const chaptersNumbers = Object.keys(chapters);
          let ci = 0
          for await (const chapterNumber of chaptersNumbers){
            ci++
            //@ts-ignore
            const pages = chapters[chapterNumber]
            console.log(pages)
            const number = parseInt(chapterNumber)
            if(!number){
              return Response.error()
            }
            const {error} = await supabase.from('chapters').insert({
              seriesSlug:body.series,
              number: parseInt(chapterNumber),
              pages,
              views:0,
     
            })
            if(error){
              return Response.error()
            }
            if(ci == chaptersNumbers.length){
              return Response.json({success: true})
            }
          }

           
        });
      });

console.log(body) 

}
