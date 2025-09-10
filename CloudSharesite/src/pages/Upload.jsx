import React, { useState } from "react";
import DeashboardLayout from "../layout/DeashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useUserCreditsContext } from "../context/UserCreditsContext";
import apiEndpoints from "../context/apiEndpoint";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud } from "lucide-react";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { getToken } = useAuth();
  const { credits, fetchUserCredits } = useUserCreditsContext();

  const MAX_FILE = 5;

  // File selection
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > MAX_FILE) {
      toast.error("⚠️ You can only upload 5 files at a time");
      return;
    }
    setFiles(Array.from(selectedFiles));
  };

  // Remove file
  const handleRemoveFile = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  // Upload with credit check
  const handleUpload = async () => {
    if (credits <= 0) {
      toast.error("❌ You don’t have enough credits to upload files.");
      return;
    }

    if (files.length === 0) {
      toast.error("⚠️ Please select at least one file");
      return;
    }

    if (files.length > credits) {
      toast.error(
        `⚠️ You only have ${credits} credits left but selected ${files.length} files.`
      );
      return;
    }

    setUploading(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch(apiEndpoints.UPLOAD_FILES, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      await response.json();
      toast.success("✅ Files uploaded successfully!");
      setFiles([]);
      fetchUserCredits(); // refresh credits
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to upload files. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DeashboardLayout activeMenu="upload">
      <div className="p-6">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">📤 Upload Files</h1>
          <span className="text-gray-600 font-medium">
            {credits} credits remaining
          </span>
        </div>

        {/* Upload box */}
        <div className="border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 p-10 flex flex-col items-center justify-center text-center">
          <UploadCloud className="h-12 w-12 text-blue-500 mb-3" />
          <p className="text-gray-700 font-medium">Drag and drop files here</p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse ({credits} credits remaining)
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Files
          </label>
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Selected Files:</h2>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{file.name}</span>
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => handleRemoveFile(file)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload button */}
        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading || credits <= 0}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            {uploading
              ? "Uploading..."
              : credits <= 0
              ? "No Credits"
              : "Upload"}
          </button>
        )}
      </div>
    </DeashboardLayout>
  );
}
