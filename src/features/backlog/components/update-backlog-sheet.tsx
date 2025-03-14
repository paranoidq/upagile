'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconFlag3 } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Backlog, updateBacklogSchema, UpdateTaskSchema } from '../types'

interface UpdateBacklogSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  backlog: Backlog | null
}

export function UpdateBacklogSheet({ backlog, ...props }: UpdateBacklogSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateTaskSchema>({
    resolver: zodResolver(updateBacklogSchema),
    defaultValues: {
      title: backlog?.title ?? '',
      priority: backlog?.priority,
    },
  })

  function onSubmit(input: UpdateTaskSchema) {
    startUpdateTransition(async () => {
      if (!backlog) return

      // const { error } = await updateBacklog({
      //   id: backlog.id,
      //   ...input,
      // })

      // if (error) {
      //   toast.error(error)
      //   return
      // }

      form.reset()
      props.onOpenChange?.(false)
      toast.success('Task updated')
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>Update the task details and save the changes</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Do a kickflip' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {PRIORITIES.map((item) => (
                          <SelectItem key={item.value} value={item.value} className='capitalize'>
                            <div className='flex items-center gap-2'>
                              <IconFlag3 className={cn(item.color)} />
                              <span className={cn(item.color)}>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className='gap-2 pt-2 sm:space-x-0'>
              <SheetClose asChild>
                <Button type='button' variant='outline'>
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
