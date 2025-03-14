import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTableInstanceContext } from '../../table-instance-provider'
import { useUpdateView } from '../actions/view-services'
import { FilterParams, View } from './types'

interface UpdateViewFormProps {
  isUpdated: boolean
  currentView: View | undefined
  filterParams: FilterParams
  onSuccess?: () => void
}

// 定义表单验证模式
const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, '视图名称不能为空'),
  columns: z.array(z.string()),
  filterParams: z.any(),
})

type FormValues = z.infer<typeof formSchema>

export default function UpdateViewForm({ isUpdated, currentView, filterParams }: UpdateViewFormProps) {
  const { tableInstance } = useTableInstanceContext()

  const visibleColumns = tableInstance
    .getVisibleFlatColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    .map((column) => column.id)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: currentView?.id || 0,
      name: currentView?.name || '',
      columns: visibleColumns,
      filterParams: filterParams,
    },
  })

  const { mutate: updateView, isPending: isUpdating } = useUpdateView()

  const onSubmit = async (values: FormValues) => {
    updateView(values)
  }

  if (!isUpdated || !currentView) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='id'
          render={({ field }) => (
            <FormItem className='hidden'>
              <FormControl>
                <Input {...field} type='hidden' />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='hidden'>
              <FormControl>
                <Input {...field} type='hidden' />
              </FormControl>
            </FormItem>
          )}
        />

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
                <Input
                  {...field}
                  type='hidden'
                  value={typeof field.value === 'object' ? JSON.stringify(field.value) : field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <SubmitButton isSubmitting={isUpdating} />
      </form>
    </Form>
  )
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button disabled={isSubmitting} type='submit' size='sm' className='gap-1.5'>
      {isSubmitting && <LoaderIcon aria-hidden='true' className='size-3.5 animate-spin' />}
      更新视图
    </Button>
  )
}
