'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCube } from '@tabler/icons-react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import AntdDataPicker from '@/components/ui/antd-date-picker'
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
import { useUpdateSprint } from '../_lib/services'
import { Sprint, sprintStatus, updateSprintSchema, UpdateSprintSchema } from '../types'

interface UpdateSprintSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  sprint: Sprint | null
}

export function UpdateSprintSheet({ sprint, onOpenChange, open }: UpdateSprintSheetProps) {
  const { mutateAsync: updateSprint, isPending: isUpdatePending } = useUpdateSprint()
  const { teams: workspaces } = useTeamStore()

  const form = useForm<UpdateSprintSchema>({
    resolver: zodResolver(updateSprintSchema),
  })

  React.useEffect(() => {
    if (sprint) {
      form.reset({
        id: sprint.id,
        title: sprint.title ?? '',
        description: sprint?.description ?? '',
        startTime: sprint?.startTime,
        endTime: sprint?.endTime,
        status: sprint?.status,
        teamId: sprint?.team?.id,
      })
    }
  }, [sprint])

  function onSubmit(input: UpdateSprintSchema) {
    // 确保 title 有值
    const data = {
      ...input,
      title: input.title || sprint?.title || '',
    }

    toast.promise(updateSprint(data), {
      loading: 'Updating sprint...',
      success: () => {
        form.reset()
        onOpenChange?.(false)
        return 'Sprint updated'
      },
      error: (error) => {
        return 'Failed to update sprint' + error.message
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-md'>
        <SheetHeader className='text-left'>
          <SheetTitle>Update sprint</SheetTitle>
          <SheetDescription>Update the sprint details and save the changes</SheetDescription>
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
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='capitalize'>
                        <SelectValue placeholder='Select a priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {sprintStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value} className='capitalize'>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${item?.color || ''} text-white`}
                              >
                                {item?.icon}
                              </div>
                              <span className='inline-flex items-center'>{item?.label}</span>
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
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <AntdDataPicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date ? date.format('YYYY-MM-DD') : null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <AntdDataPicker
                      data={field.value}
                      onChange={(date) => {
                        field.onChange(date ? date.format('YYYY-MM-DD') : null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='teamId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a workspace' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workspaces.map((workspace) => (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            <div className='flex items-center gap-2 text-sm'>
                              <IconCube className='size-4' />
                              {workspace.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
