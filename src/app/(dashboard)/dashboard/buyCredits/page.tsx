'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { packages } from '@/lib/packages';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CreditPackages() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePackageSelect = async (pkg: any) => {
    console.log('pck to checkkk is sdjkfdfdddddddddddddddddddd', pkg);
    setLoading(true); // Start loading

    const { title } = pkg;
    router.push(
      `/checkout/package?package=${encodeURIComponent(
        JSON.stringify({ title, type: 'credit' })
      )}`
    );
  };

  // Reset loading when route changes
  useEffect(() => {
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  return (
    // <div className='container mx-auto p-6'>
    //   <div className='mb-8'>
    //     <h1 className='text-3xl font-bold text-gray-800 mb-2'>
    //       Credit Packages
    //     </h1>
    //     <p className='text-gray-600'>
    //       Purchase credit packages for consulting with our expert surgeons
    //     </p>
    //   </div>

    //   <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
    //     {packages.map((pkg) => (
    //       <div
    //         key={pkg.id}
    //         className={`border ${pkg.color} rounded-lg p-6 transition-all  cursor-pointer`}
    //         onClick={() => handlePackageSelect(pkg)}
    //       >
    //         <div className='flex justify-between items-start mb-4'>
    //           <div>
    //             <h2 className={`text-2xl font-bold ${pkg.textColor}`}>
    //               {pkg.title}
    //             </h2>
    //             <p className='text-gray-600'>
    //               {pkg.credits} Credit{pkg.credits > 1 ? 's' : ''}
    //             </p>
    //           </div>
    //           <div>{pkg.icon}</div>
    //         </div>

    //         <div className='mb-6'>
    //           <p className='text-3xl font-bold text-gray-800'>${pkg.price}</p>
    //           {pkg.id === 'gold' && (
    //             <p className='text-green-600 text-sm'>Save $31 (10% off)</p>
    //           )}
    //         </div>

    //         <div className='mb-6'>
    //           <ul>
    //             {pkg.features.map((feature, index) => (
    //               <li key={index} className='flex items-center mb-2'>
    //                 <CheckCircle className='w-5 h-5 text-green-500 mr-2' />
    //                 <span className='text-gray-700'>{feature}</span>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className='container mx-auto p-6 max-w-6xl'>
      <div className='mb-12 text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-3'>
          Credit Packages
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Purchase premium credit packages for exclusive consultations with our
          top surgeons
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`
          relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 
          hover:shadow-xl hover:-translate-y-2 cursor-pointer
          ${pkg.color} border-2 ${pkg.id === 'gold' ? 'border-yellow-400' : ''}
        `}
            onClick={() => handlePackageSelect(pkg)}
          >
            {/* Ribbon for best value */}
            {pkg.id === 'gold' && (
              <div className='absolute top-4 -right-6 bg-yellow-500 text-white px-6 py-2 text-sm font-bold transform rotate-45 translate-x-2  '>
                BEST VALUE
              </div>
            )}

            <div className='p-8'>
              <div className='flex justify-between items-start mb-6'>
                <div>
                  <h2
                    className={`text-3xl font-extrabold ${pkg.textColor} mb-1`}
                  >
                    {pkg.title}
                  </h2>
                  <p className='text-gray-600 font-medium'>
                    {pkg.credits} Credit{pkg.credits > 1 ? 's' : ''}
                  </p>
                </div>
                <div className='p-3 rounded-full bg-white bg-opacity-30'>
                  {pkg.icon}
                </div>
              </div>

              <div className='mb-8'>
                <p className='text-4xl font-bold text-gray-900'>
                  ${pkg.price}
                  <span className='text-lg text-gray-500'>/package</span>
                </p>
                {pkg.id === 'gold' && (
                  <p className='text-green-600 font-medium text-sm mt-1'>
                    Save $31 (10% off)
                  </p>
                )}
              </div>

              <div className='mb-8'>
                <ul className='space-y-3'>
                  {pkg.features.map((feature, index) => (
                    <li key={index} className='flex items-start'>
                      <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                      <span className='text-gray-800 font-medium'>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`
              w-full py-3 px-6 rounded-lg font-bold text-white transition-all
              ${pkg.id === 'bronze' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              ${pkg.id === 'silver' ? 'bg-slate-600 hover:bg-slate-700' : ''}
              ${pkg.id === 'gold' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              hover:shadow-md
            `}
              >
                Select Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
