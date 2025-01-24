import { type FC } from 'react'
import { Main } from '@/components/layout/main'

const Workspace: FC = () => {
  return (
    <Main>
      <h1 className='text-2xl font-bold mb-6'>Workspace</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Workspace content will go here */}
      </div>
    </Main>
  )
}

export default Workspace
