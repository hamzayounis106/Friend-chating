import HomeJobForm from '@/components/home/HomeJobForm';
import ArticleGrid from '@/components/articles/ArticleGrid';
import articleData from '@/components/articles/ArticlesData';
import QuestionBanner from '../QuestionBanner';
import RecentBlogPosts from '../RecentPost';
import TopBarComp from '../TopBarComp';

const ArticlesPage = () => {
  return (
    <section>
      <TopBarComp title='Articles' />
      <main className='container my-12 px-4'>
        <div className='flex flex-col gap-8 md:hidden'>
          <HomeJobForm />
          <ArticleGrid />
          <RecentBlogPosts
            posts={articleData}
            title='Recent Articles'
            maxPosts={4}
            basePath='/articles'
          />
          <QuestionBanner />
        </div>

        {/* Desktop layout (side by side) */}
        <div className='hidden md:flex gap-8'>
          <div className='flex-1'>
            <ArticleGrid />
          </div>
          <div className='w-1/3 flex flex-col gap-8'>
            <HomeJobForm />
            <RecentBlogPosts
              posts={articleData}
              title='Recent Articles'
              maxPosts={4}
              basePath='/articles'
            />
            <QuestionBanner />
          </div>
        </div>
      </main>
    </section>
  );
};

export default ArticlesPage;
