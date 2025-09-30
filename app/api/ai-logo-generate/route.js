// api/ai-logo-generate-prompt/route.js (Cloudinary Version)
import { NextResponse } from "next/server";
import { generateFinalprompt, generateLogo } from "../../../config/aiModel";
import { db } from "../../../config/firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log("Generating logo for user:", userId);

    // Step 1: Generate the final AI prompt
    const result = await generateFinalprompt(prompt);
    const finalprompt = JSON.parse(result);

    if (!finalprompt?.prompt) {
      throw new Error("Invalid response from prompt generation");
    }

    console.log("Final prompt generated:", finalprompt.prompt);

    // Step 2: Generate the logo image buffer
    const imageBuffer = await generateLogo(finalprompt.prompt);
    
    if (!imageBuffer) {
      throw new Error("Failed to generate image buffer");
    }

    console.log("Image buffer generated, size:", imageBuffer.length);

    // Step 3: Upload to Cloudinary
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: `logos/${userId}`,
      public_id: `logo_${Date.now()}`,
      resource_type: 'image',
    });

    console.log("Uploaded to Cloudinary:", uploadResponse.secure_url);

    // Step 4: Save logo metadata in Firestore
    const logosRef = collection(db, "users", userId, "logos");
    const docRef = await addDoc(logosRef, {
      prompt: finalprompt.prompt,
      imageUrl: uploadResponse.secure_url,
      cloudinaryPublicId: uploadResponse.public_id,
      createdAt: serverTimestamp(),
    });

    console.log("Logo metadata saved to Firestore with ID:", docRef.id);

    // Step 5: Return response
    return NextResponse.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
      prompt: finalprompt.prompt,
      logoId: docRef.id,
      message: "Logo generated and stored successfully",
    });

  } catch (error) {
    console.error("Logo Generation API Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to generate logo", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}