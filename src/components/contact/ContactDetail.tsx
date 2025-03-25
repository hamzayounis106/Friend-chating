import {
  Contact,
  HelpCircle,
  LocateIcon,
  MapPin,
  PhoneOutgoing,
} from 'lucide-react';

const ContactDetail = () => {
  return (
    <section className='w-full md:w-1/2 space-y-8'>
      <h1 className='text-3xl  mb-8 text-center md:text-left'>
        Contact Details
      </h1>

      <div className='grid grid-cols-1 gap-6'>
        {/* First Card - Emergency Contact */}
        <div className='flex items-start gap-6 p-6 bg-white rounded-lg  border'>
          <div className='p-3 bg-primary rounded-full flex items-center justify-center w-12 h-12'>
            <PhoneOutgoing className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-semibold mb-2'>Emergency Contact</h1>
            <p className='text-gray-600'>
              Your safety and well-being are our top priorities. For urgent
              inquiries, post-surgery concerns, or immediate assistance, please
              contact us at <span className='font-medium'>988 1617 9085</span>.
              Our team is here to support you 24/7.
            </p>
          </div>
        </div>

        {/* Second Row - Two Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Address Card */}
          <div className='flex flex-col items-center text-center p-6 bg-white rounded-lg border gap-4'>
            <div className='p-3 bg-primary rounded-full flex items-center justify-center w-12 h-12'>
              {/* <LocateIcon className='w-6 h-6 text-white' /> */}
              <MapPin className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-medium  mb-2'>Address</h1>
              <p className=''>Abu Dhabi, Dubai</p>
            </div>
          </div>

          {/* Support Card */}
          <div className='flex flex-col items-center text-center p-6 bg-white rounded-lg border gap-4'>
            <div className='p-3 bg-primary rounded-full flex items-center justify-center w-12 h-12'>
              <HelpCircle className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-semibold mb-2'>Need Support?</h1>
              <p className=' text-sm'>
                (+62)81 422 7509
                <br />
                plasticsurgery@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactDetail;
