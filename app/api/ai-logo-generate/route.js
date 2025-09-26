import {NextResponse} from "next/server";
import { generateFinalprompt } from "../../../config/aiModel";
export async function POST(req)
{
  try{
      const { prompt } = await req.json();
       
       if (!prompt) {
         return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
       }
   
       const result = await generateFinalprompt(prompt);
       console.log(result);
       
       return NextResponse.json(JSON.parse(result));
  }
  catch(error)
  {
console.error("AI API Error:", error);
    return NextResponse.json({ 
      error: "Failed to generate AI response" 
    }, { status: 500 });
  }
}