import { db } from "../../../config/firebaseconfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } =await auth(); // secure Clerk userId
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userName, userEmail } = await req.json();

    const docRef = doc(db, "users", userId); // use userId as doc ID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      const data = {
        name: userName,
        email: userEmail,
        credits: 5,
        createdAt: new Date().toISOString(),
      };

      await setDoc(docRef, data);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to store user data", details: error.message },
      { status: 500 }
    );
  }
}
