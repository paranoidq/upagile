import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateView, useRenameView } from '@/features/tasks/services/view-services'

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '请输入视图名称'),
  type: z.string().optional(),
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

  const onSubmit = async (values: FormValues) => {
    if (isCreate) {
      createView(values)
    } else {
      renameView(values)
    }
    form.reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter view name' />
                  </FormControl>
                </FormItem>
              )}
            />

            <input type='hidden' {...form.register('id')} />
            <input type='hidden' {...form.register('type')} />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
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
