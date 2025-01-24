import { type FC } from 'react'
import { Main } from '@/components/layout/main'

const Requirement: FC = () => {
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Requirements</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Requirements content will go here */}
      </div>
    </Main>
  )
}

export default Requirement
