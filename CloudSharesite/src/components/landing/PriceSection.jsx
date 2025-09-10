import React from 'react';

export default function PriceSection({ pricingPlans, openSignUp }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-center mb-8">Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-lg p-6 bg-white flex flex-col items-center border-2
                ${
                  plan.highlighted
                    ? 'border-purple-500'
                    : 'border-gray-200'
                }
                hover:border-purple-500 hover:shadow-2xl transition-all duration-300 ease-in-out
              `}
            >
              {/* Icon placeholder */}
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-600 rounded-full p-3">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
              </div>

             {/* Price */}
{plan.price && (
  <span className="text-3xl font-bold mb-4">
    ₹{plan.price}
  </span>
)}

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <ul className="mb-4 text-gray-600 text-sm list-disc list-inside">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              )}

              {/* Call to Action Button */}
              {plan.cta && (
                <button
                  onClick={openSignUp}
                  className="mt-auto px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
