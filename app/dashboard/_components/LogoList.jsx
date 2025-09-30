"use client";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../_context/UserDetailContext";
import Image from "next/image";
import { Button } from "../../../components/ui/Button";
import { Download, Trash2, Loader2 } from "lucide-react";

function LogoList() {
  const { userDetail } = useContext(UserDetailContext);
  const [logoList, setLogoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (userDetail) {
      GetUserLogos();
    }
  }, [userDetail]);

  const GetUserLogos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch logos from API route
      const response = await fetch(`/api/user-logos?userId=${userDetail.email}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(data.error || "Failed to load logos");
      }

      console.log("Fetched logos:", data.logos.length);
      setLogoList(data.logos);
    } catch (error) {
      console.error("Error fetching logos:", error);
      setError("Failed to load logos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl, logoId) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `logo-${logoId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      
      console.log("✅ Logo downloaded successfully");
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download logo. Please try again.");
    }
  };

  const handleDelete = async (logoId) => {
    if (!confirm("Are you sure you want to delete this logo?")) {
      return;
    }

    try {
      setDeletingId(logoId);

      // Call delete API
      const response = await fetch(`/api/user-logos`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          logoId,
          userId: userDetail.email 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete logo");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete logo");
      }

      // Remove from local state
      setLogoList((prev) => prev.filter((logo) => logo.id !== logoId));

      console.log("✅ Logo deleted successfully");
    } catch (error) {
      console.error("Error deleting logo:", error);
      alert("Failed to delete logo. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mt-10 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading your logos...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Error:</strong> {error}
        <Button 
          onClick={GetUserLogos} 
          variant="outline" 
          size="sm" 
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (logoList.length === 0) {
    return (
      <div className="mt-10 text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-lg">
          No logos generated yet. Create your first logo to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Logos ({logoList.length})</h2>
        <Button onClick={GetUserLogos} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {logoList.map((logo) => (
          <div 
            key={logo.id} 
            className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Image Container */}
            <div className="relative aspect-square">
              <img
                src={logo?.imageUrl || "/placeholder-logo.png"}
                
                alt={logo?.prompt?.substring(0, 50) || "Generated logo"}
                className="object-cover"
           
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(logo.imageUrl, logo.id)}
                  className="transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(logo.id)}
                  disabled={deletingId === logo.id}
                  className="transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  {deletingId === logo.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Logo Info */}
            <div className="p-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {logo?.prompt?.substring(0, 60) || "No description"}...
              </p>
              {logo?.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(logo.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoList;