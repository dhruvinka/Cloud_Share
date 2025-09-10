import React, { useEffect, useRef, useState } from "react";
import DeashboardLayout from "../layout/DeashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useUserCreditsContext } from "../context/UserCreditsContext";

export default function Subscription() {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { getToken } = useAuth();
  const { credits, fetchUserCredits } = useUserCreditsContext();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const razorpayScriptRef = useRef(null);

  useEffect(() => {
    if (!razorpayLoaded && !razorpayScriptRef.current) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () =>
        showMessage("Failed to load Razorpay. Please refresh.", "error");
      razorpayScriptRef.current = script;
      document.body.appendChild(script);
    }
  }, [razorpayLoaded]);

  useEffect(() => {
    fetchUserCredits();
  }, [fetchUserCredits]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const startPayment = async (planId, amount, currency = "INR") => {
    try {
      setProcessingPayment(true);
      showMessage("", "");

      const token = await getToken();

      const response = await fetch("http://localhost:8080/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, amount, currency }),
      });

      if (!response.ok) throw new Error("Failed to create payment order.");
      const data = await response.json();
      if (!data.success) {
        showMessage(data.message || "Failed to create payment order.", "error");
        setProcessingPayment(false);
        return;
      }

      if (!window.Razorpay) throw new Error("Razorpay SDK not loaded.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "Cloud Share",
        description: `${planId.toUpperCase()} Subscription`,
        order_id: data.orderId,
        handler: async (res) => {
          try {
            const verifyRes = await fetch("http://localhost:8080/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_signature: res.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const text = await verifyRes.text();
              throw new Error(`Verification failed (${verifyRes.status}): ${text}`);
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              showMessage("✅ Payment successful! Credits updated.", "success");
              await fetchUserCredits();
            } else {
              showMessage(verifyData.message || "❌ Payment verification failed.", "error");
            }
          } catch (err) {
            showMessage("❌ Payment verification error: " + err.message, "error");
          } finally {
            setProcessingPayment(false);
          }
        },
        theme: { color: "#6b46c1" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      showMessage("Payment error: " + err.message, "error");
      setProcessingPayment(false);
    }
  };

  const plans = [
    {
      id: "premium",
      name: "Premium",
      price: 500,
      credits: 500,
      features: [
        "Upload up to 500 files",
        "Access to all basic features",
        "Priority support",
      ],
      recommended: false,
    },
    {
      id: "ultimate",
      name: "Ultimate",
      price: 2500,
      credits: 5000,
      features: [
        "Upload up to 5000 files",
        "Access to all premium features",
        "Priority support",
        "Advanced analytics",
      ],
      recommended: true,
    },
  ];

  return (
    <DeashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Subscription Plans</h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              messageType === "success" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow">
          <p className="font-medium">Current Credits: {credits}</p>
          <p className="text-sm text-gray-600">
            You can upload {credits} more files with your current credits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 shadow hover:shadow-lg transition relative flex flex-col justify-between ${
                plan.recommended ? "border-purple-500" : "border-gray-300"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-2xl font-semibold mb-4">
                  ₹{plan.price} for {plan.credits} credits
                </p>
                <ul className="mb-4 space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="mr-2 text-green-500">✔</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button stays at the bottom across all cards */}
              <button
                className={`w-full py-2 rounded text-white font-medium mt-auto ${
                  plan.recommended
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50`}
                disabled={processingPayment || !razorpayLoaded}
                onClick={() => startPayment(plan.id, plan.price)}
              >
                Purchase Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </DeashboardLayout>
  );
}
