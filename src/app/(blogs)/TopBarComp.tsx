const TopBarComp = ({ title }: { title: string }) => {
  return (
    <main className='bg-primary py-12'>
      <div className='container mx-auto '>
        <h1 className='text-3xl font-bold text-white'>{title}</h1>
      </div>
    </main>
  );
};
export default TopBarComp;
