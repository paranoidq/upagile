import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateView, useRenameView } from '@/features/tasks/services/view-services'

const formSchema = z.object({
  id: z.number().optional().describe('视图ID'),
  name: z
    .string()
    .min(1, {
      message: '请输入视图名称',
    })
    .describe('视图名称'),
  type: z.string().optional().describe('视图类型'),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  open: boolean
  id?: number
  name: string
  type?: string
  onOpenChange: (open: boolean) => void
}

export const ViewDialog = ({ open, id, name, type, onOpenChange }: Props) => {
  const isCreate = !id
  const title = isCreate ? '新建视图' : '重命名'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      name,
      type,
    },
  })

  const { mutate: createView, isPending: isCreating } = useCreateView()
  const { mutate: renameView, isPending: isRenaming } = useRenameView()

  const onSubmit = (values: FormValues) => {
    console.log('Submit values:', values)

    if (isCreate) {
      createView(values)
    } else {
      renameView(values)
    }
    form.reset()
    onOpenChange(false)
  }

  const onClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>write your view name</DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (values) => {
                onSubmit(values)
              },
              (errors) => {
                console.log('Form validation failed:', errors)
              },
            )}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='请输入视图名称' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='id'
              render={({ field }) => <input type='hidden' {...field} value={field.value || ''} />}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => <input type='hidden' {...field} value={field.value || ''} />}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                取消
              </Button>
              <Button type='submit' disabled={isCreating || isRenaming}>
                确定
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
