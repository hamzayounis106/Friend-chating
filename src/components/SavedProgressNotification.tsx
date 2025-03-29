'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, FileText, Tag } from 'lucide-react';

interface JobFormData {
  date?: string;
  description?: string;
  type?: string;
}

const SavedProgressNotification = () => {
  const [savedData, setSavedData] = useState<JobFormData | null>(null);

  useEffect(() => {
    // Check localStorage for job form data when component mounts
    const storedData = localStorage.getItem('homeJobFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as JobFormData;
        // Only show if we have at least some data
        if (parsedData.date || parsedData.description || parsedData.type) {
          setSavedData(parsedData);
        }
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
  }, []);

  // Don't render anything if no saved data
  if (!savedData) return null;

  // Format the date in a more readable way if available
  const formattedDate = savedData.date 
    ? new Date(savedData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Format the procedure type to be more readable
  const formattedType = savedData.type
    ? savedData.type.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : null;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
      <div className="p-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      <div className="px-6 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">We've saved your progress</h3>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue your consultation request
            </p>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formattedDate && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Scheduled For</p>
                  <p className="text-sm font-medium">{formattedDate}</p>
                </div>
              </div>
            )}
            
            {formattedType && (
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Procedure</p>
                  <p className="text-sm font-medium">{formattedType}</p>
                </div>
              </div>
            )}
            
            {savedData.description && savedData.description.length > 0 && (
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Details Provided</p>
                  <p className="text-sm font-medium">
                    {savedData.description.length > 5 
                      ? savedData.description.substring(0, 5) + '...' 
                      : savedData.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedProgressNotification;