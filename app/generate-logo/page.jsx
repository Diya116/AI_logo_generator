"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import Prompt from "../_data/Prompt";
import { UserDetailContext } from "../_context/UserDetailContext";
import axios from "axios";
import { Button } from "../../components/ui/Button";
import Link from "next/link";

function Page() {
  const [formData, setFormData] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasGeneratedRef = useRef(false); // ADDED: Missing ref declaration

  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  // Load form data from localStorage and start logo generation when user is available
  useEffect(() => {
    // Prevent multiple generations
    if (hasGeneratedRef.current) {
      return;
    }

    if (typeof window !== "undefined" && userDetail?.email) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        try {
          const parsedData = JSON.parse(storage);
          setFormData(parsedData);
          console.log("Form Data loaded:", parsedData);
          
          // Check if user has credits before generating
          if (userDetail.credits > 0) {
            hasGeneratedRef.current = true; // Mark as generated
            GenerateAILogo(parsedData);
          } else {
            setError("Insufficient credits. Please purchase more credits to generate logos.");
          }
        } catch (err) {
          console.error("Error parsing form data from localStorage:", err);
          setError("Invalid form data in storage");
        }
      } else {
        setError("No form data found. Please go back and fill out the logo details.");
      }
    }
  }, [userDetail?.email]);

  const GenerateAILogo = async (formDataToUse) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formDataToUse?.title) {
        throw new Error("Form data is missing or incomplete");
      }

      // Build prompt from template
      const PROMPT = Prompt.LOGO_PROMPT
        .replace("{logoTitle}", formDataToUse?.title || "")
        .replace("{logoDesc}", formDataToUse?.desc || "")
        .replace("{logoColor}", formDataToUse?.palette || "")
        .replace("{logoIdea}", formDataToUse?.idea || "")
        .replace("{logoDesign}", formDataToUse?.design?.title || "")
        .replace("{logoPrompt}", formDataToUse?.design?.prompt || "");

      console.log("Generated Prompt:", PROMPT);

      // Call the backend API 
      const result = await axios.post("/api/ai-logo-generate", {
        prompt: PROMPT,
      });

      console.log("API Response:", result.data);

      if (!result.data?.success) {
        throw new Error(result.data?.error || "Invalid response from logo generation API");
      }

      // The backend returns a Cloudinary URL
      const imageUrl = result.data.imageUrl;
      console.log("Received image URL from backend:", imageUrl);

      setImageSrc(imageUrl);
      
      // Update user credits locally 
      if (setUserDetail && userDetail) {
        setUserDetail({
          ...userDetail,
          credits: Math.max(0, userDetail.credits - 1)
        });
      }
      
    } catch (error) {
      console.error("Error generating AI Logo:", error);
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to generate logo";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Fetch the image from Cloudinary URL
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `logo-${Date.now()}.png`; // unique filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // free memory
      
      console.log(" Logo downloaded successfully");
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download logo. Please try again.");
    }
  };

  const handleRegenerate = () => {
    if (formData) {
      if (userDetail?.credits > 0) {
        // Reset the ref to allow regeneration
        hasGeneratedRef.current = false;
        GenerateAILogo(formData);
      } else {
        setError("Insufficient credits. Please purchase more credits to generate logos.");
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Credits Display */}
      {userDetail && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Available Credits:</strong> {userDetail.credits}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
          {error.includes("credits") && (
            <div className="mt-2">
              <Link href="/purchase-credits">
                <Button variant="outline" size="sm">Purchase Credits</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary text-primary rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Generating your logo... This may take 30-60 seconds.
          </div>
        </div>
      )}

      {/* Show initial loading message if no form data and no error */}
      {!formData && !error && !loading && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700 mr-2"></div>
            Loading your logo details...
          </div>
        </div>
      )}

      {/* Regenerate Button */}
      {imageSrc && !loading && (
        <div className="mb-4 flex gap-2">
          <Button 
            onClick={handleRegenerate}
            disabled={loading || !userDetail?.credits}
            variant="outline"
          >
            Generate New Logo ({userDetail?.credits || 0} credits)
          </Button>
        </div>
      )}

      {/* Generated Image */}
      {imageSrc && (
        <div className="mt-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Generated Logo:</h3>
          <img 
            src={imageSrc} 
            alt="Generated Logo" 
            className="w-full max-w-md h-auto object-contain border border-gray-300 rounded-2xl shadow-lg"
            onLoad={() => console.log("Image loaded successfully")}
            onError={(e) => {
              console.error("Image failed to load:", e);
              setError("Failed to display generated image. The URL may be invalid.");
            }}
          />
          
          {/* Download Button */}
          <div className="mt-4 flex gap-2">
            <Button onClick={handleDownload} className="cursor-pointer">
              Download Logo
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;