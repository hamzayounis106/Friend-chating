import LocationGrid from '@/components/locations/LocationGrid';

import TopBarComp from '../TopBarComp';

const LocationsPage = () => {
  return (
    <section>
      <TopBarComp title='Location' />
      <main className='container mt-12'>
        <LocationGrid />
      </main>
    </section>
  );
};

export default LocationsPage;
