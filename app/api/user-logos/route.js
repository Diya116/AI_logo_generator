// api/user-logos/route.js
import { NextResponse } from "next/server";
import { db } from "../../../config/firebaseconfig";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all logos for a user
export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: "Unauthorized" 
      }, { status: 401 });
    }

    console.log("Fetching logos for user:", userId);

    // Query the user's logos subcollection
    const logosRef = collection(db, "users", userId, "logos");
    const q = query(logosRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const logos = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logos.push({
        id: docSnap.id,
        ...data,
        // Convert Firestore timestamp to ISO string for frontend
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });

    console.log("Fetched logos count:", logos.length);

    return NextResponse.json({
      success: true,
      logos,
      count: logos.length
    });

  } catch (error) {
    console.error("Error fetching logos:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch logos", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific logo
export async function DELETE(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: "Unauthorized" 
      }, { status: 401 });
    }

    const { logoId } = await req.json();
    
    if (!logoId) {
      return NextResponse.json({ 
        success: false,
        error: "Logo ID is required" 
      }, { status: 400 });
    }

    console.log("Deleting logo:", logoId, "for user:", userId);

    // Get the logo document to retrieve cloudinary public_id
    const logoDocRef = doc(db, "users", userId, "logos", logoId);
    const logoDoc = await getDoc(logoDocRef);

    if (!logoDoc.exists()) {
      return NextResponse.json({ 
        success: false,
        error: "Logo not found" 
      }, { status: 404 });
    }

    const logoData = logoDoc.data();

    // Delete from Cloudinary if public_id exists
    if (logoData.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(logoData.cloudinaryPublicId);
        console.log("Deleted from Cloudinary:", logoData.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error("Failed to delete from Cloudinary:", cloudinaryError);
        // Continue with Firestore deletion even if Cloudinary fails
      }
    }

    // Delete from Firestore
    await deleteDoc(logoDocRef);

    console.log("✅ Logo deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Logo deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting logo:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete logo", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}