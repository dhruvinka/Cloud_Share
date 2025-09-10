import { useAuth } from "@clerk/clerk-react"
import React, { useEffect, useState } from "react"
import DeashboardLayout from "../layout/DeashboardLayout"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useUserCreditsContext } from "../context/UserCreditsContext"
import { File, Upload, CreditCard, Star } from "lucide-react"
import apiEndpoints from "../context/apiEndpoint"

export default function Dashboard() {
  const { getToken } = useAuth()
  const [uploads, setUploads] = useState([])
  const [recentFiles, setRecentFiles] = useState([])
  const { credits, setCredits } = useUserCreditsContext()

  const usedCredits = uploads.length

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken()
      try {
        const filesRes = await fetch(apiEndpoints.FETCH_FILES, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (filesRes.ok) {
          const data = await filesRes.json()
          setRecentFiles(data.slice(0, 5))
          setUploads(data)
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      }
    }

    fetchData()
  }, [getToken, setCredits])

  const usageChartData = [
    { name: "Used", value: usedCredits },
    { name: "Remaining", value: credits },
  ]

  const fileTypeCounts = uploads.reduce((acc, file) => {
    const ext = file.name?.split(".").pop().toLowerCase() || "other"
    acc[ext] = (acc[ext] || 0) + 1
    return acc
  }, {})

  const fileTypeChartData = Object.entries(fileTypeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  // Find most popular file type
  const mostPopularFileType =
    fileTypeChartData.length > 0
      ? fileTypeChartData.reduce((a, b) => (a.value > b.value ? a : b)).name
      : "N/A"

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"]

  return (
    <DeashboardLayout activeMenu="dashboard">
      <div className="p-6 space-y-8">
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Credits */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white flex items-center">
            <CreditCard className="w-10 h-10 mr-4 opacity-90" />
            <div>
              <p className="text-sm opacity-80">Current Credits</p>
              <p className="text-3xl font-bold">{credits}</p>
            </div>
          </div>

          {/* Uploads */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white flex items-center">
            <Upload className="w-10 h-10 mr-4 opacity-90" />
            <div>
              <p className="text-sm opacity-80">Files Uploaded</p>
              <p className="text-3xl font-bold">{uploads.length}</p>
            </div>
          </div>

          {/* Most Popular File Type */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white flex items-center">
            <Star className="w-10 h-10 mr-4 opacity-90" />
            <div>
              <p className="text-sm opacity-80">Most Popular File Type</p>
              <p className="text-2xl font-bold capitalize">{mostPopularFileType}</p>
            </div>
          </div>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credits Usage */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Credits Usage
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={usageChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {usageChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* File Type Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Top File Types Uploaded
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fileTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Recent Files --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h2>
          {recentFiles.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="pb-2">File Name</th>
                  <th className="pb-2">Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {recentFiles.map((file, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-2 font-medium text-gray-800">{file.name}</td>
                    <td className="py-2 text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No recent files found.</p>
          )}
        </div>
      </div>
    </DeashboardLayout>
  )
}
