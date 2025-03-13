"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreditUseButtonProps {
  jobId: string;
  surgeonId: string;
  chatPartnerName: string;
}

export default function CreditUseButton({ jobId, surgeonId, chatPartnerName }: CreditUseButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUseCredit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/credit/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          surgeonId
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to use credit');
      }
      
      // Refresh the page to show the chat
      router.refresh();
      
    } catch (error) {
      console.error('Error using credit:', error);
      alert('Failed to use credit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleUseCredit}
      disabled={loading}
      className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
    >
      <CreditCard className="mr-2 h-5 w-5" />
      {loading ? 'Processing...' : `Use Credit to unlock all replies of this job post`}
    </button>
  );
}