import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, Share2, Copy, Download } from "lucide-react";
import apiEndpoints from "../context/apiEndpoint";
import axios from "axios";

export default function PublicFileView() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shareModel, setShareModel] = useState({ isOpen: false, link: "" });
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useAuth();
  const { fileId } = useParams();

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(apiEndpoints.PublicFileView(fileId));
        setFile(res.data);

        // Try to generate preview URL if image
        const ext = res.data.name.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          setPreviewUrl(apiEndpoints.DOWNLOAD_FILE(fileId)); // preview from same download endpoint
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not retrieve file");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const handleDownload = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
        headers: { Authorization: `Bearer ${token}` }, // 👈 fix: include auth
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to download file");
      console.log("Download error", error);
    }
  };

  const openShareModel = () => {
    setShareModel({
      isOpen: true,
      link: window.location.href,
    });
  };

  const closeShareModel = () => {
    setShareModel({
      isOpen: false,
      link: "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">Loading file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="p-4 border-b bg-white">
        <div className="container max-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Share2 className="text-blue-600" />
            <span className="font-bold text-xl text-gray-800">CloudShare</span>
          </div>
          <button
            onClick={openShareModel}
            className="flex items-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg"
          >
            <Copy size={16} />
            <span>Share Link</span>
          </button>
        </div>
      </header>

      <main className="p-6 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">{file.name}</h2>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="max-w-lg rounded-lg shadow"
          />
        ) : (
          <p className="text-gray-500">Preview not supported for this file type.</p>
        )}

        <button
          onClick={handleDownload}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          <Download size={18} />
          Download
        </button>
      </main>
    </div>
  );
}
