'use client'

import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCube } from '@tabler/icons-react'
import dayjs from 'dayjs'
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
import { useCreateSprint, useUpdateSprint } from '../_lib/services'
import { createSprintSchema, Sprint, sprintStatus, updateSprintSchema } from '../types'

interface UpdateSprintSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  sprint: Sprint | null
}

export function UpdateOrCreateSprintSheet({ sprint, onOpenChange, open }: UpdateSprintSheetProps) {
  const isUpdating = !!sprint?.id

  const { mutateAsync: updateSprint, isPending: isUpdatePending } = useUpdateSprint()

  const { mutateAsync: createSprint, isPending: isCreatePending } = useCreateSprint()

  const { teams: workspaces } = useTeamStore()

  type UpdateFormValues = z.infer<typeof updateSprintSchema>
  type CreateFormValues = z.infer<typeof createSprintSchema>

  const form = useForm<UpdateFormValues | CreateFormValues>({
    resolver: zodResolver(isUpdating ? updateSprintSchema : createSprintSchema),
    defaultValues: {
      id: sprint?.id,
      title: sprint?.title ?? '',
      description: sprint?.description ?? '',
      startTime: sprint?.startTime ? dayjs(sprint.startTime).format('YYYY-MM-DD') : '',
      endTime: sprint?.endTime ? dayjs(sprint.endTime).format('YYYY-MM-DD') : '',
      status: sprint?.status || 'init',
      teamId: sprint?.team?.id,
    },
  })

  React.useEffect(() => {
    form.reset({
      id: sprint?.id,
      title: sprint?.title ?? '',
      description: sprint?.description ?? '',
      startTime: sprint?.startTime ? dayjs(sprint.startTime).format('YYYY-MM-DD') : '',
      endTime: sprint?.endTime ? dayjs(sprint.endTime).format('YYYY-MM-DD') : '',
      status: sprint?.status || 'init',
      teamId: sprint?.team?.id,
    })
  }, [sprint])

  function onSubmit(input: UpdateFormValues | CreateFormValues) {
    const data = {
      ...input,
      startTime: input.startTime ? dayjs(input.startTime).format('YYYY-MM-DD') : undefined,
      endTime: input.endTime ? dayjs(input.endTime).format('YYYY-MM-DD') : undefined,
    }

    if (isUpdating) {
      toast.promise(updateSprint(data as UpdateFormValues), {
        loading: 'Updating sprint...',
        success: () => {
          onOpenChange?.(false)
          form.reset()
          return 'Sprint updated'
        },
        error: (error) => {
          return {
            message: error.msg,
            description: error.reason,
          }
        },
      })
    } else {
      const { ...createData } = data as CreateFormValues

      toast.promise(
        createSprint({
          ...createData,
          title: createData.title || '',
        }),
        {
          loading: 'Creating sprint...',
          success: () => {
            onOpenChange?.(false)
            form.reset()
            return 'Sprint created'
          },
          error: (error) => ({
            message: error.msg,
            description: error.reason,
          }),
        },
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-[400px] sm:w-[540px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{isUpdating ? 'Update Sprint' : 'Create Sprint'}</SheetTitle>
          <SheetDescription>Update the sprint details and save the changes</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            {isUpdating && (
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
            )}

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
                        <SelectValue placeholder='Select a status' />
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
                      placeholder='Select start time'
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
                      placeholder='Select end time'
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
                <Button type='button' variant='outline' onClick={() => form.reset()}>
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending || isCreatePending}>
                {isUpdatePending ? 'Updating...' : isCreatePending ? 'Creating...' : isUpdating ? 'Update' : 'Create'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
