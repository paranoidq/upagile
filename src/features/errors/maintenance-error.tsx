import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function MaintenanceError() {
  const navigate = useNavigate()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>Service Unavailable</span>
        <p className='text-center text-muted-foreground'>
          We're currently performing maintenance. <br />
          Please check back later.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
