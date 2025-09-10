import React, { useState, useEffect } from "react"
import DeashboardLayout from "../layout/DeashboardLayout"
import { Grid, List, File, Trash2, Download, Lock, Globe, Share2, X, Copy, Eye } from "lucide-react" // 👈 added Eye
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiEndpoints from "../context/apiEndpoint"

const API_BASE = "http://localhost:8080"

export default function Myfiles() {
  const [shareModel, setShareModel] = useState({
    isOpen: false,
    fileId: null,
    link: ""
  })
  const [files, setFiles] = useState([])
  const [viewMode, setViewMode] = useState("grid")
  const { getToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = await getToken()
        const response = await axios.get(apiEndpoints.FETCH_FILES, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFiles(response.data)
      } catch (error) {
        console.error("Error fetching files:", error)
        toast.error("Failed to fetch files")
      }
    }
    fetchFiles()
  }, [getToken])

  // Open share modal
  const openShareModel = (fileId) => {
    const link = `${window.location.origin}/file/${fileId}`
    setShareModel({
      isOpen: true,
      fileId: fileId,
      link: link
    })
  }

  // Close share modal
  const closeShareModel = () => {
    setShareModel({
      isOpen: false,
      fileId: null,
      link: ""
    })
  }

  // Copy share link
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareModel.link)
    toast.success("Link copied to clipboard!")
  }

  // Confirm delete
  const confirmDelete = (file) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span className="mb-2">Are you sure you want to delete <b>{file.name}</b>?</span>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleDelete(file.id)
                closeToast()
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    )
  }

  // Delete file
  const handleDelete = async (fileId) => {
    try {
      const token = await getToken()
      await axios.delete(apiEndpoints.DELETE_FILE(fileId), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFiles(files.filter((file) => file.id !== fileId))
      toast.success("File deleted successfully!")
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
    }
  }

  // Download file
  const downloadFile = async (fileId, fileName) => {
    try {
      const token = await getToken()
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(fileId), {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading file:", error)
      toast.error("Failed to download file")
    }
  }

  // Toggle visibility
  const togglePublic = async (fileId) => {
    try {
      const token = await getToken()
      const response = await axios.patch(apiEndpoints.TOGGLE_FILE(fileId), {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedFile = response.data
      setFiles(files.map((f) => (f.id === updatedFile.id ? updatedFile : f)))
      toast.success("File visibility updated!")
    } catch (error) {
      console.error("Error toggling file visibility:", error)
      toast.error("Failed to toggle file visibility")
    }
  }

  return (
    <DeashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Files */}
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
              >
                <File size={40} className="text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 truncate w-full text-center">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>

                {/* Sharing info */}
                <div
                  className="mt-2 text-xs text-gray-600 flex items-center gap-2 cursor-pointer"
                  onClick={() => togglePublic(file.id)}
                >
                  {file.isPublic ? (
                    <>
                      <Globe size={16} className="text-green-500" />
                      <span>Public</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openShareModel(file.id)
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <Share2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="text-gray-500" />
                      <span>Private</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  {/* 👁️ Eye button */}
                  <button
                    onClick={() => navigate(`/file/${file.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => downloadFile(file.id, file.name)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(file)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 text-sm font-medium text-gray-600">Name</th>
                <th className="p-3 text-sm font-medium text-gray-600">Size</th>
                <th className="p-3 text-sm font-medium text-gray-600">Uploaded At</th>
                <th className="p-3 text-sm font-medium text-gray-600">Sharing</th>
                <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-t">
                  <td className="p-3 text-sm text-gray-700">{file.name}</td>
                  <td className="p-3 text-sm text-gray-700">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="p-3 text-sm text-gray-700">{file.uploadedAt}</td>
                  <td
                    className="p-3 text-sm flex items-center gap-2 cursor-pointer"
                    onClick={() => togglePublic(file.id)}
                  >
                    {file.isPublic ? (
                      <>
                        <Globe size={16} className="text-green-500" />
                        <span>Public</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openShareModel(file.id)
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Share2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Lock size={16} className="text-gray-500" />
                        <span>Private</span>
                      </>
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex items-center gap-4">
                      {/* 👁️ Eye button */}
                      <button
                        onClick={() => navigate(`/file/${file.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => downloadFile(file.id, file.name)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(file)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Share Modal */}
        {shareModel.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
              <button
                onClick={closeShareModel}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-semibold mb-3">Share File</h2>
              <p className="text-sm text-gray-600 mb-2">Share this link with others to give them access to this file:</p>
              <div className="flex items-center border rounded px-2 py-1 mb-4">
                <input
                  type="text"
                  value={shareModel.link}
                  readOnly
                  className="flex-1 text-sm outline-none"
                />
                <button onClick={copyShareLink} className="ml-2 text-blue-600 hover:text-blue-800">
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Anyone with this link can access this file.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeShareModel}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={copyShareLink}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeashboardLayout>
  )
}
