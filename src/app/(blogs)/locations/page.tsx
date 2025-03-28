import HomeJobForm from '@/components/home/HomeJobForm';
import locationData from '@/components/locations/LocationData';
import LocationGrid from '@/components/locations/LocationGrid';
import QuestionBanner from '../QuestionBanner';
import RecentBlogPosts from '../RecentPost';
import RecentPost from '../RecentPost';
import TopBarComp from '../TopBarComp';

const LocationsPage = () => {
  return (
    <section>
      <TopBarComp title='Location' />
      <main className='container my-12 px-4'>
        <div className='flex flex-col gap-8 md:hidden'>
          <HomeJobForm />
          <LocationGrid />
          <RecentBlogPosts
            posts={locationData}
            title='Popular Locations'
            maxPosts={4}
            basePath='/locations'
          />{' '}
          <QuestionBanner />
        </div>

        {/* Desktop layout (side by side) */}
        <div className='hidden md:flex gap-8'>
          <div className='flex-1'>
            <LocationGrid />
          </div>
          <div className='w-1/3 flex flex-col gap-8'>
            <HomeJobForm />
            <RecentBlogPosts
              posts={locationData}
              title='Popular Locations'
              maxPosts={4}
              basePath='/locations'
            />{' '}
            <QuestionBanner />
          </div>
        </div>
      </main>
    </section>
  );
};

export default LocationsPage;
