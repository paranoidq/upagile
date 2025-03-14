import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({ minimal, className, ...props }: GeneralErrorProps) {
  const navigate = useNavigate()

  if (minimal) {
    return (
      <div className={cn('flex h-full w-full flex-col items-center justify-center gap-2', className)} {...props}>
        <h1 className='text-4xl font-bold'>Oops!</h1>
        <p className='text-center text-muted-foreground'>Something went wrong. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        <span className='font-medium'>Internal Server Error</span>
        <p className='text-center text-muted-foreground'>
          Something went wrong on our end. <br />
          Please try again later.
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
