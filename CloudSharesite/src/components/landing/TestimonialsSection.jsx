import React from "react";

function StarRating({ rating }) {
  // Render filled and empty stars based on rating out of 5
  const totalStars = 5;
  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.04 9.4c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.974z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }) {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
        What Our Users Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border-l-8 border-purple-500
              hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col"
          >
            {/* Top section: photo, name, rating */}
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image || testimonial.avatar}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full mr-4 border-2 border-purple-500 hover:border-purple-700 transition-colors duration-300"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <StarRating rating={testimonial.rating || 0} />
              </div>
            </div>

            {/* Quote Icon */}
            <svg
              className="w-6 h-6 text-purple-500 mb-3"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M7.17 6A5.996 5.996 0 002 12c0 3.31 2.69 6 6 6v-4H5.5a1.5 1.5 0 010-3H8V6H7.17zm9 0A5.996 5.996 0 0011 12c0 3.31 2.69 6 6 6v-4h-2.5a1.5 1.5 0 010-3H17V6h-.83z" />
            </svg>

            <p className="text-gray-700 italic mt-auto hover:text-purple-600 transition-colors duration-300">
              "{testimonial.quote}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
