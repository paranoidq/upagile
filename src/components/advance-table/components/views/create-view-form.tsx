import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTableInstanceContext } from '../../table-instance-provider'
import { calcViewSearchParams } from '../../utils/utils'
import { useCreateView } from '../actions/view-services'
import { FilterParams } from './types'

interface CreateViewFormProps {
  backButton?: true
  onBack?: () => void
  onSuccess?: () => void
  filterParams?: FilterParams
}

// 定义表单验证模式
const formSchema = z.object({
  name: z.string().min(1, '视图名称不能为空'),
  columns: z.array(z.string()),
  filterParams: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateViewForm({ backButton, filterParams, onBack, onSuccess }: CreateViewFormProps) {
  const router = useRouter()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { tableInstance } = useTableInstanceContext()
  const { mutate: createView, isPending } = useCreateView()

  const visibleColumns = tableInstance
    .getVisibleFlatColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    .map((column) => column.id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      columns: visibleColumns,
      filterParams: filterParams || undefined,
    },
  })

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const onSubmit = async (values: FormValues) => {
    createView(values, {
      onSuccess: () => {
        toast.success('创建视图成功')
        onSuccess?.()

        const searchParams = calcViewSearchParams(values)
        if (searchParams) {
          router.navigate({
            to: '.',
            search: (prev) => ({
              ...prev,
              ...searchParams,
            }),
            replace: true,
          })
        }
      },
      onError: (error) => {
        toast.error('创建视图失败', {
          description: error instanceof Error ? error.message : '未知错误',
        })
      },
    })
  }

  return (
    <div>
      {backButton && (
        <>
          <div className='flex items-center gap-1 px-1 py-1.5'>
            <Button variant='ghost' size='icon' className='size-6' onClick={() => onBack?.()}>
              <span className='sr-only'>关闭创建视图表单</span>
              <ChevronLeftIcon aria-hidden='true' className='size-4' />
            </Button>

            <span className='text-sm'>创建视图</span>
          </div>

          <Separator />
        </>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2 p-2'>
          <FormField
            control={form.control}
            name='columns'
            render={({ field }) => (
              <FormItem className='hidden'>
                <FormControl>
                  <Input
                    {...field}
                    type='hidden'
                    value={Array.isArray(field.value) ? JSON.stringify(field.value) : field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='filterParams'
            render={({ field }) => (
              <FormItem className='hidden'>
                <FormControl>
                  <Input {...field} type='hidden' value={field.value ? JSON.stringify(field.value) : ''} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input ref={nameInputRef} {...field} type='text' placeholder='名称' autoComplete='off' />
                </FormControl>
              </FormItem>
            )}
          />

          <SubmitButton isSubmitting={isPending} />
        </form>
      </Form>
    </div>
  )
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button disabled={isSubmitting} type='submit' size='sm'>
      {isSubmitting ? <LoaderIcon aria-hidden='true' className='size-3.5 animate-spin' /> : '创建'}
    </Button>
  )
}
