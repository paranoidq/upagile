import { type FC } from 'react'

const Workspace: FC = () => {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Workspace</h1>
      <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
        {/* Workspace content will go here */}
      </div>
    </div>
  )
}

export default Workspace
