import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios.ts'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast.ts'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input.tsx'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
})

interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: string
  account: {
    id: string
    username: string
    name: string
    avatar: string
    teams: [
      {
        id: string
        name: string
        owner: string
      },
    ]
  }
}

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
    try {
      setIsLoading(true)

      const response = await http.post<LoginResponse>('/auth/login', data, {
        skipAuth: true,
      })

      auth.setAccessToken(response.accessToken)
      auth.setUser({
        username: response.account.username,
        name: response.account.name,
        avatar: response.account.avatar,
        email: response.account.email,
      })

      // 使用 React Router 的导航
      navigate(redirectTo)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '登录失败',
        description: '请检查用户名和密码',
      })
    } finally {
      setIsLoading(false)
    }
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
                    <PasswordInput placeholder='********' {...field} />
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
