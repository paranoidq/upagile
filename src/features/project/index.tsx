import { type FC } from 'react'
import { Main } from '@/components/layout/main'

const Project: FC = () => {
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Projects</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Projects content will go here */}
      </div>
    </Main>
  )
}

export default Project
