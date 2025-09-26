import { db } from "../../../config/firebaseconfig";
import { doc,getDoc,setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req)
{
    const {userEmail,userName}=await req.json();
    try{
     const docRef=doc(db,'user',userEmail);
     const docSnap=await getDoc(docRef);
     if(docSnap.exists())
     {
        return NextResponse.json(docSnap.data())
     }
     else{
        const data={
            name:userName,
            email:userEmail,
            credits:5
        }
        await setDoc(doc(db,"user",userEmail),{
            ...data
        })
       return NextResponse.json(data)
     }
    }
    catch(error)
    {
     console.error("authentication error:", error);
    return NextResponse.json({ 
      error: "Failed to store user data" 
    }, { status: 500 });
    }
}