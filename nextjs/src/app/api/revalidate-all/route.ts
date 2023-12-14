import { revalidatePath } from 'next/cache'

export function GET(){
revalidatePath('/', 'layout')
console.log('revalidated')
return Response.json({success: true})
}