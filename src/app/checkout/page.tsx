"use client";

import CheckoutForm from "@/components/checkout";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout() {
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const packageParam = searchParams.get("package");
    if (packageParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(packageParam));
        setPackageData(parsedData);
      } catch (error) {
        console.error("Error parsing package data:", error);
      }
    }
  }, [searchParams]);

  const calculateOrderAmount = () => {
    return packageData?.price * 100 || 0;
  };
  console.log('packageData 😭😭😭😭😭😭😭😭😭😭😭',packageData)

  useEffect(() => {
    async function fetchClientSecret() {
      if (packageData) {
        try {
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: calculateOrderAmount() , type: 'credit' ,credits:packageData?.credits,title:packageData?.title}),
          });

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
        }
      }
    }

    fetchClientSecret();
  }, [packageData]);

  if (!packageData) {
    return <div>Loading package data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete your purchase securely
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h2 className="text-lg font-medium">Order Summary</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Item</span>
              <span className="font-medium">{packageData?.title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{packageData?.credits}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>Total</span>
              <span>${calculateOrderAmount() / 100}</span>
            </div>
          </div>
        </div>

        {/* Payment Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" id="checkout">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Your payment is secured with SSL encryption
            </p>
          </div>
          <div className="px-6 py-6">
            {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-3">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-3a5 5 0 110-10 5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <svg
              className="h-8 w-8 text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M4 15V9h16v6h2V9a2 2 0 00-2-2h-4V5l-2-2h-4L8 5v2H4a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4zm6-8V5h4v2h-4z" />
              <path d="M17 15l-3 3V9h6v6h-3zm-3 5l2-2h4v2h-6z" />
            </svg>
            <svg
              className="h-8 w-8 text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-4-4.586L6.586 16 12 10.586 17.414 16 16 17.414l-4-4-4 4z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            Secure and encrypted payments. We never store your credit card details.
          </p>
        </div>
      </div>
    </div>
  );
}