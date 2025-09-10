import React from 'react'
import * as Icons from 'lucide-react' // Import all Lucide icons

export default function FeaturesSection({ features }) {
    
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need for file sharing
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Discover the powerful features of CloudShare.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = Icons[feature.iconName] || Icons.FileText // fallback icon
              return (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent
                      className={`${feature.iconColor} w-8 h-8 mr-3`}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  )
}
