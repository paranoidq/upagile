import { type FC } from 'react'
import { Main } from '@/components/layout/main'

const Release: FC = () => {
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Release</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Backlog content will go here */}
      </div>
    </Main>
  )
}

export default Release
