import { type FC } from 'react'
import { Main } from '@/components/layout/main'

const Sprint: FC = () => {
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Sprints</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Sprints content will go here */}
      </div>
    </Main>
  )
}

export default Sprint
