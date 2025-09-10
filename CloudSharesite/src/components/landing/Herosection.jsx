import React from 'react'
import assets from '../../assets/assets'

export default function Herosection({ openSignIn, openSignUp }) {
  return (
    <div className="landing-page-content relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100  opacity-50 z-0 pointer-events-none"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
              <span className="block font-black">Share Files Securely with </span>
              <span className="block text-purple-300">CloudShare</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500  sm:text-lg md:mt-5 md:text-lg md:max-w-3xl">
                Upload, share, and manage your files effortlessly with our intuitive platform.
             
            </p>
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <button 
                  onClick={()=>openSignUp()}
                    className='px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition'>Get Started</button>
                    <button 
                    onClick={()=>openSignIn()}
                    className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300 transition'>Sign In</button>
                </div>
            </div>
          </div>
        </div>


        <div className="relative">
            <div className="aspact-w-16 rounded-lg shadow-xl overflow-hidden">
               
            </div>

        </div>

        <div className="mt-8 text-center">

        </div>
    
      </div>
    </div>
  )
}
