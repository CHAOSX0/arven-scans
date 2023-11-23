import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://uuckqeakqoiezqehbitr.supabase.co', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Y2txZWFrcW9pZXpxZWhiaXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NDQzNTEsImV4cCI6MjAxNjMyMDM1MX0.ioakpOpVL5lr7E_a-RLftdosaQ0uMl24_SryLlWRaDI`)

export default supabase;