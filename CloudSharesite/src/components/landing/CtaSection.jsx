import React from 'react';

export default function CtaSection({openSignUp}) {
  return (
    <div className="bg-purple-500 shadow-lg">
      <div className="max-w-7xl mx-auto py-20 px-6 sm:px-10 lg:px-12" style={{height:'260px'}}>
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          {/* Text content */}
          <div className="text-center md:text-left md:flex-1">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl sm:text-2xl text-purple-200 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Join thousands of users who trust CloudShare for their file sharing needs.
            </p>
          </div>

          {/* Button */}
          <div className="mt-8 md:mt-0 md:ml-12">
            <button
              onClick={openSignUp}
              className="inline-block bg-white text-purple-500 px-10 py-4 rounded-full font-semibold
                hover:bg-purple-100 hover:text-purple-600 transition-colors duration-300
                transform hover:scale-105"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
