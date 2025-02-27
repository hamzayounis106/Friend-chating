import AddJobPostButtonForm from '@/components/AddJobPostButtonForm'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Post a Job</h1>
      <AddJobPostButtonForm />
    </main>
  )
}

export default page
