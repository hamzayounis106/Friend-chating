import HomeJobForm from '@/components/home/HomeJobForm';
import LocationGrid from '@/components/locations/LocationGrid';
import QuestionBanner from '../QuestionBanner';
import RecentArticles from '../RecentPost';
import TopBarComp from '../TopBarComp';

const LocationsPage = () => {
  return (
    <section>
      <TopBarComp title='Locations' />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        {/* Mobile layout (stacked) */}
        <div className='flex flex-col gap-8 md:hidden'>
          <div className="max-w-xl mx-auto w-full">
            <HomeJobForm />
          </div>
          
          <div className="w-full">
            <LocationGrid />
          </div>
          
          <div className="max-w-xl mx-auto w-full">
            <RecentArticles />
          </div>
          
          <div className="max-w-xl mx-auto w-full">
            <QuestionBanner />
          </div>
        </div>

        {/* Desktop layout (side by side) */}
        <div className='hidden md:flex gap-8 lg:gap-12'>
          {/* Main content */}
          <div className='flex-1 min-w-0'>
            <LocationGrid />
          </div>
          
          {/* Sidebar */}
          <div className='w-full md:w-1/3 max-w-sm flex flex-col gap-8'>
            <div>
              <HomeJobForm />
            </div>
            <div>
              <RecentArticles />
            </div>
            <div>
              <QuestionBanner />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default LocationsPage;