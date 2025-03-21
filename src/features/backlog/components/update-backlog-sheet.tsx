'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconFlag3Filled } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { useUpdateBacklog } from '../services'
import { Backlog, updateBacklogSchema, UpdateBacklogSchema } from '../types'

interface UpdateBacklogSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  backlog: Backlog | null
}

export function UpdateBacklogSheet({ backlog, ...props }: UpdateBacklogSheetProps) {
  const { mutateAsync: updateBacklog, isPending: isUpdatePending } = useUpdateBacklog()

  const form = useForm<UpdateBacklogSchema>({
    resolver: zodResolver(updateBacklogSchema),
  })

  // 当 backlog 变化时重置表单
  React.useEffect(() => {
    if (backlog) {
      form.reset({
        id: backlog.id,
        title: backlog.title ?? '',
        description: backlog?.description ?? '',
        backlogType: backlog?.backlogType,
        priority: backlog?.priority,
        deadline: backlog?.deadline,
        estimateWorkload: backlog?.estimateWorkload,
      })
    }
  }, [backlog])

  function onSubmit(input: UpdateBacklogSchema) {
    // 确保 title 有值
    const data = {
      ...input,
      title: input.title || backlog?.title || '',
    }

    toast.promise(updateBacklog(data), {
      loading: 'Updating backlog...',
      success: () => {
        form.reset()
        props.onOpenChange?.(false)
        return 'Backlog updated'
      },
      error: (error) => {
        return 'Failed to update backlog' + error.message
      },
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>Update backlog</SheetTitle>
          <SheetDescription>Update the backlog details and save the changes</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='' {...field} />
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
                              <IconFlag3Filled className={cn(item.color)} />
                              <span>{item.label}</span>
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

            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type='date' placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='estimateWorkload'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimate Workload (hours)</FormLabel>
                  <FormControl>
                    <Input type='number' max={100} min={0} placeholder='' {...field} />
                  </FormControl>
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
