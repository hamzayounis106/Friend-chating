import HomeJobForm from '@/components/home/HomeJobForm';
import proceduresData from '@/components/procedures/proceduresData';
import ProcedureGrid from '@/components/procedures/ProceduresGrid';
import QuestionBanner from '../QuestionBanner';
import RecentBlogPosts from '../RecentPost';
import TopBarComp from '../TopBarComp';

const ProceduresPage = () => {
  return (
    <section>
      <TopBarComp title='Procedures' />
      <main className='container my-12 px-4'>
        <div className='flex flex-col gap-8 md:hidden'>
          <HomeJobForm />
          <ProcedureGrid />
          <RecentBlogPosts
            posts={proceduresData}
            title='Recent Procedures'
            maxPosts={4}
            basePath='/procedures'
          />
          <QuestionBanner />
        </div>

        {/* Desktop layout (side by side) */}
        <div className='hidden md:flex gap-8'>
          <div className='flex-1'>
            <ProcedureGrid />
          </div>
          <div className='w-1/3 flex flex-col gap-8'>
            <HomeJobForm />
            <RecentBlogPosts
              posts={proceduresData}
              title='Recent Procedures'
              maxPosts={4}
              basePath='/procedures'
            />
            <QuestionBanner />
          </div>
        </div>
      </main>
    </section>
  );
};

export default ProceduresPage;
