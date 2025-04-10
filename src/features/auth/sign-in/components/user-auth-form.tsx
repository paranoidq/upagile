import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input.tsx'
import { login } from '../../_lib/services'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z.string().min(1, 'please enter your username'),
  password: z.string().min(1, 'please enter your password'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { auth } = useAuthStore()

  // 获取 URL 中的 redirect 参数
  const redirectTo = searchParams.get('redirect') || '/'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(login(data), {
      loading: '登录中...',
      success: (data) => {
        auth.setAccessToken(data.accessToken)
        auth.setUser({
          username: data.account.username,
          name: data.account.name,
          avatar: data.account.avatar,
          email: data.account.email,
        })

        setIsLoading(false)

        navigate(redirectTo, { replace: true })

        return '登录成功'
      },
      error: (e) => {
        setIsLoading(false)
        return {
          message: e.msg,
        }
      },
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link to='/forgot-password' className='text-sm font-medium text-muted-foreground hover:opacity-75'>
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
